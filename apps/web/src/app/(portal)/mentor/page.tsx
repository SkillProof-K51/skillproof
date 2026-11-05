import { BuildingsIcon, CaretRightIcon, KanbanIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { requireAccount } from "@/lib/account";
import { getMentorCompanyName } from "@/lib/company";

export const metadata: Metadata = { title: "Home · SkillProof Portal" };

/** A mentor's home: the company they mentor for, and the way to its micro-projects. */
export default async function MentorHomePage() {
  const account = await requireAccount(["mentor"]);
  const company = await getMentorCompanyName(account.id);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Hi, ${account.fullName.split(" ")[0]}`} description="You rate students' micro-project work. A rating of 3 out of 5 or more verifies the skill." />
      <Card>
        <CardContent className="flex items-start gap-3">
          <BuildingsIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          {company ? (
            <p className="text-sm">
              Mentor for <span className="font-medium">{company}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your company removed you, so you&rsquo;re not linked to one now. Contact them if that&rsquo;s a mistake.
            </p>
          )}
        </CardContent>
      </Card>
      {company ? (
        <Link href="/mentor/micro-projects" className="max-w-md">
          <Card className="hover:bg-muted">
            <CardContent className="flex items-center gap-3">
              <KanbanIcon className="size-5 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">Micro-projects you mentor</span>
              <CaretRightIcon className="size-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      ) : null}
    </div>
  );
}
