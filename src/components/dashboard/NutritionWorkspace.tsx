"use client";

import { useMemo, useState } from "react";
import type { Cuisine, MacroKey, MealCandidate, MealSource, SavedMeal } from "@/domain/nutrition/models";
import { analyseMeal, commonMeals } from "@/services/meals/meal-analysis";

type View = "dashboard" | "log" | "confirm" | "favourites";
type Method = "image" | "text" | "voice";

const macroData: Record<MacroKey, { current: number; goal: number; unit: string; colour: string }> = {
  Protein: { current: 82, goal: 110, unit: "g", colour: "#176f45" },
  Carbohydrates: { current: 168, goal: 240, unit: "g", colour: "#d6a33b" },
  Fat: { current: 54, goal: 70, unit: "g", colour: "#4f78a8" },
};

const initialReminders = [
  { id: 1, title: "Complete your nutrition profile", text: "Add your allergies and preferences for safer recommendations." },
  { id: 2, title: "Drink some water", text: "You are 3 glasses away from today’s hydration goal." },
  { id: 3, title: "Log your lunch", text: "Keeping a complete record improves your weekly insights." },
];

const initialNotifications = [
  { id: 1, title: "New nutritionist message", text: "Ada left feedback on yesterday’s dinner.", unread: true },
  { id: 2, title: "Meal reminder", text: "Would you like to log breakfast?", unread: true },
  { id: 3, title: "Weekly recommendation", text: "Your fibre intake is improving.", unread: false },
];

export function NutritionWorkspace() {
  const [view, setView] = useState<View>("dashboard");
  const [cuisine, setCuisine] = useState<Cuisine>("Nigerian Cuisine");
  const [method, setMethod] = useState<Method>("text");
  const [macro, setMacro] = useState<MacroKey>("Protein");
  const [reminders, setReminders] = useState(initialReminders);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MealCandidate[]>([]);
  const [selected, setSelected] = useState<MealCandidate | null>(null);
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [voiceSupported] = useState(() => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window));
  const [voiceExampleSeen, setVoiceExampleSeen] = useState(false);
  const [status, setStatus] = useState("");

  const searchResults = useMemo(() => query.trim().length < 2 ? [] : commonMeals.filter((meal) => meal.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5), [query]);
  const consumed = 1460;
  const goal = 2100;
  const remaining = goal - consumed;
  const caloriePercent = Math.round((consumed / goal) * 100);

  const chooseCandidate = (candidate: MealCandidate) => { setSelected(candidate); setView("confirm"); setStatus(""); };
  const runAnalysis = () => { setSuggestions(analyseMeal(cuisine)); setStatus("Analysis complete. Select the closest meal match."); };
  const saveMeal = (source: MealSource = method) => {
    if (!selected) return;
    setSavedMeals((items) => [{ ...selected, source, savedAt: new Date().toISOString(), pinned: false }, ...items]);
    setStatus(`${selected.name} was saved to Meal History.`);
    setView("dashboard");
    setSelected(null);
    setSuggestions([]);
  };

  return (
    <div className="nutrition-app">
      <div className="workspace-toolbar">
        <div className="view-tabs" aria-label="Workspace sections">
          <button className={view === "dashboard" ? "is-current" : ""} onClick={() => setView("dashboard")}>Dashboard</button>
          <button className={view === "log" || view === "confirm" ? "is-current" : ""} onClick={() => setView("log")}>Log meal</button>
          <button className={view === "favourites" ? "is-current" : ""} onClick={() => setView("favourites")}>Favourites</button>
        </div>
        <label className="cuisine-control">Cuisine<select value={cuisine} onChange={(event) => setCuisine(event.target.value as Cuisine)}><option>Nigerian Cuisine</option><option>International Cuisine</option></select></label>
      </div>

      <section className="workspace-search" aria-label="Global search">
        <label><span className="sr-only">Search Bite Wise</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search meals, ingredients, history and recommendations" /></label>
        {searchResults.length > 0 && <div className="search-suggestions">{searchResults.map((meal) => <button key={meal.id} onClick={() => chooseCandidate(meal)}><strong>{meal.name}</strong><span>{meal.nutrients.calories} kcal · {meal.serving}</span></button>)}</div>}
      </section>

      {status && <div className="status-banner" role="status">{status}<button onClick={() => setStatus("")} aria-label="Dismiss message">×</button></div>}

      {view === "dashboard" && <Dashboard
        caloriePercent={caloriePercent} consumed={consumed} goal={goal} remaining={remaining} macro={macro} setMacro={setMacro}
        reminders={reminders} dismissReminder={(id) => setReminders((items) => items.filter((item) => item.id !== id))}
        notifications={notifications} markRead={(id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item))}
        cuisine={cuisine} onLog={() => setView("log")} onPick={chooseCandidate}
      />}

      {view === "log" && <MealLogger method={method} setMethod={setMethod} cuisine={cuisine} setCuisine={setCuisine} suggestions={suggestions} runAnalysis={runAnalysis} chooseCandidate={chooseCandidate} voiceSupported={voiceSupported} voiceExampleSeen={voiceExampleSeen} setVoiceExampleSeen={setVoiceExampleSeen} />}

      {view === "confirm" && selected && <MealConfirmation meal={selected} setMeal={setSelected} alternatives={suggestions} onCancel={() => { setSelected(null); setView("log"); }} onSave={() => saveMeal()} />}

      {view === "favourites" && <Favourites savedMeals={savedMeals} setSavedMeals={setSavedMeals} onLog={(meal) => { setSelected(meal); saveMeal("favourite"); }} chooseCandidate={chooseCandidate} />}
    </div>
  );
}

