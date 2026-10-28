"use client";

import { useActionState } from "react";

import { register } from "@/lib/auth-actions";
import { MIN_PASSWORD, type FormState, type RegisterKind } from "@/lib/auth-rules";

import { FormField } from "./FormField";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";

/** Registration for a company, a mentor (with the company's join code) or a coordinator. */
export function RegisterForm({ kind }: { kind: RegisterKind }) {
  const [state, action] = useActionState(register, {} as FormState);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="kind" value={kind} />
      <FormMessage state={state} />
      {kind === "company" ? (
        <>
          <FormField name="company_name" label="Company name" description="As on your SSM certificate." state={state} />
          <FormField name="ssm_no" label="SSM registration no." placeholder="202401012345" state={state} />
          <FormField name="website" label="Website (optional)" placeholder="contoh.com.my" state={state} />
        </>
      ) : null}
      {kind === "mentor" ? (
        <>
          <FormField
            name="join_code"
            label="Your company's join code"
            placeholder="XXXX-XXXX"
            description="Your company finds it on its SkillProof page."
            autoCapitalize="characters"
            state={state}
          />
          <FormField name="job_title" label="Job title (optional)" placeholder="Senior developer" state={state} />
        </>
      ) : null}
      <FormField
        name="full_name"
        label={kind === "company" ? "Your name (the contact person)" : "Full name"}
        autoComplete="name"
        state={state}
      />
      {kind === "coordinator" ? <FormField name="faculty" label="Faculty" placeholder="Faculty of ICT" state={state} /> : null}
      <FormField name="email" label="Email" type="email" autoComplete="email" state={state} />
      <FormField
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        description={`At least ${MIN_PASSWORD} characters.`}
        state={state}
      />
      <SubmitButton>Create account</SubmitButton>
    </form>
  );
}
