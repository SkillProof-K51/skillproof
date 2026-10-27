import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/** The card every sign-in and registration page sits in: a title, the form, the ways elsewhere. */
export function AuthCard({ title, description, footer, children }: { title: string; description?: string; footer?: ReactNode; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer ? <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">{footer}</CardFooter> : null}
    </Card>
  );
}
