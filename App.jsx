import { useState, useEffect, useCallback } from "react";

const FOODS = [
  { name: "Jollof Rice",      cal: 145, protein: 2.6,  carbs: 27.5, fat: 2.7,  fiber: 1.3 },
  { name: "Egusi Soup",       cal: 182, protein: 14,   carbs: 3.1,  fat: 13.2, fiber: 2   },
  { name: "Pounded Yam",      cal: 118, protein: 1.5,  carbs: 27,   fat: 0.1,  fiber: 0.9 },
  { name: "Garri / Eba",      cal: 357, protein: 1.3,  carbs: 85,   fat: 0.5,  fiber: 2   },
  { name: "Suya",             cal: 250, protein: 20,   carbs: 5,    fat: 15,   fiber: 2   },
  { name: "Akara",            cal: 180, protein: 3.5,  carbs: 18,   fat: 10,   fiber: 3   },
  { name: "Moi Moi",          cal: 120, protein: 7,    carbs: 12,   fat: 4.5,  fiber: 3.5 },
  { name: "Beans Porridge",   cal: 130, protein: 8,    carbs: 20,   fat: 3,    fiber: 6   },
  { name: "Efo Riro",         cal: 85,  protein: 6,    carbs: 4,    fat: 5.5,  fiber: 2.8 },
  { name: "Pepper Soup",      cal: 55,  protein: 7,    carbs: 1.5,  fat: 2.5,  fiber: 0.5 },
  { name: "Fried Plantain",   cal: 196, protein: 1.1,  carbs: 32,   fat: 7.5,  fiber: 1.8 },
  { name: "Okra Soup",        cal: 78,  protein: 5.5,  carbs: 5.5,  fat: 4.5,  fiber: 3.2 },
  { name: "Amala",            cal: 90,  protein: 2,    carbs: 20,   fat: 0.2,  fiber: 1.5 },
  { name: "Ogi / Pap",        cal: 50,  protein: 1.2,  carbs: 11,   fat: 0.5,  fiber: 0.8 },
  { name: "Groundnut Soup",   cal: 175, protein: 8.5,  carbs: 6,    fat: 13.5, fiber: 2.2 },
  { name: "Bitter Leaf Soup", cal: 95,  protein: 6.5,  carbs: 5,    fat: 6,    fiber: 2.5 },
  { name: "Banga Soup",       cal: 130, protein: 7,    carbs: 4,    fat: 10,   fiber: 1.8 },
  { name: "Ofada Rice",       cal: 160, protein: 3.5,  carbs: 28,   fat: 4.5,  fiber: 2.5 },
  { name: "Nkwobi",           cal: 200, protein: 15,   carbs: 3,    fat: 14,   fiber: 0.5 },
  { name: "Tuwo Shinkafa",    cal: 100, protein: 2,    carbs: 22,   fat: 0.3,  fiber: 0.5 },
];

const EXERCISES = [
  { name: "Brisk Walk",      duration: "30 min", burn: 150, icon: "👟" },
  { name: "Running",         duration: "20 min", burn: 220, icon: "🏃" },
  { name: "Football",        duration: "60 min", burn: 400, icon: "⚽" },
  { name: "Cycling",         duration: "30 min", burn: 200, icon: "🚴" },
  { name: "Swimming",        duration: "30 min", burn: 250, icon: "🏊" },
  { name: "Jump Rope",       duration: "15 min", burn: 180, icon: "🪢" },
  { name: "Weight Training", duration: "45 min", burn: 280, icon: "🏋" },
  { name: "Yoga",            duration: "45 min", burn: 120, icon: "🧘" },
];

const NAV = [
  { id: "home",     label: "Home",     icon: "⊞" },
  { id: "food",     label: "Food",     icon: "🍽" },
  { id: "activity", label: "Activity", icon: "⚡" },
  { id: "profile",  label: "Profile",  icon: "◎" },
  { id: "about",    label: "About",    icon: "ℹ" },
];

const GOAL = 2100;
const EMPTY_PROFILE = { name: "", age: "", weight: "", height: "", sex: "Male" };

