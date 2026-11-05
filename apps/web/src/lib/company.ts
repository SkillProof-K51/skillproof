import "server-only";

import { demoAccounts } from "./demo/accounts";
import { demoCompany, demoMentors, demoPendingCompany } from "./demo/portal";
import { createClient } from "./supabase/server";
import { isTestMode } from "./testMode";

export type Company = { id: string; name: string; ssmNo: string; website?: string; documentPath?: string; joinCode: string };
export type Mentor = { id: string; fullName: string; email: string; jobTitle: string; joinedAt: string };

/** The signed-in company's own row (RLS: only its owner and admins read it). */
export async function getMyCompany(ownerId: string): Promise<Company | null> {
  if (isTestMode) return ownerId === demoAccounts["company-pending"].id ? demoPendingCompany : demoCompany;
  const { data, error } = await (await createClient())
    .from("companies")
    .select("id, name, ssm_no, website, document_path, join_code")
    .eq("owner_id", ownerId)
    .maybeSingle();
  if (error) throw new Error("Couldn’t load your company. Refresh to try again.");
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    ssmNo: data.ssm_no,
    website: data.website ?? undefined,
    documentPath: data.document_path ?? undefined,
    joinCode: data.join_code,
  };
}

type MentorRow = { id: string; job_title: string; created_at: string; profiles: { full_name: string; email: string | null } | null };

/** The company's mentors, newest first, with their names (RLS: a company reads its own mentors). */
export async function getMentors(companyId: string): Promise<Mentor[]> {
  if (isTestMode) return demoMentors;
  const { data, error } = await (await createClient())
    .from("mentors")
    .select("id, job_title, created_at, profiles (full_name, email)")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .overrideTypes<MentorRow[], { merge: false }>();
  if (error) throw new Error("Couldn’t load your mentors. Refresh to try again.");
  return data.map((m) => ({
    id: m.id,
    fullName: m.profiles?.full_name ?? "A mentor",
    email: m.profiles?.email ?? "",
    jobTitle: m.job_title,
    joinedAt: m.created_at,
  }));
}

/** The company a mentor joined, or null if their company removed them. */
export async function getMentorCompanyName(mentorId: string): Promise<string | null> {
  if (isTestMode) return demoCompany.name;
  const { data, error } = await (await createClient())
    .from("mentors")
    .select("companies (name)")
    .eq("id", mentorId)
    .maybeSingle()
    .overrideTypes<{ companies: { name: string } | null } | null, { merge: false }>();
  if (error) throw new Error("Couldn’t load your company. Refresh to try again.");
  return data?.companies?.name ?? null;
}
