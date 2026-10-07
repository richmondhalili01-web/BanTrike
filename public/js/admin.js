/* ============================================================
   BanTrike — js/admin.js
   ------------------------------------------------------------
   Lists every registered tricycle (getAllTricycles() from
   store.js) with its renewal + roadworthiness standing, lets
   the admin flag a unit for re-inspection, and shows a log of
   admin actions taken so far.
   ============================================================ */

// Strategy for the admin dashboard:
// - Read every registered tricycle from localStorage.
// - Compute summary numbers (total, active, needs attention).
// - Apply filters and render the table dynamically.
// - Let the admin flag a tricycle for re-inspection, which resets its roadworthiness status.
// This is a good example of integrating programming concepts:
// - Array methods: .filter(), .map(), .length
// - DOM rendering: innerHTML is used to build the table rows dynamically
// - Event listeners: change and click events trigger rerendering
// - Data flow: getAllTricycles() -> renderStats() -> renderTable() -> renderLog()
// - Business rule: a unit is marked as "needs attention" if it is expired or roadworthy is invalid/stale
const adminUsername = requireAdmin(); // redirects non-admins to dashboard.html

document.getElementById("attention-explainer").textContent =
  `"Needs attention" = expired registration, failed roadworthiness, or a check older than ${ROADWORTHY_VALID_DAYS} days.`;

// A unit "needs attention" if its roadworthiness isn't currently
// valid — covers never-checked, failed, AND stale-but-once-passed.
function needsAttention(t) { return !isRoadworthyValid(t); }

function roadworthyCell(t) {
  if (t.roadworthy === null) return `<span class="badge badge-neutral">Not checked</span>`;
  if (isRoadworthyValid(t)) return `<span class="badge badge-success">Valid (${daysSince(t.lastInspectionDate)}d ago)</span>`;
  if (t.roadworthy === false) return `<span class="badge badge-danger">Failed</span>`;
  return `<span class="badge badge-warning">Stale (${daysSince(t.lastInspectionDate)}d ago)</span>`;
}

function renderStats(fleet) {
  document.getElementById("s-total").textContent = fleet.length;
  document.getElementById("s-active").textContent = fleet.filter(t => tricycleStatus(t) === "active").length;
  document.getElementById("s-attention").textContent = fleet.filter(needsAttention).length;
}

function renderTable() {
  const filter = document.getElementById("filter-select").value;
  let fleet = getAllTricycles();
  renderStats(fleet);

  if (filter === "expired") fleet = fleet.filter(t => tricycleStatus(t) === "expired");
  if (filter === "attention") fleet = fleet.filter(needsAttention);

  const body = document.getElementById("fleet-body");
  if (fleet.length === 0) {
    body.innerHTML = `<tr><td colspan="8" class="hint">No units match this filter.</td></tr>`;
    return;
  }

  body.innerHTML = fleet.map(t => `
    <tr>
      <td>${t.id}</td>
      <td>${t.ownerName}</td>
      <td>${t.plateNumber}</td>
      <td><span class="badge ${tricycleStatus(t) === "active" ? "badge-success" : "badge-danger"}">${tricycleStatus(t) === "active" ? "Active" : "Expired"}</span></td>
      <td>${roadworthyCell(t)}</td>
      <td class="hint">${t.lastInspectionDate || "—"}</td>
      <td class="hint">${t.expiryDate}</td>
      <td><button class="btn btn-outline btn-sm" data-owner="${t.owner}" ${t.roadworthy === null ? "disabled" : ""}>Flag for re-inspection</button></td>
    </tr>
  `).join("");

  body.querySelectorAll("button[data-owner]").forEach(btn => {
    btn.addEventListener("click", () => {
      flagForReinspection(adminUsername, btn.dataset.owner);
      renderTable();
      renderLog();
    });
  });
}

function renderLog() {
  const log = getAdminLog();
  document.getElementById("log-list").innerHTML = log.length
    ? log.map(l => `
        <div style="display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px solid var(--line);">
          <span>${l.action}</span>
          <span class="hint">${l.date} | ${l.admin}</span>
        </div>
      `).join("")
    : `<p class="hint">No admin actions logged yet.</p>`;
}

document.getElementById("filter-select").addEventListener("change", renderTable);
renderTable();
renderLog();

document.getElementById("logout-btn").addEventListener("click", () => {
  clearSession();
  window.location.href = "index.html";
});
