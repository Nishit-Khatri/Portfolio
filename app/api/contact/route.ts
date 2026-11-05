import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getServerEnv } from "@/lib/env";
import { acknowledgementEmail, notificationEmail } from "@/lib/emailTemplates";

export const runtime = "nodejs";

// ─── In-memory rate limiter (resets on serverless cold start) ─────────────────
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

// ─── Validation helpers ───────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function containsNewline(s: string): boolean {
  return /[\r\n]/.test(s);
}

// ─── POST /api/contact ────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Reject oversized bodies (~10 KB)
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 10_000) {
    return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413 });
  }

  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please wait a few minutes before trying again." },
      { status: 429 }
    );
  }

  // Parse JSON body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  // Honeypot check — return 200 silently if filled
  const website = typeof raw.website === "string" ? raw.website : "";
  if (website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Extract and trim fields
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";

  // Server-side validation
  if (!name || name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { ok: false, error: "Name must be between 2 and 80 characters." },
      { status: 400 }
    );
  }
  if (containsNewline(name)) {
    return NextResponse.json({ ok: false, error: "Invalid name." }, { status: 400 });
  }

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (containsNewline(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
  }

  if (!message || message.length < 10 || message.length > 2000) {
    return NextResponse.json(
      { ok: false, error: "Message must be between 10 and 2000 characters." },
      { status: 400 }
    );
  }

  // Load server env (call inside handler, not at module top)
  let env: ReturnType<typeof getServerEnv>;
  try {
    env = getServerEnv();
  } catch {
    console.error("Contact form: missing email configuration");
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please try again." },
      { status: 500 }
    );
  }

  // IST timestamp
  const sentAtIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "medium",
  });

  // Build email content
  const notif = notificationEmail({ name, email, message, sentAtIST });
  const ack = acknowledgementEmail({ name, email, message });

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: env.GMAIL_USER,
      pass: env.GMAIL_APP_PASSWORD,
    },
  });

  // Send notification FIRST
  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${env.GMAIL_USER}>`,
      to: env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: notif.subject,
      html: notif.html,
      text: notif.text,
    });
  } catch {
    console.error("Contact form: failed to send notification");
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please try again." },
      { status: 500 }
    );
  }

  // Send acknowledgement (best-effort)
  try {
    await transporter.sendMail({
      from: `"Nishit Khatri" <${env.GMAIL_USER}>`,
      to: email,
      replyTo: env.CONTACT_TO_EMAIL,
      subject: ack.subject,
      html: ack.html,
      text: ack.text,
    });
  } catch {
    console.error("Contact form: acknowledgement email failed");
    return NextResponse.json({ ok: true, ackSent: false });
  }

  return NextResponse.json({ ok: true, ackSent: true });
}

