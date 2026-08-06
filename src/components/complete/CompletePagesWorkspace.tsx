"use client";

import { useMemo, useState } from "react";
import { DesignSystemWorkspace } from "@/components/design-system/DesignSystemWorkspace";

type Section = "Authentication" | "Main application" | "Nutritionist" | "User settings" | "Support" | "Design system";
type DialogKind = "Delete meal" | "Delete favourite" | "Disconnect nutritionist" | "Sign out" | "Remove shared access" | "Reset preferences" | "Permanently delete account";

const pageGroups: Record<Section, string[]> = {
  Authentication: ["Welcome Page", "Sign Up", "Login", "Forgot Password", "Reset Password", "Email Verification"],
  "Main application": ["Dashboard", "Meal Logging", "Image Upload", "Webcam Capture", "Voice Logging", "Meal Confirmation", "Meal History", "Favourite Meals", "Nutrition Dashboard", "Weekly Progress", "Monthly Progress", "Nutrition Insights"],
  Nutritionist: ["Nutritionist Dashboard", "Client Profile", "Shared Meal History", "Meal Recommendations", "Client Messages", "Privacy Controls"],
  "User settings": ["Profile", "Dietary Requirements", "Allergies", "Notification Preferences", "Language", "Privacy", "Connected Nutritionist", "Simplified View"],
  Support: ["Help Centre", "Frequently Asked Questions", "Contact Support", "About Bite Wise", "Privacy Policy", "Terms of Service", "Medical Disclaimer"],
  "Design system": ["Component Library"],
};

const emptyStates = ["No Meals Logged", "No Favourite Meals", "No Notifications", "No Nutritionist Connected", "No Weekly Data Available"];
const successStates = ["Meal Saved", "Profile Updated", "Nutritionist Connected", "Preferences Saved", "Password Changed", "Language Updated"];
const errorStates = [
  ["No Internet Connection", "Check your connection and try again."],
  ["Authentication Failed", "Review your email and password, then retry."],
  ["Session Expired", "Sign in again to continue securely."],
  ["Webcam Access Denied", "Allow camera access or upload an image instead."],
  ["Microphone Access Denied", "Allow microphone access or upload an audio file."],
  ["Image Upload Failed", "Choose another file or retry the upload."],
  ["Translation Service Unavailable", "Continue in the original language and retry later."],
  ["USDA FoodData Central API Unavailable", "Use estimated values and confirm before saving."],
  ["Firebase Authentication Error", "Retry sign-in or reset your password."],
  ["Firestore Synchronization Failed", "Keep this page open and retry synchronization."],
];
const dialogKinds: DialogKind[] = ["Delete meal", "Delete favourite", "Disconnect nutritionist", "Sign out", "Remove shared access", "Reset preferences", "Permanently delete account"];

