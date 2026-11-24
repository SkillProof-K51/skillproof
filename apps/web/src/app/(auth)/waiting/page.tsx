import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/AuthCard";
import { DocumentUpload } from "@/components/company/DocumentUpload";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { getAccount, homeFor } from "@/lib/account";
import { signOut } from "@/lib/auth-actions";
import { getMyCompany } from "@/lib/company";

export const metadata: Metadata = { title: "Waiting for approval · SkillProof Portal" };

/**
 * A company or coordinator the admin hasn't approved yet (or rejected). A waiting company uploads
 * its SSM document here — that's what the admin checks.
 */
export default async function WaitingPage() {
  const account = await getAccount();
  if (!account) redirect("/sign-in");
  if (account.status === "active") redirect(homeFor(account));
  const company = account.role === "company" ? await getMyCompany(account.id) : null;
  const rejected = account.status === "rejected";

  return (
    <AuthCard
      title={rejected ? "Your registration wasn't approved" : "Waiting for approval"}
      description={
        rejected
          ? "An admin turned this registration down. Contact the SkillProof admin if you think that's a mistake."
          : company
            ? `An admin checks ${company.name}'s SSM registration. Upload the document below; you'll get in once it's approved.`
            : "An admin approves university coordinators before they can see students' reports."
      }
      footer={
        <form action={signOut}>
          <Button type="submit" variant="link" className="px-0">
            Sign out
          </Button>
        </form>
      }
    >
      {company && !rejected ? <DocumentUpload current={company.documentPath} /> : null}
      <Toaster />
    </AuthCard>
  );
}
