// Color palette — hues evenly spaced for readability; one assigned per unique type
const TYPE_HUES = [213, 140, 300, 30, 0, 185, 55, 330];

function buildColors(types) {
  const map = {};
  types.forEach((type, i) => {
    const h = TYPE_HUES[i % TYPE_HUES.length];
    map[type] = {
      bg:     `hsl(${h},47%,54%)`,
      light:  `hsl(${h},85%,94%)`,
      border: `hsl(${h},70%,42%)`,
      text:   `hsl(${h},58%,20%)`,
    };
  });
  return map;
}

const allTypes = [...new Set(trainees.map(t => t.type))];
const TYPE_ORDER = ['Fellow', 'MS4', 'PSY1'];
const TYPES = [...TYPE_ORDER.filter(t => allTypes.includes(t)), ...allTypes.filter(t => !TYPE_ORDER.includes(t))];
const colors = buildColors(TYPES);

// Known display labels; falls back to raw type name for unknown types
const GROUP_LABELS = {
  Fellow: "Fellows",
  MS4:    "Medical Students (MS4)",
  PSY1:   "Psych Residents",
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
  ["All", ...TYPES].forEach(x => {
    const el = document.getElementById("f" + x);
    if (!el) return;
    el.classList.remove("active");
    el.style.background = "";
    el.style.color = "";
    el.style.borderColor = "";
  });
  const activeEl = document.getElementById("f" + f);
  if (activeEl) {
    activeEl.classList.add("active");
    if (f !== "All" && colors[f]) {
      activeEl.style.background = colors[f].bg;
      activeEl.style.color = "#fff";
      activeEl.style.borderColor = colors[f].border;
    }
  }
  renderTimeline();
  if (currentView === "monthly") renderMonthly();
}

function renderControls() {
  const filterContainer = document.getElementById("filterBtns");
  const legendContainer = document.getElementById("legend");
  if (!filterContainer) return;

  let btnHtml = `<button class="btn active" id="fAll" onclick="setFilter('All')">All</button>`;
  TYPES.forEach(type => {
    btnHtml += `<button class="btn" id="f${type}" onclick="setFilter('${type}')">${type}</button>`;
  });
  filterContainer.innerHTML = btnHtml;

  if (legendContainer) {
    legendContainer.innerHTML = TYPES.map(type =>
      `<div class="legend-item"><span class="legend-dot" style="background:${colors[type].bg}"></span>${GROUP_LABELS[type] || type}</div>`
    ).join("");
  }
}

function getFiltered() {
  return currentFilter === "All" ? trainees : trainees.filter(t => t.type === currentFilter);
}

// ---- TIMELINE ----
function renderTimeline() {
  const el = document.getElementById("timeline");
  const filtered = getFiltered();
  const groups = TYPES;

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
    const rows = filtered.filter(t => t.type === grp).sort((a, b) => a.start.localeCompare(b.start));
    if (!rows.length) return;
    const c = colors[grp];
    html += `<div class="group-block">
      <div class="group-header" style="color:${c.text};background:${c.light};border-color:${c.border}">${GROUP_LABELS[grp] || grp}</div>`;
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
renderControls();
renderTimeline();
document.getElementById("timeline").style.display = "block";
document.getElementById("monthly").style.display = "none";