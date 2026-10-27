import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Join as a mentor · SkillProof Portal" };

export default function RegisterMentorPage() {
  return (
    <AuthCard
      title="Join as a mentor"
      description="Use the join code from your company's SkillProof page. You can start straight away."
      footer={
        <Link href="/register" className="text-primary hover:underline">
          Register as someone else
        </Link>
      }
    >
      <RegisterForm kind="mentor" />
    </AuthCard>
  );
}
