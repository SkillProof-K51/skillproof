import type { SkillStatus } from "../../components/ui/StatusBadge";
import type { MicroProject } from "../home";
import { demoHome } from "./home";

const DETAILS: Record<string, { partner: string; summary: string; description: string; skillIds: string[]; duration: string; mentor: string; deliverables: string[]; rubric: string[] }> = {
  cafe: {
    partner: "Contoh Tech Sdn Bhd",
    summary: "Build a welcoming landing page for a neighbourhood café.",
    description: "Create a responsive page that introduces the café, highlights its menu, and helps visitors find opening hours and contact details.",
    skillIds: ["html_css", "react"],
    duration: "About 2 weeks",
    mentor: "Kamal Ariff",
    deliverables: ["A live link or a GitHub repo", "A reflection: what you built and what you changed about 150 words"],
    rubric: ["Works on a phone and a laptop", "Clean, readable components", "The booking form checks its fields", "Close to the café's brief", "Reflection shows what you learned"],
  },
  clinic: {
    partner: "Sample Health Team",
    summary: "Design a clear appointment request form for a small clinic.",
    description: "Build a simple booking flow with helpful validation and a confirmation state. Focus on making the next step clear to patients.",
    skillIds: ["html_css", "javascript"],
    duration: "About 2 weeks", mentor: "Siti Aminah", deliverables: ["A live link or a GitHub repo", "A short reflection"], rubric: ["Clear labels", "Helpful validation", "Accessible controls"],
  },
  portfolio: {
    partner: "Sample Creative Lab",
    summary: "Create a portfolio page that presents work and contact details.",
    description: "Arrange a short introduction, selected work, and contact information into an accessible, responsive portfolio page.",
    skillIds: ["html_css", "javascript"],
    duration: "About 2 weeks", mentor: "Siti Aminah", deliverables: ["A live link or a GitHub repo", "A short reflection"], rubric: ["Responsive layout", "Readable content", "Working links"],
  },
  bookstore: {
    partner: "Sample Books Co.",
    summary: "Create a small catalogue API for a neighbourhood bookshop.",
    description: "Design a few endpoints for listing books and searching by title. Add clear responses for successful and empty searches.",
    skillIds: ["nodejs", "javascript"],
    duration: "About 2 weeks", mentor: "Kamal Ariff", deliverables: ["A repository link", "A short reflection"], rubric: ["Useful endpoints", "Clear responses", "Readable code"],
  },
  sales: {
    partner: "Sample Data Team",
    summary: "Turn a small sales dataset into a useful dashboard.",
    description: "Summarise sales by category and month, then present the results in a compact dashboard with readable labels.",
    skillIds: ["sql", "data_vis"],
    duration: "About 2 weeks", mentor: "Siti Aminah", deliverables: ["A live dashboard or repository", "A short reflection"], rubric: ["Correct summary", "Clear labels", "Useful visualisation"],
  },
};

const skillNames: Record<string, string> = {
  html_css: "HTML and CSS",
  javascript: "JavaScript",
  react: "React",
  nodejs: "Node.js",
  sql: "SQL",
  data_vis: "Data visualisation",
};

const readinessBySkill = new Map(demoHome.readiness.skills.map((skill) => [skill.name, skill.status]));
// Static TEST MODE examples until Module 2 supplies its shared project-fit result for locked items.
const FIT_FOR_LOCKED_DEMOS: Record<string, number> = { bookstore: 48, sales: 36 };

export type ProjectSkill = { id: string; name: string; status: SkillStatus };
export type Project = Omit<MicroProject, "fitPercent"> & {
  fitPercent: number;
  partner: string;
  summary: string;
  description: string;
  duration: string;
  mentor: string;
  deliverables: string[];
  rubric: string[];
  requiredSkills: ProjectSkill[];
};

export const demoProjects: Project[] = demoHome.microProjects.map((project) => {
  const detail = DETAILS[project.id];
  const requiredSkills = detail.skillIds.map((id) => {
    const name = skillNames[id];
    const status = readinessBySkill.get(name) ?? "not_yet";
    return { id, name, status };
  });
  const lockedBy = requiredSkills.find((skill) => skill.status === "not_yet")?.name;
  const fitPercent = project.fitPercent ?? FIT_FOR_LOCKED_DEMOS[project.id];
  if (fitPercent === undefined) throw new Error(`Missing TEST MODE fit example for ${project.id}.`);

  return {
    ...project,
    fitPercent,
    lockedBy,
    partner: detail.partner,
    summary: detail.summary,
    description: detail.description,
    duration: detail.duration,
    mentor: detail.mentor,
    deliverables: detail.deliverables,
    rubric: detail.rubric,
    requiredSkills,
  };
});
