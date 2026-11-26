import { demoProjects, type Project } from "./demo/projects";
import { isTestMode } from "./testMode";

/** Returns sample projects in TEST MODE; live project queries will be added after schema review. */
export function getProjects(): Project[] | null {
  return isTestMode ? demoProjects : null;
}

/** One project for its detail route, or null when it isn't available. */
export function getProject(projectId: string): Project | null {
  return getProjects()?.find((project) => project.id === projectId) ?? null;
}

/** The demo Apply action is explicit: it never records an application or claims that it did. */
export function applyToProject(projectId: string): { submitted: false } {
  if (!isTestMode) {
    throw new Error("Project applications are not connected outside TEST MODE.");
  }

  const project = getProject(projectId);
  if (!project) throw new Error("This project is no longer available.");
  if (project.lockedBy) throw new Error(`${project.lockedBy} must be Practised before you can apply.`);

  return { submitted: false };
}
