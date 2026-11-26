import "server-only";

import { demoMicroProjects } from "./demo/portal";
import { createClient } from "./supabase/server";
import { isTestMode } from "./testMode";

export type MicroProjectStatus = "draft" | "open" | "closed";
export type MicroProject = {
  id: string;
  ownerId: string;
  title: string;
  summary: string;
  requiredSkills: string[];
  status: MicroProjectStatus;
  applicationCount: number;
};

type ProjectRow = {
  id: string;
  owner_id: string;
  title: string;
  summary: string;
  required_skill_ids: string[];
  status: MicroProjectStatus;
};
type ApplicationRow = { project_id: string };

const skillLabels: Record<string, string> = {
  html_css: "HTML & CSS",
  javascript: "JavaScript",
  testing: "Testing",
  communication: "Communication",
  sql: "SQL",
  data_visualisation: "Data visualisation",
};

async function getProjects(ownerIds: string[]): Promise<MicroProject[]> {
  if (isTestMode) {
    return demoMicroProjects
      .filter((project) => ownerIds.includes(project.ownerId))
      .map(({ applications, ...project }) => ({ ...project, applicationCount: applications }));
  }
  if (ownerIds.length === 0) return [];

  const client = await createClient();
  const { data, error } = await client
    .from("micro_projects")
    .select("id, owner_id, title, summary, required_skill_ids, status")
    .in("owner_id", ownerIds)
    .order("created_at", { ascending: false })
    .overrideTypes<ProjectRow[], { merge: false }>();
  if (error) throw new Error("Couldn’t load micro-projects. Refresh to try again.");

  const ids = data.map((project) => project.id);
  const { data: applications, error: applicationsError } = ids.length
    ? await client.from("applications").select("project_id").in("project_id", ids).overrideTypes<ApplicationRow[], { merge: false }>()
    : { data: [] as ApplicationRow[], error: null };
  if (applicationsError) throw new Error("Couldn’t load application counts. Refresh to try again.");
  const counts = new Map<string, number>();
  for (const application of applications) counts.set(application.project_id, (counts.get(application.project_id) ?? 0) + 1);

  return data.map((project) => ({
    id: project.id,
    ownerId: project.owner_id,
    title: project.title,
    summary: project.summary,
    requiredSkills: project.required_skill_ids.map((id) => skillLabels[id] ?? id.replaceAll("_", " ")),
    status: project.status,
    applicationCount: counts.get(project.id) ?? 0,
  }));
}

/** Projects created by the company's mentors; the company can inspect, but not edit, them. */
export async function getCompanyMicroProjects(mentorIds: string[]): Promise<MicroProject[]> {
  return getProjects(mentorIds);
}

/** Projects owned by the signed-in mentor. */
export async function getMentorMicroProjects(mentorId: string): Promise<MicroProject[]> {
  return getProjects([mentorId]);
}
