import { getPassportData, passportBadges } from "./passport";
import { getTargetRoles } from "./auth";
import { isTestMode } from "./testMode";
import { readiness, isReady, type SkillProgress } from "./fitEngine";

export type StudentAim = "internship" | "first_job" | "freelance";
export type ProfileData = {
  student: {
    name: string;
    programme: string;
    year: number | null;
    aim: StudentAim | null;
  };
  targetRole: string;
  readiness: number;
  ready: boolean;
  skills: {
    skill: string;
    status: "verified" | "practised" | "not_yet";
  }[];
};

/** Profile data for the Profile tab. Demo data is only shown in TEST MODE. */
export function getProfileData(): ProfileData | null {
  if (!isTestMode) return null;

  const passport = getPassportData();
  if (!passport) return null;

  const roles = getTargetRoles();
  const role = roles.find((item) => item.id === "web");

  if (!role) return null;

  const badges = passportBadges(passport);

  const skills: SkillProgress[] = badges.map((item) => ({
    id: item.skill
      .toLowerCase()
      .replaceAll(" ", "_")
      .replace("html_and_css", "html_css")
      .replace("node.js", "nodejs"),
    status: item.status,
  }));

  const weights: Record<string, number> = {
    html_css: 20,
    javascript: 25,
    git: 10,
    react: 20,
    typescript: 15,
    nodejs: 10,
  };

  const percent = readiness(skills, weights);

  return {
    student: {
      name: passport.student.name,
      programme: "Software Development",
      year: 2,
      aim: "internship",
    },
    targetRole: role.label,
    readiness: percent,
    ready: isReady(percent),
    skills: badges.map((item) => ({
      skill: item.skill,
      status: item.status,
    })),
  };
}

/** Updates the authenticated student's career aim. */
export async function updateStudentAim(aim: StudentAim): Promise<void> {
  // Demo data is not saved to Supabase.
  if (isTestMode) return;

  const { supabase } = await import("./supabase");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("You must be logged in to update your career aim.");
  }

  const { data, error } = await supabase
    .from("student_profiles")
    .update({ aim })
    .eq("id", user.id)
    .select("id");

  if (error) throw error;

  if (!data?.length) {
    throw new Error("Your student profile could not be updated.");
  }
}
