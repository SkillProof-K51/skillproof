import { FileTextIcon, GlobeIcon, IdentificationCardIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";

import { DocumentUpload } from "@/components/company/DocumentUpload";
import { JoinCodeCard } from "@/components/company/JoinCodeCard";
import { MentorsTable } from "@/components/company/MentorsTable";
import { PageHeader } from "@/components/portal/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAccount } from "@/lib/account";
import { getMentors, getMyCompany } from "@/lib/company";
import { waitedFor } from "@/lib/time";

export const metadata: Metadata = { title: "Your company · SkillProof Portal" };

/** An approved company's page: the code its mentors join with, its mentors, its details. */
export default async function CompanyPage() {
  const account = await requireAccount(["company"]);
  const company = await getMyCompany(account.id);
  if (!company) throw new Error("Your company's details are missing. Contact the admin.");
  const mentors = (await getMentors(company.id)).map((m) => ({ ...m, joined: waitedFor(m.joinedAt) }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={company.name} description="Share the join code with your mentors. Micro-projects come with Module 4." actions={<Badge variant="success">Approved</Badge>} />
      <div className="grid gap-4 lg:grid-cols-2">
        <JoinCodeCard code={company.joinCode} />
        <Card>
          <CardHeader>
            <CardTitle>Company details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p className="flex items-center gap-2">
              <IdentificationCardIcon className="size-4 text-muted-foreground" />
              SSM <span className="font-mono">{company.ssmNo}</span>
            </p>
            {company.website ? (
              <p className="flex items-center gap-2">
                <GlobeIcon className="size-4 text-muted-foreground" />
                <a href={company.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  {company.website.replace(/^https?:\/\//, "")}
                </a>
              </p>
            ) : null}
            <div className="flex items-start gap-2">
              <FileTextIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <DocumentUpload current={company.documentPath} />
            </div>
          </CardContent>
        </Card>
      </div>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Your mentors · {mentors.length}</h2>
        <MentorsTable mentors={mentors} />
      </section>
    </div>
  );
}
