"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { applyActionCode } from "firebase/auth";
import { getFirebaseAuth } from "@/services/auth/firebase";

export default function AuthActionPage() {
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");
      const oobCode = params.get("oobCode");

      const auth = getFirebaseAuth();

      if (!auth || mode !== "verifyEmail" || !oobCode) {
        setMessage("Invalid verification link.");
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        setSuccess(true);
        setMessage("Your email has been verified successfully.");
      } catch {
        setMessage("Verification link has expired or is invalid.");
      }
    };

    void verify();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 500, textAlign: "center" }}>
        <h1>{success ? "Email Verified" : "Email Verification"}</h1>
        <p>{message}</p>

        <Link href={success ? "/login" : "/signup"}>
          {success ? "Continue to Login" : "Back to Sign Up"}
        </Link>
      </div>
    </main>
  );
}