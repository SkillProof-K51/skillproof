import type { RoadmapSkill, TargetRole } from "../auth";

// Demo target roles (TEST MODE): the same ids and roadmaps as supabase/seed.sql.
const skill = (id: string, name: string): RoadmapSkill => ({ id, name });
const HTML_CSS = skill("html_css", "HTML and CSS");
const JAVASCRIPT = skill("javascript", "JavaScript");
const TYPESCRIPT = skill("typescript", "TypeScript");
const REACT = skill("react", "React");
const NODEJS = skill("nodejs", "Node.js");
const GIT = skill("git", "Git");
const SQL = skill("sql", "SQL");
const PYTHON = skill("python", "Python");
const DATA_VIS = skill("data_vis", "Data visualisation");
const TESTING = skill("testing", "Testing");

export const demoRoles: TargetRole[] = [
  // Web Developer's roadmap is the one Home and the passport show
  { id: "web", label: "Web Developer", description: "Front end, back end, or both", roadmap: [HTML_CSS, JAVASCRIPT, GIT, REACT, TYPESCRIPT, NODEJS] },
  { id: "data", label: "Data Analyst", description: "Queries, numbers and charts", roadmap: [SQL, PYTHON, DATA_VIS, GIT] },
  { id: "mobile", label: "Mobile Developer", description: "Apps for phones", roadmap: [JAVASCRIPT, TYPESCRIPT, REACT, GIT, TESTING] },
  { id: "qa", label: "QA Engineer", description: "Testing that software works", roadmap: [TESTING, JAVASCRIPT, SQL, GIT] },
];
