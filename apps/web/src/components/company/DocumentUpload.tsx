"use client";

import { FileArrowUpIcon, FileTextIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { recordDocument } from "@/lib/company-actions";
import { createClient } from "@/lib/supabase/client";
import { isTestMode } from "@/lib/testMode";

const MAX_BYTES = 5 * 1024 * 1024; // the bucket's own limit
const TYPES = ["application/pdf", "image/jpeg", "image/png"];

/** Upload (or replace) the SSM document: straight into the company's own folder in the private bucket. */
export function DocumentUpload({ current }: { current?: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();

  const upload = (file: File) =>
    start(async () => {
      if (!TYPES.includes(file.type)) return void toast.error("Choose a PDF, JPG or PNG.");
      if (file.size > MAX_BYTES) return void toast.error("That file is over 5 MB. Choose a smaller scan.");
      if (isTestMode) return void toast("Test mode: nothing was uploaded.");
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return void toast.error("Sign in again, then upload.");
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const path = `${auth.user.id}/${Date.now()}-${safe}`;
      const { error } = await supabase.storage.from("company-documents").upload(path, file, { contentType: file.type });
      if (error) return void toast.error("Couldn’t upload that file. Try again.");
      const result = await recordDocument(path);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
      router.refresh();
    });

  return (
    <div className="flex flex-col gap-3">
      {current ? (
        <p className="flex items-center gap-2 text-sm">
          <FileTextIcon className="size-4 text-muted-foreground" />
          {current.split("/").pop()}
        </p>
      ) : null}
      <input
        ref={input}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      <Button variant={current ? "outline" : "default"} disabled={pending} onClick={() => input.current?.click()}>
        <FileArrowUpIcon data-icon="inline-start" />
        {pending ? "Uploading…" : current ? "Replace the document" : "Upload your SSM document"}
      </Button>
      <p className="text-xs text-muted-foreground">A PDF, JPG or PNG up to 5 MB. Only you and the admins can see it.</p>
    </div>
  );
}
