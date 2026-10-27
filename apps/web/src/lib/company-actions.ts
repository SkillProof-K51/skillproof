"use server";

import { revalidatePath } from "next/cache";

import { getAccount, requireAccount } from "./account";
import { createClient } from "./supabase/server";
import { isTestMode } from "./testMode";

export type ActionResult = { ok: boolean; message: string; code?: string };

/** Draws a new mentor join code; the old one stops working. The database draws it (nobody picks). */
export async function newJoinCode(): Promise<ActionResult> {
  const account = await requireAccount(["company"]);
  if (isTestMode) return { ok: true, message: "Test mode: nothing was saved.", code: "T3ST-C0DE" };
  const { data, error } = await (await createClient())
    .from("companies")
    .update({ join_code: null })
    .eq("owner_id", account.id)
    .select("join_code")
    .single();
  if (error || !data) return { ok: false, message: "Couldn’t make a new code. Try again." };
  revalidatePath("/company");
  return { ok: true, message: "New code ready. The old one no longer works.", code: data.join_code };
}

/** Removes a mentor from the company (their account stays; they're no longer linked to you). */
export async function removeMentor(id: string, name: string): Promise<ActionResult> {
  await requireAccount(["company"]);
  if (isTestMode) return { ok: true, message: `Test mode: nothing was saved. (${name} would be removed.)` };
  const { data, error } = await (await createClient()).from("mentors").delete().eq("id", id).select("id");
  if (error) return { ok: false, message: "Couldn’t remove that mentor. Try again." };
  if (!data.length) return { ok: false, message: `${name} isn't one of your mentors any more.` };
  revalidatePath("/company");
  return { ok: true, message: `${name} was removed.` };
}

/**
 * Records the SSM document a company just uploaded (to its own folder in the private bucket).
 * Open to a company that's still waiting: that's when the admin needs it.
 */
export async function recordDocument(path: string): Promise<ActionResult> {
  const account = await getAccount();
  if (!account || account.role !== "company") return { ok: false, message: "Only a company uploads a company document." };
  if (!path.startsWith(`${account.id}/`)) return { ok: false, message: "That file isn't in your company's folder." };
  if (isTestMode) return { ok: true, message: "Test mode: nothing was uploaded." };
  const { error } = await (await createClient()).from("companies").update({ document_path: path }).eq("owner_id", account.id);
  if (error) return { ok: false, message: "Couldn’t save the document. Try again." };
  revalidatePath("/waiting");
  revalidatePath("/company");
  return { ok: true, message: "Document uploaded. The admin can see it now." };
}
