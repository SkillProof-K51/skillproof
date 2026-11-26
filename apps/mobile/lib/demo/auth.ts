import type { RoadmapSkill, TargetRole } from "../auth";

// Demo target roles (TEST MODE): the same ids and roadmaps as supabase/seed.sql.
const skill = (id: string, name: string): RoadmapSkill => ({ id, name });
const HTML_CSS = skill("html_css", "HTML and CSS");
const JAVASCRIPT = skill("javascript", "JavaScript");
const REACT = skill("react", "React");
const GIT = skill("git", "Git");
const SQL = skill("sql", "SQL");
const PYTHON = skill("python", "Python");
const DATA_VIS = skill("data_vis", "Data visualisation");
const TESTING = skill("testing", "Testing");
const PHP = skill("php", "PHP");
const REST_API = skill("rest_api", "REST APIs");
const REACT_NATIVE = skill("react_native", "React Native");
const EXCEL = skill("excel", "Excel");
const TEST_AUTOMATION = skill("test_automation", "Test automation");

export const demoRoles: TargetRole[] = [
  // Web Developer's roadmap is the one Home and the passport show
  { id: "web", label: "Web Developer", description: "Front end, back end, or both", roadmap: [HTML_CSS, JAVASCRIPT, SQL, PHP, REST_API, REACT] },
  { id: "data", label: "Data Analyst", description: "Queries, numbers and charts", roadmap: [EXCEL, SQL, DATA_VIS, PYTHON] },
  { id: "mobile", label: "Mobile Developer", description: "Apps for phones", roadmap: [GIT, REACT_NATIVE, REST_API, TESTING] },
  { id: "qa", label: "QA Engineer", description: "Testing that software works", roadmap: [TESTING, SQL, JAVASCRIPT, TEST_AUTOMATION, REST_API] },
];
