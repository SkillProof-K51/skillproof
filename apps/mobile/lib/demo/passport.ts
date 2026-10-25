import type { PassportData } from "../passport";

// Fictional persona (AGENTS.md rule 12): Aina Sofea. Same counts as Home's passport card
// (3 Verified, 2 Practised, HTML and CSS most recent). Projects are past ones, not Home's open list.
// The link uses the reserved .test domain, so it can never point at a real site.
export const demoPassport: PassportData = {
  student: { name: "Aina Sofea", pathLabel: "Web Developer path" },
  skills: [
    { skill: "HTML and CSS", status: "verified", evidence: { kind: "project", project: "Recipe card layout (sample)", rating: 4, outOf: 5 }, shown: true },
    { skill: "JavaScript", status: "verified", evidence: { kind: "project", project: "Event RSVP form (sample)", rating: 5, outOf: 5 }, shown: true },
    { skill: "Git", status: "verified", evidence: { kind: "project", project: "Team repo workflow (sample)", rating: 4, outOf: 5 }, shown: true },
    { skill: "React", status: "practised", evidence: { kind: "challenges", passed: 3, best: 92 }, shown: true },
    { skill: "TypeScript", status: "practised", evidence: { kind: "challenges", passed: 3, best: 85 }, shown: false },
  ],
  // Home's roadmap, in the same order: Node.js is the one still locked
  roadmap: ["HTML and CSS", "JavaScript", "Git", "React", "TypeScript", "Node.js"],
  share: { isPublic: true, link: "skillproof.test/p/aina-sofea" },
};
