import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Basic in-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []

  // Filter out timestamps outside current window
  const validTimestamps = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }

  validTimestamps.push(now)
  rateLimitMap.set(ip, validTimestamps)
  return false
}

// Utility to escape HTML special characters to prevent HTML injection in emails
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, subject, message, website } = body

    // 2. Anti-Spam Honeypot Check
    if (website && website.trim() !== "") {
      return NextResponse.json(
        { success: true, message: "Thank you for your submission." },
        { status: 200 }
      )
    }

    // 3. Strict Input Validation
    const errors: Record<string, string> = {}

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long."
    } else if (name.trim().length > 100) {
      errors.name = "Name cannot exceed 100 characters."
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      errors.email = "Please provide a valid email address."
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 2) {
      errors.subject = "Subject must be at least 2 characters long."
    } else if (subject.trim().length > 150) {
      errors.subject = "Subject cannot exceed 150 characters."
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long."
    } else if (message.trim().length > 5000) {
      errors.message = "Message cannot exceed 5000 characters."
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please check your inputs.",
          validationErrors: errors,
        },
        { status: 400 }
      )
    }

    const sanitizedName = escapeHtml(name.trim())
    const sanitizedEmail = email.trim()
    const sanitizedSubject = escapeHtml(subject.trim())
    const sanitizedMessage = escapeHtml(message.trim())

    // 4. Retrieve & Verify SMTP Environment Variables
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10)
    const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL
    const senderName = process.env.SENDER_NAME

    if (!smtpUser || !smtpPass) {
      console.warn("⚠️ SMTP credentials missing in environment variables.")
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service is currently unconfigured. Please configure SMTP_USER and SMTP_PASS in the .env file.",
        },
        { status: 503 }
      )
    }

    // Clean password (remove spaces if user entered spaced app password e.g. "usxb fjpv wpyu fglr")
    const cleanSmtpPass = smtpPass.replace(/\s+/g, "")

    // 5. Create Nodemailer Transporter with connection pooling for reliability
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: cleanSmtpPass,
      },
      pool: true, // Use SMTP pooled connection to handle multiple dispatches smoothly
      maxConnections: 3,
    })

    const submissionDate = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "Asia/Kolkata",
    })

    // 6. Template for Admin
    const adminMailOptions = {
      from: `"${senderName}" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: `"${sanitizedName}" <${sanitizedEmail}>`,
      subject: `📬 Portfolio Contact: ${sanitizedSubject}`,
      text: `New message from ${sanitizedName} (${sanitizedEmail})\nSubject: ${sanitizedSubject}\nDate: ${submissionDate}\n\nMessage:\n${sanitizedMessage}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e1e8ed; }
              .header { background: linear-gradient(135deg, #2563eb, #7c3aed); color: #ffffff; padding: 28px 24px; text-align: center; }
              .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
              .badge { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 8px; font-weight: 600; }
              .content { padding: 24px; }
              .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; background: #f8fafc; border-radius: 8px; overflow: hidden; }
              .meta-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
              .meta-table td.label { font-weight: 600; color: #475569; width: 120px; }
              .meta-table td.value { color: #1e293b; }
              .message-box { background: #ffffff; border-left: 4px solid #2563eb; padding: 16px; margin-top: 10px; border-radius: 4px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
              .message-box p { margin: 0; line-height: 1.6; white-space: pre-wrap; font-size: 15px; color: #334155; }
              .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }
              .reply-btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 16px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Portfolio Message</h1>
                <div class="badge">Direct Website Inquiry</div>
              </div>
              <div class="content">
                <table class="meta-table">
                  <tr>
                    <td class="label">From:</td>
                    <td class="value"><strong>${sanitizedName}</strong> (&lt;<a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a>&gt;)</td>
                  </tr>
                  <tr>
                    <td class="label">Subject:</td>
                    <td class="value">${sanitizedSubject}</td>
                  </tr>
                  <tr>
                    <td class="label">Submitted:</td>
                    <td class="value">${submissionDate}</td>
                  </tr>
                </table>

                <div style="font-weight: 600; color: #475569; margin-bottom: 8px; font-size: 14px;">Message Details:</div>
                <div class="message-box">
                  <p>${sanitizedMessage}</p>
                </div>

                <div style="text-align: center;">
                  <a href="mailto:${sanitizedEmail}?subject=Re: ${encodeURIComponent(sanitizedSubject)}" class="reply-btn">
                    Reply directly to ${sanitizedName}
                  </a>
                </div>
              </div>
              <div class="footer">
                This email was generated automatically by your portfolio contact form.
              </div>
            </div>
          </body>
        </html>
      `,
    }

    // 7. Template for Visitor
    const visitorMailOptions = {
      from: `"${senderName}" <${smtpUser}>`,
      to: sanitizedEmail,
      replyTo: recipientEmail,
      subject: `Thank you for reaching out, ${sanitizedName}!`,
      text: `Hi ${sanitizedName},\n\nThank you for reaching out! I have successfully received your message and will get back to you as soon as possible.\n\nBest regards,\nNishit Khatri`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e1e8ed; }
              .header { background: linear-gradient(135deg, #2563eb, #7c3aed); color: #ffffff; padding: 32px 24px; text-align: center; }
              .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
              .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 14px; }
              .content { padding: 28px 24px; line-height: 1.6; color: #334155; font-size: 15px; }
              .greeting { font-size: 17px; font-weight: 600; margin-bottom: 16px; color: #1e293b; }
              .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; }
              .summary-title { font-weight: 600; color: #475569; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
              .summary-subject { font-weight: 600; color: #1e293b; margin-bottom: 6px; }
              .summary-text { color: #64748b; font-size: 14px; font-style: italic; margin: 0; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
              .signature { margin-top: 28px; border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 15px; }
              .signature-name { font-weight: 700; color: #1e293b; margin-top: 4px; }
              .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Nishit Khatri</h1>
                <p>Full Stack Web Developer</p>
              </div>
              <div class="content">
                <div class="greeting">Hi ${sanitizedName},</div>
                <p>Thank you for reaching out! I have successfully received your message and will get back to you as soon as possible.</p>
                
                <div class="summary-card">
                  <div class="summary-title">Summary of Your Message</div>
                  <div class="summary-subject">Subject: ${sanitizedSubject}</div>
                  <p class="summary-text">"${sanitizedMessage}"</p>
                </div>

                <p>I usually respond within 24 hours. Looking forward to connecting!</p>

                <div class="signature">
                  Best regards,<br/>
                  <div class="signature-name">Nishit Khatri</div>
                </div>
              </div>
              <div class="footer">
                This is an automated confirmation sent to ${sanitizedEmail} in response to your portfolio contact submission.
              </div>
            </div>
          </body>
        </html>
      `,
    }

    // 8. Dispatch Emails Sequentially via Pooled Transporter
    // First, send the admin notification email
    console.log(`Sending admin notification email to ${recipientEmail}...`)
    await transporter.sendMail(adminMailOptions)

    // Second, send the auto-confirmation thank you email to visitor
    console.log(`Sending visitor confirmation email to ${sanitizedEmail}...`)
    try {
      await transporter.sendMail(visitorMailOptions)
      console.log(`✅ Visitor confirmation email sent successfully to ${sanitizedEmail}`)
    } catch (visitorError: any) {
      console.error("⚠️ Failed to send visitor auto-confirmation email:", visitorError)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("❌ Error processing contact form submission:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred while sending your message.",
      },
      { status: 500 }
    )
  }
}
