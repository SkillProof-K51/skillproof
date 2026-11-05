import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/PasswordForms";

export const metadata: Metadata = { title: "Choose a new password · SkillProof Portal" };

/** Where the reset link lands (via /auth/confirm, which signs you in for this). */
export default function ResetPasswordPage() {
  return (
    <AuthCard title="Choose a new password" description="Then sign in with it here or on the app.">
      <ResetPasswordForm />
    </AuthCard>
  );
}