// ── FAQ Data (20 Q&As, cardiovascular health & exercise) ─────────────────────
const FAQ = [
  { q: "What is cardiovascular disease (CVD)?", a: "Cardiovascular disease refers to conditions affecting the heart and blood vessels, including coronary heart disease, stroke, heart failure, and hypertension. It is the leading cause of death globally, yet physical inactivity is one of its most modifiable risk factors.", src: "Masmoum et al., Cureus 2024" },
  { q: "How does exercise reduce cardiovascular disease risk?", a: "Regular exercise reduces CVD risk through multiple pathways: it lowers resting blood pressure, improves cholesterol profiles (raising HDL and lowering LDL), reduces systemic inflammation, improves insulin sensitivity, and strengthens the heart muscle. A 2024 systematic review of 10 years of research confirmed aerobic exercise significantly reduces blood pressure and lipid levels in adults.", src: "Masmoum et al., Cureus 2024" },
  { q: "How much exercise do I need for heart health?", a: "The WHO and American College of Sports Medicine recommend at least 150–300 minutes of moderate-intensity aerobic activity per week, or 75–150 minutes of vigorous activity. Strength training at least twice per week provides additional benefit. Sessions as short as 10 minutes count toward your total.", src: "WHO Guidelines; Guo & Wang, Frontiers in Public Health 2025" },
  { q: "What types of exercise are best for the heart?", a: "Aerobic exercises — brisk walking, running, cycling, swimming — show the strongest and most consistent cardiovascular benefits. Resistance training complements aerobic work by improving body composition and insulin sensitivity. Combined programmes produce the most comprehensive risk reduction.", src: "Masmoum et al., Cureus 2024" },
  { q: "Can exercise lower blood pressure?", a: "Yes. Exercise is now recognised as a therapeutic tool for hypertension, with effects comparable to some blood pressure medications. Regular aerobic exercise produces measurable reductions in both systolic and diastolic pressure, even in people without diagnosed hypertension.", src: "Volis & Zafrir, Journal of Clinical Medicine 2024; NIH/PMC 2020" },
  { q: "Does exercise affect cholesterol levels?", a: "Yes. Regular physical activity raises HDL ('good') cholesterol and can lower LDL ('bad') cholesterol and triglycerides. This reduces the buildup of fatty plaques in arteries — the primary mechanism behind heart attacks and strokes.", src: "Masmoum et al., Cureus 2024; NIH/PMC 2019" },
  { q: "What happens to the heart during exercise?", a: "During exercise, cardiac output and blood pressure increase to deliver oxygen to working muscles. Over time, regular exercisers develop a lower resting heart rate, increased stroke volume, and mild cardiac hypertrophy — adaptations that make the heart more efficient. Exercise also boosts nitric oxide availability, which dilates blood vessels and improves circulation.", src: "NIH/PMC — Cardiovascular Effects and Benefits of Exercise 2018" },
  { q: "Is walking enough to protect my heart?", a: "Yes. Brisk walking is one of the most studied and accessible cardiovascular exercises. Just 30 minutes of brisk walking most days of the week significantly reduces CVD risk, lowers blood pressure, and improves cholesterol — especially for sedentary individuals just starting out.", src: "Volis & Zafrir, Journal of Clinical Medicine 2024" },
  { q: "Can too much exercise harm the heart?", a: "For the vast majority of people, more exercise is better. However, evidence suggests extremely high sustained volumes — such as competitive marathon running over many years — may cause minor structural changes. These are rare and specific to elite endurance athletes. For ordinary exercise levels the benefits are overwhelmingly positive.", src: "NIH/PMC — Cardiovascular Effects and Benefits of Exercise 2018" },
  { q: "Does exercise help if I already have heart disease?", a: "Yes. Exercise is a cornerstone of cardiac rehabilitation and secondary prevention. Studies show sustained physical activity improves survival at 30-year follow-up in people with coronary artery disease, reduces heart failure risk, and produces a more favourable inflammatory profile. Any exercise programme for existing heart disease should be supervised by a healthcare provider.", src: "NIH/PMC 2018; Volis & Zafrir 2024" },
  { q: "How does exercise affect blood sugar and diabetes risk?", a: "Exercise improves insulin sensitivity, helping cells absorb glucose from the blood more efficiently. Regular activity reduces type 2 diabetes risk — itself a major risk factor for heart disease. Even a single session of moderate exercise has been shown to improve insulin action for hours afterward.", src: "NIH/PMC — Exercise for Prevention and Relief of CVD 2019" },
  { q: "What is cardiorespiratory fitness (CRF) and why does it matter?", a: "Cardiorespiratory fitness is the ability of the heart, lungs, and circulation to sustain oxygen delivery during exercise. Higher CRF is one of the strongest predictors of cardiovascular and all-cause mortality — often stronger than traditional risk factors like blood pressure or cholesterol alone. It improves directly with regular aerobic training.", src: "Volis & Zafrir, Journal of Clinical Medicine 2024" },
  { q: "Can exercise alone compensate for a poor diet?", a: "No — exercise and diet are complementary, not interchangeable. Regular exercise provides significant cardiovascular benefits independently, but combining it with a healthy diet produces substantially better outcomes than either alone. Exercise cannot fully neutralise the harm of a consistently poor diet.", src: "Masmoum et al., Cureus 2024" },
  { q: "Does sitting a lot cancel out the benefits of exercise?", a: "Partially. Prolonged sitting is an independent CVD risk factor even in people who exercise. However, high amounts of moderate-to-vigorous physical activity have been shown in meta-analysis to significantly attenuate — and sometimes eliminate — the elevated mortality risk associated with high sitting time. Regular movement throughout the day matters alongside structured exercise.", src: "NIH/PMC 2020; Guo & Wang 2025" },
  { q: "How quickly do cardiovascular benefits from exercise appear?", a: "Some benefits are rapid. Blood pressure can show measurable reductions within weeks of starting regular aerobic exercise. Improvements in insulin sensitivity can occur after a single session. Significant improvements in cholesterol and structural cardiac adaptations typically develop over 3–6 months of consistent training.", src: "Volis & Zafrir, Journal of Clinical Medicine 2024" },
  { q: "Is high-intensity or moderate-intensity exercise better for the heart?", a: "Both intensities provide cardiovascular benefits. High-intensity interval training (HIIT) produces comparable or greater improvements in cardiorespiratory fitness in less time. Moderate-intensity continuous exercise is generally safer and more sustainable for beginners and those with existing conditions. The best exercise is one you can do consistently.", src: "Masmoum et al., Cureus 2024; WHO Guidelines" },
  { q: "Does exercise reduce the risk of stroke?", a: "Yes. Regular physical activity significantly reduces the risk of both ischemic and haemorrhagic stroke. Exercise lowers key stroke risk factors — hypertension, atrial fibrillation risk, obesity, and blood glucose — all in one intervention. The protective effect is present even at moderate activity levels.", src: "Volis & Zafrir 2024; NIH/PMC 2020" },
  { q: "What role does exercise play in managing stress and heart health?", a: "Exercise reduces sympathetic nervous system activity (the 'fight or flight' response) and promotes parasympathetic tone, lowering resting heart rate and blood pressure. It also reduces cortisol and inflammatory markers like C-reactive protein — both of which, when chronically elevated, damage blood vessels and raise CVD risk.", src: "NIH/PMC — Cardiovascular Effects and Benefits of Exercise 2018" },
  { q: "How does sleep affect cardiovascular health?", a: "Optimal sleep — 7 to 9 hours per night for adults — is essential for cardiovascular health. During deep sleep, blood pressure naturally 'dips', relieving strain on the heart. Short sleep (under 7 hours) is associated with elevated blood pressure, impaired glucose metabolism, increased inflammation, and higher risk of heart attack and stroke. The AHA included sleep in its 'Life's Essential 8' checklist in 2023.", src: "American College of Cardiology 2025; Pan et al. 2023; AHA Circulation Statement" },
  { q: "How does prolonged sitting affect the heart independently of exercise?", a: "Sitting for long periods is associated with a 29% increased risk of cardiovascular disease and a 13% increased risk of type 2 diabetes, independent of exercise. Each additional hour of daily sitting raises all-cause mortality risk by approximately 2%, rising to a 34% increase at 10 hours per day. Breaking up sitting regularly throughout the day is strongly recommended.", src: "PubMed Meta-Analysis 2019 (448,285 participants); Guo & Wang 2025; American Heart Association 2023" },
];

