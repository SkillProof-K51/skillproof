import { SealCheckIcon } from "@phosphor-icons/react";

/** The mark and name for client components (the sidebar). Server pages use Brand. */
export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <SealCheckIcon weight="bold" className="size-4" />
      </span>
      <span className="font-semibold">SkillProof</span>
    </div>
  );
}
