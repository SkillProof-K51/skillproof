import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/portal/ModulePlaceholder";
import { requireAccount } from "@/lib/account";

export const metadata: Metadata = { title: "Micro-projects · SkillProof Portal" };

export default async function MentorMicroProjectsPage() {
  await requireAccount(["mentor"]);
  return (
    <ModulePlaceholder
      title="Micro-projects"
      description="The micro-projects you mentor."
      owner="Module 4 · Fiona"
      plan="Review deliverables (an AI first review, then you decide) and rate them: 3 out of 5 or more verifies the skill."
    />
  );
}
