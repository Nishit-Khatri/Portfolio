import "server-only";

// ─── Email theme colors (dark theme from globals.css :root[data-theme="dark"])
const BG = "#0C0C0E";
const CARD = "#141417";
const TEXT = "#F4F4F2";
const MUTED = "#8C8C94";
const BORDER = "#26262B";
const ACCENT = "#6C8BFF";

/** Escape HTML special characters to prevent injection in HTML emails. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Preserve line breaks in HTML by converting \n → <br>. Input must be already escaped. */
function nl2br(escaped: string): string {
  return escaped.replace(/\n/g, "<br>");
}

function sharedStyles(): string {
  return `
    body { margin: 0; padding: 0; background-color: ${BG}; font-family: Arial, Helvetica, sans-serif; }
    table { border-collapse: collapse; }
  `.trim();
}

/** Outer skeleton used by both emails. */
function wrapHtml(preheader: string, innerTable: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Nishit Khatri</title>
  <style>${sharedStyles()}</style>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:Arial,Helvetica,sans-serif;">
  <!-- preheader -->
  <span style="display:none;font-size:1px;color:${BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}&nbsp;</span>

  <!-- outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:${BG};">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- card -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:600px;background-color:${CARD};border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">

          <!-- top accent bar -->
          <tr>
            <td style="height:4px;background-color:${ACCENT};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          ${innerTable}

          <!-- footer -->
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid ${BORDER};text-align:center;">
              <p style="margin:0;font-size:12px;color:${MUTED};line-height:1.5;">
                This is an automatic confirmation. You can reply to this email.
              </p>
            </td>
          </tr>

        </table>
        <!-- /card -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Acknowledgement email ────────────────────────────────────────────────────

interface AckParams {
  name: string;
  email: string;
  message: string;
}

export function acknowledgementEmail({ name, message }: AckParams): {
  subject: string;
  html: string;
  text: string;
} {
  const firstName = escapeHtml(name.split(" ")[0]);
  const escapedMessage = nl2br(escapeHtml(message));

  const githubUrl = (process.env.NEXT_PUBLIC_GITHUB_URL ?? "").trim();
  const linkedinUrl = (process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "").trim();
  const location = (process.env.NEXT_PUBLIC_LOCATION ?? "").trim();
  const phone = (process.env.NEXT_PUBLIC_PHONE ?? "").trim();

  const locationPhoneParts = [
    location ? escapeHtml(location) : "",
    phone ? escapeHtml(phone) : "",
  ].filter(Boolean);

  const locationPhoneHtml =
    locationPhoneParts.length > 0
      ? `<p style="margin:4px 0 0;font-size:12px;color:${MUTED};line-height:1.4;">${locationPhoneParts.join(" &nbsp;·&nbsp; ")}</p>`
      : "";

  const socialLinksHtml =
    githubUrl || linkedinUrl
      ? `<p style="margin:16px 0 0;font-size:13px;color:${MUTED};">
          ${githubUrl ? `<a href="${escapeHtml(githubUrl)}" style="color:${ACCENT};text-decoration:none;">GitHub</a>` : ""}
          ${githubUrl && linkedinUrl ? `<span style="color:${MUTED};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>` : ""}
          ${linkedinUrl ? `<a href="${escapeHtml(linkedinUrl)}" style="color:${ACCENT};text-decoration:none;">LinkedIn</a>` : ""}
        </p>`
      : "";

  const inner = `
  <!-- monogram + heading -->
  <tr>
    <td style="padding:32px 32px 0;">
      <!-- NK badge -->
      <table cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="width:48px;height:48px;background-color:${ACCENT};border-radius:50%;text-align:center;vertical-align:middle;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#ffffff;line-height:48px;">NK</span>
          </td>
        </tr>
      </table>
      <h1 style="margin:20px 0 8px;font-size:22px;font-weight:700;color:${TEXT};line-height:1.3;font-family:Arial,Helvetica,sans-serif;">
        Thanks for reaching out, ${firstName}
      </h1>
      <p style="margin:0 0 20px;font-size:15px;color:${MUTED};line-height:1.6;">
        Your message has reached me. I read every message and I&rsquo;ll get back to you as soon as I can.
      </p>
    </td>
  </tr>

  <!-- quote box -->
  <tr>
    <td style="padding:0 32px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="border-left:3px solid ${ACCENT};padding:14px 18px;background-color:${BG};border-radius:0 8px 8px 0;">
            <p style="margin:0;font-size:14px;color:${TEXT};line-height:1.7;white-space:pre-line;">${escapedMessage}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- sign-off -->
  <tr>
    <td style="padding:0 32px 28px;">
      <p style="margin:0;font-size:15px;color:${TEXT};font-weight:600;">Nishit Khatri</p>
      <p style="margin:4px 0 0;font-size:13px;color:${MUTED};">Full Stack Web Developer</p>
      ${locationPhoneHtml}
      ${socialLinksHtml}
    </td>
  </tr>
  `;

  const html = wrapHtml(
    `Your message has reached Nishit Khatri.`,
    inner
  );

  const locationPhoneText = [location, phone].filter(Boolean).join(" · ");

  const socialText = [
    githubUrl ? `GitHub: ${githubUrl}` : "",
    linkedinUrl ? `LinkedIn: ${linkedinUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const text = [
    `Hi ${name},`,
    "",
    "Your message has reached me. I read every message and I'll get back to you as soon as I can.",
    "",
    "Your message:",
    "---",
    message,
    "---",
    "",
    "— Nishit Khatri",
    "Full Stack Web Developer",
    locationPhoneText,
    socialText,
    "",
    "This is an automatic confirmation. You can reply to this email.",
  ]
    .filter(Boolean)
    .join("\n")
    .trim();

  return {
    subject: `Thanks for reaching out, ${name.split(" ")[0]}`,
    html,
    text,
  };
}

// ─── Notification email ───────────────────────────────────────────────────────

interface NotifParams {
  name: string;
  email: string;
  message: string;
  sentAtIST: string;
}

export function notificationEmail({ name, email, message, sentAtIST }: NotifParams): {
  subject: string;
  html: string;
  text: string;
} {
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = nl2br(escapeHtml(message));
  const escapedTime = escapeHtml(sentAtIST);

  const inner = `
  <!-- heading -->
  <tr>
    <td style="padding:32px 32px 0;">
      <!-- NK badge -->
      <table cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="width:48px;height:48px;background-color:${ACCENT};border-radius:50%;text-align:center;vertical-align:middle;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#ffffff;line-height:48px;">NK</span>
          </td>
        </tr>
      </table>
      <h1 style="margin:20px 0 8px;font-size:22px;font-weight:700;color:${TEXT};line-height:1.3;font-family:Arial,Helvetica,sans-serif;">
        New portfolio message
      </h1>
    </td>
  </tr>

  <!-- meta rows -->
  <tr>
    <td style="padding:0 32px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};">
            <span style="font-size:12px;color:${MUTED};text-transform:uppercase;letter-spacing:0.08em;">Name</span><br>
            <span style="font-size:15px;color:${TEXT};">${escapedName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};">
            <span style="font-size:12px;color:${MUTED};text-transform:uppercase;letter-spacing:0.08em;">Email</span><br>
            <a href="mailto:${escapedEmail}" style="font-size:15px;color:${ACCENT};text-decoration:none;">${escapedEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};">
            <span style="font-size:12px;color:${MUTED};text-transform:uppercase;letter-spacing:0.08em;">Time (IST)</span><br>
            <span style="font-size:15px;color:${TEXT};">${escapedTime}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- message quote box -->
  <tr>
    <td style="padding:0 32px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="border-left:3px solid ${ACCENT};padding:14px 18px;background-color:${BG};border-radius:0 8px 8px 0;">
            <p style="margin:0;font-size:14px;color:${TEXT};line-height:1.7;">${escapedMessage}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- reply button -->
  <tr>
    <td style="padding:0 32px 28px;">
      <table cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="background-color:${ACCENT};border-radius:8px;">
            <a href="mailto:${escapedEmail}"
               style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">
              Reply to ${escapedName}
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;

  const html = wrapHtml(`New message from ${name} via your portfolio.`, inner);

  const text = [
    "New portfolio message",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Time (IST): ${sentAtIST}`,
    "",
    "Message:",
    "---",
    message,
    "---",
  ]
    .join("\n")
    .trim();

  return {
    subject: `New portfolio message from ${name}`,
    html,
    text,
  };
}
