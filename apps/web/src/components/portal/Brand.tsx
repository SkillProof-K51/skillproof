import { cn } from "@/lib/utils";

import { Logo } from "./Logo";

/** The SkillProof logo — the mark, then "skillproof" in the code font — for the sidebar and signed-out pages. */
export function Brand({ subtitle, className }: { subtitle?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo />
      <span className="font-mono text-lg font-bold tracking-tight">skillproof</span>
      {subtitle ? <span className="text-muted-foreground">{subtitle}</span> : null}
    </div>
  );
}
