import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/portal/ModulePlaceholder";
import { requireAccount } from "@/lib/account";

export const metadata: Metadata = { title: "Skills · SkillProof Portal" };

export default async function AdminSkillsPage() {
  await requireAccount(["admin"]);
  return (
    <ModulePlaceholder
      title="Skills"
      description="The skill catalogue every role's roadmap is built from."
      owner="Module 1 · Iskandar"
      plan="Add, edit and delete skills. A skill a student already holds can't be deleted, so the page should say why. The table is ready: skills (docs/data-contracts.md)."
    />
  );
}
