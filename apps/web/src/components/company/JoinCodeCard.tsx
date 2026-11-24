"use client";

import { ArrowsClockwiseIcon, CopyIcon } from "@phosphor-icons/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { newJoinCode } from "@/lib/company-actions";

/** The code mentors sign up with: copy it, or draw a new one (the old one stops working). */
export function JoinCodeCard({ code: initial }: { code: string }) {
  const [code, setCode] = useState(initial);
  const [pending, start] = useTransition();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied");
    } catch {
      toast.error("Couldn’t copy. Select the code and copy it yourself.");
    }
  };
  const renew = () =>
    start(async () => {
      const result = await newJoinCode();
      if (result.ok && result.code) setCode(result.code);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentor join code</CardTitle>
        <CardDescription>Your mentors sign up on the portal with this code, and are linked to you at once.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border bg-muted px-3 py-1.5 font-mono text-lg tracking-wider">{code}</span>
        <Button variant="outline" onClick={copy}>
          <CopyIcon data-icon="inline-start" />
          Copy
        </Button>
        <Dialog>
          <DialogTrigger render={<Button variant="ghost" disabled={pending} />}>
            <ArrowsClockwiseIcon data-icon="inline-start" />
            New code
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Make a new join code?</DialogTitle>
              <DialogDescription>
                The old code stops working. Mentors who already joined stay linked; anyone still to join needs the new code.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
              <DialogClose render={<Button onClick={renew} />}>Make a new code</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
