import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/AuthCard";
import { LinkSignIn } from "@/components/auth/LinkSignIn";

export const metadata: Metadata = { title: "Signing you in · SkillProof Portal" };

/** Where Supabase's default email links land (resets asked for on the portal or in the app). */
export default function AuthCallbackPage() {
  return (
    <AuthCard title="One moment">
      <LinkSignIn />
    </AuthCard>
  );
}
