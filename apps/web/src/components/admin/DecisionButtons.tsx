"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { decideAccount } from "@/lib/approval-actions";

/** Approve straight away; Reject asks first (it closes the account until an admin opens it again). */
export function DecisionButtons({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const decide = (decision: "active" | "rejected") =>
    start(async () => {
      const result = await decideAccount(id, name, decision);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
      router.refresh();
    });

  return (
    <div className="flex justify-end gap-1">
      <Dialog>
        <DialogTrigger render={<Button size="sm" variant="ghost" disabled={pending} />}>Reject</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {name}?</DialogTitle>
            <DialogDescription>They can&rsquo;t use the portal until an admin approves them. They can contact you to try again.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <DialogClose render={<Button variant="destructive" onClick={() => decide("rejected")} />}>Reject</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button size="sm" disabled={pending} onClick={() => decide("active")}>
        Approve
      </Button>
    </div>
  );
}
