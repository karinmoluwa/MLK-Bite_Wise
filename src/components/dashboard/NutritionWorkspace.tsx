"use client";

import {
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  Cuisine,
  MacroKey,
  MealCandidate,
  MealSource,
  SavedMeal,
} from "@/domain/nutrition/models";

import {
  analyseMeal,
  commonMeals,
} from "@/services/meals/meal-analysis";

import {
  additionalMeals,
  ingredientReferences,
} from "@/services/meals/additionalfood";

type View = "dashboard" | "log" | "confirm" | "favourites";
type Method = "image" | "text" | "voice";

const allMeals: MealCandidate[] = [
  ...commonMeals,
  ...additionalMeals,
] as MealCandidate[];

function getClosestMeals(query: string, limit = 3): MealCandidate[] {
  const search = query.trim().toLowerCase();

  if (search.length < 2) {
    return [];
  }

  return allMeals
    .map((meal) => {
      const name = meal.name.toLowerCase();

      const aliases =
        "aliases" in meal && Array.isArray(meal.aliases)
          ? meal.aliases
              .filter(
                (alias): alias is string =>
                  typeof alias === "string"
              )
              .map((alias) => alias.toLowerCase())
          : [];

      let score = 0;

      if (name === search) {
        score += 100;
      } else if (name.startsWith(search)) {
        score += 60;
      } else if (name.includes(search)) {
        score += 40;
      }

      aliases.forEach((alias) => {
        if (alias === search) {
          score += 80;
        } else if (alias.startsWith(search)) {
          score += 50;
        } else if (alias.includes(search)) {
          score += 30;
        }
      });

      search
        .split(/\s+/)
        .filter(Boolean)
        .forEach((word) => {
          if (word.length > 1 && name.includes(word)) {
            score += 10;
          }

          if (
            word.length > 1 &&
            aliases.some((alias) => alias.includes(word))
          ) {
            score += 8;
          }
        });

      return {
        meal,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.meal);
}

const macroData: Record<
  MacroKey,
  {
    current: number;
    goal: number;
    unit: string;
    colour: string;
  }
> = {
  Protein: {
    current: 82,
    goal: 110,
    unit: "g",
    colour: "#176f45",
  },
  Carbohydrates: {
    current: 168,
    goal: 240,
    unit: "g",
    colour: "#d6a33b",
  },
  Fat: {
    current: 54,
    goal: 70,
    unit: "g",
    colour: "#4f78a8",
  },
};

const initialReminders: {
  id: number;
  title: string;
  text: string;
}[] = [];

const initialNotifications: {
  id: number;
  title: string;
  text: string;
  unread: boolean;
}[] = [];

export function NutritionWorkspace() {
  const [view, setView] = useState<View>("dashboard");
  const [cuisine, setCuisine] =
    useState<Cuisine>("Nigerian Cuisine");

  const [method, setMethod] = useState<Method>("text");
  const [macro, setMacro] = useState<MacroKey>("Protein");

  const [reminders, setReminders] =
    useState(initialReminders);

  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [query, setQuery] = useState("");

  const [suggestions, setSuggestions] =
    useState<MealCandidate[]>([]);

  const [selected, setSelected] =
    useState<MealCandidate | null>(null);

  const [savedMeals, setSavedMeals] =
    useState<SavedMeal[]>([]);

  const [voiceSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window ||
        "webkitSpeechRecognition" in window)
  );

  const [voiceExampleSeen, setVoiceExampleSeen] =
    useState(false);

  const [status, setStatus] = useState("");

  const searchResults = useMemo(
    () => getClosestMeals(query, 3),
    [query]
  );

  const consumed = savedMeals.reduce(
    (total, meal) =>
      total + meal.nutrients.calories,
    0
  );

  const goal = 2100;
  const remaining = goal - consumed;

  const caloriePercent =
    goal > 0
      ? Math.min(
          100,
          Math.round((consumed / goal) * 100)
        )
      : 0;

  const chooseCandidate = (
    candidate: MealCandidate
  ) => {
    setSelected(candidate);
    setView("confirm");
    setStatus("");
  };

  const runAnalysis = () => {
    setSuggestions(analyseMeal(cuisine));
    setStatus(
      "Analysis complete. Select the closest meal match."
    );
  };

  const saveMeal = (
    mealToSave: MealCandidate,
    source: MealSource = method
  ) => {
    const savedMeal: SavedMeal = {
      ...mealToSave,
      source,
      savedAt: new Date().toISOString(),
      pinned: false,
    };

    setSavedMeals((items) => [
      savedMeal,
      ...items,
    ]);

    setStatus(
      `${mealToSave.name} was saved to Meal History.`
    );

    setView("dashboard");
    setSelected(null);
    setSuggestions([]);
  };

  return (
    <div className="nutrition-app">
      <div className="workspace-toolbar">
        <div
          className="view-tabs"
          aria-label="Workspace sections"
        >
          <button
            type="button"
            className={
              view === "dashboard"
                ? "is-current"
                : ""
            }
            onClick={() =>
              setView("dashboard")
            }
          >
            Dashboard
          </button>

          <button
            type="button"
            className={
              view === "log" ||
              view === "confirm"
                ? "is-current"
                : ""
            }
            onClick={() => setView("log")}
          >
            Log meal
          </button>

          <button
            type="button"
            className={
              view === "favourites"
                ? "is-current"
                : ""
            }
            onClick={() =>
              setView("favourites")
            }
          >
            Favourites
          </button>
        </div>

        <label className="cuisine-control">
          Cuisine

          <select
            value={cuisine}
            onChange={(event) =>
              setCuisine(
                event.target.value as Cuisine
              )
            }
          >
            <option>Nigerian Cuisine</option>
            <option>
              International Cuisine
            </option>
          </select>
        </label>
      </div>

      <section
        className="workspace-search"
        aria-label="Global search"
      >
        <label>
          <span className="sr-only">
            Search Bite Wise
          </span>

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search meals and ingredients"
          />
        </label>

        {searchResults.length > 0 && (
          <div className="search-suggestions">
            {searchResults.map((meal) => (
              <button
                type="button"
                key={meal.id}
                onClick={() =>
                  chooseCandidate(meal)
                }
              >
                <strong>{meal.name}</strong>

                <span>
                  {meal.nutrients.calories} kcal
                  {" · "}
                  {meal.serving}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {status && (
        <div
          className="status-banner"
          role="status"
        >
          {status}

          <button
            type="button"
            onClick={() => setStatus("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {view === "dashboard" && (
        <Dashboard
          caloriePercent={caloriePercent}
          consumed={consumed}
          goal={goal}
          remaining={remaining}
          macro={macro}
          setMacro={setMacro}
          reminders={reminders}
          dismissReminder={(id: number) =>
            setReminders((items) =>
              items.filter(
                (item) => item.id !== id
              )
            )
          }
          notifications={notifications}
          markRead={(id: number) =>
            setNotifications((items) =>
              items.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      unread: false,
                    }
                  : item
              )
            )
          }
          cuisine={cuisine}
          onLog={() => setView("log")}
          onPick={chooseCandidate}
        />
      )}

      {view === "log" && (
        <MealLogger
          method={method}
          setMethod={setMethod}
          cuisine={cuisine}
          setCuisine={setCuisine}
          suggestions={suggestions}
          runAnalysis={runAnalysis}
          chooseCandidate={chooseCandidate}
          voiceSupported={voiceSupported}
          voiceExampleSeen={voiceExampleSeen}
          setVoiceExampleSeen={
            setVoiceExampleSeen
          }
        />
      )}

      {view === "confirm" && selected && (
        <MealConfirmation
          meal={selected}
          setMeal={setSelected}
          alternatives={suggestions}
          onCancel={() => {
            setSelected(null);
            setView("log");
          }}
          onSave={(confirmedMeal) =>
            saveMeal(confirmedMeal)
          }
        />
      )}

      {view === "favourites" && (
        <Favourites
          savedMeals={savedMeals}
          setSavedMeals={setSavedMeals}
          chooseCandidate={chooseCandidate}
        />
      )}
    </div>
  );
}

function Dashboard(props: any) {
  const macroInfo =
    macroData[props.macro as MacroKey];

  const circumference =
    2 * Math.PI * 54;

  const offset =
    circumference -
    (props.caloriePercent / 100) *
      circumference;

  return (
    <div className="dashboard-content">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">
            Daily overview
          </span>

          <h1>
            Your nutrition at a glance
          </h1>

          <p>
            Your dashboard will update as
            you log meals and complete your
            profile.
          </p>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={props.onLog}
        >
          + Log a meal
        </button>
      </div>

      {props.consumed === 0 ? (
        <section className="dashboard-card">
          <h2>No meals logged yet</h2>

          <p>
            Log your first meal to begin
            seeing calories, nutrition
            statistics, insights, and
            recommendations.
          </p>

          <button
            type="button"
            className="button button-primary"
            onClick={props.onLog}
          >
            Log your first meal
          </button>
        </section>
      ) : (
        <>
          <div className="dashboard-primary-grid">
            <article className="dashboard-card calorie-card">
              <div>
                <span className="card-kicker">
                  Daily nutrition
                </span>

                <h2>Calories</h2>

                <p>
                  Calculated from the meals
                  you have logged.
                </p>
              </div>

              <div className="calorie-gauge">
                <svg
                  viewBox="0 0 128 128"
                  role="img"
                  aria-label={`${props.caloriePercent}% of calorie goal consumed`}
                >
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="gauge-track"
                  />

                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="gauge-progress"
                    strokeDasharray={
                      circumference
                    }
                    strokeDashoffset={
                      offset
                    }
                  />
                </svg>

                <div>
                  <strong>
                    {props.consumed.toLocaleString()}
                  </strong>

                  <span>
                    kcal consumed
                  </span>
                </div>
              </div>

              <div className="calorie-summary">
                <span>
                  <strong>
                    {props.remaining}
                  </strong>{" "}
                  remaining
                </span>

                <span>
                  <strong>
                    {props.goal.toLocaleString()}
                  </strong>{" "}
                  daily goal
                </span>
              </div>
            </article>

            <article className="dashboard-card macro-card">
              <div className="card-heading">
                <div>
                  <span className="card-kicker">
                    Macronutrients
                  </span>

                  <h2>
                    Today&apos;s distribution
                  </h2>
                </div>
              </div>

              <div className="macro-layout">
                <div
                  className="macro-pie"
                  role="img"
                  aria-label="Macronutrient distribution"
                >
                  <span>
                    Daily
                    <br />
                    mix
                  </span>
                </div>

                <div className="macro-buttons">
                  {Object.entries(
                    macroData
                  ).map(
                    ([name, item]) => (
                      <button
                        type="button"
                        key={name}
                        className={
                          props.macro ===
                          name
                            ? "is-selected"
                            : ""
                        }
                        onMouseEnter={() =>
                          props.setMacro(
                            name
                          )
                        }
                        onClick={() =>
                          props.setMacro(
                            name
                          )
                        }
                      >
                        <i
                          style={{
                            background:
                              item.colour,
                          }}
                        />

                        <span>
                          {name}
                        </span>

                        <strong>
                          {item.current}
                          {item.unit}
                        </strong>
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="macro-detail">
                <strong>
                  {props.macro}
                </strong>

                <span>
                  Current{" "}
                  {macroInfo.current}
                  {macroInfo.unit}
                </span>

                <span>
                  Recommended{" "}
                  {macroInfo.goal}
                  {macroInfo.unit}
                </span>

                <span>
                  Remaining{" "}
                  {macroInfo.goal -
                    macroInfo.current}
                  {macroInfo.unit}
                </span>
              </div>
            </article>
          </div>

          <section>
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  Quick statistics
                </span>

                <h2>
                  Today&apos;s activity
                </h2>
              </div>
            </div>

            <div className="stats-grid">
              <article className="stat-card">
                <span>
                  Calories consumed
                </span>

                <strong>
                  {props.consumed} kcal
                </strong>

                <p>
                  Calculated from your
                  logged meals
                </p>
              </article>

              <article className="stat-card">
                <span>
                  Remaining calories
                </span>

                <strong>
                  {props.remaining} kcal
                </strong>

                <p>
                  Based on your current
                  daily goal
                </p>
              </article>
            </div>
          </section>

          <div className="dashboard-secondary-grid">
            <section className="dashboard-card">
              <div className="section-heading compact">
                <div>
                  <span className="eyebrow">
                    Nutrition insights
                  </span>

                  <h2>Insights</h2>
                </div>
              </div>

              <p className="empty-message">
                More detailed insights will
                appear as you continue
                logging meals.
              </p>
            </section>

            <section className="dashboard-card">
              <div className="section-heading compact">
                <div>
                  <span className="eyebrow">
                    Recommended meals
                  </span>

                  <h2>
                    Ideas that fit your day
                  </h2>
                </div>
              </div>

              <div className="meal-recommendations">
                {allMeals
  .slice(0, 3)
  .map((meal) => (
                    <button
                      type="button"
                      key={meal.id}
                      onClick={() =>
                        props.onPick(meal)
                      }
                    >
                      <span
                        className="meal-thumb"
                        aria-hidden="true"
                      >
                        {meal.name
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>

                      <span>
                        <strong>
                          {meal.name}
                        </strong>

                        <small>
                          {
                            meal.nutrients
                              .calories
                          }{" "}
                          kcal ·{" "}
                          {meal.serving}
                        </small>
                      </span>

                      <b>+</b>
                    </button>
                  ))}
              </div>
            </section>
          </div>
        </>
      )}

      <div className="dashboard-secondary-grid">
        <section className="dashboard-card">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">
                Reminders
              </span>

              <h2>
                Helpful next steps
              </h2>
            </div>
          </div>

          {props.reminders.length ? (
            <div className="reminder-list">
              {props.reminders.map(
                (item: any) => (
                  <div key={item.id}>
                    <span aria-hidden="true">
                      ✓
                    </span>

                    <p>
                      <strong>
                        {item.title}
                      </strong>

                      <small>
                        {item.text}
                      </small>
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        props.dismissReminder(
                          item.id
                        )
                      }
                      aria-label={`Dismiss ${item.title}`}
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="empty-message">
              No reminders yet.
            </p>
          )}
        </section>

        <section className="dashboard-card">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">
                Notifications
              </span>

              <h2>
                Recent updates
              </h2>
            </div>
          </div>

          {props.notifications.length ? (
            <div className="notification-list">
              {props.notifications.map(
                (item: any) => (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      item.unread
                        ? "unread"
                        : ""
                    }
                    onClick={() =>
                      props.markRead(item.id)
                    }
                  >
                    <span className="notification-dot" />

                    <span>
                      <strong>
                        {item.title}
                      </strong>

                      <small>
                        {item.text}
                      </small>
                    </span>
                  </button>
                )
              )}
            </div>
          ) : (
            <p className="empty-message">
              No notifications yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function MealLogger(props: any) {
  const [textQuery, setTextQuery] =
    useState("");

 const filtered = textQuery.trim()
  ? getClosestMeals(textQuery, 3)
  : allMeals.slice(0, 3);

  return (
    <div className="logger-page">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">
            Meal logging
          </span>

          <h1>
            How would you like to log your
            meal?
          </h1>

          <p>
            Every method ends with a review
            screen before anything is saved.
          </p>
        </div>
      </div>

      <div className="logger-controls">
        <label>
          Cuisine

          <select
            value={props.cuisine}
            onChange={(event) =>
              props.setCuisine(
                event.target.value
              )
            }
          >
            <option>
              Nigerian Cuisine
            </option>

            <option>
              International Cuisine
            </option>
          </select>
        </label>

        <div className="method-tabs">
          {[
            ["image", "Image"],
            ["text", "Text"],
            ["voice", "Voice"],
          ].map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={
                props.method === id
                  ? "is-selected"
                  : ""
              }
              onClick={() =>
                props.setMethod(id)
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {props.method === "image" && (
        <section className="logging-panel">
          <div className="upload-zone">
            <span className="upload-icon">
              IM
            </span>

            <h2>
              Upload or capture your meal
            </h2>

            <p>
              Use a clear, well-lit image
              showing the full plate.
            </p>

            <div>
              <label className="button button-primary">
                Choose image

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={
                    props.runAnalysis
                  }
                />
              </label>

              <button
                type="button"
                className="button button-secondary"
                onClick={
                  props.runAnalysis
                }
              >
                Use webcam
              </button>
            </div>

            <small>
              If camera access is
              unavailable, image upload
              remains available.
            </small>
          </div>

          <CandidateList
            items={props.suggestions}
            onPick={
              props.chooseCandidate
            }
          />
        </section>
      )}

      {props.method === "text" && (
        <section className="logging-panel">
          <div className="text-search">
            <label>
              <span>
                Search or describe a meal
              </span>

              <input
                value={textQuery}
                onChange={(event) =>
                  setTextQuery(
                    event.target.value
                  )
                }
                placeholder="e.g. jollof rice with grilled chicken"
              />
            </label>

            <button
              type="button"
              className="button button-primary"
              onClick={() =>
                props.runAnalysis()
              }
            >
              Analyse description
            </button>
          </div>

          <div className="section-heading compact">
            <div>
              <span className="eyebrow">
                Food search
              </span>

              <h2>
                {textQuery.trim()
                  ? "Closest matches"
                  : "Commonly logged meals"}
              </h2>
            </div>
          </div>

          <div className="common-meal-grid">
            {filtered.map((meal) => (
              <button
                type="button"
                key={meal.id}
                onClick={() =>
                  props.chooseCandidate(
                    meal
                  )
                }
              >
                <strong>
                  {meal.name}
                </strong>

                <span>
                  {meal.serving}
                </span>

                <small>
                  {
                    meal.nutrients
                      .calories
                  }{" "}
                  kcal
                </small>

                {"macroCategory" in meal &&
                  typeof meal.macroCategory ===
                    "string" && (
                    <span
                      className={`macro-category ${meal.macroCategory.toLowerCase()}`}
                    >
                      {
                        meal.macroCategory
                      }
                    </span>
                  )}
              </button>
            ))}
          </div>

          {textQuery
            .toLowerCase()
            .includes("jollof") &&
            commonMeals[0] && (
              <div className="variation-panel">
                <strong>
                  Jollof Rice variations
                </strong>

                <div>
                  {[
                    "Party Jollof",
                    "Homemade Jollof",
                    "Village Jollof",
                  ].map(
                    (variation) => (
                      <button
                        type="button"
                        key={variation}
                        onClick={() =>
                          props.chooseCandidate(
                            {
                              ...commonMeals[0],
                              id: variation,
                              name: variation,
                            }
                          )
                        }
                      >
                        {variation}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

          <CandidateList
            items={props.suggestions}
            onPick={
              props.chooseCandidate
            }
          />

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                Ingredient reference
              </span>

              <h2>Cooking oils</h2>

              <p>
                Estimated calories per
                tablespoon.
              </p>
            </div>
          </div>

          <div className="ingredient-reference-grid">
            {ingredientReferences.oils.map(
              (oil) => (
                <article
                  className="ingredient-reference-card"
                  key={oil.id}
                >
                  <strong>
                    {oil.name}
                  </strong>

                  <span>
                    {oil.serving}
                  </span>

                  <span className="ingredient-calories">
                    {oil.calories} kcal
                  </span>

                  <small>
                    <strong>
                      Primary fat:
                    </strong>{" "}
                    {
                      oil.primaryFatType
                    }
                  </small>

                  <small>
                    <strong>
                      Smoke point:
                    </strong>{" "}
                    {oil.smokePoint}
                  </small>

                  <small>
                    <strong>
                      Best use:
                    </strong>{" "}
                    {oil.bestUse}
                  </small>
                </article>
              )
            )}
          </div>

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                Ingredient reference
              </span>

              <h2>
                Spices &amp; seasonings
              </h2>

              <p>
                Estimated calories based on
                the listed spoon weight.
              </p>
            </div>
          </div>

          <div className="ingredient-reference-grid">
            {ingredientReferences.spices.map(
              (spice) => (
                <article
                  className="ingredient-reference-card"
                  key={spice.id}
                >
                  <span className="card-kicker">
                    Tier {spice.tier}
                  </span>

                  <strong>
                    {spice.name}
                  </strong>

                  <span>
                    Approx.{" "}
                    {
                      spice.approximateWeightGrams
                    }{" "}
                    g
                  </span>

                  <span className="ingredient-calories">
                    {spice.calories} kcal
                  </span>

                  <small>
                    {spice.tierName}
                  </small>
                </article>
              )
            )}
          </div>
        </section>
      )}

      {props.method === "voice" && (
        <section className="logging-panel">
          {!props.voiceExampleSeen && (
            <div className="voice-example">
              <button
                type="button"
                onClick={() =>
                  props.setVoiceExampleSeen(
                    true
                  )
                }
                aria-label="Dismiss example"
              >
                ×
              </button>

              <strong>
                Try saying:
              </strong>

              <p>
                “I ate one serving of jollof
                rice with grilled chicken
                and a small bottle of orange
                juice.”
              </p>
            </div>
          )}

          <div className="voice-zone">
            <span className="voice-pulse">
              VO
            </span>

            <h2>
              {props.voiceSupported
                ? "Describe your meal naturally"
                : "Voice recognition is unavailable"}
            </h2>

            <p>
              {props.voiceSupported
                ? "We will convert your speech to text, then ask you to confirm the meal."
                : "Upload an audio recording instead. Core meal logging remains available."}
            </p>

            <button
              type="button"
              className="button button-primary"
              onClick={
                props.runAnalysis
              }
            >
              {props.voiceSupported
                ? "Start recording"
                : "Upload audio"}
            </button>
          </div>

          <CandidateList
            items={props.suggestions}
            onPick={
              props.chooseCandidate
            }
          />
        </section>
      )}
    </div>
  );
}

function CandidateList({
  items,
  onPick,
}: {
  items: MealCandidate[];
  onPick: (
    meal: MealCandidate
  ) => void;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="candidate-list">
      <h2>Possible matches</h2>

      {items.slice(0, 3).map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => onPick(item)}
        >
          <span>
            <strong>
              {item.name}
            </strong>

            <small>
              {item.serving} ·{" "}
              {item.nutrients.calories} kcal
            </small>
          </span>

          <b>
            {item.confidence}% match
          </b>
        </button>
      ))}
    </div>
  );
}

function MealConfirmation({
  meal,
  setMeal,
  alternatives,
  onCancel,
  onSave,
}: {
  meal: MealCandidate;
  setMeal: (
    meal: MealCandidate
  ) => void;
  alternatives: MealCandidate[];
  onCancel: () => void;
  onSave: (
    meal: MealCandidate
  ) => void;
}) {
  const [servings, setServings] =
    useState(1);

  const scaledMeal: MealCandidate = {
    ...meal,
    serving: `${servings} × ${meal.serving}`,
    nutrients: {
      ...meal.nutrients,
      calories: Math.round(
        meal.nutrients.calories *
          servings
      ),
      protein:
        meal.nutrients.protein *
        servings,
      carbohydrates:
        meal.nutrients
          .carbohydrates * servings,
      fat:
        meal.nutrients.fat *
        servings,
      fibre:
        meal.nutrients.fibre *
        servings,
    },
  };

  return (
    <div className="confirmation-page">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">
            Meal confirmation
          </span>

          <h1>
            Review before saving
          </h1>

          <p>
            No meal is stored until you
            explicitly confirm it.
          </p>
        </div>
      </div>

      <div className="confirmation-grid">
        <section className="dashboard-card meal-review">
          <div className="meal-review-image">
            {meal.name
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <span className="card-kicker">
              Detected meal
            </span>

            <input
              className="meal-name-input"
              value={meal.name}
              onChange={(event) =>
                setMeal({
                  ...meal,
                  name:
                    event.target.value,
                })
              }
            />

            <p>
              {meal.estimated
                ? "Nutrition values are estimated because an exact USDA match was unavailable."
                : "Nutrition values use the closest USDA FoodData Central match."}
            </p>

            <div className="portion-control">
              <span className="portion-label">
                Portion
              </span>

              <div className="portion-stepper">
                <button
                  type="button"
                  className="portion-button"
                  onClick={() =>
                    setServings(
                      (current) =>
                        Math.max(
                          0.5,
                          Number(
                            (
                              current -
                              0.5
                            ).toFixed(
                              1
                            )
                          )
                        )
                    )
                  }
                  disabled={
                    servings <= 0.5
                  }
                  aria-label="Reduce portion"
                >
                  −
                </button>

                <div className="portion-value">
                  <strong>
                    {servings}
                  </strong>

                  <span>
                    {servings === 1
                      ? "portion"
                      : "portions"}
                  </span>
                </div>

                <button
                  type="button"
                  className="portion-button"
                  onClick={() =>
                    setServings(
                      (current) =>
                        Number(
                          (
                            current +
                            0.5
                          ).toFixed(
                            1
                          )
                        )
                    )
                  }
                  aria-label="Increase portion"
                >
                  +
                </button>
              </div>

              <small>
                {Math.round(
                  servings * 100
                )}
                % of the standard serving
              </small>
            </div>
          </div>
        </section>

        <aside className="dashboard-card nutrition-summary">
          <span className="card-kicker">
            Nutritional summary
          </span>

          <strong className="calorie-total">
            {
              scaledMeal.nutrients
                .calories
            }{" "}
            kcal
          </strong>

          {[
            [
              "Protein",
              scaledMeal.nutrients
                .protein,
            ],
            [
              "Carbohydrates",
              scaledMeal.nutrients
                .carbohydrates,
            ],
            [
              "Fat",
              scaledMeal.nutrients.fat,
            ],
            [
              "Fibre",
              scaledMeal.nutrients
                .fibre,
            ],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <span>
                {String(label)}
              </span>

              <strong>
                {Math.round(
                  Number(value)
                )}{" "}
                g
              </strong>
            </div>
          ))}

          <div>
            <span>Confidence</span>

            <strong>
              {meal.confidence}%
            </strong>
          </div>
        </aside>
      </div>

      <div className="safety-summary">
        <div>
          <strong>
            Detected allergens
          </strong>

          <span>
            {meal.allergens.length
              ? meal.allergens.join(
                  ", "
                )
              : "None detected"}
          </span>
        </div>

        <div>
          <strong>
            Food intolerances
          </strong>

          <span>
            {meal.intolerances.length
              ? meal.intolerances.join(
                  ", "
                )
              : "None detected"}
          </span>
        </div>
      </div>

      {alternatives.length > 1 && (
        <div className="alternative-strip">
          <strong>
            Select another AI suggestion
          </strong>

          <div>
            {alternatives
              .filter(
                (alternative) =>
                  alternative.id !==
                  meal.id
              )
              .slice(0, 3)
              .map(
                (alternative) => (
                  <button
                    type="button"
                    key={
                      alternative.id
                    }
                    onClick={() =>
                      setMeal(
                        alternative
                      )
                    }
                  >
                    {
                      alternative.name
                    }
                  </button>
                )
              )}
          </div>
        </div>
      )}

      <div className="confirmation-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="button"
          className="button button-primary"
          onClick={() =>
            onSave(scaledMeal)
          }
        >
          Confirm and save
        </button>
      </div>
    </div>
  );
}

function Favourites({
  savedMeals,
  setSavedMeals,
  chooseCandidate,
}: {
  savedMeals: SavedMeal[];
  setSavedMeals: Dispatch<
    SetStateAction<SavedMeal[]>
  >;
  chooseCandidate: (
    meal: MealCandidate
  ) => void;
}) {
  const items = savedMeals;

  return (
    <div className="favourites-page">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">
            Favourites
          </span>

          <h1>
            Your fastest meals to log
          </h1>

          <p>
            Pin, remove, or review a meal
            before logging it again.
          </p>
        </div>
      </div>

      {[
        "Pinned Meals",
        "Frequently Logged Meals",
        "Recent Meals",
      ].map((section, index) => (
        <section key={section}>
          <div className="section-heading">
            <h2>{section}</h2>
          </div>

          <div className="favourite-grid">
            {items
              .filter(
                (meal) =>
                  index !== 0 ||
                  meal.pinned
              )
              .slice(0, 4)
              .map((meal) => (
                <article key={meal.id}>
                  <span className="meal-thumb">
                    {meal.name
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>

                  <div>
                    <strong>
                      {meal.name}
                    </strong>

                    <small>
                      {
                        meal.nutrients
                          .calories
                      }{" "}
                      kcal ·{" "}
                      {meal.serving}
                    </small>
                  </div>

                  <div className="favourite-actions">
                    <button
                      type="button"
                      onClick={() =>
                        setSavedMeals(
                          (all) =>
                            all.map(
                              (
                                item
                              ) =>
                                item.id ===
                                meal.id
                                  ? {
                                      ...item,
                                      pinned:
                                        !item.pinned,
                                    }
                                  : item
                            )
                        )
                      }
                    >
                      {meal.pinned
                        ? "Unpin"
                        : "Pin"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        chooseCandidate(
                          meal
                        )
                      }
                    >
                      Log
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSavedMeals(
                          (all) =>
                            all.filter(
                              (
                                item
                              ) =>
                                item.id !==
                                meal.id
                            )
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
          </div>

          {!items.length && (
            <p className="empty-message">
              No saved meals yet.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}