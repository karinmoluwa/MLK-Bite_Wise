import { env } from "@/config/env";

const ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll"] as const;

export class SessionManager {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private onExpire: () => void;

  constructor(onExpire: () => void) {
    this.onExpire = onExpire;
  }

  start() {
    if (typeof window === "undefined") return;
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, this.reset, { passive: true }));
    this.reset();
  }

  stop() {
    if (typeof window === "undefined") return;
    ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, this.reset));
    if (this.timer) clearTimeout(this.timer);
  }

  private reset = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(this.onExpire, env.sessionTimeoutMinutes * 60 * 1000);
  };
}
