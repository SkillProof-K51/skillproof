import { InfoIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";

import { ApprovalsTabs } from "@/components/admin/ApprovalsTabs";
import { PageHeader } from "@/components/portal/PageHeader";
import { requireAccount } from "@/lib/account";
import { getPendingAccounts } from "@/lib/approvals";
import { waitedFor } from "@/lib/time";

export const metadata: Metadata = { title: "Approvals · SkillProof Portal" };

/** The admin's queue: companies and coordinators wait here until approved (look A). */
export default async function ApprovalsPage() {
  await requireAccount(["admin"]);
  const rows = (await getPendingAccounts()).map((r) => ({ ...r, waited: waitedFor(r.createdAt) }));
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Approvals"
        description="Companies and coordinators wait here until you approve them. Mentors don't: they join with their company's code once the company is approved."
      />
      <ApprovalsTabs rows={rows} />
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <InfoIcon className="mt-0.5 size-4 shrink-0" />
        Approving lets the company sign in and see its mentor join code. Rejecting keeps the account closed.
      </p>
    </div>
  );
}
