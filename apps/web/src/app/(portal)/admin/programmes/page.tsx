import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/portal/ModulePlaceholder";
import { requireAccount } from "@/lib/account";

export const metadata: Metadata = { title: "Programmes · SkillProof Portal" };

export default async function AdminProgrammesPage() {
  await requireAccount(["admin"]);
  return (
    <ModulePlaceholder
      title="Programmes"
      description="The study programmes students pick at sign-up."
      owner="Shared core · Azim"
      plan="Replace the five placeholder programmes with the faculty's real list, and edit it here."
    />
  );
}
