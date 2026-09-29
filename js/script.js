const COURSES = ["Mathematics", "Science", "Computer Science"];
const SAMPLE = {
  "Aarav":   ["Mathematics", "Computer Science"],
  "Bhavna":  ["Science"],
  "Chetan":  ["Mathematics", "Science", "Computer Science"],
  "Diya":    ["Computer Science"],
  "Eshan":   [],
  "Fatima":  ["Mathematics", "Science"],
  "Gaurav":  ["Mathematics"],
  "Isha":    []
};

// state: student name -> Set of courses
let data = load();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem("enrollment"));
    if (raw) return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, new Set(v)]));
  } catch (e) {}
  return fromSample();
}
function fromSample() {
  return Object.fromEntries(Object.entries(SAMPLE).map(([k, v]) => [k, new Set(v)]));
}
function save() {
  try {
    localStorage.setItem("enrollment", JSON.stringify(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, [...v]]))));
  } catch (e) {}
}

// ---- set helpers ----
const union = (a, b) => new Set([...a, ...b]);
const intersection = (a, b) => new Set([...a].filter(x => b.has(x)));
const difference = (a, b) => new Set([...a].filter(x => !b.has(x)));

const allStudents = () => new Set(Object.keys(data));
const courseSet = c => new Set(Object.keys(data).filter(s => data[s].has(c)));

function chips(set, warn) {
  if (!set.size) return '<span class="empty">Nobody</span>';
  return [...set].sort().map(n => `<span class="chip${warn ? " warn" : ""}">${esc(n)}</span>`).join("");
}
function card(title, note, set, warn) {
  return `<div class="res"><h3>${title} (${set.size})</h3><small>${note}</small><div class="chips">${chips(set, warn)}</div></div>`;
}
const esc = s => s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// ---- render ----
function renderTable() {
  const head = `<tr><th>Student</th>${COURSES.map(c => `<th class="c">${c}</th>`).join("")}<th></th></tr>`;
  const rows = Object.keys(data).map(s => `<tr><td>${esc(s)}</td>${COURSES.map(c =>
    `<td class="c"><input type="checkbox" data-s="${esc(s)}" data-c="${c}" aria-label="${esc(s)} in ${c}" ${data[s].has(c) ? "checked" : ""}></td>`).join("")}
    <td><button class="ghost" data-del="${esc(s)}" aria-label="Remove ${esc(s)}">Remove</button></td></tr>`).join("");
  document.getElementById("table").innerHTML = head + rows;
}

function renderOps() {
  const A = document.getElementById("selA").value, B = document.getElementById("selB").value;
  const sa = courseSet(A), sb = courseSet(B);
  document.getElementById("ops").innerHTML =
    card("Union", `In ${A} or ${B}`, union(sa, sb)) +
    card("Intersection", `In both ${A} and ${B}`, intersection(sa, sb)) +
    card(`${A} only`, `${A} minus ${B}`, difference(sa, sb)) +
    card(`${B} only`, `${B} minus ${A}`, difference(sb, sa));
}

function renderOverall() {
  const sets = COURSES.map(courseSet);
  const enrolled = sets.reduce(union, new Set());
  const none = difference(allStudents(), enrolled);
  const multi = new Set(Object.keys(data).filter(s => data[s].size > 1));
  const all3 = sets.reduce(intersection);
  const single = new Set(Object.keys(data).filter(s => data[s].size === 1));
  document.getElementById("overall").innerHTML =
    card("In at least one course", "Union of all courses", enrolled) +
    card("Not enrolled anywhere", "All students minus the union", none, true) +
    card("In more than one course", "Students with 2 or more courses", multi) +
    card("In exactly one course", "Students with a single course", single) +
    card("In every course", "Intersection of all courses", all3) +
    `<div class="res"><h3>Headcount per course</h3><small>Use this to plan seats and teachers</small>
      ${COURSES.map((c, i) => `<div>${c}: <strong>${sets[i].size}</strong></div>`).join("")}</div>`;
}

function render() { renderTable(); renderOps(); renderOverall(); }

// ---- events ----
["selA", "selB"].forEach((id, i) => {
  const el = document.getElementById(id);
  el.innerHTML = COURSES.map(c => `<option>${c}</option>`).join("");
  el.selectedIndex = i;
  el.addEventListener("change", renderOps);
});

document.getElementById("table").addEventListener("click", e => {
  const s = e.target.dataset.del;
  if (s) { delete data[s]; save(); render(); }
});
document.getElementById("table").addEventListener("change", e => {
  const { s, c } = e.target.dataset;
  if (!s) return;
  e.target.checked ? data[s].add(c) : data[s].delete(c);
  save(); renderOps(); renderOverall();
});
function addStudent() {
  const input = document.getElementById("newName");
  const name = input.value.trim();
  if (!name || data[name]) { input.focus(); return; }
  data[name] = new Set();
  input.value = "";
  save(); render();
}
document.getElementById("addBtn").addEventListener("click", addStudent);
document.getElementById("newName").addEventListener("keydown", e => { if (e.key === "Enter") addStudent(); });
document.getElementById("resetBtn").addEventListener("click", () => { data = fromSample(); save(); render(); });

render();
