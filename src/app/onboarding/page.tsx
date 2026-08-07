"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDatabase } from "@/services/auth/firebase";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [language, setLanguage] = useState("en");
 useEffect(() => {
  const browserLanguage = navigator.language?.split("-")[0] || "en";
  setLanguage(browserLanguage);
 }, []);
 const [activityLevel, setActivityLevel] = useState("");
 const [goal, setGoal] = useState("");
 const [allergies, setAllergies] = useState<
  { name: string; severity: "mild" | "moderate" | "severe" }[]
 >([]);
 const [intolerances, setIntolerances] = useState<string[]>([]);
 const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
 const [allergyName, setAllergyName] = useState("");
 const [allergySeverity, setAllergySeverity] = useState<
  "mild" | "moderate" | "severe"
 >("mild");

 const [intoleranceName, setIntoleranceName] = useState("");
 const [dietaryPreference, setDietaryPreference] = useState("");
 const heightNeedsConfirmation =
  height !== "" && (Number(height) < 100 || Number(height) > 230);

 const weightNeedsConfirmation =
  weight !== "" && (Number(weight) < 30 || Number(weight) > 250);
 const healthTips = [
  "Stay hydrated throughout the day.",
  "Small nutritional improvements lead to lasting habits.",
  "Balanced meals support sustained energy.",
 ];

 const [tipIndex, setTipIndex] = useState(0);

 useEffect(() => {
  const timer = setInterval(() => {
    setTipIndex((current) => (current + 1) % healthTips.length);
  }, 5000);

  return () => clearInterval(timer);
 }, []);
 const [errors, setErrors] = useState<Record<string, string>>({});
 function validateStepOne() {
  const nextErrors: Record<string, string> = {};

  if (!age) nextErrors.age = "Please enter your age.";
  if (!sex) nextErrors.sex = "Please select your biological sex.";
  if (!height) nextErrors.height = "Please enter your height in centimeters.";
  if (!weight) nextErrors.weight = "Please enter your weight in kilograms.";
  if (!language) nextErrors.language = "Please select your preferred language.";

  setErrors(nextErrors);

  return Object.keys(nextErrors).length === 0;
 } 
 function goToStepTwo() {
  if (!validateStepOne()) {
    return;
  }

  setErrors({});
  setStep(2);
 }

 function getSelectedValue(selected: string, other: string) {
  return selected === "Other" ? other.trim() : selected.trim();
}