function Dashboard(props: any) {
  const macroInfo = macroData[props.macro as MacroKey];
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (props.caloriePercent / 100) * circumference;
  return <div className="dashboard-content">
    <div className="dashboard-title"><div><span className="eyebrow">Daily overview</span><h1>Your nutrition at a glance</h1><p>Clear progress, practical guidance, and culturally relevant meal ideas.</p></div><button className="button button-primary" onClick={props.onLog}>+ Log a meal</button></div>
    <div className="dashboard-primary-grid">
      <article className="dashboard-card calorie-card"><div><span className="card-kicker">Daily nutrition</span><h2>Calories</h2><p>You are making steady progress toward today’s target.</p></div><div className="calorie-gauge"><svg viewBox="0 0 128 128" role="img" aria-label={`${props.caloriePercent}% of calorie goal consumed`}><circle cx="64" cy="64" r="54" className="gauge-track"/><circle cx="64" cy="64" r="54" className="gauge-progress" strokeDasharray={circumference} strokeDashoffset={offset}/></svg><div><strong>{props.consumed.toLocaleString()}</strong><span>kcal consumed</span></div></div><div className="calorie-summary"><span><strong>{props.remaining}</strong> remaining</span><span><strong>{props.goal.toLocaleString()}</strong> daily goal</span></div></article>
      <article className="dashboard-card macro-card"><div className="card-heading"><div><span className="card-kicker">Macronutrients</span><h2>Today’s distribution</h2></div></div><div className="macro-layout"><div className="macro-pie" role="img" aria-label="Macronutrient distribution"><span>Daily<br/>mix</span></div><div className="macro-buttons">{Object.entries(macroData).map(([name, item]) => <button key={name} className={props.macro === name ? "is-selected" : ""} onMouseEnter={() => props.setMacro(name)} onClick={() => props.setMacro(name)}><i style={{background:item.colour}}/><span>{name}</span><strong>{item.current}{item.unit}</strong></button>)}</div></div><div className="macro-detail"><strong>{props.macro}</strong><span>Current {macroInfo.current}{macroInfo.unit}</span><span>Recommended {macroInfo.goal}{macroInfo.unit}</span><span>Remaining {macroInfo.goal - macroInfo.current}{macroInfo.unit}</span></div></article>
      <article className="dashboard-card bmi-card"><span className="card-kicker">BMI summary</span><div className="bmi-value"><strong>23.4</strong><span>Healthy range</span></div><p>BMI is a general health indicator and does not account for muscle mass or overall body composition.</p></article>
    </div>
    <section><div className="section-heading"><div><span className="eyebrow">Quick statistics</span><h2>Today’s activity</h2></div></div><div className="stats-grid">{[["Meals logged","3","Breakfast, snack and lunch"],["Remaining calories",`${props.remaining} kcal`,"Available for today"],["Calories burned","310 kcal","Walking and daily movement"],["Water intake","5 / 8","Glasses completed"],["Current goal","Maintain","Weight maintenance plan"]].map(([label,value,text])=><article className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><p>{text}</p></article>)}</div></section>
    <div className="dashboard-secondary-grid">
      <section className="dashboard-card"><div className="section-heading compact"><div><span className="eyebrow">Nutrition insights</span><h2>Positive progress</h2></div></div><div className="insight-list">{["Your protein intake has improved this week.","Consider adding vegetables or fruit at dinner for more fibre.","Your calorie intake has remained consistent over the last seven days."].map((text,i)=><div key={text}><span>{i+1}</span><p>{text}</p></div>)}</div></section>
      <section className="dashboard-card"><div className="section-heading compact"><div><span className="eyebrow">Recommended meals</span><h2>Ideas that fit your day</h2></div></div><div className="meal-recommendations">{commonMeals.filter(m=>props.cuisine === "Nigerian Cuisine" ? ["jollof-chicken","moi-moi","egusi"].includes(m.id) : ["chicken-bowl","chicken-salad","pasta-chicken"].includes(m.id)).slice(0,3).map(meal=><button key={meal.id} onClick={()=>props.onPick(meal)}><span className="meal-thumb" aria-hidden="true">{meal.name.slice(0,2).toUpperCase()}</span><span><strong>{meal.name}</strong><small>{meal.nutrients.calories} kcal · {meal.nutrients.protein}g protein</small></span><b>+</b></button>)}</div></section>
    </div>
    <div className="dashboard-secondary-grid">
      <section className="dashboard-card"><div className="section-heading compact"><div><span className="eyebrow">Reminders</span><h2>Helpful next steps</h2></div></div>{props.reminders.length ? <div className="reminder-list">{props.reminders.map((item:any)=><div key={item.id}><span aria-hidden="true">✓</span><p><strong>{item.title}</strong><small>{item.text}</small></p><button onClick={()=>props.dismissReminder(item.id)} aria-label={`Dismiss ${item.title}`}>×</button></div>)}</div>:<p className="empty-message">You are all caught up. Nice work.</p>}</section>
      <section className="dashboard-card"><div className="section-heading compact"><div><span className="eyebrow">Notifications</span><h2>Recent updates</h2></div></div><div className="notification-list">{props.notifications.map((item:any)=><button key={item.id} className={item.unread?"unread":""} onClick={()=>props.markRead(item.id)}><span className="notification-dot"/><span><strong>{item.title}</strong><small>{item.text}</small></span></button>)}</div></section>
    </div>
  </div>;
}