export function CompletePagesWorkspace() {
  const [section, setSection] = useState<Section>("Authentication");
  const [selectedPage, setSelectedPage] = useState("Welcome Page");
  const [stateTab, setStateTab] = useState<"Loading" | "Empty" | "Success" | "Error">("Loading");
  const [dialog, setDialog] = useState<DialogKind | null>(null);
  const [toast, setToast] = useState("");
  const pages = useMemo(() => pageGroups[section], [section]);

  const changeSection = (next: Section) => {
    setSection(next);
    setSelectedPage(pageGroups[next][0]);
  };

  return (
    <div className="complete-workspace">
      <section className="page-heading-row">
        <div><span className="eyebrow">Production page library</span><h1>Complete Bite Wise experience</h1><p>Every required page, state, recovery pattern, and confirmation flow is represented in one responsive implementation workspace.</p></div>
        <span className="supportive-badge">WCAG 2.2 AA baseline</span>
      </section>

      <section className="dashboard-card page-library" aria-label="Application pages">
        <div className="section-tabs" role="tablist" aria-label="Page groups">
          {(Object.keys(pageGroups) as Section[]).map((item) => <button key={item} className={section === item ? "is-active" : ""} type="button" onClick={() => changeSection(item)}>{item}</button>)}
        </div>
        <div className="page-library-grid">
          <nav className="page-list" aria-label={`${section} pages`}>
            {pages.map((page) => <button key={page} className={selectedPage === page ? "is-active" : ""} type="button" onClick={() => setSelectedPage(page)}>{page}</button>)}
          </nav>
          <article className="page-preview" aria-live="polite">
            <div className="preview-header"><div><span className="card-kicker">{section}</span><h2>{selectedPage}</h2></div><span className="supportive-badge">Responsive</span></div>
            <PagePreview name={selectedPage} onSuccess={(message) => { setToast(message); window.setTimeout(() => setToast(""), 2600); }} />
          </article>
        </div>
      </section>

      <section className="dashboard-card state-showcase">
        <div className="card-heading"><div><span className="card-kicker">System states</span><h2>Clear feedback and recovery</h2></div></div>
        <div className="section-tabs compact" role="tablist" aria-label="System state types">
          {(["Loading", "Empty", "Success", "Error"] as const).map((item) => <button type="button" key={item} className={stateTab === item ? "is-active" : ""} onClick={() => setStateTab(item)}>{item}</button>)}
        </div>
        {stateTab === "Loading" && <div className="state-grid"><Skeleton title="Dashboard skeleton"/><Skeleton title="File upload progress" progress={68}/><Skeleton title="Synchronization" progress={42}/></div>}
        {stateTab === "Empty" && <div className="state-grid">{emptyStates.map((item) => <StateCard key={item} icon="＋" title={item} body="You are ready to begin. Add your first item to build a useful nutrition history." action="Get started" />)}</div>}
        {stateTab === "Success" && <div className="state-grid">{successStates.map((item) => <StateCard key={item} icon="✓" title={item} body="Your change has been saved securely." action="Continue" tone="success" />)}</div>}
        {stateTab === "Error" && <div className="state-grid">{errorStates.map(([title, body]) => <StateCard key={title} icon="!" title={title} body={body} action="Try again" tone="error" />)}</div>}
      </section>

      <section className="dashboard-card">
        <div className="card-heading"><div><span className="card-kicker">Confirmation dialogs</span><h2>Protected high-impact actions</h2></div></div>
        <div className="dialog-button-grid">{dialogKinds.map((kind) => <button type="button" className={kind === "Permanently delete account" ? "button danger-button" : "button button-secondary"} key={kind} onClick={() => setDialog(kind)}>{kind}</button>)}</div>
      </section>

      {toast && <div className="app-toast" role="status">✓ {toast}</div>}
      {dialog && <ConfirmationDialog kind={dialog} onCancel={() => setDialog(null)} onConfirm={() => { setDialog(null); setToast(`${dialog} confirmed`); window.setTimeout(() => setToast(""), 2600); }} />}
    </div>
  );
}

