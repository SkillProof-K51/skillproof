"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signIn } from "@/lib/auth-actions";
import type { FormState } from "@/lib/auth-rules";

import { FormField } from "./FormField";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";

/** Sign in: email and password; a notice (e.g. an expired link) shows until the first try. */
export function SignInForm({ notice }: { notice?: string }) {
  const initial: FormState = notice ? { message: notice, tone: "error" } : {};
  const [state, action] = useActionState(signIn, initial);
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormMessage state={state} />
      <FormField name="email" label="Email" type="email" autoComplete="email" state={state} />
      <FormField
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        state={state}
        aside={
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        }
      />
      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}
