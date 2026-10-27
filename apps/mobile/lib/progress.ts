import type { ChallengeKind } from "./challenges";
import { demoProgress } from "./demo/progress";
import { isTestMode } from "./testMode";

/** What the Progress screen shows (opened from Home's progress card, "See all"). */
export type ProgressData = {
  /** The week shown, e.g. "19–25 Oct". */
  week: string;
  /** Module 3's practice report: challenges done this week, by kind. */
  practice: Record<ChallengeKind, number>;
  /** Module 2's fit engine: readiness for the role on each day of the week (0–100), and the bar for Ready. */
  readiness: { role: string; days: { label: string; percent: number }[]; readyAt: number };
  /** Every skill on the roadmap, in order: its status and what proves it. */
  roadmap: { skill: string; status: "not_yet" | "practised" | "verified"; detail: string }[];
};

/**
 * Returns the week's progress, or null when there is nothing to show yet.
 * TODO (Modules 2 + 3, weeks 7–11): the practice report from attempts, readiness from the fit engine.
 */
export function getProgressData(): ProgressData | null {
  return isTestMode ? demoProgress : null;
}

/** Challenges done this week, all kinds together. */
export function practiceTotal(practice: ProgressData["practice"]): number {
  return Object.values(practice).reduce((sum, n) => sum + n, 0);
}

/** Readiness today, and how far it moved since the first day shown. */
export function readinessNow(days: ProgressData["readiness"]["days"]): { now: number; change: number } {
  const now = days[days.length - 1]?.percent ?? 0;
  return { now, change: now - (days[0]?.percent ?? now) };
}
