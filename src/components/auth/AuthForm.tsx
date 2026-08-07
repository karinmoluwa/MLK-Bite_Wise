"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut
} from "firebase/auth";
import { firebaseAuth } from "@/services/auth/firebase";
import { useAuth } from "./AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import {
  getFirebaseAuth,
  getFirebaseDatabase,
} from "@/services/auth/firebase";

type Mode = "login" | "signup" | "reset";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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

  const auth = getFirebaseAuth();
  const db = getFirebaseDatabase();
  const user = auth?.currentUser;

  if (!user || !db) {
    setMessage("We could not load your account. Please try again.");
    return;
  }

  const profileSnapshot = await getDoc(
    doc(db, "users", user.uid)
  );

  if (!profileSnapshot.exists()) {
    router.push("/onboarding");
    return;
  }

  const profile = profileSnapshot.data();

  if (
    profile.onboardingComplete === true ||
    profile.onboardingSkipped === true
  ) {
    router.push("/dashboard");
  } else {
    router.push("/onboarding");
  }

  return;
}
       else if (mode === "signup") {
        const credential = await createUserWithEmailAndPassword(
  firebaseAuth,
  email,
  password
);

await updateProfile(credential.user, {
  displayName: username.trim(),
});

await signOut(firebaseAuth);
router.push("/login");
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
    {mode === "signup" && (
  <label>
    Username
    <input
      type="text"
      value={username}
      onChange={(event) => setUsername(event.target.value)}
      autoComplete="username"
      required
    />
  </label>
)}
    <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
    {mode !== "reset" && <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} required /></label>}
    <button className="button primary" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}</button>
    {message && <p role="status" className="form-message">{message}</p>}
  </form>;
}
