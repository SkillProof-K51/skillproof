import { demoChallenges } from "./demo/challenges";
import { isTestMode } from "./testMode";

/**
 * The three kinds of challenge (spec, Module 3). Fix the bug and SQL live are checked automatically;
 * Explain it is graded by AI against our rubric.
 */
export type ChallengeKind = "fix_bug" | "sql_live" | "explain_it";

/** One challenge per day, picked by Module 3. */
export type TodaysChallenge = {
  id: string;
  title: string;
  /** First few lines of today's code or query — a teaser, never the answer. */
  preview?: string[];
  skill: string;
  /** Passed challenges in this skill so far, out of `of` (the passes that make it Practised). */
  passed: number;
  of: number;
  minutes: number;
  /** True once today's challenge is passed — the card switches to "Done for today". */
  done?: boolean;
};

export type Challenge = {
  id: string;
  title: string;
  skill: string;
  kind: ChallengeKind;
  minutes: number;
  /** The student's best attempt so far; absent = not tried yet. Score and pass come from the challenge scorer (rule 2). */
  best?: { score: number; passed: boolean };
};

/** A skill on its way to Practised: challenges passed so far, out of `of`. */
export type SkillProgress = { skill: string; passed: number; of: number };

/** What the Challenges tab displays. Every score and count is computed by Module 3 — the screen only shows it. */
export type ChallengesData = {
  /** Passes (at the pass mark) that make a skill Practised — the scorer's rule, shown in the hero. */
  passesToPractise: number;
  /** null = no challenge picked for today; the card is hidden. */
  today: TodaysChallenge | null;
  /** Skills with passes still to go, closest to Practised first. */
  inProgress: SkillProgress[];
  /** Everything else to practise, in Module 3's order: still to pass first, passed last. */
  challenges: Challenge[];
};

/**
 * Returns the Challenges data, or null when there is nothing to show yet.
 * TODO (Module 3, weeks 7–11): read challenges and attempts from Supabase; keep the demo branch
 * behind the TEST MODE flag only.
 */
export function getChallengesData(): ChallengesData | null {
  return isTestMode ? demoChallenges : null;
}

/** "1 more to Practised" / "3 more to Practised". */
export function toPractisedLabel(s: SkillProgress): string {
  return `${s.of - s.passed} more to Practised`;
}
