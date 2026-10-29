import { cn } from "@/lib/utils";

import { Logo } from "./Logo";

/** The SkillProof logo for the sidebar and signed-out pages, with an optional word after it ("Portal"). */
export function Brand({ subtitle, className }: { subtitle?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo />
      {subtitle ? <span className="text-muted-foreground">{subtitle}</span> : null}
    </div>
  );
}
