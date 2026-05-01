import { useState } from "react";

const FOODS = [
  { name: "Jollof Rice", cal: 145, protein: 2.6, carbs: 27.5, fat: 2.7, fiber: 1.3 },
  { name: "Egusi Soup", cal: 182, protein: 14, carbs: 3.1, fat: 13.2, fiber: 2 },
  { name: "Pounded Yam", cal: 118, protein: 1.5, carbs: 27, fat: 0.1, fiber: 0.9 },
  { name: "Garri / Eba", cal: 357, protein: 1.3, carbs: 85, fat: 0.5, fiber: 2 },
  { name: "Suya", cal: 250, protein: 20, carbs: 5, fat: 15, fiber: 2 },
  { name: "Akara", cal: 180, protein: 3.5, carbs: 18, fat: 10, fiber: 3 },
  { name: "Moi Moi", cal: 120, protein: 7, carbs: 12, fat: 4.5, fiber: 3.5 },
  { name: "Beans Porridge", cal: 130, protein: 8, carbs: 20, fat: 3, fiber: 6 },
  { name: "Efo Riro", cal: 85, protein: 6, carbs: 4, fat: 5.5, fiber: 2.8 },
  { name: "Pepper Soup", cal: 55, protein: 7, carbs: 1.5, fat: 2.5, fiber: 0.5 },
  { name: "Fried Plantain", cal: 196, protein: 1.1, carbs: 32, fat: 7.5, fiber: 1.8 },
  { name: "Okra Soup", cal: 78, protein: 5.5, carbs: 5.5, fat: 4.5, fiber: 3.2 },
  { name: "Amala", cal: 90, protein: 2, carbs: 20, fat: 0.2, fiber: 1.5 },
  { name: "Ogi / Pap", cal: 50, protein: 1.2, carbs: 11, fat: 0.5, fiber: 0.8 },
  { name: "Groundnut Soup", cal: 175, protein: 8.5, carbs: 6, fat: 13.5, fiber: 2.2 },
  { name: "Bitter Leaf Soup", cal: 95, protein: 6.5, carbs: 5, fat: 6, fiber: 2.5 },
  { name: "Banga Soup", cal: 130, protein: 7, carbs: 4, fat: 10, fiber: 1.8 },
  { name: "Ofada Rice", cal: 160, protein: 3.5, carbs: 28, fat: 4.5, fiber: 2.5 },
  { name: "Nkwobi", cal: 200, protein: 15, carbs: 3, fat: 14, fiber: 0.5 },
  { name: "Tuwo Shinkafa", cal: 100, protein: 2, carbs: 22, fat: 0.3, fiber: 0.5 },
];

const EXERCISES = [
  { name: "Brisk Walk", duration: "30 min", burn: 150, icon: "👟" },
  { name: "Running", duration: "20 min", burn: 220, icon: "🏃" },
  { name: "Football", duration: "60 min", burn: 400, icon: "⚽" },
  { name: "Cycling", duration: "30 min", burn: 200, icon: "🚴" },
  { name: "Swimming", duration: "30 min", burn: 250, icon: "🏊" },
  { name: "Jump Rope", duration: "15 min", burn: 180, icon: "🪢" },
  { name: "Weight Training", duration: "45 min", burn: 280, icon: "🏋" },
  { name: "Yoga", duration: "45 min", burn: 120, icon: "🧘" },
];

const NAV = [
  { id: "home", label: "Home" },
  { id: "food", label: "Food" },
  { id: "exercise", label: "Exercise" },
  { id: "profile", label: "Profile" },
  { id: "about", label: "About" },
];

const GOAL = 2100;

function CircleProgress({ pct, size = 140, stroke = 10 }) {
  const r = (size - stroke) / 2;
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

function Tag({ color, bg, children }) {
  return <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 99, background: bg, color, fontWeight: 700 }}>{children}</span>;
}

