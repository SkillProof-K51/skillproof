import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/portal/ModulePlaceholder";
import { requireAccount } from "@/lib/account";

export const metadata: Metadata = { title: "Course maps · SkillProof Portal" };

export default async function CoordinatorCourseMapsPage() {
  await requireAccount(["coordinator"]);
  return (
    <ModulePlaceholder
      title="Course maps"
      description="Which skills each of the faculty's courses teaches."
      owner="Module 1 · Iskandar"
      plan="Map courses to skills. The curriculum gap report reads these maps."
    />
  );
}