// ── localStorage helpers ──────────────────────────────────────────────────────
function lsGet(key, fallback) {
  try { const r = localStorage.getItem(key); return r !== null ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ── Reusable components ───────────────────────────────────────────────────────
function CircleProgress({ pct, size = 140, stroke = 10 }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, dash = (Math.min(100, pct) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#007BFF" strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

function MacroBar({ label, cur, tgt, color }) {
  const pct = Math.min(100, Math.round((cur / tgt) * 100));
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
        <span style={{ color: "#9BA8C0", fontWeight: 600 }}>{label}</span>
        <span style={{ color: "#5A6A8A", fontFamily: "monospace" }}>{cur}g / {tgt}g</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} />
      </div>
    </div>
  );
}

// ── Sitting Assessment Helper ─────────────────────────────────────────────────
function getSittingAssessment(hrs) {
  if (hrs <= 5) return {
    level: "healthy", label: "Healthy Range ✓", color: "#00E5A0",
    border: "rgba(0,229,160,0.2)", bg: "rgba(0,229,160,0.05)",
    advice: "Your daily sitting time is within a healthy range. No increase is recommended — maintain this level and keep up regular movement breaks.",
    detail: "Research shows that adults who sit fewer than 5 hours per day face significantly lower risks of cardiovascular disease and metabolic conditions. Continue building active habits to sustain this.",
    src: "Guo & Wang, Frontiers in Public Health 2025; PubMed Meta-Analysis 2019"
  };
  if (hrs <= 8) return {
    level: "limit", label: "At the Health Limit ⚠", color: "#FF9F43",
    border: "rgba(255,159,67,0.25)", bg: "rgba(255,159,67,0.05)",
    advice: "You are sitting 6–8 hours per day — this is at the upper boundary of what research considers acceptable. You should aim not to increase this further and actively work to reduce it.",
    detail: "Adults spending 6–8 hours seated daily show a statistically significant increased risk of diabetes and chronic disease. The American Heart Association notes that U.S. adults now average 6–8 hours of sedentary time per day, which it considers a public health concern. Take a 2–5 minute movement break every 30–45 minutes.",
    src: "American Heart Association 2023; Chronic Disease & Sitting Study, 45 and Up Study 2013"
  };
  return {
    level: "danger", label: "Reduce Immediately 🚨", color: "#FF5E5B",
    border: "rgba(255,94,91,0.3)", bg: "rgba(255,94,91,0.05)",
    advice: "You are sitting 9–12 hours per day. This level is associated with serious health risks. You should take immediate steps to reduce your daily sitting time.",
    detail: "At this level, research shows a 29% increased risk of cardiovascular disease and a 34% increased all-cause mortality risk compared to low-sitting individuals. Prolonged sitting raises blood pressure, impairs glucose regulation, increases triglycerides, reduces HDL cholesterol, and promotes chronic inflammation — all independent of how much you exercise.",
    risks: ["↑ 29% increased cardiovascular disease risk", "↑ 34% increased all-cause mortality (at 10h/day)", "↑ 13% increased type 2 diabetes risk", "Raised triglycerides and lowered HDL cholesterol", "Impaired glucose regulation and insulin sensitivity", "Elevated blood pressure and systemic inflammation"],
    src: "PubMed Meta-Analysis 2019 (448,285 participants); Guo & Wang 2025; Yale Medicine; AHA 2023"
  };
}

// ── Sleep Assessment Helper ───────────────────────────────────────────────────
function getSleepAssessment(hrs) {
  if (hrs < 6) return {
    level: "danger", label: "Too Little Sleep 🚨", color: "#FF5E5B",
    border: "rgba(255,94,91,0.3)", bg: "rgba(255,94,91,0.05)",
    advice: "You are sleeping fewer than 6 hours per night. This is significantly below the recommended amount and is associated with serious cardiovascular and metabolic risks.",
    detail: "Short sleep (≤6 hours) is associated with elevated blood pressure, impaired insulin sensitivity, increased cortisol, and higher rates of heart attack and stroke. One study found that 24 hours of sleep deprivation raised systolic blood pressure by 13 mmHg in normotensive adults. The American Heart Association added sleep to its 'Life's Essential 8' in 2023, recognising it as a core pillar of heart health.",
    risks: ["↑ Elevated systolic and diastolic blood pressure", "↑ Impaired insulin sensitivity and glucose control", "↑ Increased cortisol and inflammatory markers", "↑ Higher risk of heart attack and stroke", "Disrupted circadian blood pressure dipping", "Weakened immune function"],
    src: "Pan et al. 2023; AHA Circulation Scientific Statement; American College of Cardiology 2025"
  };
  if (hrs <= 9) return {
    level: "healthy", label: "Optimal Sleep Range ✓", color: "#00E5A0",
    border: "rgba(0,229,160,0.2)", bg: "rgba(0,229,160,0.05)",
    advice: "You are sleeping 7–9 hours per night — the optimal range for adult cardiovascular health. Maintain this consistently for the best results.",
    detail: "Research including a meta-analysis of 43 studies shows that 7–9 hours of sleep per night is associated with the lowest risks of heart failure, myocardial infarction, hypertension, and stroke. During deep sleep, blood pressure naturally dips and the body regulates cortisol, blood glucose, and inflammatory markers — all critical to heart health.",
    src: "American College of Cardiology 2025; Pan et al. 2023; CDC NHANES 2020"
  };
  return {
    level: "limit", label: "Too Much Sleep ⚠", color: "#FF9F43",
    border: "rgba(255,159,67,0.25)", bg: "rgba(255,159,67,0.05)",
    advice: "You are sleeping more than 9 hours per night. Research shows a U-shaped relationship — both too little and too much sleep are associated with increased cardiovascular risk.",
    detail: "A 2025 systematic review of 38 studies found that prolonged sleep (over 9 hours) is consistently associated with increased risks of coronary artery disease, stroke, hypertension, and myocardial infarction. Elevated inflammatory markers such as C-reactive protein and interleukin-6 are proposed as mediating factors. If you are sleeping this much regularly, it may also signal an underlying health issue worth discussing with a doctor.",
    src: "PMC — Implications of Long Sleep Duration on Cardiovascular Health 2025; Pan et al. 2023"
  };
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function CardioPal() {
  const [profile, setProfile]   = useState(() => lsGet("cp_profile", EMPTY_PROFILE));
  const [draftProfile, setDraft] = useState(() => lsGet("cp_profile", EMPTY_PROFILE));
  const profileComplete = profile.name.trim() !== "" && profile.age !== "" && profile.weight !== "" && profile.height !== "";
  const [page, setPage]           = useState(() => profileComplete ? "home" : "profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast]         = useState(null);
  const [search, setSearch]       = useState("");
  const [foodLog, setFoodLog]     = useState(() => lsGet("cp_food_log", []));
  const [exLog, setExLog]         = useState(() => lsGet("cp_ex_log", []));
  const [openFaq, setOpenFaq]       = useState(null);
  const [activityTab, setActivityTab] = useState("exercise");
  const [sittingHrs, setSittingHrs]  = useState(6);
  const [sleepHrs, setSleepHrs]   = useState(7);

  useEffect(() => { lsSet("cp_food_log", foodLog); }, [foodLog]);
  useEffect(() => { lsSet("cp_ex_log", exLog); }, [exLog]);

  const loggedCal = foodLog.reduce((a, b) => a + b.cal, 0);
  const burnedCal = exLog.reduce((a, b) => a + b.burn, 0);
  const remaining = GOAL - loggedCal + burnedCal;
  const pct       = Math.min(100, Math.round((loggedCal / GOAL) * 100));
  const protein   = Math.round(loggedCal * 0.15 / 4);
  const carbs     = Math.round(loggedCal * 0.55 / 4);
  const fat       = Math.round(loggedCal * 0.30 / 9);
  const fiber     = Math.round(loggedCal * 0.018 / 2);
  const w = parseFloat(profile.weight) || 0, h = parseFloat(profile.height) || 0, a = parseFloat(profile.age) || 0;
  const bmi      = h > 0 ? +(w / ((h / 100) ** 2)).toFixed(1) : 0;
  const bmr      = profile.sex === "Male" ? Math.round(10*w + 6.25*h - 5*a + 5) : Math.round(10*w + 6.25*h - 5*a - 161);
  const tdee     = Math.round(bmr * 1.375);
  const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const bmiColor = bmi < 18.5 ? "#FF9F43" : bmi < 25 ? "#00E5A0" : bmi < 30 ? "#FF9F43" : "#FF5E5B";

  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); }, []);
  const goToPage  = useCallback((p) => { setPage(p); if (p !== "activity") setActivityTab("exercise"); }, []);
  const logFood = useCallback((f) => { setFoodLog(p => [...p, { id: Date.now(), name: f.name, meal: "Snack", cal: Math.round(f.cal * 1.5) }]); showToast(`✓ ${f.name} logged`); }, [showToast]);
  const removeFood = useCallback((id) => { setFoodLog(p => p.filter(i => i.id !== id)); showToast("✕ Item removed"); }, [showToast]);
  const logEx = useCallback((e) => { setExLog(p => [...p, { id: Date.now(), ...e }]); showToast(`✓ ${e.name} — ${e.burn} kcal burned`); }, [showToast]);
  const removeEx = useCallback((id) => { setExLog(p => p.filter(i => i.id !== id)); showToast("✕ Activity removed"); }, [showToast]);
  const saveProfile = useCallback(() => {
    const saved = { ...draftProfile };
    setProfile(saved); lsSet("cp_profile", saved);
    const complete = saved.name.trim() !== "" && saved.age !== "" && saved.weight !== "" && saved.height !== "";
    showToast("✓ Profile saved!");
    if (complete) setTimeout(() => goToPage("home"), 600);
  }, [draftProfile, showToast]);

  const filtered = FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const sittingResult = getSittingAssessment(sittingHrs);
  const sleepResult   = getSleepAssessment(sleepHrs);

  // ── Theme ─────────────────────────────────────────────────────────────────
  const BG = "#0A0C12", SURF = "#111827", SURF2 = "#0D1118";
  const BLUE = "#007BFF", GREEN = "#00E5A0", MUTED = "#5A6A8A";
  const TEXT = "#F0F4FF", BORDER = "rgba(255,255,255,0.07)", RED = "#FF5E5B";
  const card = { background: SURF, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 20 };
  const secTitle = { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUTED, marginBottom: 18 };
  const logItemStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${BORDER}` };
  const SIDEBAR_W = sidebarOpen ? 220 : 64;

  // ── Slider style helper ───────────────────────────────────────────────────
  const sliderStyle = (color) => `
    .custom-range { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 99px; background: rgba(255,255,255,0.08); outline: none; cursor: pointer; }
    .custom-range::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: ${color}; cursor: pointer; box-shadow: 0 0 8px ${color}66; }
    .custom-range::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: ${color}; cursor: pointer; border: none; }
  `;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG, fontFamily: "'Segoe UI', system-ui, sans-serif", color: TEXT }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        input, select { color: ${TEXT}; } input::placeholder { color: ${MUTED}; } select option { background: ${SURF}; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .food-card:hover { border-color: ${BLUE} !important; background: rgba(0,123,255,0.06) !important; transform: translateY(-2px); }
        .ex-card:hover   { border-color: ${GREEN} !important; background: rgba(0,229,160,0.05) !important; transform: translateY(-2px); }
        .nav-link:hover  { color: ${TEXT} !important; background: rgba(255,255,255,0.04) !important; }
        .remove-btn { opacity: 0; transition: opacity 0.15s; }
        .log-row:hover .remove-btn { opacity: 1; }
        .sidebar-toggle:hover { background: rgba(255,255,255,0.08) !important; }
        .faq-item { border-bottom: 1px solid ${BORDER}; }
        .faq-q { display: flex; justify-content: space-between; align-items: flex-start; padding: 16px 0; cursor: pointer; gap: 12px; }
        .faq-q:hover { color: ${BLUE}; }
        .faq-a { padding: 0 0 16px; font-size: 13px; color: ${MUTED}; line-height: 1.75; animation: fadeIn 0.2s ease; }
        .custom-range { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 99px; background: rgba(255,255,255,0.08); outline: none; cursor: pointer; }
        .custom-range::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; }
        .sitting-thumb::-webkit-slider-thumb { background: #FF9F43; box-shadow: 0 0 8px #FF9F4366; }
        .sleep-thumb::-webkit-slider-thumb   { background: #9B5DE5; box-shadow: 0 0 8px #9B5DE566; }
        @media (max-width: 700px) { .sidebar-label { display: none !important; } .sidebar-logo-text { display: none !important; } .main-content { padding: 20px 16px !important; } }
      `}</style>

      {/* ── SIDEBAR ──────────────────────────────────────────────────────────── */}
      <aside style={{ width: SIDEBAR_W, minHeight: "100vh", background: SURF2, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", padding: sidebarOpen ? "20px 12px" : "20px 10px", position: "sticky", top: 0, height: "100vh", transition: "width 0.25s ease, padding 0.25s ease", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 20, borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
            <div style={{ width: 34, height: 34, minWidth: 34, background: BLUE, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
            </div>
            {sidebarOpen && <span className="sidebar-logo-text" style={{ fontSize: 16, fontWeight: 800, color: TEXT, whiteSpace: "nowrap" }}>Cardio<span style={{ color: BLUE }}>Pal</span></span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)} title={sidebarOpen ? "Collapse" : "Expand"} style={{ background: "transparent", border: "none", cursor: "pointer", color: MUTED, borderRadius: 8, padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{sidebarOpen ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}</svg>
          </button>
        </div>

        {NAV.map(n => {
          const active = page === n.id;
          return (
            <div key={n.id} className="nav-link" onClick={() => goToPage(n.id)} title={!sidebarOpen ? n.label : undefined}
              style={{ display: "flex", alignItems: "center", gap: sidebarOpen ? 10 : 0, justifyContent: sidebarOpen ? "flex-start" : "center", padding: sidebarOpen ? "10px 14px" : "10px", borderRadius: 10, cursor: "pointer", marginBottom: 4, fontSize: 14, fontWeight: 600, transition: "all 0.15s", color: active ? TEXT : MUTED, background: active ? "rgba(0,123,255,0.12)" : "transparent", borderLeft: active ? `3px solid ${BLUE}` : "3px solid transparent", whiteSpace: "nowrap", overflow: "hidden" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
              {sidebarOpen && <span className="sidebar-label">{n.label}</span>}
            </div>
          );
        })}

        {sidebarOpen && profile.name && (
          <div style={{ marginTop: "auto", paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Logged in as</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{profile.name}</div>
          </div>
        )}
        {!sidebarOpen && (
          <div style={{ marginTop: "auto", paddingTop: 20, borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "center" }}>
            <div style={{ width: 32, height: 32, background: BLUE, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
              {profile.name ? profile.name[0].toUpperCase() : "?"}
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────────────────── */}
      <main className="main-content" style={{ flex: 1, padding: "36px 40px", overflowY: "auto", maxWidth: `calc(100vw - ${SIDEBAR_W}px)` }}>

        {!profileComplete && page !== "profile" && (
          <div style={{ background: "rgba(255,159,67,0.1)", border: "1px solid rgba(255,159,67,0.3)", borderRadius: 12, padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#FFD08A" }}>👤 Set up your profile to unlock personalised calorie goals and BMI calculations.</span>
            <button onClick={() => goToPage("profile")} style={{ background: "#FF9F43", color: "#000", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Complete Profile →</button>
          </div>
        )}

        {/* ════ HOME ════ */}
        {page === "home" && (
          <>
            <div style={{ marginBottom: 30 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>{profile.name ? `Welcome back, ${profile.name} 👋` : "Welcome to CardioPal 👋"}</h1>
              <p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>{new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <div style={{ background: "linear-gradient(135deg,#0D1829,#0A1435)", border: "1px solid rgba(0,123,255,0.2)", borderRadius: 20, padding: 32, marginBottom: 24 }}>
              <div style={secTitle}>Daily Calorie Balance</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", marginBottom: 28 }}>
                <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
                  <CircleProgress pct={pct} size={140} stroke={10} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{pct}%</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>consumed</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, justifyContent: "space-evenly", flexWrap: "wrap" }}>
                  {[{ label: "Goal", val: GOAL.toLocaleString(), color: TEXT }, { label: null, val: "−", color: MUTED }, { label: "Eaten", val: loggedCal.toLocaleString(), color: BLUE }, { label: null, val: "+", color: MUTED }, { label: "Burned", val: burnedCal.toLocaleString(), color: GREEN }, { label: null, val: "=", color: MUTED }, { label: "Remaining", val: remaining.toLocaleString(), color: remaining < 0 ? RED : TEXT, big: true }].map((item, i) =>
                    item.label === null
                      ? <div key={i} style={{ fontSize: 22, color: item.color, fontWeight: 300 }}>{item.val}</div>
                      : <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: 5 }}>{item.label}</div><div style={{ fontSize: item.big ? 30 : 22, fontWeight: 800, color: item.color, fontFamily: "monospace" }}>{item.val}</div></div>
                  )}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 8 }}><div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#0055CC,#007BFF)", borderRadius: 99 }} /></div>
              <div style={{ fontSize: 11, color: MUTED, textAlign: "right" }}>{pct}% of daily target reached</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={card}>
                <div style={secTitle}>Macronutrients Today</div>
                <MacroBar label="Protein" cur={protein} tgt={150} color={BLUE} />
                <MacroBar label="Carbs"   cur={carbs}   tgt={250} color="#9B5DE5" />
                <MacroBar label="Fats"    cur={fat}      tgt={65}  color="#FF7B2C" />
                <MacroBar label="Fiber"   cur={fiber}    tgt={25}  color={GREEN} />
              </div>
              <div style={card}>
                <div style={secTitle}>Today's Log</div>
                {foodLog.length === 0 && exLog.length === 0 && <div style={{ color: MUTED, fontSize: 13 }}>Nothing logged yet. Head to Food or Activity to start.</div>}
                {[...foodLog.slice(-3).map(f => ({ name: f.name, sub: f.meal, val: `+${f.cal} kcal`, color: BLUE })), ...exLog.slice(-2).map(e => ({ name: `${e.icon} ${e.name}`, sub: `Activity • ${e.duration}`, val: `−${e.burn} kcal`, color: GREEN }))].map((item, i, arr) => (
                  <div key={i} style={{ ...logItemStyle, borderBottom: i === arr.length - 1 ? "none" : undefined }}>
                    <div><div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div><div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{item.sub}</div></div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: item.color, fontFamily: "monospace" }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ════ FOOD ════ */}
        {page === "food" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
              <div><h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Food Log</h1><p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>Click any food to log it. Click × to remove a logged item.</p></div>
              <button onClick={() => showToast("Click any food card below to log it")} style={{ padding: "12px 22px", background: BLUE, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>+ Log Meal</button>
            </div>
            <input style={{ width: "100%", background: SURF, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "13px 18px", color: TEXT, fontSize: 14, outline: "none", fontFamily: "inherit", marginBottom: 20 }} placeholder="Search — try Egusi, Suya, Jollof, Moi Moi..." value={search} onChange={e => setSearch(e.target.value)} />
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Nigerian Foods Database</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(188px,1fr))", gap: 12, marginBottom: 28 }}>
              {filtered.map(f => (
                <div key={f.name} className="food-card" onClick={() => logFood(f)} style={{ background: SURF, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{f.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: BLUE, fontFamily: "monospace" }}>{f.cal}<span style={{ fontSize: 11, color: MUTED, fontWeight: 400 }}> kcal/100g</span></div>
                  <div style={{ display: "flex", gap: 5, marginTop: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 99, background: "rgba(0,123,255,0.15)", color: "#5BA3FF", fontWeight: 700 }}>P {f.protein}g</span>
                    <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 99, background: "rgba(155,93,229,0.15)", color: "#B47FFF", fontWeight: 700 }}>C {f.carbs}g</span>
                    <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 99, background: "rgba(255,123,44,0.15)", color: "#FF9F6B", fontWeight: 700 }}>F {f.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={card}>
                <div style={secTitle}>Today's Food Log</div>
                {foodLog.length === 0 && <div style={{ color: MUTED, fontSize: 13 }}>No meals logged yet. Click a food card above.</div>}
                {foodLog.map((item) => (
                  <div key={item.id} className="log-row" style={{ ...logItemStyle, gap: 8 }}>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div><div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{item.meal}</div></div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: BLUE, fontFamily: "monospace" }}>+{item.cal} kcal</span>
                    <button className="remove-btn" onClick={() => removeFood(item.id)} title="Remove" style={{ background: "rgba(255,94,91,0.12)", border: "1px solid rgba(255,94,91,0.25)", color: RED, borderRadius: 7, width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(0,229,160,0.04)", border: "1px solid rgba(0,229,160,0.15)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: GREEN, marginBottom: 12 }}>Nutrition Insight</div>
                <p style={{ fontSize: 14, color: "#9BA8C0", lineHeight: 1.75, marginBottom: 16 }}>You have consumed <strong style={{ color: TEXT }}>{loggedCal} kcal</strong> today. Your protein is <strong style={{ color: protein < 80 ? "#FF9F43" : GREEN }}>{protein < 80 ? "low" : "on track"}</strong>. {protein < 80 ? "Consider adding Moi Moi, beans, or Suya." : "Great job hitting your protein targets!"}</p>
                <MacroBar label="Protein" cur={protein} tgt={150} color={BLUE} />
                <MacroBar label="Fiber"   cur={fiber}   tgt={25}  color={GREEN} />
              </div>
            </div>
          </>
        )}

        {/* ════ ACTIVITY ════ */}
        {page === "activity" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Activity Tracker ⚡</h1>
              <p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>Log your physical activity and track your sitting time and sleep quality.</p>
            </div>

            {/* ── Sub-tab switcher ── */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28, background: SURF2, padding: 6, borderRadius: 12, border: `1px solid ${BORDER}`, width: "fit-content" }}>
              {[["exercise", "⚡ Exercise"], ["sitting", "🪑 Sitting"], ["sleep", "😴 Sleep"]].map(([id, label]) => (
                <button key={id} onClick={() => setActivityTab(id)}
                  style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, transition: "all 0.15s", background: activityTab === id ? BLUE : "transparent", color: activityTab === id ? "#fff" : MUTED }}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── EXERCISE SUB-TAB ── */}
            {activityTab === "exercise" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
                  <div><div style={{ fontSize: 15, fontWeight: 700 }}>Quick-Add Activities</div><p style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>Click an activity to log it. Hover a log item and click × to remove.</p></div>
                  <button onClick={() => showToast("Click any activity card to log it")} style={{ padding: "12px 22px", background: BLUE, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>+ Log Activity</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px,1fr))", gap: 12, marginBottom: 28 }}>
                  {EXERCISES.map(e => (
                    <div key={e.name} className="ex-card" onClick={() => logEx(e)} style={{ background: SURF, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 16px", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                      <div style={{ fontSize: 28, marginBottom: 10 }}>{e.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginBottom: 10 }}>{e.duration}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: GREEN, fontFamily: "monospace" }}>{e.burn}</div>
                      <div style={{ fontSize: 10, color: MUTED }}>kcal burned</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div style={card}>
                    <div style={secTitle}>Activity Log</div>
                    {exLog.length === 0 && <div style={{ color: MUTED, fontSize: 13 }}>No activities logged yet.</div>}
                    {exLog.map((e) => (
                      <div key={e.id} className="log-row" style={{ ...logItemStyle, gap: 10 }}>
                        <div style={{ width: 36, height: 36, background: "rgba(0,229,160,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{e.icon}</div>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{e.name}</div><div style={{ fontSize: 11, color: MUTED }}>{e.duration}</div></div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: GREEN, fontFamily: "monospace" }}>−{e.burn} kcal</span>
                        <button className="remove-btn" onClick={() => removeEx(e.id)} title="Remove" style={{ background: "rgba(255,94,91,0.12)", border: "1px solid rgba(255,94,91,0.25)", color: RED, borderRadius: 7, width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
                      </div>
                    ))}
                  </div>
                  <div style={card}>
                    <div style={secTitle}>Burn Summary</div>
                    <div style={{ textAlign: "center", padding: "14px 0 22px" }}><div style={{ fontSize: 52, fontWeight: 800, color: GREEN, fontFamily: "monospace", lineHeight: 1 }}>{burnedCal}</div><div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>total kcal burned today</div></div>
                    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 8 }}><div style={{ height: "100%", width: `${Math.min(100, Math.round(burnedCal / 500 * 100))}%`, background: GREEN, borderRadius: 99 }} /></div>
                    <div style={{ fontSize: 11, color: MUTED, textAlign: "right" }}>Target: 500 kcal / day</div>
                  </div>
                </div>
              </>
            )}

            {/* ── SITTING SUB-TAB ── */}
            {activityTab === "sitting" && (
              <>
                <div style={{ ...card, borderColor: sittingResult.border }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={secTitle}>🪑 Daily Sitting Time</div>
                      <div style={{ fontSize: 13, color: MUTED }}>Drag the slider to enter how many hours you sit per day.</div>
                    </div>
                    <div style={{ background: sittingResult.bg, border: `1px solid ${sittingResult.border}`, borderRadius: 10, padding: "8px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: sittingResult.color, fontFamily: "monospace" }}>{sittingHrs}h</div>
                      <div style={{ fontSize: 11, color: sittingResult.color, fontWeight: 700 }}>{sittingResult.label}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <input type="range" min="0" max="12" step="0.5" value={sittingHrs} onChange={e => setSittingHrs(parseFloat(e.target.value))} className="custom-range sitting-thumb" />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: MUTED, marginTop: 6 }}>
                      <span>0h</span><span style={{ color: "#00E5A0" }}>0–5h Healthy</span><span style={{ color: "#FF9F43" }}>6–8h Limit</span><span style={{ color: "#FF5E5B" }}>9–12h Danger</span><span>12h</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 8, marginBottom: 20 }}>
                    <div style={{ flex: 5, background: "#00E5A0" }} />
                    <div style={{ flex: 3, background: "#FF9F43" }} />
                    <div style={{ flex: 4, background: "#FF5E5B" }} />
                  </div>
                  <div style={{ background: sittingResult.bg, border: `1px solid ${sittingResult.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: sittingResult.color, marginBottom: 8 }}>{sittingResult.label}</div>
                    <p style={{ fontSize: 13, color: "#9BA8C0", lineHeight: 1.75, marginBottom: 10 }}>{sittingResult.advice}</p>
                    <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.75 }}>{sittingResult.detail}</p>
                    {sittingResult.risks && (
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: RED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Health Risks at This Level</div>
                        {sittingResult.risks.map((r, i) => <div key={i} style={{ fontSize: 13, color: "#9BA8C0", padding: "5px 0", borderBottom: i < sittingResult.risks.length - 1 ? `1px solid ${BORDER}` : "none" }}>{r}</div>)}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: MUTED }}>📚 Source: {sittingResult.src}</div>
                </div>
                <div style={card}>
                  <div style={secTitle}>💡 Tips to Reduce Sitting</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      ["🕐 Break every 30 min", "Stand up and move for 2–5 minutes every 30–45 minutes. Set a phone timer as a reminder."],
                      ["🚶 Walk after meals", "A 10-minute walk after eating improves blood sugar control and reduces post-meal cardiovascular strain."],
                      ["🖥 Standing desk", "Consider a standing desk or desk riser to alternate between sitting and standing throughout your workday."],
                      ["📞 Walk while on calls", "Take phone calls standing or walking rather than sitting — an easy daily habit that adds up quickly."],
                    ].map(([t, d]) => (
                      <div key={t} style={{ background: SURF2, borderRadius: 12, padding: 16, border: `1px solid ${BORDER}` }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{t}</div>
                        <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.7 }}>{d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── SLEEP SUB-TAB ── */}
            {activityTab === "sleep" && (
              <>
                <div style={{ ...card, borderColor: sleepResult.border }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={secTitle}>😴 Nightly Sleep Duration</div>
                      <div style={{ fontSize: 13, color: MUTED }}>Drag the slider to enter how many hours you sleep per night.</div>
                    </div>
                    <div style={{ background: sleepResult.bg, border: `1px solid ${sleepResult.border}`, borderRadius: 10, padding: "8px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: sleepResult.color, fontFamily: "monospace" }}>{sleepHrs}h</div>
                      <div style={{ fontSize: 11, color: sleepResult.color, fontWeight: 700 }}>{sleepResult.label}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <input type="range" min="3" max="12" step="0.5" value={sleepHrs} onChange={e => setSleepHrs(parseFloat(e.target.value))} className="custom-range sleep-thumb" />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: MUTED, marginTop: 6 }}>
                      <span>3h</span><span style={{ color: "#FF5E5B" }}>&lt;6h Too little</span><span style={{ color: "#00E5A0" }}>7–9h Optimal</span><span style={{ color: "#FF9F43" }}>&gt;9h Too much</span><span>12h</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 8, marginBottom: 20 }}>
                    <div style={{ flex: 3, background: "#FF5E5B" }} />
                    <div style={{ flex: 3, background: "#00E5A0" }} />
                    <div style={{ flex: 3, background: "#FF9F43" }} />
                  </div>
                  <div style={{ background: sleepResult.bg, border: `1px solid ${sleepResult.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: sleepResult.color, marginBottom: 8 }}>{sleepResult.label}</div>
                    <p style={{ fontSize: 13, color: "#9BA8C0", lineHeight: 1.75, marginBottom: 10 }}>{sleepResult.advice}</p>
                    <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.75 }}>{sleepResult.detail}</p>
                    {sleepResult.risks && (
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: RED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Health Risks at This Level</div>
                        {sleepResult.risks.map((r, i) => <div key={i} style={{ fontSize: 13, color: "#9BA8C0", padding: "5px 0", borderBottom: i < sleepResult.risks.length - 1 ? `1px solid ${BORDER}` : "none" }}>{r}</div>)}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: MUTED }}>📚 Source: {sleepResult.src}</div>
                </div>
                <div style={card}>
                  <div style={secTitle}>💡 Tips for Better Sleep</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      ["📵 Screen curfew", "Avoid screens 30–60 minutes before bed. Blue light suppresses melatonin and delays sleep onset."],
                      ["🌡️ Cool your room", "A bedroom temperature of 16–20°C (60–68°F) supports deeper, more restorative sleep cycles."],
                      ["⏰ Consistent schedule", "Going to bed and waking at the same time every day — including weekends — regulates your circadian rhythm."],
                      ["☕ Cut caffeine early", "Avoid caffeine after 2pm. It has a half-life of 5–6 hours and significantly disrupts sleep architecture."],
                    ].map(([t, d]) => (
                      <div key={t} style={{ background: SURF2, borderRadius: 12, padding: 16, border: `1px solid ${BORDER}` }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{t}</div>
                        <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.7 }}>{d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ════ PROFILE ════ */}
        {page === "profile" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Your Profile</h1>
              <p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>{!profileComplete ? "👋 Welcome! Fill in your details — this data is saved only on your device." : "Your stats are saved locally. Update anytime."}</p>
            </div>
            {profileComplete && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 22 }}>
                {[{ label: "BMI", val: bmi, sub: bmiLabel, color: bmiColor }, { label: "BMR", val: bmr.toLocaleString(), sub: "kcal / day at rest", color: BLUE }, { label: "TDEE", val: tdee.toLocaleString(), sub: "kcal / day (active)", color: "#FF9F43" }].map(s => (
                  <div key={s.label} style={{ background: SURF2, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20, textAlign: "center" }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "monospace", marginBottom: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: s.color, marginTop: 4, fontWeight: 600 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={card}>
              <div style={secTitle}>Personal Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px 40px" }}>
                {[{ label: "Full Name", key: "name", type: "text", placeholder: "e.g. Chidi Okafor" }, { label: "Age (years)", key: "age", type: "number", placeholder: "e.g. 25" }, { label: "Weight (kg)", key: "weight", type: "number", placeholder: "e.g. 72" }, { label: "Height (cm)", key: "height", type: "number", placeholder: "e.g. 175" }].map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{f.label}</div>
                    <input type={f.type} value={draftProfile[f.key]} placeholder={f.placeholder} onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.12)", padding: "10px 0", color: TEXT, fontSize: 16, fontWeight: 600, outline: "none", fontFamily: "inherit" }} />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Sex</div>
                  <select value={draftProfile.sex} onChange={e => setDraft(p => ({ ...p, sex: e.target.value }))} style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.12)", padding: "10px 0", color: TEXT, fontSize: 16, fontWeight: 600, outline: "none", fontFamily: "inherit", cursor: "pointer" }}><option>Male</option><option>Female</option></select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button onClick={saveProfile} style={{ padding: "12px 24px", background: BLUE, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{profileComplete ? "Save Changes" : "Save & Get Started →"}</button>
                {profileComplete && <button onClick={() => { setDraft(profile); showToast("Changes discarded"); }} style={{ padding: "12px 20px", background: "transparent", color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Discard</button>}
              </div>
              <div style={{ marginTop: 16, fontSize: 12, color: MUTED }}>🔒 Your data is saved only in your browser's localStorage — never sent anywhere.</div>
            </div>
            <div style={card}>
              <div style={secTitle}>What These Mean</div>
              {[["BMI", "Body Mass Index — a ratio of weight to height. Normal range: 18.5–24.9."], ["BMR", "Basal Metabolic Rate — the calories your body burns per day at complete rest."], ["TDEE", "Total Daily Energy Expenditure — your BMR multiplied by an activity factor (1.375 = lightly active)."]].map(([t, d]) => (
                <div key={t} style={{ marginBottom: 12 }}><span style={{ fontSize: 13, fontWeight: 700 }}>{t} — </span><span style={{ fontSize: 13, color: MUTED }}>{d}</span></div>
              ))}
            </div>
          </>
        )}

        {/* ════ ABOUT ════ */}
        {page === "about" && (
          <>
            <div style={{ background: "linear-gradient(135deg, rgba(0,123,255,0.07), rgba(155,93,229,0.07))", border: "1px solid rgba(0,123,255,0.15)", borderRadius: 20, padding: 40, textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>❤️</div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 10 }}>Cardio<span style={{ color: BLUE }}>Pal</span></div>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.8, maxWidth: 500, margin: "0 auto" }}>A Nigerian-first nutrition and fitness tracker built with localised food data and evidence-based cardiovascular health guidance.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div style={card}>
                <div style={secTitle}>Our Mission</div>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.8 }}>Most nutrition apps rely on Western food databases — leaving Nigerian users to guess the nutritional value of Jollof Rice, Egusi Soup, or Suya. CardioPal solves this with <strong style={{ color: TEXT }}>20+ Nigerian foods</strong> backed by research, alongside evidence-based wellness guidance on sitting, sleep, and cardiovascular health.</p>
              </div>
              <div style={card}>
                <div style={secTitle}>Features</div>
                {["🍽  Nigerian food database (20+ foods)", "📊  Macro & calorie tracking", "⚡  Exercise burn calculator", "🫀  Sitting & sleep wellness tracker", "📐  BMI & BMR calculator", "❓  20-question cardiovascular FAQ", "🔒  Data stored locally — never shared", "↔️  Collapsible sidebar"].map(f => (
                  <div key={f} style={{ fontSize: 13, color: MUTED, marginBottom: 10 }}>{f}</div>
                ))}
              </div>
            </div>

            {/* ── FAQ ── */}
            <div style={card}>
              <div style={secTitle}>❓ Cardiovascular Health FAQ</div>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.7 }}>20 evidence-based questions and answers on cardiovascular health and exercise, sourced from peer-reviewed research and leading health organisations.</p>
              <div>
                {FAQ.map((item, i) => (
                  <div key={i} className="faq-item">
                    <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: openFaq === i ? BLUE : TEXT, lineHeight: 1.5 }}>{i + 1}. {item.q}</span>
                      <span style={{ fontSize: 18, color: openFaq === i ? BLUE : MUTED, flexShrink: 0, lineHeight: 1 }}>{openFaq === i ? "−" : "+"}</span>
                    </div>
                    {openFaq === i && (
                      <div className="faq-a">
                        <p style={{ marginBottom: 10 }}>{item.a}</p>
                        <p style={{ fontSize: 11, color: "#3A4A6A", fontStyle: "italic" }}>📚 Source: {item.src}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={secTitle}>Tech Stack</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 12 }}>
                {[["React", "UI Framework"], ["localStorage", "Data Persistence"], ["JSON", "Food Database"], ["CSS-in-JS", "Styling"], ["Vite", "Build Tool"], ["Expo (RN)", "Mobile Version"]].map(([n, r]) => (
                  <div key={n} style={{ background: SURF2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{n}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{r}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: SURF2, border: `1px solid ${BLUE}`, borderRadius: 12, padding: "12px 18px", fontSize: 13, fontWeight: 600, color: TEXT, zIndex: 999, boxShadow: "0 4px 24px rgba(0,123,255,0.25)", animation: "slideUp 0.3s ease" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
