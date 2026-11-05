// Sign-in and registration rules, in one place (shared by every form): each message says what to do.
export const MIN_PASSWORD = 8;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // a shape check only — Supabase decides if it's real

export type RegisterKind = "company" | "mentor" | "coordinator";

/** What a form shows after it's sent: errors under fields, or one message on top. */
export type FormState = {
  errors?: Partial<Record<string, string>>;
  message?: string;
  tone?: "error" | "success";
  /** What was typed (never a password), so the form keeps it. */
  values?: Record<string, string>;
};

/** "2024 0101 2345" → "202401012345" (what the database stores). */
export const cleanSsm = (v: string) => v.replace(/\s/g, "").toUpperCase();
/** "k7qf m2xp" → "K7QF-M2XP". */
export function cleanJoinCode(v: string): string {
  const s = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4)}` : s;
}

export const emailError = (email: string) => (EMAIL.test(email) ? undefined : "Enter a valid email address");

export function validateEmailPassword(email: string, password: string): FormState["errors"] {
  const e: FormState["errors"] = {};
  if (emailError(email)) e.email = emailError(email);
  if (password.length < MIN_PASSWORD) e.password = `Use at least ${MIN_PASSWORD} characters`;
  return e;
}

export function validateRegister(kind: RegisterKind, v: Record<string, string>): FormState["errors"] {
  const e = validateEmailPassword(v.email, v.password) ?? {};
  if (!v.full_name) e.full_name = "Enter your full name";
  if (kind === "company") {
    if (v.company_name.length < 2) e.company_name = "Enter the company's registered name";
    if (!/^[0-9A-Z-]{5,20}$/.test(cleanSsm(v.ssm_no))) e.ssm_no = "Enter the registration number on your SSM certificate";
    if (v.website && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/.test(v.website)) e.website = "Enter the website's address, or leave it empty";
  }
  if (kind === "mentor" && !/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(cleanJoinCode(v.join_code))) {
    e.join_code = "Enter the 8-character code your company gave you";
  }
  if (kind === "coordinator" && !v.faculty) e.faculty = "Enter your faculty";
  return e;
}

// Supabase Auth's error codes → what to do. Anything else shows Supabase's own words.
const AUTH_ERRORS: Record<string, string> = {
  user_already_exists: "That email already has an account. Sign in instead.",
  email_exists: "That email already has an account. Sign in instead.",
  invalid_credentials: "Wrong email or password. Try again.",
  email_not_confirmed: "Confirm your email first: open the link we sent you.",
  weak_password: `Choose a stronger password: at least ${MIN_PASSWORD} characters.`,
  same_password: "That's your current password. Choose a new one.",
  over_email_send_rate_limit: "Too many emails just now. Wait a few minutes and try again.",
  over_request_rate_limit: "Too many tries just now. Wait a minute and try again.",
};

export function authMessage(error: { code?: string; status?: number; message: string }, kind?: RegisterKind): string {
  // The database refuses a mentor sign-up whose code matches no approved company; Supabase
  // reports that as a generic 500.
  if (kind === "mentor" && error.status === 500) return "That join code isn't valid. Ask your company for its current code.";
  return AUTH_ERRORS[error.code ?? ""] ?? error.message;
}
