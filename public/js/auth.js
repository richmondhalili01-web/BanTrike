/* ============================================================
   BanTrike — js/auth.js
   ------------------------------------------------------------
   Powers index.html: switching between Log In / Sign Up, and
   handling both submissions through store.js. Admin accounts
   land on admin.html; everyone else lands on dashboard.html.
   ============================================================ */

if (getSession()) {
  const existing = findUser(getSession());
  window.location.href = (existing && existing.role === "admin") ? "admin.html" : "dashboard.html";
}

// Strategy: treat authentication like a simple gatekeeper.
// 1) The user submits either Login or Sign Up.
// 2) The app validates the input and either accepts or shows an error banner.
// 3) On success, it stores the active username in localStorage and redirects by role.
// This makes the whole app role-based: admin goes to admin.html, everyone else goes to dashboard.html.
// In programming terms:
// - The form element is the input interface.
// - event.preventDefault() stops the browser from reloading the page.
// - .value reads the text typed by the user.
// - findUser() searches the users array to see if the username exists.
// - setSession() saves the current user in localStorage, like a session token.
// - A login system is just a controlled gate: check the credentials, authorize the user, then redirect.
// - In a backend app, we would usually use async/await with fetch() to send credentials to a server.
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const banner = document.getElementById("banner");

function showTab(which) {
  const isLogin = which === "login";
  tabLogin.classList.toggle("active", isLogin);
  tabSignup.classList.toggle("active", !isLogin);
  loginForm.style.display = isLogin ? "block" : "none";
  signupForm.style.display = isLogin ? "none" : "block";
  banner.innerHTML = "";
}
tabLogin.addEventListener("click", () => showTab("login"));
tabSignup.addEventListener("click", () => showTab("signup"));

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  const user = findUser(username);
  if (!user || user.password !== password) {
    banner.innerHTML = `<div class="banner banner-danger">Incorrect username or password.</div>`;
    return;
  }

  setSession(user.username);
  window.location.href = user.role === "admin" ? "admin.html" : "dashboard.html";
});

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const fullName = document.getElementById("signup-fullname").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!fullName || !username || !password) {
    banner.innerHTML = `<div class="banner banner-danger">Please fill in every field.</div>`;
    return;
  }

  const user = createUser({ username, fullName, password });
  if (!user) {
    banner.innerHTML = `<div class="banner banner-danger">That username is already taken.</div>`;
    return;
  }

  setSession(user.username);
  window.location.href = "dashboard.html"; // new sign-ups are always drivers
});
