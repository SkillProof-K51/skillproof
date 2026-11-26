import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MicroProject } from "@/lib/micro-projects";

const statusLabels = { draft: "Draft", open: "Open", closed: "Closed" } as const;

export function MicroProjectsTable({
  projects,
  mentors,
  showMentor = false,
}: {
  projects: MicroProject[];
  mentors?: { id: string; fullName: string }[];
  showMentor?: boolean;
}) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No micro-projects yet. Projects will appear here when a mentor creates one.
        </CardContent>
      </Card>
    );
  }

  const mentorNames = new Map(mentors?.map((mentor) => [mentor.id, mentor.fullName]));
  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            {showMentor ? <TableHead>Mentor</TableHead> : null}
            <TableHead>Skills</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Applications</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="min-w-56 whitespace-normal">
                <p className="font-medium">{project.title}</p>
                <p className="mt-1 text-muted-foreground">{project.summary}</p>
              </TableCell>
              {showMentor ? <TableCell>{mentorNames.get(project.ownerId) ?? "Mentor"}</TableCell> : null}
              <TableCell className="min-w-40 whitespace-normal">{project.requiredSkills.join(", ") || "Skills to be confirmed"}</TableCell>
              <TableCell><Badge variant={project.status === "open" ? "success" : "outline"}>{statusLabels[project.status]}</Badge></TableCell>
              <TableCell className="text-right">{project.applicationCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
