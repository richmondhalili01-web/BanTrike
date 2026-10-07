/* ============================================================
   BanTrike — js/dashboard.js
   ------------------------------------------------------------
   Shows the logged-in driver's tricycle status at a glance, and
   links out to the three main features.
   ============================================================ */

// Programming lesson: this is the dashboard page, where the app reads the current user session,
// loads the object from the users array, and renders personalized information. It demonstrates:
// - session handling
// - object access (user.fullName, user.tricycle)
// - conditional rendering
// - array mapping to generate feature cards dynamically
const username = requireAuth();
paintNavUser();

const user = findUser(username);
document.getElementById("welcome-heading").textContent = `Welcome back, ${user.fullName.split(" ")[0]}.`;

if (!user.tricycle) {
  document.getElementById("no-unit-notice").style.display = "block";
} else {
  const t = user.tricycle;
  document.getElementById("status-tiles").style.display = "grid";

  const status = tricycleStatus(t);
  document.getElementById("tile-status").innerHTML =
    `<span class="badge ${status === "active" ? "badge-success" : "badge-danger"}">${status === "active" ? "Active" : "Expired"}</span>`;

  let roadLabel, roadClass;
  if (t.roadworthy === null) { roadLabel = "Not yet checked"; roadClass = "badge-neutral"; }
  else if (isRoadworthyValid(t)) { roadLabel = "Passed"; roadClass = "badge-success"; }
  else if (t.roadworthy === false) { roadLabel = "Failed"; roadClass = "badge-danger"; }
  else { roadLabel = "Needs recheck (expired)"; roadClass = "badge-warning"; }
  document.getElementById("tile-roadworthy").innerHTML = `<span class="badge ${roadClass}">${roadLabel}</span>`;

  document.getElementById("tile-expiry").textContent = t.expiryDate;
}

const FEATURES = [
  { title: "Registration", desc: "Register your tricycle and get your BanTrike ID.", href: "registration.html" },
  { title: "Renewal", desc: "Renew your registration for another year.", href: "renewal.html" },
  { title: "Roadworthiness Standard", desc: "Run the checklist — required before every renewal.", href: "roadworthy.html" },
];
document.getElementById("feature-grid").innerHTML = FEATURES.map(f => `
  <article class="feature-card">
    <h3>${f.title}</h3>
    <p>${f.desc}</p>
    <a href="${f.href}">Open →</a>
  </article>
`).join("");
