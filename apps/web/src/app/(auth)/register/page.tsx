import { BuildingsIcon, CaretRightIcon, ChalkboardTeacherIcon, GraduationCapIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = { title: "Create an account · SkillProof Portal" };

const KINDS = [
  { href: "/register/company", icon: BuildingsIcon, title: "A company", body: "Post micro-projects and check students' skills. An admin approves you first." },
  { href: "/register/mentor", icon: ChalkboardTeacherIcon, title: "A mentor", body: "Rate students' work for your company. You need your company's join code." },
  { href: "/register/coordinator", icon: GraduationCapIcon, title: "A university coordinator", body: "Map courses to skills and read the reports. An admin approves you first." },
] as const;

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an account"
      description="Who are you registering as?"
      footer={
        <>
          <span>
            Already registered?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </span>
          <span>Students sign up on the SkillProof app.</span>
        </>
      }
    >
      <ul className="flex flex-col gap-2">
        {KINDS.map(({ href, icon: Icon, title, body }) => (
          <li key={href}>
            <Link href={href} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted">
              <Icon className="size-5 shrink-0 text-muted-foreground" />
              <span className="flex flex-col">
                <span className="text-sm font-medium">{title}</span>
                <span className="text-sm text-muted-foreground">{body}</span>
              </span>
              <CaretRightIcon className="ml-auto size-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </AuthCard>
  );
}
