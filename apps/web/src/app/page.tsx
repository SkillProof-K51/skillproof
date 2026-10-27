import Link from "next/link";

import { Button } from "@/components/ui/button";

// Temporary home: the portal shell replaces it (sign-in → each role's page).
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">SkillProof Portal</h1>
      <p className="text-sm text-muted-foreground">For companies, mentors, university coordinators and admins.</p>
      <Button render={<Link href="/kit" />}>See the portal kit</Button>
    </main>
  );
}
