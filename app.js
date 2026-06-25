const colors = {
  Fellow: { bg:"#4f86c6", light:"#dbeafe", border:"#2563eb", text:"#1e3a5f" },
  MS4:    { bg:"#5a9e6f", light:"#dcfce7", border:"#16a34a", text:"#14532d" },
  PSY1:   { bg:"#c47ac0", light:"#fae8ff", border:"#9333ea", text:"#4a1772" },
};

const PROG_START = new Date(2026, 6, 1);
const PROG_END   = new Date(2027, 5, 30);
const TOTAL_DAYS = (PROG_END - PROG_START) / 86400000 + 1;

const MONTHS = [];
for (let i = 0; i < 12; i++) {
  const d = new Date(2026, 6 + i, 1);
  MONTHS.push({ year: d.getFullYear(), month: d.getMonth() });
}

let currentView = "timeline";
let currentFilter = "All";
let currentMonthIdx = 0;

function parseDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function pct(dateStr) {
  const d = parseDate(dateStr);
  return ((d - PROG_START) / 86400000) / TOTAL_DAYS * 100;
}

function fmt(dateStr) {
  const d = parseDate(dateStr);
  return `${d.getMonth()+1}/${d.getDate()}`;
}

function setView(v) {
  currentView = v;
  document.getElementById("btn-timeline").classList.toggle("active", v === "timeline");
  document.getElementById("btn-monthly").classList.toggle("active", v === "monthly");
  document.getElementById("timeline").style.display = v === "timeline" ? "block" : "none";
  document.getElementById("monthly").style.display  = v === "monthly"  ? "block" : "none";
  if (v === "monthly") renderMonthly();
}

function setFilter(f) {
  currentFilter = f;
  ["All","Fellow","MS4","PSY1"].forEach(x => {
    document.getElementById("f"+x).classList.remove("active");
  });
  document.getElementById("f"+f).classList.add("active");
  renderTimeline();
  if (currentView === "monthly") renderMonthly();
}

function getFiltered() {
  return currentFilter === "All" ? trainees : trainees.filter(t => t.type === currentFilter);
}

// ---- TIMELINE ----
function renderTimeline() {
  const el = document.getElementById("timeline");
  const filtered = getFiltered();
  const groups = ["Fellow","MS4","PSY1"];
  const groupLabels = { Fellow:"Fellows", MS4:"Medical Students (MS4)", PSY1:"Psych Residents" };

  // Month axis
  let axisHtml = '<div class="month-axis">';
  for (let i = 0; i < 13; i++) {
    const d = new Date(2026, 6 + i, 1);
    if (d > new Date("2027-07-01")) break;
    const p = ((d - PROG_START) / 86400000) / TOTAL_DAYS * 100;
    const label = d.toLocaleString("default", { month:"short", year:"2-digit" });
    axisHtml += `<div class="month-label" style="left:${p}%">${label}</div>`;
  }
  axisHtml += "</div>";

  let html = axisHtml;

  const gridPcts = [0,8.33,16.67,25,33.33,41.67,50,58.33,66.67,75,83.33,91.67,100];

  groups.forEach(grp => {
    const rows = filtered.filter(t => t.type === grp);
    if (!rows.length) return;
    const c = colors[grp];
    html += `<div class="group-block">
      <div class="group-header" style="color:${c.text};background:${c.light};border-color:${c.border}">${groupLabels[grp]}</div>`;
    rows.forEach(t => {
      const s = pct(t.start), e = pct(t.end);
      const gridLines = gridPcts.map(p => `<div class="grid-line" style="left:${p}%"></div>`).join("");
      html += `<div class="tl-row">
        <div class="tl-name" title="${t.name}">${t.name}</div>
        <div class="tl-track">
          ${gridLines}
          <div class="tl-bar" style="left:${s}%;width:${Math.max(e-s,0.8)}%;background:${c.bg};opacity:0.88"
            title="${t.name}: ${t.start} – ${t.end}">
            <span>${fmt(t.start)}–${fmt(t.end)}</span>
          </div>
        </div>
      </div>`;
    });
    html += "</div>";
  });

  el.innerHTML = html;
}

// ---- MONTHLY ----
function renderMonthly() {
  const el = document.getElementById("monthly");
  const { year, month } = MONTHS[currentMonthIdx];
  const monthTitle = new Date(year, month, 1).toLocaleString("default", { month:"long", year:"numeric" });

  const days = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) { days.push(new Date(d)); d.setDate(d.getDate()+1); }

  const firstDow = new Date(year, month, 1).getDay();
  const today = new Date().toISOString().slice(0,10);
  const filtered = getFiltered();

  let html = `<div class="month-nav">
    <button class="nav-btn" onclick="changeMonth(-1)">&#8249;</button>
    <div class="month-title">${monthTitle}</div>
    <button class="nav-btn" onclick="changeMonth(1)">&#8250;</button>
  </div>
  <div class="cal-grid">
    <div class="dow-header">Sun</div><div class="dow-header">Mon</div><div class="dow-header">Tue</div>
    <div class="dow-header">Wed</div><div class="dow-header">Thu</div><div class="dow-header">Fri</div>
    <div class="dow-header">Sat</div>`;

  for (let i = 0; i < firstDow; i++) html += `<div class="cal-cell empty"></div>`;

  days.forEach(day => {
    const ds = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,"0")}-${String(day.getDate()).padStart(2,"0")}`;
    const present = filtered.filter(t => ds >= t.start && ds <= t.end);
    const isToday = ds === today;
    html += `<div class="cal-cell${isToday?" today":""}">
      <div class="day-num">${day.getDate()}</div>`;
    present.forEach(t => {
      const parts = t.name.split(" ");
      const label = parts[0] + " " + parts[parts.length-1];
      html += `<div class="trainee-chip" style="background:${colors[t.type].bg}" title="${t.name} (${t.type})">${label}</div>`;
    });
    html += `</div>`;
  });

  html += `</div>`;
  el.innerHTML = html;
}

function changeMonth(dir) {
  currentMonthIdx = Math.max(0, Math.min(MONTHS.length-1, currentMonthIdx + dir));
  renderMonthly();
}

// Init
renderTimeline();
document.getElementById("timeline").style.display = "block";
document.getElementById("monthly").style.display = "none";