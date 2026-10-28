import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/portal/ModulePlaceholder";
import { requireAccount } from "@/lib/account";

export const metadata: Metadata = { title: "Micro-projects · SkillProof Portal" };

export default async function CompanyMicroProjectsPage() {
  await requireAccount(["company"]);
  return (
    <ModulePlaceholder
      title="Micro-projects"
      description="Short real projects students apply for once their skills are Practised."
      owner="Module 4 · Fiona"
      plan="Post micro-projects, see who applied, and assign one of your mentors."
    />
  );
}