function MealLogger(props:any) {
  const [textQuery,setTextQuery]=useState("");
  const filtered=commonMeals.filter(m=>m.name.toLowerCase().includes(textQuery.toLowerCase())).slice(0,6);
  return <div className="logger-page"><div className="dashboard-title"><div><span className="eyebrow">Meal logging</span><h1>How would you like to log your meal?</h1><p>Every method ends with a review screen before anything is saved.</p></div></div>
    <div className="logger-controls"><label>Cuisine<select value={props.cuisine} onChange={(e)=>props.setCuisine(e.target.value)}><option>Nigerian Cuisine</option><option>International Cuisine</option></select></label><div className="method-tabs">{[["image","Image"],["text","Text"],["voice","Voice"]].map(([id,label])=><button key={id} className={props.method===id?"is-selected":""} onClick={()=>props.setMethod(id)}>{label}</button>)}</div></div>
    {props.method === "image" && <section className="logging-panel"><div className="upload-zone"><span className="upload-icon">IM</span><h2>Upload or capture your meal</h2><p>Use a clear, well-lit image showing the full plate.</p><div><label className="button button-primary">Choose image<input type="file" accept="image/*" hidden onChange={props.runAnalysis}/></label><button className="button button-secondary" onClick={props.runAnalysis}>Use webcam</button></div><small>If camera access is unavailable, image upload remains available.</small></div><CandidateList items={props.suggestions} onPick={props.chooseCandidate}/></section>}
    {props.method === "text" && <section className="logging-panel"><div className="text-search"><label><span>Search or describe a meal</span><input value={textQuery} onChange={e=>setTextQuery(e.target.value)} placeholder="e.g. jollof rice with grilled chicken"/></label><button className="button button-primary" onClick={()=>props.runAnalysis()}>Analyse description</button></div><h2>Commonly logged meals</h2><div className="common-meal-grid">{filtered.map(meal=><button key={meal.id} onClick={()=>props.chooseCandidate(meal)}><strong>{meal.name}</strong><span>{meal.serving}</span><small>{meal.nutrients.calories} kcal</small></button>)}</div>{textQuery.toLowerCase().includes("jollof")&&<div className="variation-panel"><strong>Jollof Rice variations</strong><div>{["Party Jollof","Homemade Jollof","Village Jollof"].map(v=><button key={v} onClick={()=>props.chooseCandidate({...commonMeals[0],id:v,name:v})}>{v}</button>)}</div></div>}<CandidateList items={props.suggestions} onPick={props.chooseCandidate}/></section>}
    {props.method === "voice" && <section className="logging-panel">{!props.voiceExampleSeen&&<div className="voice-example"><button onClick={()=>props.setVoiceExampleSeen(true)} aria-label="Dismiss example">×</button><strong>Try saying:</strong><p>“I ate one serving of jollof rice with grilled chicken and a small bottle of orange juice.”</p></div>}<div className="voice-zone"><span className="voice-pulse">VO</span><h2>{props.voiceSupported?"Describe your meal naturally":"Voice recognition is unavailable"}</h2><p>{props.voiceSupported?"We will convert your speech to text, then ask you to confirm the meal.":"Upload an audio recording instead. Core meal logging remains available."}</p><button className="button button-primary" onClick={props.runAnalysis}>{props.voiceSupported?"Start recording":"Upload audio"}</button></div><CandidateList items={props.suggestions} onPick={props.chooseCandidate}/></section>}
  </div>;
}
function CandidateList({items,onPick}:{items:MealCandidate[];onPick:(m:MealCandidate)=>void}) { return items.length?<div className="candidate-list"><h2>Possible matches</h2>{items.map(item=><button key={item.id} onClick={()=>onPick(item)}><span><strong>{item.name}</strong><small>{item.serving} · {item.nutrients.calories} kcal</small></span><b>{item.confidence}% match</b></button>)}</div>:null; }
function MealConfirmation({meal,setMeal,alternatives,onCancel,onSave}:{meal:MealCandidate;setMeal:(m:MealCandidate)=>void;alternatives:MealCandidate[];onCancel:()=>void;onSave:()=>void}) {
  const [servings,setServings]=useState(1);
  return <div className="confirmation-page"><div className="dashboard-title"><div><span className="eyebrow">Meal confirmation</span><h1>Review before saving</h1><p>No meal is stored until you explicitly confirm it.</p></div></div><div className="confirmation-grid"><section className="dashboard-card meal-review"><div className="meal-review-image">{meal.name.slice(0,2).toUpperCase()}</div><div><span className="card-kicker">Detected meal</span><input className="meal-name-input" value={meal.name} onChange={e=>setMeal({...meal,name:e.target.value})}/><p>{meal.estimated?"Nutrition values are estimated because an exact USDA match was unavailable.":"Nutrition values use the closest USDA FoodData Central match."}</p><label>Serving multiplier<input type="number" min="0.25" step="0.25" value={servings} onChange={e=>setServings(Number(e.target.value)||1)}/></label></div></section><aside className="dashboard-card nutrition-summary"><span className="card-kicker">Nutritional summary</span><strong className="calorie-total">{Math.round(meal.nutrients.calories*servings)} kcal</strong>{[["Protein",meal.nutrients.protein],["Carbohydrates",meal.nutrients.carbohydrates],["Fat",meal.nutrients.fat],["Fibre",meal.nutrients.fibre]].map(([label,value])=><div key={label}><span>{label}</span><strong>{Math.round(Number(value)*servings)} g</strong></div>)}<div><span>Confidence</span><strong>{meal.confidence}%</strong></div></aside></div><div className="safety-summary"><div><strong>Detected allergens</strong><span>{meal.allergens.length?meal.allergens.join(", "):"None detected"}</span></div><div><strong>Food intolerances</strong><span>{meal.intolerances.length?meal.intolerances.join(", "):"None detected"}</span></div></div>{alternatives.length>1&&<div className="alternative-strip"><strong>Select another AI suggestion</strong><div>{alternatives.filter(a=>a.id!==meal.id).map(a=><button key={a.id} onClick={()=>setMeal(a)}>{a.name}</button>)}</div></div>}<div className="confirmation-actions"><button className="button button-secondary" onClick={onCancel}>Cancel</button><button className="button button-secondary" onClick={()=>setMeal({...meal,name:meal.name})}>Edit meal</button><button className="button button-primary" onClick={onSave}>Confirm and save</button></div></div>;
}
function Favourites({savedMeals,setSavedMeals,chooseCandidate}:{savedMeals:SavedMeal[];setSavedMeals:any;onLog:any;chooseCandidate:(m:MealCandidate)=>void}) {
  const defaults=commonMeals.slice(0,3).map((m,i)=>({...m,source:"favourite" as const,savedAt:new Date().toISOString(),pinned:i===0}));
  const items=savedMeals.length?savedMeals:defaults;
  return <div className="favourites-page"><div className="dashboard-title"><div><span className="eyebrow">Favourites</span><h1>Your fastest meals to log</h1><p>Pin, rename, remove, or review a meal before logging it again.</p></div></div>{["Pinned Meals","Frequently Logged Meals","Recent Meals"].map((section,index)=><section key={section}><div className="section-heading"><h2>{section}</h2></div><div className="favourite-grid">{items.filter((m)=>index!==0||m.pinned).slice(0,4).map((meal)=><article key={meal.id}><span className="meal-thumb">{meal.name.slice(0,2).toUpperCase()}</span><div><strong>{meal.name}</strong><small>{meal.nutrients.calories} kcal · {meal.serving}</small></div><div className="favourite-actions"><button onClick={()=>setSavedMeals((all:SavedMeal[])=>all.map(m=>m.id===meal.id?{...m,pinned:!m.pinned}:m))}>{meal.pinned?"Unpin":"Pin"}</button><button onClick={()=>chooseCandidate(meal)}>Log</button><button onClick={()=>setSavedMeals((all:SavedMeal[])=>all.filter(m=>m.id!==meal.id))}>Remove</button></div></article>)}</div></section>)}</div>;
}
