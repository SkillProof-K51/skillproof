import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Register as a coordinator · SkillProof Portal" };

export default function RegisterCoordinatorPage() {
  return (
    <AuthCard
      title="Register as a coordinator"
      description="An admin approves university coordinators before they can see students' reports."
      footer={
        <Link href="/register" className="text-primary hover:underline">
          Register as someone else
        </Link>
      }
    >
      <RegisterForm kind="coordinator" />
    </AuthCard>
  );
}
