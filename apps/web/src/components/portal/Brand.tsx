import { SealCheckIcon } from "@phosphor-icons/react/ssr";

/** The SkillProof mark and name (no logo yet): a purple tile with the verified seal. */
export function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <SealCheckIcon weight="bold" className="size-4" />
      </span>
      <span className="font-semibold">SkillProof</span>
      {subtitle ? <span className="text-muted-foreground">{subtitle}</span> : null}
    </div>
  );
}
