import type { TargetRole } from "../auth";

// Demo target roles (TEST MODE). The real list is Module 1's roles table.
export const demoRoles: TargetRole[] = [
  { id: "web", label: "Web Developer", description: "Front end, back end, or both" },
  { id: "data", label: "Data Analyst" },
  { id: "mobile", label: "Mobile Developer" },
  { id: "qa", label: "QA Engineer" },
];
