import { demoRoles } from "./demo/auth";
import type { OnboardingAnswers } from "./onboarding";
import { supabase } from "./supabase";
import { isTestMode } from "./testMode";

/** A skill on a roadmap: its catalogue id (what gets saved) and its name (what's shown). */
export type RoadmapSkill = { id: string; name: string };

/** A role a student works towards (Module 1 defines them, with their skills and weights). */
export type TargetRole = {
  id: string;
  label: string;
  description?: string;
  /** The skills on its roadmap, in order. */
  roadmap: RoadmapSkill[];
};

export type SignUpInput = { name: string; email: string; password: string; roleId?: string; consent: boolean };
export type LogInInput = { email: string; password: string };
/** One message per field that needs fixing; an empty object = good to go. */
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const MIN_PASSWORD = 8;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // a shape check only — the server decides if it's real

type RoleRow = {
  id: string;
  name: string;
  description: string;
  job_role_skills: { position: number; skills: { id: string; name: string } | null }[];
};

/** The roles to pick from, each with its roadmap in order (Module 1's tables; anyone can read them). */
export async function getTargetRoles(): Promise<TargetRole[]> {
  if (isTestMode) return demoRoles;
  const { data, error } = await supabase()
    .from("job_roles")
    .select("id, name, description, job_role_skills (position, skills (id, name))")
    .order("name")
    .overrideTypes<RoleRow[], { merge: false }>();
  if (error) throw new Error("Couldn’t load the roles. Check your connection and try again.");
  return data.map((r) => ({
    id: r.id,
    label: r.name,
    description: r.description || undefined,
    roadmap: [...r.job_role_skills]
      .sort((a, b) => a.position - b.position)
      .flatMap((s) => (s.skills ? [{ id: s.skills.id, name: s.skills.name }] : [])),
  }));
}

/** The signed-in user, as the database's sign-up trigger made them. */
export type Account = { fullName: string; firstName: string; role: string; jobRole?: string };

type AccountRow = { full_name: string; role: string; student_profiles: { job_roles: { name: string } | null } | null };

/** Who is signed in (their own profile row — RLS lets them read nothing else), or null if nobody. */
export async function getMyAccount(): Promise<Account | null> {
  if (isTestMode) return null;
  const { data: auth } = await supabase().auth.getSession();
  const id = auth.session?.user.id;
  if (!id) return null;
  const { data, error } = await supabase()
    .from("profiles")
    .select("full_name, role, student_profiles (job_roles (name))")
    .eq("id", id)
    .single()
    .overrideTypes<AccountRow, { merge: false }>();
  if (error) throw new Error("Couldn’t load your profile. Check your connection and try again.");
  return {
    fullName: data.full_name,
    firstName: data.full_name.split(" ")[0],
    role: data.role,
    jobRole: data.student_profiles?.job_roles?.name,
  };
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

/**
 * demo = TEST MODE: nothing really happened, and the screen must say so (rule 4).
 * confirmEmail = the account exists but waits for the link in the student's inbox.
 */
export type AuthResult = { demo: boolean; confirmEmail?: boolean };

// Supabase Auth's error codes → what the student should do. Anything else shows Supabase's words.
const AUTH_ERRORS: Record<string, string> = {
  user_already_exists: "That email already has an account. Log in instead.",
  email_exists: "That email already has an account. Log in instead.",
  invalid_credentials: "Wrong email or password. Try again.",
  email_not_confirmed: "Confirm your email first: open the link we sent you.",
  weak_password: `Choose a stronger password: at least ${MIN_PASSWORD} characters.`,
  over_email_send_rate_limit: "Too many emails just now. Wait a few minutes and try again.",
  over_request_rate_limit: "Too many tries just now. Wait a minute and try again.",
};
const authError = (e: { code?: string; message: string }) => new Error(AUTH_ERRORS[e.code ?? ""] ?? e.message);

/**
 * Creates the student's account with what they answered in onboarding. The database makes their
 * profile from these answers (private.handle_new_user); the aim isn't saved until Module 2 adds it.
 */
export async function signUp(input: SignUpInput, answers?: OnboardingAnswers): Promise<AuthResult> {
  if (isTestMode) return { demo: true };
  const { data, error } = await supabase().auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: {
        full_name: input.name.trim(),
        role: "student",
        job_role_id: input.roleId,
        programme_id: answers?.programmeId,
        year: answers?.year,
        used_skill_ids: answers?.used ?? [],
      },
    },
  });
  if (error) throw authError(error);
  return { demo: false, confirmEmail: !data.session };
}

/** Signs the student in; the app moves on by itself once the session arrives. */
export async function logIn(input: LogInInput): Promise<AuthResult> {
  if (isTestMode) return { demo: true };
  const { error } = await supabase().auth.signInWithPassword({ email: input.email.trim(), password: input.password });
  if (error) throw authError(error);
  return { demo: false };
}

/** Signs out; the app goes back to Welcome by itself. */
export async function logOut(): Promise<AuthResult> {
  if (isTestMode) return { demo: true };
  const { error } = await supabase().auth.signOut();
  if (error) throw authError(error);
  return { demo: false };
}

/**
 * Emails a password-reset link.
 * TODO (web portal shell): the link opens a "choose a new password" page on the web portal, so
 * this waits for it (supabase.auth.resetPasswordForEmail with that page as redirectTo).
 */
export async function sendPasswordReset(email: string): Promise<AuthResult> {
  if (isTestMode) return { demo: true };
  throw new Error(`Password reset comes with the web portal, where its link opens (${email.trim() || "no email given"}).`);
}
