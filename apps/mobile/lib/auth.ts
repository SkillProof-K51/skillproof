import { demoRoles } from "./demo/auth";
import type { OnboardingAnswers } from "./onboarding";
import { isTestMode } from "./testMode";

/** A role a student works towards (Module 1 defines them, with their skills and weights). */
export type TargetRole = {
  id: string;
  label: string;
  description?: string;
  /** The skills on its roadmap, in order. */
  roadmap: string[];
};

export type SignUpInput = { name: string; email: string; password: string; roleId?: string; consent: boolean };
export type LogInInput = { email: string; password: string };
/** One message per field that needs fixing; an empty object = good to go. */
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const MIN_PASSWORD = 8;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // a shape check only — the server decides if it's real

/**
 * The roles to pick from at sign-up.
 * TODO (shared core, weeks 6–7): read Module 1's roles table.
 */
export function getTargetRoles(): TargetRole[] {
  return isTestMode ? demoRoles : [];
}

/** Sign-up rules, in one place: every message says what to do. */
export function validateSignUp(v: SignUpInput): FieldErrors<SignUpInput> {
  const e: FieldErrors<SignUpInput> = {};
  if (!v.name.trim()) e.name = "Enter your full name";
  if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email address";
  if (v.password.length < MIN_PASSWORD) e.password = `Use at least ${MIN_PASSWORD} characters`;
  if (!v.roleId) e.roleId = "Choose the role you’re working towards";
  if (!v.consent) e.consent = "Tick this to create your account";
  return e;
}

export function validateLogIn(v: LogInInput): FieldErrors<LogInInput> {
  const e: FieldErrors<LogInInput> = {};
  if (!EMAIL.test(v.email.trim())) e.email = "Enter the email you signed up with";
  if (!v.password) e.password = "Enter your password";
  return e;
}

/** demo = TEST MODE: nothing really happened, and the screen must say so (rule 4). */
export type AuthResult = { demo: boolean };

/**
 * Creates the student's account, with what they answered in onboarding.
 * TODO (shared core, weeks 6–7): supabase.auth.signUp + a profiles row (RLS: owner only); the
 * answers go on the profile (Module 2), the skills they've used only pick the first challenges.
 */
export async function signUp(input: SignUpInput, answers?: OnboardingAnswers): Promise<AuthResult> {
  void answers; // saved with the profile once the shared core exists
  if (isTestMode) return { demo: true };
  throw new Error(`Accounts arrive with the shared core in weeks 6–7, so ${input.email.trim() || "this email"} can’t sign up yet.`);
}

/**
 * Signs the student in.
 * TODO (shared core, weeks 6–7): supabase.auth.signInWithPassword.
 */
export async function logIn(input: LogInInput): Promise<AuthResult> {
  if (isTestMode) return { demo: true };
  throw new Error(`Logging in arrives with the shared core in weeks 6–7, so ${input.email.trim() || "this email"} can’t log in yet.`);
}

/**
 * Emails a password-reset link.
 * TODO (shared core, weeks 6–7): supabase.auth.resetPasswordForEmail.
 */
export async function sendPasswordReset(email: string): Promise<AuthResult> {
  if (isTestMode) return { demo: true };
  throw new Error(`Password reset arrives with the shared core in weeks 6–7 (${email.trim() || "no email given"}).`);
}
