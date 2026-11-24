export type SkillStatus = "verified" | "practised" | "not_yet";

export type SkillProgress = {
  id: string;
  status: SkillStatus;
};

/**
 * Calculates weighted Readiness (0–100).
 * Weights come from job_role_skills.weight.
 */
export function readiness(
  skills: SkillProgress[],
  weights: Record<string, number>,
): number {
  let earnedWeight = 0;
  let totalWeight = 0;

  for (const skill of skills) {
    const weight = weights[skill.id];

    if (typeof weight !== "number" || !Number.isFinite(weight) || weight <= 0) {
      continue;
    }

    totalWeight += weight;

    if (skill.status === "verified") {
      earnedWeight += weight;
    } else if (skill.status === "practised") {
      earnedWeight += weight * 0.5;
    }
  }

  if (totalWeight === 0) return 0;

  return Math.floor((earnedWeight / totalWeight) * 100);
}

/** A student is Ready at 70% or above. */
export function isReady(percent: number): boolean {
  return percent >= 70;
}

/*
 * Five worked examples:
 *
 * 1. All verified:
 *    readiness([{id:"html_css",status:"verified"}], {html_css:100})
 *    = 100
 *
 * 2. All practised:
 *    readiness([{id:"html_css",status:"practised"}], {html_css:100})
 *    = 50
 *
 * 3. Not yet:
 *    readiness([{id:"html_css",status:"not_yet"}], {html_css:100})
 *    = 0
 *
 * 4. Mixed:
 *    60 weight verified + 40 weight practised
 *    = (60 + 20) / 100 × 100 = 80
 *
 * 5. Aina Sofea — Web Developer:
 *    HTML/CSS verified (20), JavaScript verified (25),
 *    Git verified (10), React practised (20),
 *    TypeScript practised (15), Node.js not yet (10).
 *    = (20 + 25 + 10 + 10 + 7.5 + 0) / 100 × 100
 *    = 72 after flooring. Ready.
 */
