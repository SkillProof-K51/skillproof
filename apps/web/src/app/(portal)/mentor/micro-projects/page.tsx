import type { Metadata } from "next";

import { MicroProjectsTable } from "@/components/micro-projects/MicroProjectsTable";
import { PageHeader } from "@/components/portal/PageHeader";
import { requireAccount } from "@/lib/account";
import { getMentorMicroProjects } from "@/lib/micro-projects";

export const metadata: Metadata = { title: "Micro-projects · SkillProof Portal" };

/** A mentor's projects and application counts. Ratings and verification are a later workflow. */
export default async function MentorMicroProjectsPage() {
  const account = await requireAccount(["mentor"]);
  const projects = await getMentorMicroProjects(account.id);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Micro-projects"
        description="Manage your short projects and keep track of student applications. A rating of 3 out of 5 or more verifies the skill."
      />
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Your projects · {projects.length}</h2>
        <MicroProjectsTable projects={projects} />
      </section>
    </div>
  );
}