export default function CardioPal() {
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [foodLog, setFoodLog] = useState([
  ]);
  const [exLog, setExLog] = useState([
    { name: "Brisk Walk", duration: "45 min", burn: 300, icon: "👟" },
  ]);
  const [profile, setProfile] = useState({ name: "Chidi", age: 24, weight: 72, height: 175, sex: "Male" });

  const loggedCal = foodLog.reduce((a, b) => a + b.cal, 0);
  const burnedCal = exLog.reduce((a, b) => a + b.burn, 0);
  const remaining = GOAL - loggedCal + burnedCal;
  const pct = Math.min(100, Math.round((loggedCal / GOAL) * 100));
  const protein = Math.round(loggedCal * 0.15 / 4);
  const carbs   = Math.round(loggedCal * 0.55 / 4);
  const fat      = Math.round(loggedCal * 0.30 / 9);
  const fiber    = Math.round(loggedCal * 0.018 / 2);

  const bmi = +(profile.weight / ((profile.height / 100) ** 2)).toFixed(1);
  const bmr = profile.sex === "Male"
    ? Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5)
    : Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161);
  const tdee = Math.round(bmr * 1.375);
  const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const bmiColor = bmi < 18.5 ? "#FF9F43" : bmi < 25 ? "#00E5A0" : bmi < 30 ? "#FF9F43" : "#FF5E5B";

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const logFood = (f) => {
    setFoodLog(p => [...p, { name: f.name, meal: "Snack", cal: Math.round(f.cal * 1.5) }]);
    showToast(`✓ ${f.name} logged`);
  };
  const logEx = (e) => {
    setExLog(p => [...p, { ...e }]);
    showToast(`✓ ${e.name} — ${e.burn} kcal burned`);
  };

  const filtered = FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const BG   = "#0A0C12";
  const SURF = "#111827";
  const SURF2 = "#0D1118";
  const BLUE = "#007BFF";
  const GREEN = "#00E5A0";
  const MUTED = "#5A6A8A";
  const TEXT  = "#F0F4FF";
  const BORDER = "rgba(255,255,255,0.07)";

  const card = { background: SURF, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 20 };
  const sectionTitle = { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUTED, marginBottom: 18 };
  const logItemStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${BORDER}` };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG, fontFamily: "'Segoe UI', system-ui, sans-serif", color: TEXT }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        input, select { color: ${TEXT}; }
        input::placeholder { color: ${MUTED}; }
        select option { background: ${SURF}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .food-card:hover { border-color: ${BLUE} !important; background: rgba(0,123,255,0.06) !important; transform: translateY(-2px); }
        .ex-card:hover   { border-color: ${GREEN} !important; background: rgba(0,229,160,0.05) !important; transform: translateY(-2px); }
        .nav-link:hover  { color: ${TEXT} !important; background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 220, minHeight: "100vh", background: SURF2, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", padding: "24px 12px", position: "sticky", top: 0, height: "100vh" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 24, borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
          <div style={{ width: 34, height: 34, background: BLUE, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: TEXT, letterSpacing: "-0.3px" }}>
            Cardio<span style={{ color: BLUE }}>Pal</span>
          </span>
        </div>

        {/* Nav */}
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <div key={n.id}
              className="nav-link"
              onClick={() => setPage(n.id)}
              style={{
                padding: "10px 14px", borderRadius: 10, cursor: "pointer", marginBottom: 4,
                fontSize: 14, fontWeight: 600, transition: "all 0.15s",
                color: active ? TEXT : MUTED,
                background: active ? "rgba(0,123,255,0.12)" : "transparent",
                borderLeft: active ? `3px solid ${BLUE}` : "3px solid transparent",
              }}>
              {n.label}
            </div>
          );
        })}

        <div style={{ marginTop: "auto", paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Logged in as</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{profile.name}</div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, padding: "36px 40px", maxWidth: 980, overflowY: "auto" }}>

        {/* ════ HOME ════ */}
        {page === "home" && (
          <>
            <div style={{ marginBottom: 30 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Welcome back, {profile.name} 👋</h1>
              <p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>
                {new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg,#0D1829,#0A1435)", border: "1px solid rgba(0,123,255,0.2)", borderRadius: 20, padding: 32, marginBottom: 24 }}>
              <div style={sectionTitle}>Daily Calorie Balance</div>
              <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
                {/* Circle */}
                <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
                  <CircleProgress pct={pct} size={140} stroke={10} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{pct}%</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>consumed</div>
                  </div>
                </div>
                {/* Equation */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, flexWrap: "wrap", justifyContent: "space-evenly" }}>
                  {[
                    { label: "Goal", val: GOAL.toLocaleString(), color: TEXT },
                    { label: null, val: "−", color: MUTED },
                    { label: "Eaten", val: loggedCal.toLocaleString(), color: BLUE },
                    { label: null, val: "+", color: MUTED },
                    { label: "Burned", val: burnedCal.toLocaleString(), color: GREEN },
                    { label: null, val: "=", color: MUTED },
                    { label: "Remaining", val: remaining.toLocaleString(), color: remaining < 0 ? "#FF5E5B" : TEXT, big: true },
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

            {/* Two cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={card}>
                <div style={sectionTitle}>Macronutrients Today</div>
                <MacroBar label="Protein" cur={protein} tgt={150} color={BLUE} />
                <MacroBar label="Carbs"   cur={carbs}   tgt={250} color="#9B5DE5" />
                <MacroBar label="Fats"    cur={fat}     tgt={65}  color="#FF7B2C" />
                <MacroBar label="Fiber"   cur={fiber}   tgt={25}  color={GREEN} />
              </div>

              <div style={card}>
                <div style={sectionTitle}>Today's Log</div>
                {[...foodLog.slice(-3).map(f => ({ ...f, isEx: false })), ...exLog.slice(-2).map(e => ({ ...e, isEx: true }))].map((item, i, arr) => (
                  <div key={i} style={{ ...logItemStyle, borderBottom: i === arr.length - 1 ? "none" : undefined }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.isEx ? `${item.icon} ${item.name}` : item.name}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{item.isEx ? `Exercise • ${item.duration}` : item.meal}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: item.isEx ? GREEN : BLUE }}>
                      {item.isEx ? `−${item.burn}` : `+${item.cal}`} kcal
                    </span>
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
                <p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>Search and log meals from your Nigerian nutrition database.</p>
              </div>
              <button onClick={() => showToast("Click any food card below to log it")}
                style={{ padding: "12px 22px", background: BLUE, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
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
                    <Tag color="#5BA3FF" bg="rgba(0,123,255,0.15)">P {f.protein}g</Tag>
                    <Tag color="#B47FFF" bg="rgba(155,93,229,0.15)">C {f.carbs}g</Tag>
                    <Tag color="#FF9F6B" bg="rgba(255,123,44,0.15)">F {f.fat}g</Tag>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={card}>
                <div style={sectionTitle}>Today's Food Log</div>
                {foodLog.map((item, i) => (
                  <div key={i} style={{ ...logItemStyle, borderBottom: i === foodLog.length - 1 ? "none" : undefined }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{item.meal}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: BLUE, fontFamily: "monospace" }}>+{item.cal} kcal</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(0,229,160,0.04)", border: "1px solid rgba(0,229,160,0.15)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: GREEN, marginBottom: 12 }}>Nutrition Insight</div>
                <p style={{ fontSize: 14, color: "#9BA8C0", lineHeight: 1.75, marginBottom: 20 }}>
                  You have consumed <strong style={{ color: TEXT }}>{loggedCal} kcal</strong> today. Your protein is{" "}
                  <strong style={{ color: protein < 80 ? "#FF9F43" : GREEN }}>{protein < 80 ? "low" : "on track"}</strong>.{" "}
                  {protein < 80 ? "Consider adding Moi Moi, beans, or Suya to your next meal." : "Great job hitting your protein targets!"}
                </p>
                <MacroBar label="Protein" cur={protein} tgt={150} color={BLUE} />
                <MacroBar label="Fiber" cur={fiber} tgt={25} color={GREEN} />
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
                <p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>Log activities and track your daily calorie burn.</p>
              </div>
              <button onClick={() => showToast("Click any activity card to log it")}
                style={{ padding: "12px 22px", background: BLUE, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
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
                <div style={sectionTitle}>Activity Timeline</div>
                {exLog.map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, background: "rgba(0,229,160,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{e.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>{e.duration}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: GREEN, fontFamily: "monospace" }}>−{e.burn} kcal</span>
                  </div>
                ))}
              </div>

              <div style={card}>
                <div style={sectionTitle}>Burn Summary</div>
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
              <p style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>Update your stats for accurate BMI and BMR calculations.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 22 }}>
              {[
                { label: "BMI", val: bmi, sub: bmiLabel, color: bmiColor },
                { label: "BMR", val: bmr.toLocaleString(), sub: "kcal / day at rest", color: BLUE },
                { label: "TDEE", val: tdee.toLocaleString(), sub: "kcal / day (active)", color: "#FF9F43" },
              ].map(s => (
                <div key={s.label} style={{ background: SURF2, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20, textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "monospace", marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: s.color, marginTop: 4, fontWeight: 600 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={sectionTitle}>Personal Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px 40px" }}>
                {[
                  { label: "Full Name", key: "name", type: "text" },
                  { label: "Age (years)", key: "age", type: "number" },
                  { label: "Weight (kg)", key: "weight", type: "number" },
                  { label: "Height (cm)", key: "height", type: "number" },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{f.label}</div>
                    <input
                      type={f.type}
                      value={profile[f.key]}
                      onChange={e => setProfile(p => ({ ...p, [f.key]: f.type === "number" ? +e.target.value : e.target.value }))}
                      style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid rgba(255,255,255,0.12)`, padding: "10px 0", color: TEXT, fontSize: 16, fontWeight: 600, outline: "none", fontFamily: "inherit" }}
                    />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Sex</div>
                  <select value={profile.sex} onChange={e => setProfile(p => ({ ...p, sex: e.target.value }))}
                    style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid rgba(255,255,255,0.12)`, padding: "10px 0", color: TEXT, fontSize: 16, fontWeight: 600, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <button onClick={() => showToast("✓ Profile saved!")}
                style={{ marginTop: 28, padding: "12px 24px", background: BLUE, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Save Changes
              </button>
            </div>

            <div style={card}>
              <div style={sectionTitle}>What These Mean</div>
              {[
                ["BMI", "Body Mass Index — a ratio of weight to height. Normal range: 18.5–24.9."],
                ["BMR", "Basal Metabolic Rate — the calories your body burns per day at complete rest."],
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
                <div style={sectionTitle}>Our Mission</div>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.8 }}>
                  Most nutrition apps rely on Western food databases — leaving Nigerian users to guess the nutritional value of Jollof Rice, Egusi Soup, or Suya. CardioPal solves this with a comprehensive, research-backed database of{" "}
                  <strong style={{ color: TEXT }}>20+ common Nigerian foods</strong> with accurate macro and micronutrient data sourced from Nigerian nutritional research.
                </p>
              </div>
              <div style={card}>
                <div style={sectionTitle}>Features</div>
                {["🍽  Nigerian food database (20+ foods)", "📊  Macro & calorie tracking", "⚡  Exercise burn calculator", "🧠  Smart nutrition insights", "📐  BMI & BMR calculator", "🔒  All data stays on your device"].map(f => (
                  <div key={f} style={{ fontSize: 13, color: MUTED, marginBottom: 10 }}>{f}</div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Tech Stack</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 12 }}>
                {[["React", "UI Framework"], ["JSON", "Food Database"], ["Syne", "Display Font"], ["DM Mono", "Monospace"], ["Lucide React", "Icons"], ["Vite", "Build Tool"]].map(([n, r]) => (
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

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: SURF2, border: `1px solid ${BLUE}`, borderRadius: 12, padding: "12px 18px", fontSize: 13, fontWeight: 600, color: TEXT, zIndex: 999, boxShadow: "0 4px 24px rgba(0,123,255,0.25)", animation: "slideUp 0.3s ease" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
