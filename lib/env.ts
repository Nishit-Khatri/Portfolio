import "server-only";

interface ServerEnv {
  GMAIL_USER: string;
  GMAIL_APP_PASSWORD: string;
  CONTACT_TO_EMAIL: string;
}

/**
 * Reads and validates the three server-only email secrets.
 * Throws a generic error if any are missing or empty.
 * Call this inside a handler, never at module top level.
 */
export function getServerEnv(): ServerEnv {
  const GMAIL_USER = (process.env.GMAIL_USER ?? "").trim();
  const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD ?? "").trim();
  const CONTACT_TO_EMAIL = (process.env.CONTACT_TO_EMAIL ?? "").trim();

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CONTACT_TO_EMAIL) {
    throw new Error("Missing email configuration");
  }

  return { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO_EMAIL };
}

