"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <main className="standalone-page"><p>Loading your secure workspace…</p></main>;
  if (!user && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return <main className="standalone-page"><section className="surface-panel"><h1>Sign in required</h1><p>Please sign in to access this page.</p><Link className="button primary" href="/login">Go to login</Link></section></main>;
  }
  return <>{children}</>;
}
