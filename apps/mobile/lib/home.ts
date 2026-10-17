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
    roleLabel: string;
    /** "Job-ready" copy must follow Module 2's threshold rule (Ready ≥ 70 %). */
    headline: string;
    focusSkills: string[];
  };
  todaysChallenge: { title: string; skill: string; passed: number; of: number; minutes: number } | null;
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

/** Time-of-day greeting from the device clock. */
export function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
