import type { Metadata } from "next";

import { KitShowcase } from "@/components/kit/KitShowcase";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = { title: "Portal kit · SkillProof" };

export default function KitPage() {
  return (
    <>
      <KitShowcase />
      <Toaster />
    </>
  );
}
