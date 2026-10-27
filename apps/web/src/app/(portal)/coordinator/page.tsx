import { CaretRightIcon, ChartBarIcon, GitDiffIcon, TreeStructureIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { requireAccount } from "@/lib/account";

export const metadata: Metadata = { title: "Home · SkillProof Portal" };

const LINKS = [
  { href: "/coordinator/course-maps", icon: TreeStructureIcon, title: "Course maps", body: "Which skills each course teaches." },
  { href: "/reports/curriculum-gap", icon: GitDiffIcon, title: "Curriculum gap", body: "What employers want that courses don't teach yet." },
  { href: "/reports/skill-shortage", icon: ChartBarIcon, title: "Skill shortage", body: "Where students' verified skills fall short." },
] as const;

export default async function CoordinatorHomePage() {
  const account = await requireAccount(["coordinator"]);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Hi, ${account.fullName.split(" ")[0]}`} description="Map the faculty's courses to skills, then read the reports." />
      <div className="grid gap-4 md:grid-cols-3">
        {LINKS.map(({ href, icon: Icon, title, body }) => (
          <Link key={href} href={href}>
            <Card className="h-full hover:bg-muted">
              <CardContent className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-medium">{title}</span>
                  <span className="text-sm text-muted-foreground">{body}</span>
                </div>
                <CaretRightIcon className="size-4 shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
