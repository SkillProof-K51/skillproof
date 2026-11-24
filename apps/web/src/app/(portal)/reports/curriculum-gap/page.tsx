import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/portal/ModulePlaceholder";
import { requireAccount } from "@/lib/account";

export const metadata: Metadata = { title: "Curriculum gap · SkillProof Portal" };

export default async function ReportsCurriculumGapPage() {
  await requireAccount(["admin", "coordinator"]);
  return (
    <ModulePlaceholder
      title="Curriculum gap"
      description="The skills employers ask for that the mapped courses don't teach yet."
      owner="Module 1 · Iskandar"
      plan="The gap report: job-ad weights against the course ↔ skill maps, per role."
    />
  );
}
