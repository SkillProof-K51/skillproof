import type { TargetRole } from "../auth";

// Demo target roles (TEST MODE). The real list is Module 1's roles table.
export const demoRoles: TargetRole[] = [
  // Web Developer's roadmap is the one Home and the passport show
  { id: "web", label: "Web Developer", description: "Front end, back end, or both", roadmap: ["HTML and CSS", "JavaScript", "Git", "React", "TypeScript", "Node.js"] },
  { id: "data", label: "Data Analyst", description: "Queries, numbers and charts", roadmap: ["SQL", "Python", "Data visualisation", "Git"] },
  { id: "mobile", label: "Mobile Developer", description: "Apps for phones", roadmap: ["JavaScript", "TypeScript", "React", "Git", "Testing"] },
  { id: "qa", label: "QA Engineer", description: "Testing that software works", roadmap: ["Testing", "JavaScript", "SQL", "Git"] },
];
