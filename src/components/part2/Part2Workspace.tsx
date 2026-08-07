"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  getFirebaseAuth,
  getFirebaseDatabase,
} from "@/services/auth/firebase";

import { NutritionWorkspace } from "@/components/dashboard/NutritionWorkspace";

type Area =
  | "nutrition"
  | "nutritionist"
  | "client"
  | "insights"
  | "settings";

type Role = "user" | "nutritionist";

type PrivacyKey =
  | "Meal History"
  | "Nutrition Progress"
  | "Weight History"
  | "Allergies"
  | "Food Intolerances"
  | "Dietary Requirements"
  | "Water Intake"
  | "Activity Summary";

type NotificationKey =
  | "Meal Reminders"
  | "Daily Nutrition Summaries"
  | "Nutritionist Notifications"
  | "Recommendation Alerts"
  | "Weekly Progress Updates";

type Allergy = {
  name: string;
  severity: "Mild" | "Moderate" | "Severe";
};

const clients: any[] = [];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-Free",
  "Lactose-Free",
  "Diabetic-Friendly",
  "Low Sodium",
  "High Protein",
  "Pregnancy-Friendly",
  "Religious Fasting",
  "Other",
];

const privacyOptions: PrivacyKey[] = [
  "Meal History",
  "Nutrition Progress",
  "Weight History",
  "Allergies",
  "Food Intolerances",
  "Dietary Requirements",
  "Water Intake",
  "Activity Summary",
];

const notificationOptions: NotificationKey[] = [
  "Meal Reminders",
  "Daily Nutrition Summaries",
  "Nutritionist Notifications",
  "Recommendation Alerts",
  "Weekly Progress Updates",
];

