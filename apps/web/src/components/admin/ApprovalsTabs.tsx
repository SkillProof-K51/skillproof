"use client";

import { FileTextIcon } from "@phosphor-icons/react";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PendingAccount } from "@/lib/approvals";

import { DecisionButtons } from "./DecisionButtons";

export type PendingRow = PendingAccount & { waited: string };

/** Companies and coordinators waiting, each in its own tab. */
export function ApprovalsTabs({ rows }: { rows: PendingRow[] }) {
  const companies = rows.filter((r) => r.kind === "company");
  const coordinators = rows.filter((r) => r.kind === "coordinator");
  return (
    <Tabs defaultValue={companies.length || !coordinators.length ? "companies" : "coordinators"}>
      <TabsList>
        <TabsTrigger value="companies">
          Companies <span className="text-muted-foreground">{companies.length}</span>
        </TabsTrigger>
        <TabsTrigger value="coordinators">
          Coordinators <span className="text-muted-foreground">{coordinators.length}</span>
        </TabsTrigger>
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
              {companies.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-muted-foreground">
                      {r.contactName} · {r.email}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{r.ssmNo}</TableCell>
                  <TableCell>
                    {r.documentPath ? (
                      <a
                        href={`/admin/approvals/document?path=${encodeURIComponent(r.documentPath)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <FileTextIcon className="size-4" />
                        {r.documentPath.split("/").pop()}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">Not uploaded yet</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.waited}</TableCell>
                  <TableCell>
                    <DecisionButtons id={r.id} name={r.name} />
                  </TableCell>
                </TableRow>
              ))}
              {companies.length ? null : <EmptyRow columns={5} text="No companies are waiting." />}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>
      <TabsContent value="coordinators">
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coordinator</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Waiting</TableHead>
                <TableHead className="text-right">Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coordinators.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-muted-foreground">{r.email}</div>
                  </TableCell>
                  <TableCell>{r.faculty || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.waited}</TableCell>
                  <TableCell>
                    <DecisionButtons id={r.id} name={r.name} />
                  </TableCell>
                </TableRow>
              ))}
              {coordinators.length ? null : <EmptyRow columns={4} text="No coordinators are waiting." />}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function EmptyRow({ columns, text }: { columns: number; text: string }) {
  return (
    <TableRow>
      <TableCell colSpan={columns} className="py-8 text-center text-muted-foreground">
        {text}
      </TableCell>
    </TableRow>
  );
}
