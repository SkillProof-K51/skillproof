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

/** One challenge per day, picked by Module 3. */
export type TodaysChallenge = {
  title: string;
  skill: string;
  /** Passed challenges in this skill so far, out of `of` (3 = Practised). */
  passed: number;
  of: number;
  minutes: number;
  /** True once today's challenge is passed — the card switches to "Done for today". */
  done?: boolean;
};

/** What the Home screen displays. Every number is computed elsewhere (rule 2) — Home only shows it. */
export type HomeData = {
  student: { firstName: string; initials: string; pathLabel: string };
  bubble: string;
  readiness: {
    /** 0–100 integer from the Module 2 fit engine. */
    percent: number;
    roleLabel: string;
    /** "Job-ready" copy must follow Module 2's threshold rule (Ready ≥ 70 %). */
    headline: string;
    focusSkills: string[];
  };
  /** null = Module 3 has no challenge for today; the card is hidden. */
  todaysChallenge: TodaysChallenge | null;
  /** Already ranked by the fit engine (Module 2), best first. Home features the first open one. */
  microProjects: MicroProject[];
  passport: { verified: number; practised: number };
};

/**
 * Returns the Home data, or null when there is nothing to show yet.
 * TODO (shared core, weeks 6–7): read the signed-in student from Supabase; keep the demo
 * branch behind the TEST MODE flag only.
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
