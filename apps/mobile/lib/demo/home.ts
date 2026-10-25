import type { HomeData } from "../home";
import { demoToday } from "./challenges";

// Fictional persona (AGENTS.md rule 12): Aina Sofea, BITS student on the Web Developer path.
// Numbers are illustrative — the real ones come from the Module 2 fit engine and Modules 3–5.
export const demoHome: HomeData = {
  student: { firstName: "Aina", initials: "AS", pathLabel: "Web Developer path" },
  bubble: "Ready for today’s challenge, Aina?",
  readiness: {
    percent: 72,
    // the same statuses as the passport demo: 3 Verified, 2 Practised, Node.js still to practise
    skills: [
      { name: "HTML and CSS", status: "verified" },
      { name: "JavaScript", status: "verified" },
      { name: "Git", status: "verified" },
      { name: "React", status: "practised" },
      { name: "TypeScript", status: "practised" },
      { name: "Node.js", status: "not_yet" },
    ],
  },
  todaysChallenge: demoToday,
  microProjects: [
    { id: "cafe", title: "Café landing page (sample)", skillsLabel: "Skills: HTML and CSS · React", fitPercent: 86, placesLeft: 2 },
    { id: "clinic", title: "Clinic booking form (sample)", skillsLabel: "Skills: HTML and CSS · JavaScript", fitPercent: 74, placesLeft: 3 },
    { id: "portfolio", title: "Portfolio site (sample)", skillsLabel: "Skills: HTML and CSS · JavaScript", fitPercent: 70, placesLeft: 2 },
    { id: "bookstore", title: "Bookstore REST API (sample)", skillsLabel: "Skills: Node.js · JavaScript", lockedBy: "Node.js" },
    { id: "sales", title: "Sales dashboard (sample)", skillsLabel: "Skills: SQL · Data visualisation", lockedBy: "SQL" },
  ],
  passport: { verified: 3, practised: 2, latestVerified: "HTML and CSS" },
};
