import { getCharacter, createCharacter, updateCharacter } from "/js/api.js";
import { initPage, setFlash, showStatus, clearStatus } from "/js/layout.js";

const form = document.getElementById("character-form");
const title = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const formError = document.getElementById("form-error");

const id = new URLSearchParams(window.location.search).get("id");
const editing = id !== null;

const FIELDS = ["name", "species", "role", "age", "imageUrl", "description"];

function clearErrors() {
  formError.hidden = true;
  formError.textContent = "";
  for (const span of form.querySelectorAll(".field-error")) {
    span.textContent = "";
  }
}

function showFieldError(field, message) {
  const span = form.querySelector(`.field-error[data-for="${field}"]`);
  if (span) span.textContent = message;
}

function fillForm(character) {
  for (const field of FIELDS) {
    form.elements[field].value = character[field] ?? "";
  }
}

// Form values are strings: convert age, and send null for empty optional fields
function readForm() {
  const text = (name) => form.elements[name].value.trim();
  const orNull = (value) => (value === "" ? null : value);
  const age = text("age");
  return {
    name: text("name"),
    description: text("description"),
    species: orNull(text("species")),
    role: orNull(text("role")),
    age: age === "" ? null : Number(age),
    imageUrl: orNull(text("imageUrl")),
  };
}

function showServerErrors(err) {
  const fieldErrors = Object.entries(err.errors || {});
  if (fieldErrors.length === 0) {
    formError.textContent = err.message;
    formError.hidden = false;
    return;
  }
  formError.textContent = "Please fix the problems below.";
  formError.hidden = false;
  for (const [field, message] of fieldErrors) {
    showFieldError(field, message);
  }
}

async function onSubmit(event) {
  event.preventDefault(); // stay on the page so typed values are kept
  clearErrors();

  // HTML validation attributes (required, min) run first
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const character = readForm();
  submitButton.disabled = true; // prevents a double submit creating duplicates

  try {
    if (editing) {
      const saved = await updateCharacter(id, character);
      setFlash(`${saved.name} was updated`);
      window.location.href = `/details.html?id=${encodeURIComponent(saved.characterId)}`;
    } else {
      const saved = await createCharacter(character);
      setFlash(`${saved.name} was added`);
      window.location.href = "/index.html";
    }
  } catch (err) {
    submitButton.disabled = false;
    if (editing && err.status === 404) {
      form.hidden = true;
      showStatus("error", "Character not found. It may have been removed.");
      return;
    }
    showServerErrors(err);
  }
}

async function init() {
  initPage();
  form.addEventListener("submit", onSubmit);

  if (!editing) {
    form.hidden = false;
    return;
  }

  title.textContent = "Edit Character";
  document.title = "Edit Character";
  submitButton.textContent = "Save Changes";

  showStatus("loading", "Loading...");
  try {
    const character = await getCharacter(id);
    fillForm(character);
    clearStatus();
    form.hidden = false;
  } catch (err) {
    if (err.status === 404) {
      showStatus("error", "Character not found. It may have been removed.");
    } else {
      showStatus("error", `Could not load this character. ${err.message}`);
    }
  }
}

init();
