// Shared layout: navigation bar, one-time success message, and small DOM helpers.

const NAV_LINKS = [
  { href: "/index.html", label: "Home", match: ["/", "/index.html", "/details.html"] },
  { href: "/about.html", label: "About", match: ["/about.html"] },
  { href: "/character-form.html", label: "Add a Character", match: ["/character-form.html"] },
];

const FLASH_KEY = "flashMessage";

// Create an element with optional class and text (textContent only, never innerHTML)
export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

export function renderNav() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;
  nav.replaceChildren();

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  // The form page in edit mode belongs to a character, not to "Add a Character"
  const editing = path === "/character-form.html" && params.has("id");

  for (const link of NAV_LINKS) {
    const a = el("a", "", link.label);
    a.href = link.href;
    if (link.match.includes(path) && !(editing && link.label === "Add a Character")) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
    nav.appendChild(a);
  }
}

// Save a message to show once on the next page that loads
export function setFlash(message) {
  try {
    sessionStorage.setItem(FLASH_KEY, message);
  } catch (err) {
    // storage unavailable; the message is simply skipped
  }
}

// Show the saved message (if any) in #flash, then forget it
export function showFlash() {
  const box = document.getElementById("flash");
  let message = null;
  try {
    message = sessionStorage.getItem(FLASH_KEY);
    sessionStorage.removeItem(FLASH_KEY);
  } catch (err) {
    return;
  }
  if (!box || !message) return;
  box.replaceChildren(el("div", "flash-message", message));
}

// Loading / empty / error states, all shown in the #status element
export function showStatus(kind, message) {
  const box = document.getElementById("status");
  if (!box) return;
  box.className = `status ${kind}`;
  box.textContent = message;
}

export function clearStatus() {
  const box = document.getElementById("status");
  if (!box) return;
  box.className = "status";
  box.textContent = "";
}

// Call this at the top of every page script
export function initPage() {
  renderNav();
  showFlash();
}
