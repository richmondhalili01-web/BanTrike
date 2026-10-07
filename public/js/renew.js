/* ============================================================
   BanTrike — js/renew.js
   ------------------------------------------------------------
   Shows the driver's unit status and either lets them renew, or
   blocks it with a clear reason — using isRoadworthyValid() and
   renewTricycle() from store.js. This is the gate: no passing,
   recent roadworthiness check means no renewal.
   ============================================================ */

// Programming lesson: this file shows a business-rule gate.
// A renewal is only allowed if the tricycle passes the roadworthiness rule.
// The page reads current data, checks conditions, and then updates the UI accordingly.
// This is a strong example of decision logic, state updates, and re-rendering the page.
const username = requireAuth();
paintNavUser();

function render() {
  const t = findUser(username).tricycle;
  if (!t) {
    document.getElementById("no-unit-notice").style.display = "block";
    document.getElementById("content").style.display = "none";
    return;
  }
  document.getElementById("content").style.display = "block";

  document.getElementById("d-id").textContent = t.id;

  const status = tricycleStatus(t);
  document.getElementById("d-status").innerHTML =
    `<span class="badge ${status === "active" ? "badge-success" : "badge-danger"}">${status === "active" ? "Active" : "Expired"}</span>`;
  document.getElementById("d-expiry").textContent = t.expiryDate;

  const valid = isRoadworthyValid(t);
  const gateBox = document.getElementById("gate-message");
  const renewBtn = document.getElementById("renew-btn");
  const checkLink = document.getElementById("check-link");

  if (valid) {
    document.getElementById("d-roadworthy").innerHTML = `<span class="badge badge-success">Passed (valid)</span>`;
    gateBox.innerHTML = `<div class="banner banner-success">Your roadworthiness check is valid. You're eligible to renew.</div>`;
    renewBtn.style.display = "block";
    renewBtn.disabled = false;
    checkLink.style.display = "none";
  } else {
    let reason;
    if (t.roadworthy === null) {
      reason = "You haven't run a roadworthiness check yet.";
      document.getElementById("d-roadworthy").innerHTML = `<span class="badge badge-neutral">Not yet checked</span>`;
    } else if (t.roadworthy === false) {
      reason = "Your last roadworthiness check did not pass.";
      document.getElementById("d-roadworthy").innerHTML = `<span class="badge badge-danger">Failed</span>`;
    } else {
      reason = `Your last passing check was ${daysSince(t.lastInspectionDate)} days ago — checks are only valid for ${ROADWORTHY_VALID_DAYS} days.`;
      document.getElementById("d-roadworthy").innerHTML = `<span class="badge badge-warning">Expired — needs recheck</span>`;
    }
    gateBox.innerHTML = `<div class="banner banner-warning">Renewal locked. ${reason}</div>`;
    renewBtn.style.display = "none";
    checkLink.style.display = "block";
  }
}
render();

document.getElementById("renew-btn").addEventListener("click", () => {
  const result = renewTricycle(username);
  if (result.error) {
    document.getElementById("gate-message").innerHTML = `<div class="banner banner-danger">${result.error}</div>`;
    render();
    return;
  }
  render();
  document.getElementById("gate-message").innerHTML =
    `<div class="banner banner-success">Renewed! Valid until <strong>${result.tricycle.expiryDate}</strong>.</div>`;
});
