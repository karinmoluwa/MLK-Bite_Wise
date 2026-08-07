"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { getFirebaseAuth } from "@/services/auth/firebase";import { primaryNavigation, secondaryNavigation } from "@/domain/navigation";
import { SessionManager } from "@/services/auth/session-manager";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabletCollapsed, setTabletCollapsed] = useState(false);
  const [sessionNotice, setSessionNotice] = useState(false);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const manager = new SessionManager(() => setSessionNotice(true));
    manager.start();
    return () => manager.stop();
  }, []);
 useEffect(() => {
  const auth = getFirebaseAuth();

  if (!auth) return;

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      setUsername("User");
      return;
    }

    setUsername(
      user.displayName ||
      user.email?.split("@")[0] ||
      "User"
    );
  });

  return unsubscribe;
 }, []);
  const signOut = async () => {
  setSessionNotice(false);
  setMobileOpen(false);

  const auth = getFirebaseAuth();

  if (auth) {
    await firebaseSignOut(auth);
  }

  window.location.href = "/login";
 };

  const nav = (items: typeof primaryNavigation) => items.map((item, index) => (
    <a className={`app-nav-link ${index === 0 ? "is-active" : ""}`} href={item.href} key={item.label} onClick={() => setMobileOpen(false)}>
      <span className="nav-icon" aria-hidden="true">{item.icon}</span>
      <span className="nav-label">{item.label}</span>
    </a>
  ));

  return (
    <div className={`application-frame ${tabletCollapsed ? "sidebar-collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <aside className={`app-sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Application navigation">
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true">BW</span>
          <span className="brand-copy"><strong>Bite Wise</strong><small>Nutrition, made clearer</small></span>
          <button className="icon-button mobile-close" type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation">×</button>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">{nav(primaryNavigation)}</div>
          <div className="nav-section nav-section-bottom">{nav(secondaryNavigation)}</div>
        </nav>
        <button className="sign-out-button" type="button" onClick={signOut}>
          <span className="nav-icon" aria-hidden="true">SO</span><span className="nav-label">Sign out</span>
        </button>
      </aside>

      {mobileOpen && <button className="nav-scrim" type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

      <div className="app-content-column">
        <header className="app-topbar">
          <div className="topbar-leading">
            <button className="icon-button mobile-menu" type="button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>☰</button>
            <button className="icon-button tablet-toggle" type="button" aria-label="Collapse navigation" onClick={() => setTabletCollapsed((value) => !value)}>☰</button>
<div>
  <strong>Hi, {username}</strong>
  <small>Here is your nutrition overview</small>
</div>          </div>
          <div className="topbar-actions">
            <label className="global-search"><span className="sr-only">Search Bite Wise</span><input type="search" placeholder="Search meals and insights" /></label>
            <button className="icon-button" type="button" aria-label="View notifications">●</button>
<button
  className="profile-button"
  type="button"
  aria-label="Open profile menu"
>
  <span>
    {username.slice(0, 2).toUpperCase()}
  </span>

  <span className="profile-copy">
    <strong>{username}</strong>
    <small>Standard user</small>
  </span>
</button>          </div>
        </header>

        <main id="main-content" className="app-main">{children}</main>
      </div>

      {sessionNotice && (
        <div className="dialog-backdrop" role="presentation">
          <section className="session-dialog" role="dialog" aria-modal="true" aria-labelledby="session-title">
            <span className="dialog-icon" aria-hidden="true">!</span>
            <h2 id="session-title">Your session has expired</h2>
            <p>For your security, Bite Wise signs you out after a period of inactivity. Your saved information remains secure.</p>
            <button className="button button-primary" type="button" onClick={signOut}>Return to sign in</button>
          </section>
        </div>
      )}
    </div>
  );
}
