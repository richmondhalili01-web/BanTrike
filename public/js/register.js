/* ============================================================
   BanTrike — js/register.js
   ------------------------------------------------------------
   Registers a tricycle against the logged-in account, via
   registerTricycle() in store.js. Blocks a second registration
   on the same account (one unit per driver, in this prototype).
   ============================================================ */

// Programming lesson: registration uses form input, validation, and data mutation.
// The app reads values from the form, validates whether the driver already has a tricycle,
// then uses a function to create a new tricycle object and store it back into the users array.
// This is a good example of object creation, validation, and updating application state.
const username = requireAuth();
paintNavUser();

const existing = findUser(username).tricycle;
if (existing) {
  document.getElementById("already-registered").style.display = "block";
  document.getElementById("existing-id").textContent = existing.id;
  document.getElementById("register-form").querySelector("button[type=submit]").disabled = true;
}

document.getElementById("register-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const result = registerTricycle(username, {
    plateNumber: document.getElementById("plateNumber").value.trim(),
    tricycleModel: document.getElementById("tricycleModel").value.trim(),
    address: document.getElementById("address").value.trim(),
    contactNumber: document.getElementById("contactNumber").value.trim(),
  });

  const resultBox = document.getElementById("result");
  if (result.error) {
    resultBox.innerHTML = `<div class="banner banner-danger">${result.error}</div>`;
    return;
  }

  resultBox.innerHTML = `
    <div class="banner banner-success">
      You're registered! Your BanTrike ID is <strong>${result.tricycle.id}</strong>.
      Next step: complete a <a href="roadworthy.html" style="text-decoration:underline;">roadworthiness check</a> before your first renewal.
    </div>
  `;
  this.querySelector("button[type=submit]").disabled = true;
});
