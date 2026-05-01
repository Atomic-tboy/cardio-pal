import { useState, useEffect, useCallback } from "react";

// ── Data ─────────────────────────────────────────────────────────────────────

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
  { id: "exercise", label: "Exercise", icon: "⚡" },
  { id: "profile",  label: "Profile",  icon: "◎" },
  { id: "about",    label: "About",    icon: "ℹ" },
];

const GOAL = 2100;
const EMPTY_PROFILE = { name: "", age: "", weight: "", height: "", sex: "Male" };

// ── localStorage helpers ──────────────────────────────────────────────────────

function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── Small reusable components ─────────────────────────────────────────────────

function CircleProgress({ pct, size = 140, stroke = 10 }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(100, pct) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#007BFF" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
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

// ── Main App ──────────────────────────────────────────────────────────────────

export default function CardioPal() {

  // ── Profile — loaded from localStorage, empty by default ──────────────────
  const [profile, setProfile]   = useState(() => lsGet("cp_profile", EMPTY_PROFILE));
  const [draftProfile, setDraft] = useState(() => lsGet("cp_profile", EMPTY_PROFILE));

  // Profile is "complete" only when name + at least age/weight/height filled in
  const profileComplete = profile.name.trim() !== "" && profile.age !== "" && profile.weight !== "" && profile.height !== "";

  // ── Active page — default to profile if not set up yet ────────────────────
  const [page, setPage]         = useState(() => profileComplete ? "home" : "profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast]       = useState(null);
  const [search, setSearch]     = useState("");

  // ── Logs — also persisted ─────────────────────────────────────────────────
  const [foodLog, setFoodLog]   = useState(() => lsGet("cp_food_log", []));
  const [exLog,   setExLog]     = useState(() => lsGet("cp_ex_log",   []));

  // Persist logs to localStorage whenever they change
  useEffect(() => { lsSet("cp_food_log", foodLog); }, [foodLog]);
  useEffect(() => { lsSet("cp_ex_log",   exLog);   }, [exLog]);

  // ── Derived values ────────────────────────────────────────────────────────
  const loggedCal = foodLog.reduce((a, b) => a + b.cal, 0);
  const burnedCal = exLog.reduce((a, b) => a + b.burn, 0);
  const remaining = GOAL - loggedCal + burnedCal;
  const pct       = Math.min(100, Math.round((loggedCal / GOAL) * 100));
  const protein   = Math.round(loggedCal * 0.15 / 4);
  const carbs     = Math.round(loggedCal * 0.55 / 4);
  const fat       = Math.round(loggedCal * 0.30 / 9);
  const fiber     = Math.round(loggedCal * 0.018 / 2);

  const w = parseFloat(profile.weight) || 0;
  const h = parseFloat(profile.height) || 0;
  const a = parseFloat(profile.age)    || 0;
  const bmi      = h > 0 ? +(w / ((h / 100) ** 2)).toFixed(1) : 0;
  const bmr      = profile.sex === "Male"
    ? Math.round(10 * w + 6.25 * h - 5 * a + 5)
    : Math.round(10 * w + 6.25 * h - 5 * a - 161);
  const tdee     = Math.round(bmr * 1.375);
  const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const bmiColor = bmi < 18.5 ? "#FF9F43" : bmi < 25 ? "#00E5A0" : bmi < 30 ? "#FF9F43" : "#FF5E5B";

  // ── Handlers ──────────────────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const logFood = useCallback((f) => {
    const entry = { id: Date.now(), name: f.name, meal: "Snack", cal: Math.round(f.cal * 1.5) };
    setFoodLog(p => [...p, entry]);
    showToast(`✓ ${f.name} logged`);
  }, [showToast]);

  const removeFood = useCallback((id) => {
    setFoodLog(p => p.filter(item => item.id !== id));
    showToast("✕ Item removed");
  }, [showToast]);

  const logEx = useCallback((e) => {
    const entry = { id: Date.now(), ...e };
    setExLog(p => [...p, entry]);
    showToast(`✓ ${e.name} — ${e.burn} kcal burned`);
  }, [showToast]);

  const removeEx = useCallback((id) => {
    setExLog(p => p.filter(item => item.id !== id));
    showToast("✕ Activity removed");
  }, [showToast]);

  const saveProfile = useCallback(() => {
    const saved = { ...draftProfile };
    setProfile(saved);
    lsSet("cp_profile", saved);
    const complete = saved.name.trim() !== "" && saved.age !== "" && saved.weight !== "" && saved.height !== "";
    showToast("✓ Profile saved!");
    if (complete) setTimeout(() => setPage("home"), 600);
  }, [draftProfile, showToast]);

  const filtered = FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const BG     = "#0A0C12";
  const SURF   = "#111827";
  const SURF2  = "#0D1118";
  const BLUE   = "#007BFF";
  const GREEN  = "#00E5A0";
  const MUTED  = "#5A6A8A";
  const TEXT   = "#F0F4FF";
  const BORDER = "rgba(255,255,255,0.07)";
  const RED    = "#FF5E5B";

  const card          = { background: SURF, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 20 };
  const secTitle      = { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUTED, marginBottom: 18 };
  const logItemStyle  = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${BORDER}` };

  const SIDEBAR_W = sidebarOpen ? 220 : 64;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG, fontFamily: "'Segoe UI', system-ui, sans-serif", color: TEXT }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        input, select { color: ${TEXT}; }
        input::placeholder { color: ${MUTED}; }
        select option { background: ${SURF}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .food-card:hover  { border-color: ${BLUE}  !important; background: rgba(0,123,255,0.06) !important; transform: translateY(-2px); }
        .ex-card:hover    { border-color: ${GREEN} !important; background: rgba(0,229,160,0.05) !important; transform: translateY(-2px); }
        .nav-link:hover   { color: ${TEXT} !important; background: rgba(255,255,255,0.04) !important; }
        .remove-btn       { opacity: 0; transition: opacity 0.15s; }
        .log-row:hover .remove-btn { opacity: 1; }
        .sidebar-toggle:hover { background: rgba(255,255,255,0.08) !important; }
        @media (max-width: 700px) {
          .sidebar-forced { width: 64px !important; }
          .sidebar-label  { display: none !important; }
          .sidebar-logo-text { display: none !important; }
          .main-content   { padding: 20px 16px !important; }
        }
      `}</style>

      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <aside style={{
        width: SIDEBAR_W, minHeight: "100vh", background: SURF2,
        borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column",
        padding: sidebarOpen ? "20px 12px" : "20px 10px",
        position: "sticky", top: 0, height: "100vh",
        transition: "width 0.25s ease, padding 0.25s ease", overflow: "hidden", flexShrink: 0,
      }}>
        {/* Logo + toggle button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 20, borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
            {/* <div style={{ width: 34, height: 34, minWidth: 34, background: BLUE, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
            </div> */}
            {sidebarOpen && (
              <span className="sidebar-logo-text" style={{ fontSize: 16, fontWeight: 800, color: TEXT, whiteSpace: "nowrap" }}>
                Cardio<span style={{ color: BLUE }}>Pal</span>
              </span>
            )}
          </div>

          {/* Collapse / expand toggle */}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(o => !o)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: MUTED, borderRadius: 8, padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarOpen
                ? <><polyline points="15 18 9 12 15 6"/></>
                : <><polyline points="9 18 15 12 9 6"/></>}
            </svg>
          </button>
        </div>

        {/* Nav items */}
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <div key={n.id}
              className="nav-link"
              onClick={() => setPage(n.id)}
              title={!sidebarOpen ? n.label : undefined}
              style={{
                display: "flex", alignItems: "center", gap: sidebarOpen ? 10 : 0,
                justifyContent: sidebarOpen ? "flex-start" : "center",
                padding: sidebarOpen ? "10px 14px" : "10px",
                borderRadius: 10, cursor: "pointer", marginBottom: 4,
                fontSize: 14, fontWeight: 600, transition: "all 0.15s",
                color: active ? TEXT : MUTED,
                background: active ? "rgba(0,123,255,0.12)" : "transparent",
                borderLeft: active ? `3px solid ${BLUE}` : "3px solid transparent",
                whiteSpace: "nowrap", overflow: "hidden",
              }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
              {sidebarOpen && <span className="sidebar-label">{n.label}</span>}
            </div>
          );
        })}

        {/* Footer user info */}
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

      {/* ── MAIN ─────────────────────────────────────────────────────── */}
      <main className="main-content" style={{ flex: 1, padding: "36px 40px", overflowY: "auto", maxWidth: "calc(100vw - " + SIDEBAR_W + "px)" }}>

        {/* ════ PROFILE-FIRST BANNER ════ */}
        {!profileComplete && page !== "profile" && (
          <div style={{ background: "rgba(255,159,67,0.1)", border: "1px solid rgba(255,159,67,0.3)", borderRadius: 12, padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, animation: "fadeIn 0.3s ease" }}>
            <span style={{ fontSize: 13, color: "#FFD08A" }}>👤 Set up your profile to unlock personalised calorie goals and BMI calculations.</span>
            <button onClick={() => setPage("profile")}
              style={{ background: "#FF9F43", color: "#000", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              Complete Profile →
            </button>
          </div>
        )}

        {/* ════ HOME ════ */}
        {page === "home" && (
          <>
            <div style={{ marginBottom: 30 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>
                {profile.name ? `Welcome back, ${profile.name}` : "Welcome to CardioPal "}
              </h1>
              <p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>
                {new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* Hero */}
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
                  {[
                    { label: "Goal",      val: GOAL.toLocaleString(),       color: TEXT             },
                    { label: null,         val: "−",                         color: MUTED             },
                    { label: "Eaten",      val: loggedCal.toLocaleString(),  color: BLUE              },
                    { label: null,         val: "+",                         color: MUTED             },
                    { label: "Burned",     val: burnedCal.toLocaleString(),  color: GREEN             },
                    { label: null,         val: "=",                         color: MUTED             },
                    { label: "Remaining",  val: remaining.toLocaleString(),  color: remaining < 0 ? RED : TEXT, big: true },
                  ].map((item, i) =>
                    item.label === null
                      ? <div key={i} style={{ fontSize: 22, color: item.color, fontWeight: 300 }}>{item.val}</div>
                      : <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: 5 }}>{item.label}</div>
                          <div style={{ fontSize: item.big ? 30 : 22, fontWeight: 800, color: item.color, fontFamily: "monospace" }}>{item.val}</div>
                        </div>
                  )}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#0055CC,#007BFF)", borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: 11, color: MUTED, textAlign: "right" }}>{pct}% of daily target reached</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={card}>
                <div style={secTitle}>Macronutrients Today</div>
                <MacroBar label="Protein" cur={protein} tgt={150} color={BLUE}     />
                <MacroBar label="Carbs"   cur={carbs}   tgt={250} color="#9B5DE5"  />
                <MacroBar label="Fats"    cur={fat}      tgt={65}  color="#FF7B2C"  />
                <MacroBar label="Fiber"   cur={fiber}    tgt={25}  color={GREEN}    />
              </div>

              <div style={card}>
                <div style={secTitle}>Today's Log</div>
                {foodLog.length === 0 && exLog.length === 0 && (
                  <div style={{ color: MUTED, fontSize: 13 }}>Nothing logged yet. Head to Food or Exercise to start.</div>
                )}
                {[...foodLog.slice(-3).map(f => ({ name: f.name, sub: f.meal, val: `+${f.cal} kcal`, color: BLUE })),
                   ...exLog.slice(-2).map(e => ({ name: `${e.icon} ${e.name}`, sub: `Exercise • ${e.duration}`, val: `−${e.burn} kcal`, color: GREEN }))
                ].map((item, i, arr) => (
                  <div key={i} style={{ ...logItemStyle, borderBottom: i === arr.length - 1 ? "none" : undefined }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{item.sub}</div>
                    </div>
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
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Food Log</h1>
                <p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>Click any food to log it. Click × to remove a logged item.</p>
              </div>
              <button onClick={() => showToast("Click any food card below to log it")}
                style={{ padding: "12px 22px", background: BLUE, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                + Log Meal
              </button>
            </div>

            <input
              style={{ width: "100%", background: SURF, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "13px 18px", color: TEXT, fontSize: 14, outline: "none", fontFamily: "inherit", marginBottom: 20 }}
              placeholder="Search — try Egusi, Suya, Jollof, Moi Moi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Nigerian Foods Database</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(188px,1fr))", gap: 12, marginBottom: 28 }}>
              {filtered.map(f => (
                <div key={f.name} className="food-card" onClick={() => logFood(f)}
                  style={{ background: SURF, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{f.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: BLUE, fontFamily: "monospace" }}>
                    {f.cal}<span style={{ fontSize: 11, color: MUTED, fontWeight: 400 }}> kcal/100g</span>
                  </div>
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
                {foodLog.length === 0 && (
                  <div style={{ color: MUTED, fontSize: 13 }}>No meals logged yet. Click a food card above to add one.</div>
                )}
                {foodLog.map((item) => (
                  <div key={item.id} className="log-row" style={{ ...logItemStyle, gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{item.meal}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: BLUE, fontFamily: "monospace" }}>+{item.cal} kcal</span>
                    <button
                      className="remove-btn"
                      onClick={() => removeFood(item.id)}
                      title="Remove this item"
                      style={{ background: "rgba(255,94,91,0.12)", border: "1px solid rgba(255,94,91,0.25)", color: RED, borderRadius: 7, width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(0,229,160,0.04)", border: "1px solid rgba(0,229,160,0.15)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: GREEN, marginBottom: 12 }}>Nutrition Insight</div>
                <p style={{ fontSize: 14, color: "#9BA8C0", lineHeight: 1.75, marginBottom: 16 }}>
                  You have consumed <strong style={{ color: TEXT }}>{loggedCal} kcal</strong> today.
                  Your protein is <strong style={{ color: protein < 80 ? "#FF9F43" : GREEN }}>{protein < 80 ? "low" : "on track"}</strong>.{" "}
                  {protein < 80 ? "Consider adding Moi Moi, beans, or Suya to your next meal." : "Great job hitting your protein targets!"}
                </p>
                <MacroBar label="Protein" cur={protein} tgt={150} color={BLUE}  />
                <MacroBar label="Fiber"   cur={fiber}   tgt={25}  color={GREEN} />
              </div>
            </div>
          </>
        )}

        {/* ════ EXERCISE ════ */}
        {page === "exercise" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Exercise Tracker</h1>
                <p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>Click an activity to log it. Click × to remove a logged entry.</p>
              </div>
              <button onClick={() => showToast("Click any activity card to log it instantly")}
                style={{ padding: "12px 22px", background: BLUE, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                + Log Activity
              </button>
            </div>

            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Quick-Add Activities</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px,1fr))", gap: 12, marginBottom: 28 }}>
              {EXERCISES.map(e => (
                <div key={e.name} className="ex-card" onClick={() => logEx(e)}
                  style={{ background: SURF, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 16px", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
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
                {exLog.length === 0 && (
                  <div style={{ color: MUTED, fontSize: 13 }}>No activities logged yet. Click a card above to add one.</div>
                )}
                {exLog.map((e) => (
                  <div key={e.id} className="log-row" style={{ ...logItemStyle, gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: "rgba(0,229,160,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{e.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>{e.duration}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: GREEN, fontFamily: "monospace" }}>−{e.burn} kcal</span>
                    <button
                      className="remove-btn"
                      onClick={() => removeEx(e.id)}
                      title="Remove this activity"
                      style={{ background: "rgba(255,94,91,0.12)", border: "1px solid rgba(255,94,91,0.25)", color: RED, borderRadius: 7, width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div style={card}>
                <div style={secTitle}>Burn Summary</div>
                <div style={{ textAlign: "center", padding: "14px 0 22px" }}>
                  <div style={{ fontSize: 52, fontWeight: 800, color: GREEN, fontFamily: "monospace", lineHeight: 1 }}>{burnedCal}</div>
                  <div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>total kcal burned today</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", width: `${Math.min(100, Math.round(burnedCal / 500 * 100))}%`, background: GREEN, borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 11, color: MUTED, textAlign: "right" }}>Target: 500 kcal / day</div>
              </div>
            </div>
          </>
        )}

        {/* ════ PROFILE ════ */}
        {page === "profile" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Your Profile</h1>
              <p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>
                {!profileComplete
                  ? "👋 Welcome! Fill in your details to get started — this data is saved only on your device."
                  : "Your stats are saved locally on this device. Update anytime."}
              </p>
            </div>

            {/* Stats (only show when profile is complete) */}
            {profileComplete && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 22 }}>
                {[
                  { label: "BMI",  val: bmi,                  sub: bmiLabel,            color: bmiColor  },
                  { label: "BMR",  val: bmr.toLocaleString(),  sub: "kcal / day at rest", color: BLUE      },
                  { label: "TDEE", val: tdee.toLocaleString(), sub: "kcal / day (active)", color: "#FF9F43" },
                ].map(s => (
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
                {[
                  { label: "Full Name",   key: "name",   type: "text",   placeholder: "e.g. Chidi Okafor"  },
                  { label: "Age (years)", key: "age",    type: "number", placeholder: "e.g. 25"             },
                  { label: "Weight (kg)", key: "weight", type: "number", placeholder: "e.g. 72"             },
                  { label: "Height (cm)", key: "height", type: "number", placeholder: "e.g. 175"            },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{f.label}</div>
                    <input
                      type={f.type}
                      value={draftProfile[f.key]}
                      placeholder={f.placeholder}
                      onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid rgba(255,255,255,0.12)`, padding: "10px 0", color: TEXT, fontSize: 16, fontWeight: 600, outline: "none", fontFamily: "inherit" }}
                    />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Sex</div>
                  <select
                    value={draftProfile.sex}
                    onChange={e => setDraft(p => ({ ...p, sex: e.target.value }))}
                    style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid rgba(255,255,255,0.12)`, padding: "10px 0", color: TEXT, fontSize: 16, fontWeight: 600, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button onClick={saveProfile}
                  style={{ padding: "12px 24px", background: BLUE, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {profileComplete ? "Save Changes" : "Save & Get Started →"}
                </button>
                {profileComplete && (
                  <button onClick={() => { setDraft(profile); showToast("Changes discarded"); }}
                    style={{ padding: "12px 20px", background: "transparent", color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Discard
                  </button>
                )}
              </div>

              <div style={{ marginTop: 16, fontSize: 12, color: MUTED, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🔒</span> Your data is saved only in your browser's localStorage — never sent anywhere.
              </div>
            </div>

            <div style={card}>
              <div style={secTitle}>What These Mean</div>
              {[
                ["BMI",  "Body Mass Index — a ratio of weight to height. Normal range: 18.5–24.9."],
                ["BMR",  "Basal Metabolic Rate — the calories your body burns per day at complete rest."],
                ["TDEE", "Total Daily Energy Expenditure — your BMR multiplied by an activity factor (1.375 = lightly active)."],
              ].map(([t, d]) => (
                <div key={t} style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{t} — </span>
                  <span style={{ fontSize: 13, color: MUTED }}>{d}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ════ ABOUT ════ */}
        {page === "about" && (
          <>
            <div style={{ background: "linear-gradient(135deg, rgba(0,123,255,0.07), rgba(155,93,229,0.07))", border: "1px solid rgba(0,123,255,0.15)", borderRadius: 20, padding: 40, textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>❤️</div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 10 }}>
                Cardio<span style={{ color: BLUE }}>Pal</span>
              </div>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.8, maxWidth: 500, margin: "0 auto" }}>
                A Nigerian-first nutrition and fitness tracker built with localised food data — helping Nigerians make informed dietary choices using the meals they actually eat every day.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div style={card}>
                <div style={secTitle}>Our Mission</div>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.8 }}>
                  Most nutrition apps rely on Western food databases — leaving Nigerian users to guess the nutritional value of Jollof Rice, Egusi Soup, or Suya. CardioPal solves this with a comprehensive, research-backed database of{" "}
                  <strong style={{ color: TEXT }}>20+ common Nigerian foods</strong> with accurate macro and micronutrient data.
                </p>
              </div>
              <div style={card}>
                <div style={secTitle}>Features</div>
                {["🍽  Nigerian food database (20+ foods)", "📊  Macro & calorie tracking", "⚡  Exercise burn calculator", "🧠  Smart nutrition insights", "📐  BMI & BMR calculator", "🔒  Data stored locally — never shared", "↔️  Collapsible sidebar"].map(f => (
                  <div key={f} style={{ fontSize: 13, color: MUTED, marginBottom: 10 }}>{f}</div>
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

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: SURF2, border: `1px solid ${BLUE}`, borderRadius: 12, padding: "12px 18px", fontSize: 13, fontWeight: 600, color: TEXT, zIndex: 999, boxShadow: "0 4px 24px rgba(0,123,255,0.25)", animation: "slideUp 0.3s ease" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
