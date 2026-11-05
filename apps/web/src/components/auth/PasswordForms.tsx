"use client";

import { useActionState } from "react";

import { requestPasswordReset, updatePassword } from "@/lib/auth-actions";
import { MIN_PASSWORD, type FormState } from "@/lib/auth-rules";

import { FormField } from "./FormField";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";

/** Forgot password: the email to send the link to. */
export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, {} as FormState);
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormMessage state={state} />
      <FormField name="email" label="Email" type="email" autoComplete="email" state={state} />
      <SubmitButton>Send the link</SubmitButton>
    </form>
  );
}

/** Choose a new password (the reset link has signed you in). */
export function ResetPasswordForm() {
  const [state, action] = useActionState(updatePassword, {} as FormState);
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormMessage state={state} />
      <FormField
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        description={`At least ${MIN_PASSWORD} characters.`}
        state={state}
      />
      <FormField name="confirm" label="The same password again" type="password" autoComplete="new-password" state={state} />
      <SubmitButton>Save the new password</SubmitButton>
    </form>
  );
}
