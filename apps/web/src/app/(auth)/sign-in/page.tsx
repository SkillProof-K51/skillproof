import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = { title: "Sign in · SkillProof Portal" };

const NOTICES: Record<string, string> = {
  expired: "That link has expired or was already used. Ask for a new one below.",
};

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const { link } = await searchParams;
  return (
    <AuthCard
      title="Sign in"
      description="For companies, mentors, university coordinators and admins."
      footer={
        <>
          <span>
            New here?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Create an account
            </Link>
          </span>
          <span>Students sign in on the SkillProof app.</span>
        </>
      }
    >
      <SignInForm notice={typeof link === "string" ? NOTICES[link] : undefined} />
    </AuthCard>
  );
}
