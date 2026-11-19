const $ = selector => document.querySelector(selector);
const text = (selector, value) => {
  $(selector).textContent = value;
};
const preferred = new URLSearchParams(location.search).get("message");
let catalogue;
let selected;
let surface = "email";

function setMessage(id) {
  if (!Object.hasOwn(catalogue, id)) return;
  selected = id;
  const message = catalogue[id];
  document.documentElement.style.setProperty("--accent", message.accent);
  document.documentElement.style.setProperty("--project-ink", message.ink);
  text("#project", message.project);
  text("#message-name", message.name);
  text(
    "#message-category",
    `${message.group.toUpperCase()} / ${message.number}`
  );
  text("#subject", message.subject);
  text("#preheader", message.preheader);
  text("#trigger", message.trigger);
  text("#note", message.note);
  text(
    "#counter",
    `${message.number} / ${String(Object.keys(catalogue).length).padStart(2, "0")}`
  );
  text("#toast-label", message.toastLabel);
  text("#toast-title", message.toastTitle);
  text("#toast-body", message.toastBody);
  text("#toast-link", `${message.cta} ↗`);
  $("#toast-link").href = `https://monolithproject.com${message.href}`;
  $("#email-frame").src = `/email/${id}`;
  $("#email-frame").title = `${message.name} email design`;
  $("#plain-link").href = `/text/${id}`;
  $("#html-link").href = `/email/${id}`;
  $("#toast").hidden = false;
  document.querySelectorAll(".message-button").forEach(button => {
    button.setAttribute("aria-current", String(button.dataset.message === id));
  });
  history.replaceState(null, "", `/?message=${encodeURIComponent(id)}`);
  document.title = `${message.name} — Monolith`;
}

document.querySelectorAll("[data-surface]").forEach(button => {
  button.addEventListener("click", () => {
    surface = button.dataset.surface;
    document
      .querySelectorAll("[data-surface]")
      .forEach(b => b.setAttribute("aria-pressed", String(b === button)));
    $("#email-stage").hidden = surface !== "email";
    $("#notification-stage").hidden = surface !== "notification";
    $("#plain-link").hidden = surface !== "email";
  });
});
document.querySelectorAll("[data-size]").forEach(button => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-size]")
      .forEach(b => b.setAttribute("aria-pressed", String(b === button)));
    [$("#mail-window"), $("#product-preview")].forEach(el =>
      el.classList.toggle("mobile", button.dataset.size === "mobile")
    );
  });
});
$(".toast-close").addEventListener("click", () => {
  $("#toast").hidden = true;
  $("#replay").focus();
});
$("#replay").addEventListener("click", () => {
  const toast = $("#toast");
  toast.hidden = false;
  toast.classList.remove("replaying");
  requestAnimationFrame(() => toast.classList.add("replaying"));
});

try {
  const response = await fetch("/catalog.json");
  if (!response.ok) throw new Error("Catalogue unavailable");
  catalogue = await response.json();
  const nav = $("#messages");
  nav.replaceChildren();
  let group;
  for (const [id, message] of Object.entries(catalogue)) {
    if (message.group !== group) {
      group = message.group;
      const label = document.createElement("p");
      label.className = "message-group";
      label.textContent =
        group === "Welcome" ? "01 / THE WELCOMES" : "02 / THE NOTIFICATIONS";
      nav.append(label);
    }
    const button = document.createElement("button");
    button.className = "message-button";
    button.dataset.message = id;
    button.style.setProperty("--dot", message.accent);
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.setAttribute("aria-hidden", "true");
    const title = document.createElement("span");
    title.textContent = message.name;
    const number = document.createElement("span");
    number.className = "item-number";
    number.textContent = message.number;
    button.append(dot, title, number);
    button.addEventListener("click", () => setMessage(id));
    nav.append(button);
  }
  setMessage(
    Object.hasOwn(catalogue, preferred || "") ? preferred : "monolith-welcome"
  );
} catch {
  $("#error").hidden = false;
  $("#messages").textContent =
    "The collection couldn’t load. Refresh to try again.";
}
