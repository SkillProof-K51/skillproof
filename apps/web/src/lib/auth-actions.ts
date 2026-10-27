"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  authMessage,
  cleanJoinCode,
  cleanSsm,
  emailError,
  MIN_PASSWORD,
  validateRegister,
  type FormState,
  type RegisterKind,
} from "./auth-rules";
import { TEST_VIEW_COOKIE, TEST_VIEWS } from "./demo/accounts";
import { createClient } from "./supabase/server";
import { isTestMode } from "./testMode";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const hasErrors = (e: FormState["errors"]) => Object.keys(e ?? {}).length > 0;

export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email");
  const password = String(form.get("password") ?? "");
  const errors = { email: emailError(email), password: password ? undefined : "Enter your password" };
  if (errors.email || errors.password) return { errors, values: { email } };
  if (isTestMode) redirect("/"); // TEST MODE: you're whoever the strip says
  const { error } = await (await createClient()).auth.signInWithPassword({ email, password });
  if (error) return { message: authMessage(error), tone: "error", values: { email } };
  redirect("/");
}

const KINDS: RegisterKind[] = ["company", "mentor", "coordinator"];

/** Registers a company, a mentor (with their company's code) or a coordinator. */
export async function register(_prev: FormState, form: FormData): Promise<FormState> {
  const kind = KINDS.find((k) => k === form.get("kind"));
  if (!kind) return { message: "Choose who you're registering as.", tone: "error" };
  const v = Object.fromEntries(
    ["full_name", "email", "company_name", "ssm_no", "website", "join_code", "job_title", "faculty"].map((k) => [k, text(form, k)]),
  );
  const password = String(form.get("password") ?? "");
  const errors = validateRegister(kind, { ...v, password });
  if (hasErrors(errors)) return { errors, values: v };
  if (isTestMode) return { message: "Test mode: no account was created.", tone: "success", values: v };

  const data = {
    company: { role: "company", full_name: v.full_name, company_name: v.company_name, ssm_no: cleanSsm(v.ssm_no), website: v.website },
    mentor: { role: "mentor", full_name: v.full_name, join_code: cleanJoinCode(v.join_code), job_title: v.job_title },
    coordinator: { role: "coordinator", full_name: v.full_name, faculty: v.faculty },
  }[kind];
  const { data: result, error } = await (await createClient()).auth.signUp({ email: v.email, password, options: { data } });
  if (error) return { message: authMessage(error, kind), tone: "error", values: v };
  if (!result.session) {
    return { message: `Check your inbox: open the link we sent to ${v.email} to finish.`, tone: "success", values: v };
  }
  redirect("/");
}

/** Emails a reset link. Says the same thing whether or not the email has an account. */
export async function requestPasswordReset(_prev: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email");
  if (emailError(email)) return { errors: { email: emailError(email) }, values: { email } };
  const sent = { message: `If ${email} has an account, a link to choose a new password is on its way.`, tone: "success" as const, values: { email } };
  if (isTestMode) return { ...sent, message: "Test mode: no email was sent." };
  const { error } = await (await createClient()).auth.resetPasswordForEmail(email);
  if (error) return { message: authMessage(error), tone: "error", values: { email } };
  return sent;
}

/** Sets a new password for whoever the reset link signed in. */
export async function updatePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < MIN_PASSWORD) return { errors: { password: `Use at least ${MIN_PASSWORD} characters` } };
  if (password !== confirm) return { errors: { confirm: "The two passwords don't match" } };
  if (isTestMode) return { message: "Test mode: no password was changed.", tone: "success" };
  const { error } = await (await createClient()).auth.updateUser({ password });
  if (error) return { message: authMessage(error), tone: "error" };
  redirect("/");
}

export async function signOut(): Promise<void> {
  if (!isTestMode) await (await createClient()).auth.signOut();
  redirect("/sign-in");
}

/** TEST MODE only: view the portal as another demo account. */
export async function setTestView(view: string): Promise<void> {
  const match = TEST_VIEWS.find((v) => v === view);
  if (!isTestMode || !match) return;
  (await cookies()).set(TEST_VIEW_COOKIE, match, { path: "/", sameSite: "lax", httpOnly: true });
  redirect("/");
}
