import { demoPassport } from "./demo/passport";
import { isTestMode } from "./testMode";

/** One skill on the passport, with what proves its status. */
export type PassportSkill = {
  skill: string;
  status: "practised" | "verified";
  /** What proves it: a micro-project a mentor rated (Verified, Module 4) or the challenges passed (Practised, Module 3). */
  evidence: { kind: "project"; project: string; rating: number; outOf: number } | { kind: "challenges"; passed: number; best: number };
  /** On the public passport — the student chooses, skill by skill. */
  shown: boolean;
};

/** What the Passport tab displays (Module 5). Statuses come from Modules 3 and 4; Module 5 only reads them. */
export type PassportData = {
  student: { name: string; pathLabel: string };
  /** Verified first, then Practised, newest first within each. */
  skills: PassportSkill[];
  /** isPublic = anyone with the link can open the passport. */
  share: { isPublic: boolean; link: string };
};

/**
 * Returns the passport, or null when there is nothing to show yet.
 * TODO (Module 5, weeks 7–11): read skills, evidence and share settings from Supabase.
 */
export function getPassportData(): PassportData | null {
  return isTestMode ? demoPassport : null;
}

const NBSP = "\u00a0"; // keeps "rated 4 of 5" and "best 85%" whole when a line wraps

/** "Recipe card layout · rated 4 of 5" / "3 challenges passed · best 92%". */
export function evidenceLabel(e: PassportSkill["evidence"]): string {
  return e.kind === "project"
    ? `${e.project} · rated${NBSP}${e.rating}${NBSP}of${NBSP}${e.outOf}`
    : `${e.passed}${NBSP}challenges passed · best${NBSP}${e.best}%`;
}

/**
 * Saves who can see the passport: the public switch and the skills shown on it.
 * TODO (Module 5, weeks 7–11): write to Supabase (RLS: only the owner). Until then only TEST MODE
 * "saves" (nothing is stored), and anything else fails loudly — rule 11, never a silent no-op.
 */
export async function savePassportSharing(change: { isPublic?: boolean; shown?: string[] }): Promise<void> {
  if (isTestMode) return;
  throw new Error(`Saving ${Object.keys(change).join(" and ")} arrives with Module 5`);
}
