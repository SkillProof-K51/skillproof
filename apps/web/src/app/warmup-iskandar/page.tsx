"use client";

import { useState } from "react";

export default function WarmupIskandarPage() {
  const [message, setMessage] = useState("");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-semibold">Module 1 · Industry Standards</h1>
      <p>Explore the skills and standards employers look for.</p>
      <button
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        onClick={() => setMessage("Thanks for exploring Module 1!")}
        type="button"
      >
        Show message
      </button>
      {message && <p role="status">{message}</p>}
    </main>
  );
}
