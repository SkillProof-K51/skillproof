import type { HomeData } from "../home";

// Fictional persona (AGENTS.md rule 12): Aina Sofea, BITS student on the Web Developer path.
// Numbers are illustrative — the real ones come from the Module 2 fit engine and Modules 3–5.
export const demoHome: HomeData = {
  student: { firstName: "Aina", initials: "AS", pathLabel: "Web Developer path" },
  bubble: "Ready for today’s challenge, Aina?",
  readiness: {
    percent: 72,
    roleLabel: "Readiness for Web Developer",
    headline: "Job-ready · 2 skills to 100%",
    focusSkills: ["Node.js", "Testing"],
  },
  todaysChallenge: {
    title: "Fix the bug in this Node.js function",
    skill: "Node.js",
    passed: 2,
    of: 3,
    minutes: 3,
  },
  microProjects: [
    { id: "cafe", title: "Café landing page (sample)", skillsLabel: "Skills: HTML and CSS · React", fitPercent: 86, placesLeft: 2 },
    { id: "bookstore", title: "Bookstore REST API (sample)", skillsLabel: "Skills: Node.js · Testing", fitPercent: 81, placesLeft: 1 },
    { id: "clinic", title: "Clinic booking form (sample)", skillsLabel: "Skills: HTML and CSS · JavaScript", fitPercent: 74, placesLeft: 3 },
    { id: "sales", title: "Sales dashboard (sample)", skillsLabel: "Skills: SQL · Data visualisation", lockedBy: "SQL" },
  ],
  passport: { verified: 3, practised: 2 },
};
