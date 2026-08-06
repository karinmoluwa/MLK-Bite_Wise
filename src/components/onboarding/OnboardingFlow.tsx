"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";

const tips = ["Stay hydrated throughout the day.", "Small nutritional improvements lead to lasting habits.", "Balanced meals support sustained energy."];
const activities = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Athlete"];
const goals = ["Lose Weight", "Maintain Weight", "Gain Weight"];
const diets = ["Vegetarian", "Vegan", "Halal", "Diabetic-Friendly", "Gluten-Free"];
type Errors = Record<string, string>;
type Allergy = { name: string; severity: string };

function detectedLanguage() {
  if (typeof navigator === "undefined") return "English";
  const language = navigator.language.toLowerCase();
  if (language.startsWith("fr")) return "French";
  if (language.startsWith("yo")) return "Yoruba";
  if (language.startsWith("ig")) return "Igbo";
  if (language.startsWith("ha")) return "Hausa";
  return "English";
}

export function OnboardingFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tip, setTip] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [confirmRange, setConfirmRange] = useState(false);
  const [rangeNotice, setRangeNotice] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [allergyName, setAllergyName] = useState("");
  const [allergySeverity, setAllergySeverity] = useState("Moderate");
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [account, setAccount] = useState({ age: "", sex: "", height: "", weight: "", email: "", username: "", password: "", language: "English" });
  const [plan, setPlan] = useState({ activity: "", goal: "", intolerances: "", dietary: [] as string[] });

  useEffect(() => {
    setAccount((value) => ({ ...value, language: detectedLanguage() }));
    setSkipped(localStorage.getItem("bitewise-onboarding-skipped") === "true");
    const timer = window.setInterval(() => setTip((value) => (value + 1) % tips.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  function validateAccount() {
    const next: Errors = {};
    if (!account.age || Number(account.age) < 18) next.age = "Please enter your age using numbers.";
    if (!account.sex) next.sex = "Please select the option that best describes you.";
    if (!account.height || Number.isNaN(Number(account.height))) next.height = "Height must be entered in centimeters.";
    if (!account.weight || Number.isNaN(Number(account.weight))) next.weight = "Weight must be entered in kilograms.";
    if (!/^\S+@\S+\.\S+$/.test(account.email)) next.email = "Please enter a valid email address.";
    if (account.username.trim().length < 3) next.username = "Username must contain at least three characters.";
    if (account.password.length < 8) next.password = "Password must contain at least eight characters.";
    setErrors(next);
    if (Object.keys(next).length) return false;
    const outside = Number(account.height) < 100 || Number(account.height) > 230 || Number(account.weight) < 30 || Number(account.weight) > 250;
    if (outside && !confirmRange) { setRangeNotice(true); return false; }
    return true;
  }

  function submitAccount(event: FormEvent) {
    event.preventDefault();
    if (!validateAccount()) return;
    setErrors({}); setRangeNotice(false); setStep(2);
  }

  function submitPlan(event: FormEvent) {
    event.preventDefault();
    const next: Errors = {};
    if (!plan.activity) next.activity = "Please select your activity level.";
    if (!plan.goal) next.goal = "Please select your primary nutrition goal.";
    setErrors(next);
    if (Object.keys(next).length) return;
    localStorage.removeItem("bitewise-onboarding-skipped");
    setSkipped(false); setStep(3);
  }

  function skipPlan() {
    localStorage.setItem("bitewise-onboarding-skipped", "true");
    setSkipped(true); setStep(3);
  }

  function addAllergy() {
    if (!allergyName.trim()) { setErrors((value) => ({ ...value, allergy: "Enter an allergy before adding it." })); return; }
    setAllergies((value) => [...value, { name: allergyName.trim(), severity: allergySeverity }]);
    setAllergyName(""); setErrors((value) => ({ ...value, allergy: "" }));
  }

  if (step === 3) return <section className="completion-page">{skipped && <div className="reminder-banner" role="status"><div><strong>Complete your nutrition profile</strong><span>Add your activity, goals, allergies, and dietary preferences to improve recommendations.</span></div><button className="button button-secondary" onClick={() => setStep(2)}>Continue setup</button></div>}<div className="completion-card"><span className="completion-icon">✓</span><span className="eyebrow">Account ready</span><h1>Welcome to Bite Wise, {account.username || "there"}</h1><p>Your details have been preserved. Continue setup now or return when you are ready.</p><button className="button button-primary" onClick={() => setStep(skipped ? 2 : 1)}>{skipped ? "Complete personalization" : "Review onboarding"}</button></div></section>;

  return <section className="onboarding-shell">
    <div className="onboarding-main">
      <header className="onboarding-header"><div><span className="eyebrow">Personal setup</span><h1 id="onboarding-title">Create your Bite Wise plan</h1><p>Two short steps help us personalize your nutrition experience without overwhelming you.</p></div><div className="progress-summary"><span>Step {step} of 2</span><div className="progress-track"><span style={{ width: step === 1 ? "50%" : "100%" }} /></div></div></header>
      <ol className="step-list"><li className={step === 1 ? "is-active" : "is-complete"}><span>1</span><div><strong>Create account</strong><small>Basic information</small></div></li><li className={step === 2 ? "is-active" : ""}><span>2</span><div><strong>Personalize plan</strong><small>Goals and preferences</small></div></li></ol>
      {step === 1 ? <form className="onboarding-card" onSubmit={submitAccount} noValidate>
        <div className="form-heading"><div><span className="card-kicker">Step one</span><h2>Create your account</h2></div><p>Required fields are marked with an asterisk.</p></div>
        {Object.keys(errors).length > 0 && <div className="form-summary" role="alert">Please check the highlighted information before continuing.</div>}
        <div className="form-grid">
          <Field label="Age" name="age" error={errors.age}><input id="age" inputMode="numeric" value={account.age} onChange={(e) => setAccount({ ...account, age: e.target.value })} aria-invalid={!!errors.age} /></Field>
          <Field label="Sex" name="sex" error={errors.sex}><select id="sex" value={account.sex} onChange={(e) => setAccount({ ...account, sex: e.target.value })} aria-invalid={!!errors.sex}><option value="">Select an option</option><option>Female</option><option>Male</option><option>Intersex</option><option>Prefer not to say</option></select></Field>
          <Field label="Height (cm)" name="height" error={errors.height} helper="Recommended range: 100–230 cm"><input id="height" inputMode="decimal" value={account.height} onChange={(e) => { setConfirmRange(false); setAccount({ ...account, height: e.target.value }); }} aria-invalid={!!errors.height} /></Field>
          <Field label="Weight (kg)" name="weight" error={errors.weight} helper="Recommended range: 30–250 kg"><input id="weight" inputMode="decimal" value={account.weight} onChange={(e) => { setConfirmRange(false); setAccount({ ...account, weight: e.target.value }); }} aria-invalid={!!errors.weight} /></Field>
          <Field label="Email address" name="email" error={errors.email} wide><input id="email" type="email" autoComplete="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} aria-invalid={!!errors.email} /></Field>
          <Field label="Username" name="username" error={errors.username}><input id="username" autoComplete="username" value={account.username} onChange={(e) => setAccount({ ...account, username: e.target.value })} aria-invalid={!!errors.username} /></Field>
          <Field label="Password" name="password" error={errors.password} helper="Use at least eight characters."><input id="password" type="password" autoComplete="new-password" value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} aria-invalid={!!errors.password} /></Field>
          <Field label="Preferred language" name="language" helper="Detected from your browser; you can change it." wide><select id="language" value={account.language} onChange={(e) => setAccount({ ...account, language: e.target.value })}><option>English</option><option>French</option><option>Yoruba</option><option>Igbo</option><option>Hausa</option></select></Field>
        </div>
        {rangeNotice && <div className="soft-warning" role="alert"><div><strong>Please confirm your measurements</strong><span>This value appears unusually high or low. Please confirm it is correct.</span></div><label><input type="checkbox" checked={confirmRange} onChange={(e) => setConfirmRange(e.target.checked)} /> I confirm these values are correct.</label></div>}
        <div className="form-actions"><span>Your completed fields will not be cleared if a correction is needed.</span><button className="button button-primary" type="submit">Continue</button></div>
      </form> : <form className="onboarding-card" onSubmit={submitPlan} noValidate>
        <div className="form-heading"><div><span className="card-kicker">Step two</span><h2>Personalize my plan</h2></div><p>You can update these preferences later.</p></div>
        {Object.values(errors).some(Boolean) && <div className="form-summary" role="alert">Please check the highlighted information before continuing.</div>}
        <div className="section-stack">
          <Field label="Activity level" name="activity" error={errors.activity}><select id="activity" value={plan.activity} onChange={(e) => setPlan({ ...plan, activity: e.target.value })} aria-invalid={!!errors.activity}><option value="">Select your activity level</option>{activities.map((value) => <option key={value}>{value}</option>)}</select></Field>
          <fieldset className="choice-group"><legend>Primary goal *</legend><div className="choice-grid">{goals.map((goal) => <label className={`choice-card ${plan.goal === goal ? "is-selected" : ""}`} key={goal}><input type="radio" name="goal" checked={plan.goal === goal} onChange={() => setPlan({ ...plan, goal })} /><span>{goal}</span></label>)}</div>{errors.goal && <p className="field-error">{errors.goal}</p>}</fieldset>
          <div className="safety-grid">
            <section className="preference-panel allergy-panel"><div className="panel-heading"><span className="panel-icon">!</span><div><h3>Food allergies</h3><p>Allergies may require urgent avoidance.</p></div></div><div className="allergy-entry"><label><span>Allergy</span><input value={allergyName} onChange={(e) => setAllergyName(e.target.value)} placeholder="e.g. peanuts" /></label><label><span>Severity</span><select value={allergySeverity} onChange={(e) => setAllergySeverity(e.target.value)}><option>Mild</option><option>Moderate</option><option>Severe</option></select></label><button className="button button-secondary" type="button" onClick={addAllergy}>Add allergy</button></div>{errors.allergy && <p className="field-error">{errors.allergy}</p>}<div className="tag-list">{allergies.map((item, index) => <span className={`severity-tag severity-${item.severity.toLowerCase()}`} key={`${item.name}-${index}`}>{item.name} · {item.severity}<button type="button" aria-label={`Remove ${item.name}`} onClick={() => setAllergies(allergies.filter((_, i) => i !== index))}>×</button></span>)}</div></section>
            <section className="preference-panel intolerance-panel"><div className="panel-heading"><span className="panel-icon">i</span><div><h3>Food intolerances</h3><p>Intolerances usually cause digestive discomfort.</p></div></div><label><span>List any intolerances</span><textarea rows={4} value={plan.intolerances} onChange={(e) => setPlan({ ...plan, intolerances: e.target.value })} placeholder="e.g. lactose, gluten" /></label></section>
          </div>
          <fieldset className="choice-group"><legend>Dietary preferences</legend><p className="legend-help">Select all that apply.</p><div className="choice-grid dietary-grid">{diets.map((diet) => { const selected = plan.dietary.includes(diet); return <label className={`choice-card ${selected ? "is-selected" : ""}`} key={diet}><input type="checkbox" checked={selected} onChange={() => setPlan({ ...plan, dietary: selected ? plan.dietary.filter((value) => value !== diet) : [...plan.dietary, diet] })} /><span>{diet}</span></label>; })}</div></fieldset>
        </div>
        <div className="form-actions split-actions"><button className="button button-secondary" type="button" onClick={() => setStep(1)}>Back</button><div><button className="button button-quiet" type="button" onClick={skipPlan}>Skip for now</button><button className="button button-primary" type="submit">Create my plan</button></div></div>
      </form>}
    </div>
    <aside className="onboarding-aside"><div className="tip-illustration"><span>BW</span></div><span className="card-kicker">Healthy reminder</span><blockquote>{tips[tip]}</blockquote><div className="tip-dots" aria-label={`Tip ${tip + 1} of ${tips.length}`}>{tips.map((_, index) => <span className={tip === index ? "is-active" : ""} key={index} />)}</div><p>Your details help Bite Wise provide safer, more relevant recommendations while keeping the experience simple.</p></aside>
  </section>;
}

function Field({ label, name, error, helper, wide, children }: { label: string; name: string; error?: string; helper?: string; wide?: boolean; children: ReactNode }) {
  return <label className={`form-field ${wide ? "form-field-wide" : ""}`} htmlFor={name}><span className="field-label">{label} <span aria-hidden="true">*</span></span>{children}{error ? <small className="field-error">{error}</small> : helper && <small>{helper}</small>}</label>;
}
