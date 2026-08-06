import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";
import { env, isFirebaseConfigured } from "@/config/env";

export function getFirebaseApp() {
  if (!isFirebaseConfigured) return null;
  return getApps()[0] ?? initializeApp(env.firebase);
}

export function getFirebaseAuth() {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}

export const firebaseAuth = getFirebaseAuth();

export function getFirebaseDatabase() {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}

export async function getFirebaseMessaging() {
  const app = getFirebaseApp();
  if (!app || !(await isSupported())) return null;
  return getMessaging(app);
}
