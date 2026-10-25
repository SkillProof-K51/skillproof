import { getTargetRoles, type TargetRole } from "./auth";
import { demoOnboarding, demoWarmUps } from "./demo/onboarding";
import { isTestMode } from "./testMode";

/** What a student is aiming for: it steers which micro-projects Module 2 suggests. */
export type Aim = { id: string; label: string; description: string };

/** The choices onboarding offers. Roles and their roadmaps come from Module 1. */
export type OnboardingOptions = {
  roles: TargetRole[];
  aims: Aim[];
  programmes: { id: string; label: string }[];
  years: number[];
};

/** What the student answered. It goes into sign-up and is saved with the profile. */
export type OnboardingAnswers = {
  roleId?: string;
  aimId?: string;
  programmeId?: string;
  year?: number;
  /** Skills they've used before. These only pick the first challenges, never a status (rule 7). */
  used: string[];
};

/** The warm-up before sign-up: a few lines of code with one bug; the student taps the line. */
export type WarmUp = {
  skill: string;
  language: "javascript" | "sql";
  lines: string[];
  /** Says what's wrong once the student finds it. */
  why: string;
};

/**
 * The options, or null when there's nothing to offer yet.
 * TODO (shared core, weeks 6–7): Module 1's roles and the programmes from the profiles schema.
 */
export function getOnboardingOptions(): OnboardingOptions | null {
  return isTestMode ? { roles: getTargetRoles(), ...demoOnboarding } : null;
}

/**
 * The warm-up for a role (one of its first skills), or null. Only the question: the answer stays
 * with the grader.
 * TODO (Module 3, weeks 7–11): pick one from the challenge bank.
 */
export function getWarmUp(roleId?: string): WarmUp | null {
  if (!isTestMode) return null;
  return (demoWarmUps[roleId ?? ""] ?? demoWarmUps.web).warmUp;
}

/**
 * Is this the line with the bug? The one place the warm-up is graded (rule 2).
 * TODO (Module 3, weeks 7–11): ask the challenge scorer, so the answer never ships in the app.
 */
export function isBugLine(warmUp: WarmUp, line: number): boolean {
  return Object.values(demoWarmUps).some((d) => d.warmUp === warmUp && d.answer === line);
}

/** Answers carried to sign-up as a route param; anything unreadable starts empty. */
export function parseAnswers(raw?: string): OnboardingAnswers {
  try {
    const v = raw ? JSON.parse(raw) : null;
    return v && Array.isArray(v.used) ? (v as OnboardingAnswers) : { used: [] };
  } catch {
    return { used: [] };
  }
}
