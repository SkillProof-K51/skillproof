import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { demoAccounts, TEST_VIEW_COOKIE, TEST_VIEWS, type TestView } from "./demo/accounts";
import { createClient } from "./supabase/server";
import { isTestMode } from "./testMode";

export type Role = "student" | "company" | "mentor" | "coordinator" | "admin";
export type Status = "active" | "pending" | "rejected";
/** The signed-in user, as their profiles row says (role and status are set by the database). */
export type Account = { id: string; email: string; fullName: string; role: Role; status: Status };

/** TEST MODE's current view (the strip's switcher); the admin's by default. */
export async function getTestView(): Promise<TestView> {
  const value = (await cookies()).get(TEST_VIEW_COOKIE)?.value;
  return TEST_VIEWS.find((v) => v === value) ?? "admin";
}

/**
 * Who is signed in, or null. The one place pages and actions ask (read once per request).
 * Everything else — what they may see — the database's RLS decides again on every query.
 */
export const getAccount = cache(async (): Promise<Account | null> => {
  if (isTestMode) return demoAccounts[await getTestView()];
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const id = auth?.claims.sub;
  if (!id) return null;
  const { data, error } = await supabase.from("profiles").select("id, email, full_name, role, status").eq("id", id).single();
  if (error || !data) throw new Error("Couldn’t load your account. Refresh the page to try again.");
  return { id: data.id, email: data.email ?? "", fullName: data.full_name, role: data.role, status: data.status };
});

/** Where an account lands after signing in. */
export function homeFor(account: Account): string {
  if (account.role === "student") return "/students";
  if (account.status !== "active") return "/waiting";
  return { admin: "/admin/approvals", coordinator: "/coordinator", company: "/company", mentor: "/mentor" }[account.role];
}

/**
 * For a page or action only some roles may use: anyone else is sent where they belong (signed
 * out → sign-in; waiting → the waiting page; a student → the app).
 */
export async function requireAccount(roles: Role[]): Promise<Account> {
  const account = await getAccount();
  if (!account) redirect("/sign-in");
  if (account.role === "student" || account.status !== "active" || !roles.includes(account.role)) redirect(homeFor(account));
  return account;
}
