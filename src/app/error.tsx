"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Bite Wise application error", error); }, [error]);
  return (
    <main className="error-state" role="alert">
      <h1>Something went wrong</h1>
      <p>Your information is safe. Please try loading this section again.</p>
      <button className="button button-primary" onClick={reset}>Try again</button>
    </main>
  );
}
