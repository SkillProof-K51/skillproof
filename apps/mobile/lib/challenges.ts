import { demoChallenges, demoResults } from "./demo/challenges";
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

/** One graded attempt, as the Result screen shows it. Every number comes from the challenge scorer (rule 2). */
export type ChallengeResult = {
  challengeId: string;
  title: string;
  skill: string;
  kind: ChallengeKind;
  /** 0–100 integer. */
  score: number;
  /** The score a pass needs (0–100) — the scorer's rule, shown beside the score. */
  passMark: number;
  passed: boolean;
  /** The skill's progress after this attempt. */
  progress: SkillProgress;
  /** True when this attempt made the skill Practised (only Module 3 writes that status). */
  nowPractised: boolean;
  /** Tests (Fix the bug), checks on the query's result (SQL live) or rubric lines (Explain it). */
  checks: { label: string; passed: boolean; detail?: string }[];
  /** ai = the AI's feedback on an Explain it answer · hint = a nudge after a missed check. */
  feedback?: { kind: "ai" | "hint"; text: string };
  /** A micro-project this attempt opened: every skill it needs is Practised now. */
  unlocked?: { id: string; title: string };
};

/**
 * Returns the Challenges data, or null when there is nothing to show yet.
 * TODO (Module 3, weeks 7–11): read challenges and attempts from Supabase; keep the demo branch
 * behind the TEST MODE flag only.
 */
export function getChallengesData(): ChallengesData | null {
  return isTestMode ? demoChallenges : null;
}

/**
 * The result of one attempt (the student's best for that challenge), or null when there is none.
 * TODO (Module 3, weeks 7–11): read the attempt from Supabase.
 */
export function getChallengeResult(challengeId: string): ChallengeResult | null {
  return isTestMode ? (demoResults[challengeId] ?? null) : null;
}

/** "1 more to Practised" / "3 more to Practised". */
export function toPractisedLabel(s: SkillProgress): string {
  return `${s.of - s.passed} more to Practised`;
}
