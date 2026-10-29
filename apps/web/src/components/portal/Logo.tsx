import { cn } from "@/lib/utils";

/**
 * The SkillProof mark (direction 3, Azim 29 Oct): a tick between two code brackets. Plain SVG, so
 * it works in server and client components alike. The masters and the app icons: docs/brand.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-7 shrink-0", className)}
    >
      <path d="M18 18L6 32L18 46M46 18L58 32L46 46" className="stroke-foreground" strokeWidth={5.5} />
      <path d="M23.5 32.5L29.5 38.5L41 25.5" className="stroke-primary" strokeWidth={6} />
    </svg>
  );
}
