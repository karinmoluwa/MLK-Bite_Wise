import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "@/services/auth/firebase";

export async function requestPushNotificationToken(vapidKey?: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return null;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;
  const messaging = await getFirebaseMessaging();
  return messaging ? getToken(messaging, vapidKey ? { vapidKey } : undefined) : null;
}
