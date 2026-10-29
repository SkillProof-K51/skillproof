import type { TodaysChallenge } from "./challenges";
import { demoHome } from "./demo/home";
import { isTestMode } from "./testMode";

export type MicroProject = {
  id: string;
  title: string;
  skillsLabel: string;
  fitPercent?: number;
  placesLeft?: number;
  /** Set when the project is locked until this skill is Practised. */
  lockedBy?: string;
};

/** What the Home screen displays. Every number is computed elsewhere (rule 2) — Home only shows it. */
export type HomeData = {
  student: { firstName: string; initials: string; pathLabel: string };
  bubble: string;
  readiness: {
    /** 0–100 integer from the Module 2 fit engine. */
    percent: number;
    /** 0–100 integer: where "ready" starts (the fit engine's line; spec: 70 %, Module 2 may refine). */
    readyAt: number;
    /**
     * The role's roadmap, in order, with each skill's status (Modules 3 and 4 write it; Home reads)
     * and weight — how much it counts toward Readiness, a 0–100 integer from Module 1
     * (`job_role_skills.weight`; a role's weights add up to 100).
     */
    skills: { name: string; status: "not_yet" | "practised" | "verified"; weight: number }[];
  };
  /** null = Module 3 has no challenge for today; the card is hidden. */
  todaysChallenge: TodaysChallenge | null;
  /** Already ranked by the fit engine (Module 2), best first. Home features the first open one. */
  microProjects: MicroProject[];
  /** Counts of the student's skills by status, and the skill most recently Verified (Module 5). */
  passport: { verified: number; practised: number; latestVerified?: string };
};

/**
 * Returns the Home data, or null when there is nothing to show yet.
 * TODO (Modules 2–4): build it from the signed-in student's readiness (fit engine), today's
 * challenge and matched projects; keep the demo branch behind the TEST MODE flag only.
 */
export function getHomeData(): HomeData | null {
  return isTestMode ? demoHome : null;
}

/**
 * The project today's challenge works toward: the first micro-project locked by today's skill, and
 * how many more passes that skill needs to reach Practised. Null when nothing is waiting on it.
 */
export function nextUnlock(data: HomeData): { project: MicroProject; remaining: number } | null {
  const c = data.todaysChallenge;
  if (!c || c.done) return null;
  const project = data.microProjects.find((p) => p.lockedBy === c.skill);
  return project ? { project, remaining: c.of - c.passed } : null;
}

/** "1 place left" / "3 places left". */
export function placesLeftLabel(n: number): string {
  return `${n} ${n === 1 ? "place" : "places"} left`;
}

/** Time-of-day greeting from the device clock. */
export function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
