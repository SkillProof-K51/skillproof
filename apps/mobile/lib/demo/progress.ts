import { evidenceLabel } from "../passport";
import type { ProgressData } from "../progress";
import { demoChallenges } from "./challenges";
import { demoPassport } from "./passport";

// Aina's week (TEST MODE). The roadmap is the passport's, so Home, the passport and this screen
// agree: 3 Verified, 2 Practised, Node.js 2 of 3 on the way. Readiness ends at Home's 72%.
const onTheWay = (skill: string) => demoChallenges.inProgress.find((s) => s.skill === skill);

export const demoProgress: ProgressData = {
  week: "19–25 Oct",
  practice: { fix_bug: 5, sql_live: 4, explain_it: 3 },
  readiness: {
    role: "Web Developer",
    days: [
      { label: "S", percent: 64 },
      { label: "M", percent: 64 },
      { label: "T", percent: 66 },
      { label: "W", percent: 68 },
      { label: "T", percent: 68 },
      { label: "F", percent: 70 },
      { label: "S", percent: 72 },
    ],
    readyAt: 70, // the proposed "Ready" line (spec, Module 2), still to confirm
  },
  roadmap: demoPassport.roadmap.map((skill) => {
    const proven = demoPassport.skills.find((s) => s.skill === skill);
    if (proven) return { skill, status: proven.status, detail: evidenceLabel(proven.evidence) };
    const p = onTheWay(skill);
    return { skill, status: "not_yet", detail: p ? `${p.passed} of ${p.of} challenges passed` : "Not started" };
  }),
};
