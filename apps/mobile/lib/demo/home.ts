import type { HomeData } from "../home";
import { demoToday } from "./challenges";

// Fictional persona (AGENTS.md rule 12): Aina Sofea, BITS student on the Web Developer path.
// Numbers are illustrative — the real ones come from the Module 2 fit engine and Modules 3–5.
export const demoHome: HomeData = {
  student: { firstName: "Aina", initials: "AS", pathLabel: "Web Developer path" },
  bubble: "Ready for today’s challenge, Aina?",
  readiness: {
    percent: 72,
    readyAt: 70,
    // the same statuses as the passport demo: 3 Verified, 2 Practised, Node.js still to practise;
    // weights as in supabase/seed.sql (20 + 25 + 10 in full, 20 + 15 at half = 72.5 → 72 %)
    skills: [
      { name: "HTML and CSS", status: "verified", weight: 20 },
      { name: "JavaScript", status: "verified", weight: 25 },
      { name: "Git", status: "verified", weight: 10 },
      { name: "React", status: "practised", weight: 20 },
      { name: "TypeScript", status: "practised", weight: 15 },
      { name: "Node.js", status: "not_yet", weight: 10 },
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
