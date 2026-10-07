/* ============================================================
   BanTrike — js/profile.js
   ------------------------------------------------------------
   Shows account info and the driver's own unit details.
   ============================================================ */

// Programming lesson: this file is a simple profile page that reads the logged-in user data from localStorage,
// then updates the DOM to display the user details. It shows how objects are used to store user information,
// how conditionals decide whether to show a unit or a "no unit yet" message, and how document.getElementById()
// is used to inject values into HTML elements.
const username = requireAuth();
paintNavUser();

const user = findUser(username);

function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }

document.getElementById("avatar").textContent = initials(user.fullName);
document.getElementById("p-name").textContent = user.fullName;
document.getElementById("p-username").textContent = "@" + user.username;
document.getElementById("p-joined").textContent = user.joinDate;

if (!user.tricycle) {
  document.getElementById("no-unit-card").style.display = "block";
} else {
  const t = user.tricycle;
  document.getElementById("unit-card").style.display = "block";
  document.getElementById("u-id").textContent = t.id;
  document.getElementById("u-plate").textContent = t.plateNumber;
  document.getElementById("u-model").textContent = t.tricycleModel || "—";
  document.getElementById("u-contact").textContent = t.contactNumber;
  document.getElementById("u-registered").textContent = t.registeredDate;
  document.getElementById("u-expiry").textContent = t.expiryDate;

  const status = tricycleStatus(t);
  document.getElementById("u-status").innerHTML =
    `<span class="badge ${status === "active" ? "badge-success" : "badge-danger"}">${status === "active" ? "Active" : "Expired"}</span>`;

  let roadLabel, roadClass;
  if (t.roadworthy === null) { roadLabel = "Not yet checked"; roadClass = "badge-neutral"; }
  else if (isRoadworthyValid(t)) { roadLabel = "Passed (valid)"; roadClass = "badge-success"; }
  else if (t.roadworthy === false) { roadLabel = "Failed"; roadClass = "badge-danger"; }
  else { roadLabel = "Expired — needs recheck"; roadClass = "badge-warning"; }
  document.getElementById("u-roadworthy").innerHTML = `<span class="badge ${roadClass}">${roadLabel}</span>`;
}

document.getElementById("logout-btn").addEventListener("click", () => {
  clearSession();
  window.location.href = "index.html";
});
