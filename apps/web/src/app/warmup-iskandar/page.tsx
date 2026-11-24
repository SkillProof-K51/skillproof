"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function WarmupIskandarPage() {
  const [message, setMessage] = useState("");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-semibold">Module 1 · Industry Standards</h1>
      <p>Explore the skills and standards employers look for.</p>
      <Button onClick={() => setMessage("Thanks for exploring Module 1!")}>Show message</Button>
      {message && <p role="status">{message}</p>}
    </main>
  );
}