function addAllergy() {
  const name = getSelectedValue(allergyName, otherAllergy);

  if (!name) return;

  const alreadyAdded = allergies.some(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (!alreadyAdded) {
    setAllergies((current) => [
      ...current,
      {
        name,
        severity: allergySeverity,
      },
    ]);
  }

  setAllergyName("");
  setOtherAllergy("");
  setAllergySeverity("mild");
}

function addIntolerance() {
  const name = getSelectedValue(intoleranceName, otherIntolerance);

  if (!name) return;

  const alreadyAdded = intolerances.some(
    (item) => item.toLowerCase() === name.toLowerCase()
  );

  if (!alreadyAdded) {
    setIntolerances((current) => [...current, name]);
  }

  setIntoleranceName("");
  setOtherIntolerance("");
}

function addDietaryPreference() {
  const preference = getSelectedValue(
    dietaryPreference,
    otherDietaryPreference
  );

  if (!preference) return;

  const alreadyAdded = dietaryPreferences.some(
    (item) => item.toLowerCase() === preference.toLowerCase()
  );

  if (!alreadyAdded) {
    setDietaryPreferences((current) => [...current, preference]);
  }

  setDietaryPreference("");
  setOtherDietaryPreference("");
}
 function validateStepTwo() {
  const nextErrors: Record<string, string> = {};

  if (!activityLevel) {
    nextErrors.activityLevel = "Please select your activity level.";
  }

  if (!goal) {
    nextErrors.goal = "Please select your primary goal.";
  }

  setErrors(nextErrors);

  return Object.keys(nextErrors).length === 0;
 }

 async function completeOnboarding() {
  if (!validateStepTwo()) {
    return;
  }

  const auth = getFirebaseAuth();
  const db = getFirebaseDatabase();
  const user = auth?.currentUser;

  if (!user || !db) {
    setErrors({
      form: "We could not save your profile. Please sign in again.",
    });
    return;
  }

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        age: Number(age),
        sex,
        height: Number(height),
        weight: Number(weight),
        language,
        activityLevel,
        goal,
        allergies,
        intolerances,
        dietaryPreferences,
        onboardingComplete: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    setErrors({});
    router.push("/dashboard");
  } catch {
    setErrors({
      form: "We could not save your profile. Please try again.",
    });
  }
 }
 const [otherAllergy, setOtherAllergy] = useState("");
 const [otherIntolerance, setOtherIntolerance] = useState("");
 const [otherDietaryPreference, setOtherDietaryPreference] = useState("");
 async function skipOnboarding() {
  const auth = getFirebaseAuth();
  const db = getFirebaseDatabase();
  const user = auth?.currentUser;

  if (!user || !db) {
    setErrors({
      form: "We could not save your profile. Please sign in again.",
    });
    return;
  }

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        age: age ? Number(age) : null,
        sex: sex || null,
        height: height ? Number(height) : null,
        weight: weight ? Number(weight) : null,
        language,
        onboardingComplete: false,
        onboardingSkipped: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    router.push("/dashboard");
  } catch {
    setErrors({
      form: "We could not save your profile. Please try again.",
    });
  }
 }

  return (
  <main className="onboarding-page">
    <section className="onboarding-card">
      <div className="onboarding-progress">
        <div className="onboarding-progress-track">
          <div
            className="onboarding-progress-fill"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
        <p>Step {step} of 2</p>
      </div>

      <div className="health-tip">
        <strong>Health tip</strong>
        <p>{healthTips[tipIndex]}</p>
      </div>

      {errors.form && (
        <p className="form-error">{errors.form}</p>
      )}

      {step === 1 && (
        <div className="onboarding-step">
          <div className="onboarding-heading">
            <span className="eyebrow">Your profile</span>
            <h1>Tell us about yourself</h1>
            <p>
              This information helps Bite Wise personalise your nutrition
              guidance.
            </p>
          </div>

          <div className="onboarding-grid">
            <label>
              <span>Age</span>
              <input
                type="number"
                value={age}
                onChange={(event) => setAge(event.target.value)}
                className={errors.age ? "input-error" : ""}
              />
              {errors.age && (
                <small className="field-error">{errors.age}</small>
              )}
            </label>

            <label>
              <span>Biological sex</span>
              <select
                value={sex}
                onChange={(event) => setSex(event.target.value)}
                className={errors.sex ? "input-error" : ""}
              >
                <option value="">Please select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              {errors.sex && (
                <small className="field-error">{errors.sex}</small>
              )}
            </label>

            <label>
              <span>Height (cm)</span>
              <input
                type="number"
                value={height}
                onChange={(event) => setHeight(event.target.value)}
                className={errors.height ? "input-error" : ""}
              />
              {errors.height && (
                <small className="field-error">{errors.height}</small>
              )}
              {heightNeedsConfirmation && (
                <small className="soft-warning">
                  This value appears unusually high or low. Please confirm it is
                  correct.
                </small>
              )}
            </label>

            <label>
              <span>Weight (kg)</span>
              <input
                type="number"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                className={errors.weight ? "input-error" : ""}
              />
              {errors.weight && (
                <small className="field-error">{errors.weight}</small>
              )}
              {weightNeedsConfirmation && (
                <small className="soft-warning">
                  This value appears unusually high or low. Please confirm it is
                  correct.
                </small>
              )}
            </label>

            <label className="full-width">
              <span>Preferred language</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className={errors.language ? "input-error" : ""}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="pt">Portuguese</option>
              </select>
              {errors.language && (
                <small className="field-error">{errors.language}</small>
              )}
            </label>
          </div>

          <div className="onboarding-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={goToStepTwo}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="onboarding-step">
          <div className="onboarding-heading">
            <span className="eyebrow">Personalise my plan</span>
            <h1>Tell us what matters to you</h1>
            <p>
              These preferences help Bite Wise make safer and more relevant
              recommendations.
            </p>
          </div>

          <div className="onboarding-grid">
            <label>
              <span>Activity level</span>
              <select
                value={activityLevel}
                onChange={(event) => setActivityLevel(event.target.value)}
                className={errors.activityLevel ? "input-error" : ""}
              >
                <option value="">Please select</option>
                <option value="sedentary">Sedentary</option>
                <option value="lightly-active">Lightly Active</option>
                <option value="moderately-active">Moderately Active</option>
                <option value="very-active">Very Active</option>
                <option value="athlete">Athlete</option>
              </select>
              {errors.activityLevel && (
                <small className="field-error">
                  {errors.activityLevel}
                </small>
              )}
            </label>

            <label>
              <span>Primary goal</span>
              <select
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                className={errors.goal ? "input-error" : ""}
              >
                <option value="">Please select</option>
                <option value="lose-weight">Lose Weight</option>
                <option value="maintain-weight">Maintain Weight</option>
                <option value="gain-weight">Gain Weight</option>
              </select>
              {errors.goal && (
                <small className="field-error">{errors.goal}</small>
              )}
            </label>
          </div>

          <section className="profile-section allergy-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">High-risk allergies</span>
                <h2>Food allergies</h2>
                <p>
                  Add any food allergies and select the appropriate severity.
                </p>
              </div>
            </div>

            <div className="allergy-entry-row">
       <select
  value={allergyName}
  onChange={(event) => setAllergyName(event.target.value)}
 >
  <option value="">Select food allergy</option>
  <option value="Peanuts">Peanuts</option>
  <option value="Tree Nuts">Tree Nuts</option>
  <option value="Milk">Milk</option>
  <option value="Eggs">Eggs</option>
  <option value="Fish">Fish</option>
  <option value="Shellfish">Shellfish</option>
  <option value="Soy">Soy</option>
  <option value="Wheat">Wheat</option>
  <option value="Sesame">Sesame</option>
  <option value="Other">Other</option>
 </select>
 {allergyName === "Other" && (
  <input
    type="text"
    value={otherAllergy}
    onChange={(event) => setOtherAllergy(event.target.value)}
    placeholder="Please specify your allergy"
  />
 )}
              <select
                value={allergySeverity}
                onChange={(event) =>
                  setAllergySeverity(
                    event.target.value as "mild" | "moderate" | "severe"
                  )
                }
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>

              <button
                type="button"
                className="button button-secondary"
                onClick={addAllergy}
              >
                Add allergy
              </button>
            </div>

            {allergies.length > 0 && (
              <div className="tag-list">
                {allergies.map((allergy, index) => (
                  <span
                    className={`profile-tag allergy-tag ${allergy.severity}`}
                    key={`${allergy.name}-${index}`}
                  >
                    {allergy.name} · {allergy.severity}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="profile-section intolerance-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Food sensitivities</span>
                <h2>Food intolerances</h2>
                <p>
                  Add foods or ingredients that cause discomfort or intolerance.
                </p>
              </div>
            </div>

            <div className="simple-entry-row">
              <select
  value={intoleranceName}
  onChange={(event) => setIntoleranceName(event.target.value)}
 >
  <option value="">Select food intolerance</option>
  <option value="Lactose">Lactose</option>
  <option value="Gluten">Gluten</option>
  <option value="Fructose">Fructose</option>
  <option value="Histamine">Histamine</option>
  <option value="Caffeine">Caffeine</option>
  <option value="Other">Other</option>
 </select>
 {intoleranceName === "Other" && (
  <input
    type="text"
    value={otherIntolerance}
    onChange={(event) => setOtherIntolerance(event.target.value)}
    placeholder="Please specify your food intolerance"
  />
 )}

              <button
                type="button"
                className="button button-secondary"
                onClick={addIntolerance}
              >
                Add intolerance
              </button>
            </div>

            {intolerances.length > 0 && (
              <div className="tag-list">
                {intolerances.map((item, index) => (
                  <span
                    className="profile-tag intolerance-tag"
                    key={`${item}-${index}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="profile-section dietary-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Dietary preferences</span>
                <h2>How do you prefer to eat?</h2>
                <p>
                  Examples include Vegetarian, Vegan, Halal,
                  Diabetic-Friendly, or Gluten-Free.
                </p>
              </div>
            </div>

            <div className="simple-entry-row">
             <select
  value={dietaryPreference}
  onChange={(event) => setDietaryPreference(event.target.value)}
 >
  <option value="">Select dietary preference</option>
  <option value="Vegetarian">Vegetarian</option>
  <option value="Vegan">Vegan</option>
  <option value="Halal">Halal</option>
  <option value="Diabetic-Friendly">Diabetic-Friendly</option>
  <option value="Gluten-Free">Gluten-Free</option>
  <option value="Dairy-Free">Dairy-Free</option>
  <option value="Low-Sodium">Low-Sodium</option>
  <option value="Other">Other</option>
 </select>
 {dietaryPreference === "Other" && (
  <input
    type="text"
    value={otherDietaryPreference}
    onChange={(event) => setOtherDietaryPreference(event.target.value)}
    placeholder="Please specify"
  />
 )}
              <button
                type="button"
                className="button button-secondary"
                onClick={addDietaryPreference}
              >
                Add preference
              </button>
            </div>

            {dietaryPreferences.length > 0 && (
              <div className="tag-list">
                {dietaryPreferences.map((item, index) => (
                  <span
                    className="profile-tag dietary-tag"
                    key={`${item}-${index}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </section>

          <div className="onboarding-actions split">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setStep(1)}
            >
              Back
            </button>

            <div className="onboarding-action-group">
              <button
                type="button"
                className="button button-text"
                onClick={skipOnboarding}              >
                Skip for Now
              </button>

              <button
                type="button"
                className="button button-primary"
                onClick={completeOnboarding}
              >
                Finish setup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  </main>
)}