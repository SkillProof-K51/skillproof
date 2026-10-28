import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { getAccount } from "@/lib/account";
import { signOut } from "@/lib/auth-actions";

export const metadata: Metadata = { title: "SkillProof for students" };

/** Where a student lands if they sign in here (or after choosing a new password). */
export default async function StudentsPage() {
  const account = await getAccount();
  return (
    <AuthCard
      title="SkillProof for students is in the app"
      description="Practise, prove your skills and share your passport on the SkillProof app. This portal is for companies, mentors, university coordinators and admins."
    >
      {account ? (
        <form action={signOut}>
          <Button type="submit" variant="outline" className="w-full">
            Sign out of the portal
          </Button>
        </form>
      ) : null}
    </AuthCard>
  );
}
