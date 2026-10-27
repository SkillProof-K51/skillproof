import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Register your company · SkillProof Portal" };

export default function RegisterCompanyPage() {
  return (
    <AuthCard
      title="Register your company"
      description="An admin checks your SSM registration before you can use the portal."
      footer={
        <Link href="/register" className="text-primary hover:underline">
          Register as someone else
        </Link>
      }
    >
      <RegisterForm kind="company" />
    </AuthCard>
  );
}
