import "server-only";

import { demoPending } from "./demo/portal";
import { createClient } from "./supabase/server";
import { isTestMode } from "./testMode";

/** A company or coordinator waiting for the admin (profiles.status = pending). */
export type PendingAccount = {
  id: string;
  kind: "company" | "coordinator";
  /** The company's name, or the coordinator's. */
  name: string;
  contactName: string;
  email: string;
  ssmNo?: string;
  website?: string;
  documentPath?: string;
  faculty?: string;
  createdAt: string;
};

type Row = {
  id: string;
  full_name: string;
  email: string | null;
  role: "company" | "coordinator";
  created_at: string;
  companies: { name: string; ssm_no: string; website: string | null; document_path: string | null } | null;
  coordinators: { faculty: string } | null;
};

/** Everyone waiting for approval, oldest first. RLS lets only an admin read them. */
export async function getPendingAccounts(): Promise<PendingAccount[]> {
  if (isTestMode) return demoPending;
  const { data, error } = await (await createClient())
    .from("profiles")
    .select("id, full_name, email, role, created_at, companies (name, ssm_no, website, document_path), coordinators (faculty)")
    .eq("status", "pending")
    .in("role", ["company", "coordinator"])
    .order("created_at", { ascending: true })
    .overrideTypes<Row[], { merge: false }>();
  if (error) throw new Error("Couldn’t load the accounts waiting for approval. Refresh to try again.");
  return data.map((r) => ({
    id: r.id,
    kind: r.role,
    name: r.companies?.name ?? r.full_name,
    contactName: r.full_name,
    email: r.email ?? "",
    ssmNo: r.companies?.ssm_no,
    website: r.companies?.website ?? undefined,
    documentPath: r.companies?.document_path ?? undefined,
    faculty: r.coordinators?.faculty,
    createdAt: r.created_at,
  }));
}

/** How many are waiting (the sidebar's count). */
export async function getPendingCount(): Promise<number> {
  if (isTestMode) return demoPending.length;
  const { count, error } = await (await createClient())
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")
    .in("role", ["company", "coordinator"]);
  if (error) throw new Error("Couldn’t count the accounts waiting for approval.");
  return count ?? 0;
}