function PagePreview({ name, onSuccess }: { name: string; onSuccess: (message: string) => void }) {
  if (name === "Component Library") return <DesignSystemWorkspace />;
  if (["Welcome Page", "Login", "Sign Up", "Forgot Password", "Reset Password", "Email Verification"].includes(name)) {
    return <div className="auth-preview"><div className="preview-brand">BW</div><p className="preview-copy">A calm, secure entry point that preserves entered information and explains every next step.</p><label>Email address<input type="email" placeholder="you@example.com" /></label>{!["Forgot Password", "Email Verification"].includes(name) && <label>Password<input type="password" placeholder="At least 8 characters" /></label>}<button className="button button-primary full-width" type="button" onClick={() => onSuccess(`${name} action completed`)}>Continue</button><small>Keyboard accessible · supportive validation · secure session handling</small></div>;
  }
  if (name.includes("Progress") || name.includes("Nutrition Dashboard") || name === "Nutrition Insights") {
    return <div className="preview-dashboard"><div className="mini-metrics"><span><strong>On track</strong><small>Daily guidance</small></span><span><strong>78%</strong><small>Protein goal</small></span><span><strong>6 days</strong><small>Consistent logging</small></span></div><div className="mini-chart" role="img" aria-label="Seven day nutrition trend"><i style={{height:"42%"}}/><i style={{height:"58%"}}/><i style={{height:"53%"}}/><i style={{height:"72%"}}/><i style={{height:"69%"}}/><i style={{height:"82%"}}/><i style={{height:"76%"}}/></div><p className="supportive-note">Your fibre intake has improved this week. Add beans or vegetables to dinner to keep the momentum going.</p></div>;
  }
  if (name.includes("Meal") || name.includes("Upload") || name.includes("Webcam") || name.includes("Voice")) {
    return <div className="meal-preview"><div className="upload-zone"><strong>{name}</strong><span>Choose a file, use a supported device feature, or continue with manual entry.</span><button className="button button-secondary" type="button">Select input</button></div><div className="meal-result"><span className="supportive-badge">Confirmation required</span><strong>Jollof rice with grilled chicken</strong><small>Estimated 620–700 kcal · allergens checked · serving editable</small><button className="button button-primary" type="button" onClick={() => onSuccess("Meal saved")}>Confirm and save</button></div></div>;
  }
  if (["Nutritionist Dashboard", "Client Profile", "Shared Meal History", "Meal Recommendations", "Client Messages", "Privacy Controls"].includes(name)) {
    return <div className="client-preview"><div className="client-row"><span className="avatar">AO</span><div><strong>Amara Okafor</strong><small>Maintain weight · active today</small></div><span className="supportive-badge">Shared access</span></div><div className="permission-grid"><span>Meal history ✓</span><span>Nutrition progress ✓</span><span>Weight history —</span><span>Allergies ✓</span></div><textarea aria-label="Nutritionist guidance" placeholder="Write constructive guidance linked to this client or meal"/><button className="button button-primary" type="button" onClick={() => onSuccess("Guidance sent")}>Send guidance</button></div>;
  }
  if (["Profile", "Dietary Requirements", "Allergies", "Notification Preferences", "Language", "Privacy", "Connected Nutritionist", "Simplified View"].includes(name)) {
    return <div className="settings-preview"><label className="setting-row"><span><strong>{name}</strong><small>Changes require confirmation before saving.</small></span><input type="checkbox" defaultChecked /></label><label>Preference<select defaultValue="English"><option>English</option><option>French</option><option>Yoruba</option><option>Igbo</option><option>Hausa</option></select></label><button className="button button-primary" type="button" onClick={() => onSuccess("Preferences saved")}>Review and save</button></div>;
  }
  return <div className="support-preview"><div className="support-icon">?</div><h3>{name}</h3><p>Plain-language guidance, searchable help, and clear routes to contact support without losing current work.</p><input type="search" placeholder="Search help topics"/><div className="faq-list"><details><summary>How does Bite Wise protect my information?</summary><p>Access is role-based, sharing is explicit, and users can revoke access at any time.</p></details><details><summary>Are calorie values exact?</summary><p>Values are estimates and can vary by preparation and serving size.</p></details></div></div>;
}

function Skeleton({ title, progress }: { title: string; progress?: number }) { return <div className="state-card"><div className="skeleton-line short"/><div className="skeleton-line"/><div className="skeleton-line medium"/>{progress !== undefined && <><div className="progress"><span style={{width:`${progress}%`}}/></div><small>{progress}% · {title}</small></>}</div>; }
function StateCard({ icon, title, body, action, tone = "neutral" }: { icon: string; title: string; body: string; action: string; tone?: "neutral"|"success"|"error" }) { return <article className={`state-card state-${tone}`}><span className="state-icon">{icon}</span><h3>{title}</h3><p>{body}</p><button className="text-button" type="button">{action}</button></article>; }
function ConfirmationDialog({ kind, onCancel, onConfirm }: { kind: DialogKind; onCancel: () => void; onConfirm: () => void }) {
  const destructive = ["Delete meal", "Delete favourite", "Permanently delete account"].includes(kind);
  return <div className="dialog-backdrop" role="presentation"><section className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><span className={`dialog-icon ${destructive ? "danger" : ""}`} aria-hidden="true">!</span><h2 id="confirm-title">Confirm {kind.toLowerCase()}</h2><p>{kind === "Permanently delete account" ? "This permanently removes your account and stored data. This action cannot be undone." : "Please review this action before continuing. Your other saved information will remain unchanged."}</p><div className="dialog-actions"><button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button><button className={destructive ? "button danger-button" : "button button-primary"} type="button" onClick={onConfirm}>{kind}</button></div></section></div>;
}
