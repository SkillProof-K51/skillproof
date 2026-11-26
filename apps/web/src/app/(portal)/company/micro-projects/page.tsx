import type { Metadata } from "next";

import { MicroProjectsTable } from "@/components/micro-projects/MicroProjectsTable";
import { PageHeader } from "@/components/portal/PageHeader";
import { requireAccount } from "@/lib/account";
import { getMentors, getMyCompany } from "@/lib/company";
import { getCompanyMicroProjects } from "@/lib/micro-projects";

export const metadata: Metadata = { title: "Micro-projects · SkillProof Portal" };

/** Company view of projects prepared by its mentors. Project editing belongs to the mentor. */
export default async function CompanyMicroProjectsPage() {
  const account = await requireAccount(["company"]);
  const company = await getMyCompany(account.id);
  if (!company) throw new Error("Your company's details are missing. Contact the admin.");
  const mentors = await getMentors(company.id);
  const projects = await getCompanyMicroProjects(mentors.map((mentor) => mentor.id));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Micro-projects"
        description="See the short projects your mentors prepare for students and track applications. Mentors manage project details and student work."
      />
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Projects · {projects.length}</h2>
        <MicroProjectsTable projects={projects} mentors={mentors} showMentor />
      </section>
    </div>
  );
}
