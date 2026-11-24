"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Mentor } from "@/lib/company";
import { removeMentor } from "@/lib/company-actions";

/** The company's mentors; removing one asks first. */
export function MentorsTable({ mentors }: { mentors: (Mentor & { joined: string })[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const remove = (m: Mentor) =>
    start(async () => {
      const result = await removeMentor(m.id, m.fullName);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
      router.refresh();
    });

  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mentor</TableHead>
            <TableHead>Job title</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentors.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                <div className="font-medium">{m.fullName}</div>
                <div className="text-muted-foreground">{m.email}</div>
              </TableCell>
              <TableCell>{m.jobTitle || "—"}</TableCell>
              <TableCell className="text-muted-foreground">{m.joined} ago</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger render={<Button size="sm" variant="ghost" disabled={pending} />}>Remove</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Remove {m.fullName}?</DialogTitle>
                      <DialogDescription>They won&rsquo;t be linked to your company any more, or mentor its micro-projects.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                      <DialogClose render={<Button variant="destructive" onClick={() => remove(m)} />}>Remove</DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
          {mentors.length ? null : (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                No mentors yet. Share your join code with them.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
