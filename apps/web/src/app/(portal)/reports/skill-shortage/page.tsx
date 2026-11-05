import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/portal/ModulePlaceholder";
import { requireAccount } from "@/lib/account";

export const metadata: Metadata = { title: "Skill shortage · SkillProof Portal" };

export default async function ReportsSkillShortagePage() {
  await requireAccount(["admin", "coordinator"]);
  return (
    <ModulePlaceholder
      title="Skill shortage"
      description="Where verified skills fall short of what employers want."
      owner="Module 5 · Azim"
      plan="Module 1's demand (the weights) against verified supply (students' Verified skills), skill by skill."
    />
  );
}
