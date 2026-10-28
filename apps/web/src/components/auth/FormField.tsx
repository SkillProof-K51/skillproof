import type { ComponentProps, ReactNode } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/auth-rules";

type Props = Omit<ComponentProps<typeof Input>, "name" | "defaultValue"> & {
  name: string;
  label: string;
  /** A hint under the field, shown until there's an error. */
  description?: string;
  /** Something on the label's line, e.g. "Forgot password?". */
  aside?: ReactNode;
  state: FormState;
};

/** A labelled input wired to a form's state: its error underneath, what was typed kept. */
export function FormField({ name, label, description, aside, state, ...input }: Props) {
  const error = state.errors?.[name];
  const id = `field-${name}`;
  return (
    <Field data-invalid={error ? true : undefined}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {aside}
      </div>
      <Input id={id} name={name} defaultValue={state.values?.[name]} aria-invalid={error ? true : undefined} {...input} />
      {error ? <FieldError>{error}</FieldError> : description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  );
}
