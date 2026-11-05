"use client";

import {
  CopyIcon,
  FileTextIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Fictional companies only (AGENTS.md rule 12).
const ROWS = [
  {
    name: "Contoh Tech Sdn Bhd",
    email: "hr@contohtech.example",
    ssm: "202401012345",
    waiting: "2 hours",
  },
  {
    name: "Awan Biru Solutions",
    email: "talent@awanbiru.example",
    ssm: "201901034567",
    waiting: "1 day",
  },
];
const PROGRAMMES = [
  { value: "software", label: "Software Development" },
  { value: "security", label: "Computer Security" },
];

/** The portal's kit, live (like the app's /kit): every component in the look, to copy from. */
export function KitShowcase() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Portal kit</h1>
        <p className="text-sm text-muted-foreground">
          shadcn/ui on our tokens (look A). Build pages from these; a new look
          is a change to the token or the component (docs/ui.md › The web
          portal).
        </p>
      </header>

      <Section title="Buttons">
        <Button>
          <PlusIcon data-icon="inline-start" />
          Approve
        </Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Reject</Button>
        <Button variant="destructive">Remove mentor</Button>
        <Button variant="link">A link</Button>
        <Button size="sm">Small</Button>
        <Button size="icon" variant="outline" aria-label="Copy">
          <CopyIcon />
        </Button>
      </Section>

      <Section title="Badges">
        <Badge variant="warning">Pending</Badge>
        <Badge variant="success">Approved</Badge>
        <Badge variant="destructive">Rejected</Badge>
        <Badge>4</Badge>
        <Badge variant="secondary">M1</Badge>
        <Badge variant="outline">Coordinator</Badge>
      </Section>

      <Section title="Form fields">
        <div className="grid w-full gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="kit-name">Company name</FieldLabel>
            <Input id="kit-name" placeholder="Contoh Tech Sdn Bhd" />
            <FieldDescription>As on your SSM certificate.</FieldDescription>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="kit-ssm">SSM registration no.</FieldLabel>
            <Input id="kit-ssm" defaultValue="12" aria-invalid />
            <FieldError>
              Enter the 12-digit number from your certificate.
            </FieldError>
          </Field>
          <Field>
            <FieldLabel>Programme</FieldLabel>
            <Select items={PROGRAMMES} defaultValue="software">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMMES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="kit-note">Note</FieldLabel>
            <Textarea id="kit-note" placeholder="Why it was rejected…" />
          </Field>
        </div>
      </Section>

      <Section title="Tabs and a table">
        <Tabs defaultValue="companies" className="w-full">
          <TabsList>
            <TabsTrigger value="companies">Companies 2</TabsTrigger>
            <TabsTrigger value="coordinators">Coordinators 0</TabsTrigger>
          </TabsList>
          <TabsContent value="companies">
            <Card className="py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>SSM registration no.</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Waiting</TableHead>
                    <TableHead className="text-right">Decision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROWS.map((r) => (
                    <TableRow key={r.ssm}>
                      <TableCell>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-muted-foreground">{r.email}</div>
                      </TableCell>
                      <TableCell className="font-mono">{r.ssm}</TableCell>
                      <TableCell>
                        <Button variant="link" className="px-0">
                          <FileTextIcon data-icon="inline-start" />
                          ssm.pdf
                        </Button>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.waiting}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          Reject
                        </Button>
                        <Button size="sm">Approve</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent
            value="coordinators"
            className="text-sm text-muted-foreground"
          >
            Nobody waiting.
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Cards, alerts and the rest">
        <div className="grid w-full gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mentor join code</CardTitle>
              <CardDescription>
                Share it with your mentors. They sign up with it.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <span className="font-mono text-lg">K7QF-M2XP</span>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Copy the code"
                onClick={() => toast.success("Code copied")}
              >
                <CopyIcon />
              </Button>
            </CardContent>
          </Card>
          <Alert>
            <InfoIcon />
            <AlertTitle>Waiting for approval</AlertTitle>
            <AlertDescription>
              An admin checks your SSM document. You can sign in, but nothing
              opens until then.
            </AlertDescription>
          </Alert>
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Open a dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Contoh Tech Sdn Bhd?</DialogTitle>
                <DialogDescription>
                  They can&rsquo;t sign in to anything until an admin approves
                  them again.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button variant="destructive">Reject</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => toast("Company approved")}>
            <MagnifyingGlassIcon data-icon="inline-start" />
            Show a toast
          </Button>
        </div>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}
