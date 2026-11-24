import { HammerIcon } from "@phosphor-icons/react/ssr";

import { Card, CardContent } from "@/components/ui/card";

import { PageHeader } from "./PageHeader";

type Props = {
  title: string;
  description: string;
  /** e.g. "Module 1 · Iskandar" — whose graded work this page is. */
  owner: string;
  /** What the page will do, in a line (spec › Modules). */
  plan: string;
};

/**
 * A module's page before its owner builds it: the shell gives it a place in the menu, the page
 * itself stays the module's graded work (AGENTS.md rule 6).
 */
export function ModulePlaceholder({ title, description, owner, plan }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />
      <Card>
        <CardContent className="flex items-start gap-3">
          <HammerIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{owner} builds this page</p>
            <p className="text-sm text-muted-foreground">{plan}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