export function Part2Workspace() {
  const [area, setArea] = useState<Area>("nutrition");
  useEffect(() => {
  const handleNavigation = () => {
    const hash = window.location.hash.replace("#", "").toLowerCase();

    switch (hash) {
      case "dashboard":
      case "nutrition":
      case "meal":
        setArea("nutrition");
        break;

      case "history":
      case "client":
        setArea("client");
        break;

      case "recommendations":
      case "insights":
        setArea("insights");
        break;

      case "settings":
      case "notifications":
        setArea("settings");
        break;

      case "nutritionist":
        setArea("nutritionist");
        break;

      default:
        setArea("nutrition");
    }
  };

  handleNavigation();

  window.addEventListener("hashchange", handleNavigation);

  return () => {
    window.removeEventListener("hashchange", handleNavigation);
  };
 }, []);
  const [role, setRole] = useState<Role>("user");

  const [connected, setConnected] = useState(false);
  const [connectionMethod, setConnectionMethod] =
    useState("Invitation Code");
  const [connectionValue, setConnectionValue] = useState("");

  const [dialog, setDialog] = useState<
    null | "connect" | "disconnect" | "privacy" | "settings" | "allergy"
  >(null);

  const [privacy, setPrivacy] = useState<Record<PrivacyKey, boolean>>(
    () =>
      Object.fromEntries(
        privacyOptions.map((key) => [key, false])
      ) as Record<PrivacyKey, boolean>
  );

  const [draftPrivacy, setDraftPrivacy] = useState(privacy);

  // New users start with NO fake dietary or allergy information.
  const [dietary, setDietary] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [intolerances, setIntolerances] = useState<string[]>([]);

  const [acknowledged, setAcknowledged] = useState(false);
  const [simplified, setSimplified] = useState(false);

  const [notifications, setNotifications] = useState<
    Record<NotificationKey, boolean>
  >(
    () =>
      Object.fromEntries(
        notificationOptions.map((key) => [key, false])
      ) as Record<NotificationKey, boolean>
  );

  const [sort, setSort] = useState("Name");
  const [filter, setFilter] = useState("All goals");

  const [messageType, setMessageType] =
    useState("Weekly recommendation");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileSkipped, setProfileSkipped] = useState(false);
  const [profile, setProfile] = useState<any>(null);
 useEffect(() => {
  const auth = getFirebaseAuth();
  const db = getFirebaseDatabase();

  if (!auth || !db) {
    setProfileLoaded(true);
    return;
  }

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setProfile(null);
      setProfileLoaded(true);
      return;
    }

    try {
      const snapshot = await getDoc(
        doc(db, "users", user.uid)
      );

      if (!snapshot.exists()) {
        setProfile(null);
        setProfileLoaded(true);
        return;
      }

      const savedProfile = snapshot.data();

      setProfile(savedProfile);

      setDietary(
        Array.isArray(savedProfile.dietaryPreferences)
          ? savedProfile.dietaryPreferences
          : []
      );

      setAllergies(
        Array.isArray(savedProfile.allergies)
          ? savedProfile.allergies.map((item: any) => ({
              name: item.name,
              severity:
                item.severity === "severe"
                  ? "Severe"
                  : item.severity === "moderate"
                  ? "Moderate"
                  : "Mild",
            }))
          : []
      );

      setIntolerances(
        Array.isArray(savedProfile.intolerances)
          ? savedProfile.intolerances
          : []
      );

      setProfileSkipped(
        savedProfile.onboardingSkipped === true &&
        savedProfile.onboardingComplete !== true
      );
    } catch {
      setToast(
        "We could not load your saved profile. Please refresh and try again."
      );
    } finally {
      setProfileLoaded(true);
    }
  });

  return unsubscribe;
}, []);
 const saveProfileSettings = async () => {
  const auth = getFirebaseAuth();
  const db = getFirebaseDatabase();
  const user = auth?.currentUser;

  if (!auth || !db || !user) {
    setToast("Please sign in again before saving your settings.");
    return;
  }

  try {
    const updatedProfile = {
  ...(profile || {}),
  language: profile?.language || "",
  cuisinePreference: profile?.cuisinePreference || "",
  displayName: profile?.displayName || "",
  dietaryPreferences: dietary,
  allergies: allergies.map((item) => ({
    name: item.name,
    severity: item.severity.toLowerCase(),
  })),
  intolerances,
  updatedAt: new Date().toISOString(),
 };

    await setDoc(
      doc(db, "users", user.uid),
      updatedProfile,
      { merge: true }
    );

    setProfile((current: any) => ({
      ...(current || {}),
      ...updatedProfile,
    }));

    setDialog(null);
    setToast("Settings saved successfully.");
  } catch {
    setToast(
      "We could not save your settings. Please try again."
    );
  }
 };

  const visibleClients = useMemo(() => {
    const filtered =
      filter === "All goals"
        ? clients
        : clients.filter((client) => client.goal === filter);

    return [...filtered].sort((a, b) => {
      if (sort === "Progress") {
        return b.progress - a.progress;
      }

      if (sort === "Last Activity") {
        return a.activity.localeCompare(b.activity);
      }

      return a.name.localeCompare(b.name);
    });
  }, [sort, filter]);

  function confirmConnection() {
    setConnected(dialog === "connect");
    setDialog(null);

    setToast(
      dialog === "connect"
        ? "Nutritionist connection approved."
        : "Nutritionist disconnected and shared access removed."
    );
  }

  return (
    <div className="part2-root">
      <div
        className="module-switcher"
        aria-label="Application modules"
      >
        <div>
          <button
            className={area === "nutrition" ? "is-current" : ""}
            onClick={() => setArea("nutrition")}
          >
            Nutrition
          </button>

          <button
            className={
              area === "nutritionist" ? "is-current" : ""
            }
            onClick={() => setArea("nutritionist")}
          >
            Nutritionist
          </button>

          <button
            className={area === "client" ? "is-current" : ""}
            onClick={() => setArea("client")}
          >
            Client profile
          </button>

          <button
            className={area === "insights" ? "is-current" : ""}
            onClick={() => setArea("insights")}
          >
            Insights
          </button>

          <button
            className={area === "settings" ? "is-current" : ""}
            onClick={() => setArea("settings")}
          >
            Settings
          </button>
        </div>

        <label>
          View as
          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as Role)
            }
          >
            <option value="user">Standard user</option>
            <option value="nutritionist">Nutritionist</option>
          </select>
        </label>
      </div>
       {profileSkipped && (
  <div className="status-banner">
    <span>
      Complete your nutrition profile to improve recommendations and safety checks.
    </span>

    <button
      type="button"
      className="button button-secondary"
      onClick={() => {
        window.location.href = "/onboarding";
      }}
    >
      Complete profile
    </button>
  </div>
  )}
  {!profileLoaded && (
  <div className="dashboard-card">
    <p>Loading your profile...</p>
  </div>
 )}
      {toast && (
        <div className="status-banner" role="status">
          {toast}

          <button
            onClick={() => setToast("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
  </div>
)}
 {profileLoaded && area === "nutrition" && (
  <NutritionWorkspace />
)}

{profileLoaded &&
  area === "nutritionist" &&
  (role === "nutritionist" ? (
    <NutritionistDashboard
      clients={visibleClients}
      sort={sort}
      setSort={setSort}
      filter={filter}
      setFilter={setFilter}
      messageType={messageType}
      setMessageType={setMessageType}
      message={message}
      setMessage={setMessage}
      send={() => {
        if (!message.trim()) return;

        setToast("Guidance sent successfully.");
        setMessage("");
      }}
    />
  ) : (
    <NutritionistConnection
      connected={connected}
      method={connectionMethod}
      setMethod={setConnectionMethod}
      value={connectionValue}
      setValue={setConnectionValue}
      connect={() =>
        setDialog(
          connected ? "disconnect" : "connect"
        )
      }
    />
  ))}

{profileLoaded && area === "client" && (
  <ClientProfile
    profile={profile}
    privacy={privacy}
    allergies={allergies}
    intolerances={intolerances}
    dietary={dietary}
    role={role}
  />
)}
{profileLoaded && area === "insights" && (
  <Insights simplified={simplified} />
)}

{profileLoaded && area === "settings" && (
  <Settings
    profile={profile}
    setProfile={setProfile}
    connected={connected}
    simplified={simplified}
    setSimplified={setSimplified}
    dietary={dietary}
    setDietary={setDietary}
    allergies={allergies}
    setAllergies={setAllergies}
    intolerances={intolerances}
    setIntolerances={setIntolerances}
    notifications={notifications}
    setNotifications={setNotifications}
    privacy={draftPrivacy}
    setPrivacy={setDraftPrivacy}
    savePrivacy={() => setDialog("privacy")}
    acknowledged={acknowledged}
    acknowledge={() => setDialog("allergy")}
    saveSettings={() => setDialog("settings")}
    disconnect={() => setDialog("disconnect")}
  />
)}
     
      {dialog && (
        <div
          className="dialog-backdrop"
          role="presentation"
        >
          <section
            className="session-dialog wide-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <span
              className="dialog-icon"
              aria-hidden="true"
            >
              !
            </span>

            <h2 id="confirm-title">
              {dialog === "connect"
                ? "Approve nutritionist connection?"
                : dialog === "disconnect"
                ? "Disconnect nutritionist?"
                : dialog === "privacy"
                ? "Save privacy changes?"
                : dialog === "allergy"
                ? "Health acknowledgement"
                : "Save settings changes?"}
            </h2>

            <p>
              {dialog === "connect"
                ? `Bite Wise will connect using ${connectionMethod}. Access is limited to information you explicitly share.`
                : dialog === "disconnect"
                ? "The nutritionist will immediately lose access to all shared information."
                : dialog === "privacy"
                ? "These sharing permissions take effect immediately."
                : dialog === "allergy"
                ? "I understand that Bite Wise is an educational nutrition platform and does not replace advice from my healthcare professional."
                : "Your updated preferences will influence recommendations, targets, alternatives, and insights."}
            </p>

            <div className="dialog-actions">
              <button
                className="button button-secondary"
                onClick={() => setDialog(null)}
              >
                Cancel
              </button>

              <button
                className="button button-primary"
                onClick={() => {
                  if (
                    dialog === "connect" ||
                    dialog === "disconnect"
                  ) {
                    confirmConnection();
                    return;
                  }

                  if (dialog === "privacy") {
                    setPrivacy(draftPrivacy);
                    setDialog(null);
                    setToast(
                      "Privacy permissions saved and applied immediately."
                    );
                    return;
                  }

                  if (dialog === "allergy") {
                    setAcknowledged(true);
                    setDialog(null);
                    setToast(
                      "Health acknowledgement saved."
                    );
                    return;
                  }

                  void saveProfileSettings();
                }}
              >
                {dialog === "allergy"
                  ? "I understand"
                  : "Confirm"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function NutritionistConnection(props: any) {
  return (
    <section className="settings-page">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">
            Secure collaboration
          </span>
          <h1>Connected nutritionist</h1>
          <p>
            You decide who connects and exactly what they can
            access.
          </p>
        </div>
      </div>

      <article className="dashboard-card connection-card">
        <div className="connection-status">
          <span
            className={
              props.connected
                ? "status-dot connected"
                : "status-dot"
            }
          />

          <div>
            <strong>
              {props.connected
                ? "Nutritionist connected"
                : "No nutritionist connected"}
            </strong>

            <p>
              {props.connected
                ? "Only approved information is shared."
                : "Connect by code, email invitation, or secure link."}
            </p>
          </div>
        </div>

        {!props.connected && (
          <div className="form-grid">
            <label>
              Connection method
              <select
                value={props.method}
                onChange={(event) =>
                  props.setMethod(event.target.value)
                }
              >
                <option>Invitation Code</option>
                <option>Email Invitation</option>
                <option>Secure Link</option>
              </select>
            </label>

            <label>
              {props.method}

              <input
                value={props.value}
                onChange={(event) =>
                  props.setValue(event.target.value)
                }
                placeholder={
                  props.method === "Invitation Code"
                    ? "Enter invitation code"
                    : props.method === "Email Invitation"
                    ? "nutritionist@example.com"
                    : "Paste secure link"
                }
              />
            </label>
          </div>
        )}

        <button
          className={
            props.connected
              ? "button button-secondary"
              : "button button-primary"
          }
          onClick={props.connect}
        >
          {props.connected
            ? "Disconnect nutritionist"
            : "Review connection request"}
        </button>
      </article>
    </section>
  );
}

function NutritionistDashboard(props: any) {
  return (
    <div className="settings-page">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">
            Nutritionist portal
          </span>
          <h1>Client care dashboard</h1>
          <p>
            View only information clients have explicitly chosen
            to share.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Assigned clients</span>
          <strong>{props.clients.length}</strong>
          <p>
            {props.clients.length
              ? "Active care relationships"
              : "No clients assigned yet"}
          </p>
        </article>
      </div>

      <section className="dashboard-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              Assigned clients
            </span>
            <h2>Progress overview</h2>
          </div>

          <div className="filter-row">
            <label>
              Sort
              <select
                value={props.sort}
                onChange={(event) =>
                  props.setSort(event.target.value)
                }
              >
                <option>Name</option>
                <option>Progress</option>
                <option>Last Activity</option>
              </select>
            </label>

            <label>
              Goal
              <select
                value={props.filter}
                onChange={(event) =>
                  props.setFilter(event.target.value)
                }
              >
                <option>All goals</option>
                <option>Lose Weight</option>
                <option>Maintain Weight</option>
                <option>Gain Weight</option>
              </select>
            </label>
          </div>
        </div>

        {props.clients.length ? (
          <div className="client-table">
            {props.clients.map((client: any) => (
              <article key={client.id}>
                <div className="avatar-circle">
                  {client.name
                    .split(" ")
                    .map((part: string) => part[0])
                    .join("")}
                </div>

                <div>
                  <strong>{client.name}</strong>
                  <small>
                    {client.goal} · Last active{" "}
                    {client.activity}
                  </small>
                </div>

                <div className="progress-cell">
                  <span>{client.progress}%</span>
                  <div>
                    <i
                      style={{
                        width: `${client.progress}%`,
                      }}
                    />
                  </div>
                </div>

                <span className="soft-badge">
                  {client.status}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-message">
            No clients have been assigned yet.
          </p>
        )}
      </section>

      <section className="dashboard-card">
        <span className="eyebrow">Shared meals</span>
        <h2>Recent meal logs</h2>

        <p className="empty-message">
          Shared client meals will appear here when a connected
          client grants permission.
        </p>
      </section>

      <section className="dashboard-card">
        <span className="eyebrow">Send guidance</span>
        <h2>Client message</h2>

        {!props.clients.length ? (
          <p className="empty-message">
            Connect or select a client before sending guidance.
          </p>
        ) : (
          <div className="form-stack">
            <label>
              Message type
              <select
                value={props.messageType}
                onChange={(event) =>
                  props.setMessageType(event.target.value)
                }
              >
                <option>Educational message</option>
                <option>Weekly recommendation</option>
                <option>Progress review</option>
                <option>Motivation</option>
              </select>
            </label>

            <label>
              Guidance
              <textarea
                value={props.message}
                onChange={(event) =>
                  props.setMessage(event.target.value)
                }
                placeholder="Write constructive, actionable guidance"
              />
            </label>

            <button
              className="button button-primary"
              onClick={props.send}
              disabled={!props.message.trim()}
            >
              Send guidance
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function ClientProfile({
  profile,
  privacy,
  allergies,
  intolerances,
  dietary,
  role,
}: any) {
  const canSee = (key: PrivacyKey) =>
    role === "user" || privacy[key];

  return (
    <div className="settings-page">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">
            Client profile
          </span>
          <h1>Your nutrition profile</h1>
          <p>
            {role === "nutritionist"
              ? "Only client-approved sections are visible."
              : "Your saved goals, nutrition history and safety profile will appear here."}
          </p>
        </div>
      </div>

    <section className="dashboard-card">
  <span className="eyebrow">Profile summary</span>
  <h2>Your personalised plan</h2>

  {profile ? (
    <div className="profile-summary-grid">
      <div>
        <span>Age</span>
        <strong>{profile.age ?? "Not provided"}</strong>
      </div>

      <div>
        <span>Biological sex</span>
        <strong>{profile.sex || "Not provided"}</strong>
      </div>

      <div>
        <span>Height</span>
        <strong>
          {profile.height ? `${profile.height} cm` : "Not provided"}
        </strong>
      </div>

      <div>
        <span>Weight</span>
        <strong>
          {profile.weight ? `${profile.weight} kg` : "Not provided"}
        </strong>
      </div>

      <div>
        <span>Activity level</span>
        <strong>{profile.activityLevel || "Not provided"}</strong>
      </div>

      <div>
        <span>Primary goal</span>
        <strong>{profile.goal || "Not provided"}</strong>
      </div>

      <div>
        <span>Preferred language</span>
        <strong>{profile.language || "Not provided"}</strong>
      </div>
    </div>
  ) : (
    <p className="empty-message">
      Complete your nutrition profile to see your personalised plan.
    </p>
  )}
 </section>

      {canSee("Meal History") && (
        <section className="dashboard-card">
          <span className="eyebrow">Meal history</span>
          <h2>Recent meals</h2>

          <p className="empty-message">
            No meals have been logged yet.
          </p>
        </section>
      )}

      <div className="dashboard-secondary-grid">
        {canSee("Allergies") && (
          <section className="dashboard-card">
            <span className="eyebrow">
              High-risk allergies
            </span>
            <h2>Safety profile</h2>

            {allergies.length ? (
              <div className="tag-list">
                {allergies.map((item: Allergy) => (
                  <span
                    className={`safety-tag ${item.severity.toLowerCase()}`}
                    key={item.name}
                  >
                    ⚠ {item.name} · {item.severity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="empty-message">
                No food allergies recorded.
              </p>
            )}
          </section>
        )}

        {canSee("Food Intolerances") && (
          <section className="dashboard-card">
            <span className="eyebrow">
              Food intolerances
            </span>
            <h2>Comfort considerations</h2>

            {intolerances.length ? (
              <div className="tag-list">
                {intolerances.map((item: string) => (
                  <span
                    className="intolerance-tag"
                    key={item}
                  >
                    ◌ {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="empty-message">
                No food intolerances recorded.
              </p>
            )}
          </section>
        )}

        {canSee("Dietary Requirements") && (
          <section className="dashboard-card">
            <span className="eyebrow">
              Dietary requirements
            </span>
            <h2>Preferences</h2>

            {dietary.length ? (
              <div className="tag-list">
                {dietary.map((item: string) => (
                  <span
                    className="soft-badge"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="empty-message">
                No dietary preferences recorded.
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function Insights({
  simplified,
}: {
  simplified: boolean;
}) {
  return (
    <div className="settings-page">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">
            Nutrition insights
          </span>

          <h1>
            {simplified
              ? "Your nutrition insights"
              : "Weekly and monthly trends"}
          </h1>

          <p>
            Your insights will be generated from meals you
            actually log.
          </p>
        </div>
      </div>

      <section className="dashboard-card">
        <h2>No insights yet</h2>
        <p className="empty-message">
          Log meals over time to see personalised nutrition
          patterns and recommendations.
        </p>
      </section>
    </div>
  );
}

function Settings(props: any) {
  const [newAllergy, setNewAllergy] = useState("");
  const [severity, setSeverity] =
    useState<Allergy["severity"]>("Mild");
  const [newIntolerance, setNewIntolerance] =
    useState("");

  return (
    <div className="settings-page">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">Settings</span>
          <h1>Personalise Bite Wise</h1>
          <p>
            Manage your preferences, safety information and
            privacy.
          </p>
        </div>

        <button
          className="button button-primary"
          onClick={props.saveSettings}
        >
          Save changes
        </button>
      </div>

      <div className="settings-grid">
        <section className="dashboard-card">
          <span className="eyebrow">
            Profile and preferences
          </span>
          <h2>Account details</h2>

          <div className="form-grid">
  <label>
    Preferred language
    <select
value={
  props.profile?.language === "en"
    ? "English"
    : props.profile?.language === "fr"
    ? "French"
    : props.profile?.language === "yo"
    ? "Yoruba"
    : props.profile?.language === "ig"
    ? "Igbo"
    : props.profile?.language === "ha"
    ? "Hausa"
    : props.profile?.language || ""
}      onChange={(event) =>
        props.setProfile((current: any) => ({
          ...(current || {}),
          language: event.target.value,
        }))
      }
    >
      <option value="">Please select</option>
      <option value="English">English</option>
      <option value="French">French</option>
      <option value="Yoruba">Yoruba</option>
      <option value="Igbo">Igbo</option>
      <option value="Hausa">Hausa</option>
    </select>
  </label>

  <label>
    Cuisine preference
    <select
      value={props.profile?.cuisinePreference || ""}
      onChange={(event) =>
        props.setProfile((current: any) => ({
          ...(current || {}),
          cuisinePreference: event.target.value,
        }))
      }
    >
      <option value="">Please select</option>
      <option value="Nigerian Cuisine">
        Nigerian Cuisine
      </option>
      <option value="International Cuisine">
        International Cuisine
      </option>
    </select>
  </label>

  <label>
    Display name
    <input
      type="text"
      value={props.profile?.displayName || ""}
      onChange={(event) =>
        props.setProfile((current: any) => ({
          ...(current || {}),
          displayName: event.target.value,
        }))
      }
      placeholder="Your display name"
    />
  </label>

  <label>
    Password
    <input
      type="password"
      placeholder="Enter a new password"
      autoComplete="new-password"
    />
  </label>
 </div>
        </section>

        <section className="dashboard-card">
          <span className="eyebrow">
            Responsible design
          </span>
          <h2>Simplified View</h2>

          <label className="switch-row">
            <span>
              <strong>
                Use supportive guidance instead of detailed
                numbers
              </strong>
              <small>
                Reduces cognitive load and discourages obsessive
                tracking.
              </small>
            </span>

            <input
              type="checkbox"
              checked={props.simplified}
              onChange={(event) =>
                props.setSimplified(event.target.checked)
              }
            />
          </label>
        </section>

        <section className="dashboard-card">
          <span className="eyebrow">
            Dietary requirements
          </span>
          <h2>Meals should respect</h2>

          <div className="choice-grid">
            {dietaryOptions.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={props.dietary.includes(item)}
                  onChange={() =>
                    props.setDietary(
                      (items: string[]) =>
                        items.includes(item)
                          ? items.filter(
                              (value) =>
                                value !== item
                            )
                          : [...items, item]
                    )
                  }
                />

                <span>{item}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="dashboard-card">
          <span className="eyebrow">
            Allergy management
          </span>
          <h2>Safety and intolerances</h2>

          <div className="form-inline">
            <input
              value={newAllergy}
              onChange={(event) =>
                setNewAllergy(event.target.value)
              }
              placeholder="Add food allergy"
            />

            <select
              value={severity}
              onChange={(event) =>
                setSeverity(
                  event.target
                    .value as Allergy["severity"]
                )
              }
            >
              <option>Mild</option>
              <option>Moderate</option>
              <option>Severe</option>
            </select>

            <button
              className="button button-secondary"
              onClick={() => {
                const name = newAllergy.trim();

                if (!name) return;

                props.setAllergies(
                  (items: Allergy[]) => [
                    ...items,
                    {
                      name,
                      severity,
                    },
                  ]
                );

                setNewAllergy("");
              }}
            >
              Add
            </button>
          </div>

          <div className="tag-list">
            {props.allergies.map(
              (item: Allergy) => (
                <button
                  className={`safety-tag ${item.severity.toLowerCase()}`}
                  key={item.name}
                  onClick={() =>
                    props.setAllergies(
                      (items: Allergy[]) =>
                        items.filter(
                          (entry) =>
                            entry.name !== item.name
                        )
                    )
                  }
                >
                  ⚠ {item.name} · {item.severity} ×
                </button>
              )
            )}
          </div>

          <div className="form-inline">
            <input
              value={newIntolerance}
              onChange={(event) =>
                setNewIntolerance(
                  event.target.value
                )
              }
              placeholder="Add food intolerance"
            />

            <button
              className="button button-secondary"
              onClick={() => {
                const name =
                  newIntolerance.trim();

                if (!name) return;

                props.setIntolerances(
                  (items: string[]) => [
                    ...items,
                    name,
                  ]
                );

                setNewIntolerance("");
              }}
            >
              Add
            </button>
          </div>

          <div className="tag-list">
            {props.intolerances.map(
              (item: string) => (
                <button
                  className="intolerance-tag"
                  key={item}
                  onClick={() =>
                    props.setIntolerances(
                      (items: string[]) =>
                        items.filter(
                          (entry) =>
                            entry !== item
                        )
                    )
                  }
                >
                  ◌ {item} ×
                </button>
              )
            )}
          </div>

          {props.allergies.some(
            (item: Allergy) =>
              item.severity === "Severe"
          ) &&
            !props.acknowledged && (
              <button
                className="button button-secondary"
                onClick={props.acknowledge}
              >
                Review required health acknowledgement
              </button>
            )}

          <p className="disclaimer">
            Allergen detection provides guidance only and should
            not replace professional medical advice.
          </p>
        </section>

        <section className="dashboard-card">
          <span className="eyebrow">
            Notifications
          </span>
          <h2>Notification preferences</h2>

          <div className="toggle-list">
            {notificationOptions.map((item) => (
              <label
                className="switch-row"
                key={item}
              >
                <span>
                  <strong>{item}</strong>
                  <small>
                    Enable or disable this notification category.
                  </small>
                </span>

                <input
                  type="checkbox"
                  checked={
                    props.notifications[item]
                  }
                  onChange={(event) =>
                    props.setNotifications(
                      (current: any) => ({
                        ...current,
                        [item]:
                          event.target.checked,
                      })
                    )
                  }
                />
              </label>
            ))}
          </div>
        </section>

        <section className="dashboard-card">
          <span className="eyebrow">
            Privacy controls
          </span>
          <h2>Shared with your nutritionist</h2>

          <div className="toggle-list">
            {privacyOptions.map((item) => (
              <label
                className="switch-row"
                key={item}
              >
                <span>
                  <strong>{item}</strong>
                  <small>
                    {props.privacy[item]
                      ? "Shared"
                      : "Private"}
                  </small>
                </span>

                <input
                  type="checkbox"
                  checked={props.privacy[item]}
                  onChange={(event) =>
                    props.setPrivacy(
                      (current: any) => ({
                        ...current,
                        [item]:
                          event.target.checked,
                      })
                    )
                  }
                />
              </label>
            ))}
          </div>

          <button
            className="button button-secondary"
            onClick={props.savePrivacy}
          >
            Review privacy changes
          </button>
        </section>

        {props.connected && (
          <section className="dashboard-card">
            <span className="eyebrow">
              Connected nutritionist
            </span>
            <h2>Nutritionist connected</h2>
            <p>
              Access remains limited by your privacy controls.
            </p>

            <button
              className="button button-secondary"
              onClick={props.disconnect}
            >
              Disconnect nutritionist
            </button>
          </section>
        )}
      </div>
    </div>
  );
}