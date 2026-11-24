import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import type { FormState } from "@/lib/auth-rules";

/** A form's one message on top: what went wrong, or what happens next. Nothing when there's none. */
export function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  const error = state.tone === "error";
  return (
    <Alert variant={error ? "destructive" : "default"} role={error ? "alert" : "status"}>
      {error ? <WarningCircleIcon /> : <CheckCircleIcon />}
      <AlertDescription>{state.message}</AlertDescription>
    </Alert>
  );
}
