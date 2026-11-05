"use server";

import { revalidatePath } from "next/cache";

import { requireAccount } from "./account";
import { createClient } from "./supabase/server";
import { isTestMode } from "./testMode";

export type DecisionResult = { ok: boolean; message: string };

/**
 * Approves or rejects a waiting company or coordinator. Checked twice: here (an admin is signed
 * in) and by the database (only an active admin may change a status — portal_accounts migration).
 */
export async function decideAccount(id: string, name: string, decision: "active" | "rejected"): Promise<DecisionResult> {
  await requireAccount(["admin"]);
  const done = decision === "active" ? `${name} is approved and can sign in.` : `${name} was rejected.`;
  if (isTestMode) return { ok: true, message: `Test mode: nothing was saved. (${done})` };
  const { data, error } = await (await createClient())
    .from("profiles")
    .update({ status: decision })
    .eq("id", id)
    .eq("status", "pending")
    .select("id");
  if (error) return { ok: false, message: "Couldn’t save that decision. Try again." };
  if (!data.length) return { ok: false, message: `${name} isn't waiting any more: someone already decided.` };
  revalidatePath("/admin/approvals", "layout"); // the list and the sidebar's count
  return { ok: true, message: done };
}
