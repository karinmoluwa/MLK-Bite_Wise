"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "@/services/auth/firebase";
import { useAuth } from "./AuthProvider";

type Mode = "login" | "signup" | "reset";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (!email.includes("@")) return setMessage("Please enter a valid email address.");
    if (mode !== "reset" && password.length < 8) return setMessage("Password must contain at least eight characters.");
    setBusy(true);
    try {
      if (!firebaseAuth) throw new Error("Firebase is not configured yet. Add your Netlify environment variables.");
      if (mode === "login") {
        await signIn(email, password);
        router.push("/dashboard");
      } else if (mode === "signup") {
        const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        await sendEmailVerification(credential.user);
        setMessage("Account created. Check your email to verify your address.");
      } else {
        await sendPasswordResetEmail(firebaseAuth, email);
        setMessage("Password reset instructions have been sent.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="auth-form surface-panel" onSubmit={submit} noValidate>
    <h1>{mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}</h1>
    <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
    {mode !== "reset" && <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} required /></label>}
    <button className="button primary" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}</button>
    {message && <p role="status" className="form-message">{message}</p>}
  </form>;
}
