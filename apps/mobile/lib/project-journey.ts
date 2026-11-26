import { demoProjectJourney } from "./demo/project-journey";
import { isTestMode } from "./testMode";
import { verificationDecision, verificationScore } from "./verification";

/** The sample lifecycle is only available in TEST MODE; no application or review is stored. */
export function getProjectJourney(projectId: string) {
  if (!isTestMode || projectId !== demoProjectJourney.projectId) return null;
  const score = verificationScore(demoProjectJourney.ratings.map((item) => item.score));
  return { ...demoProjectJourney, verificationScore: score, decision: verificationDecision(score) };
}

/** Demo actions deliberately do not submit data or call an AI service. */
export function recordDemoProjectStep(projectId: string): { recorded: false } {
  if (!isTestMode || projectId !== demoProjectJourney.projectId) {
    throw new Error("Project applications and hand-ins are not connected outside TEST MODE.");
  }
  return { recorded: false };
}

/** Word count for the mentor note and reflection limits. */
export function wordCount(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}
