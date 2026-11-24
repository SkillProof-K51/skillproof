import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/portal/ModulePlaceholder";
import { requireAccount } from "@/lib/account";

export const metadata: Metadata = { title: "Roles & weights · SkillProof Portal" };

export default async function AdminRolesPage() {
  await requireAccount(["admin"]);
  return (
    <ModulePlaceholder
      title="Roles & weights"
      description="The roles students work towards, and how much each skill counts towards Readiness %."
      owner="Module 1 · Iskandar"
      plan="Add, edit and delete roles and their roadmaps, and set each skill's weight from the job-ad counts. Tables ready: job_roles, job_role_skills."
    />
  );
}
