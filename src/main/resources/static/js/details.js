import { getCharacter, deleteCharacter } from "/js/api.js";
import { el, initPage, setFlash, showStatus, clearStatus } from "/js/layout.js";

const PLACEHOLDER = "/images/placeholder.svg";

const container = document.getElementById("details");
const id = new URLSearchParams(window.location.search).get("id");

function addRow(parent, label, value) {
  const p = el("p");
  p.appendChild(el("strong", "", `${label}: `));
  p.append(value);
  parent.appendChild(p);
}

function buildDetails(character) {
  const wrapper = el("div");
  wrapper.appendChild(el("h1", "", character.name));

  const layout = el("div", "details-container");

  const img = el("img");
  img.src = character.imageUrl || PLACEHOLDER;
  img.alt = character.name;
  img.addEventListener("error", () => {
    if (!img.src.endsWith(PLACEHOLDER)) img.src = PLACEHOLDER;
  });
  layout.appendChild(img);

  const info = el("div");
  addRow(info, "Species", character.species || "Unknown");
  addRow(info, "Role", character.role || "Unknown");
  addRow(info, "Age", character.age ?? "Unknown");
  info.appendChild(el("h2", "", "Description"));
  info.appendChild(el("p", "", character.description));
  layout.appendChild(info);
  wrapper.appendChild(layout);

  const actions = el("div", "actions");

  const back = el("a", "button secondary", "Back to Gallery");
  back.href = "/index.html";
  actions.appendChild(back);

  const edit = el("a", "button", "Edit");
  edit.href = `/character-form.html?id=${encodeURIComponent(character.characterId)}`;
  actions.appendChild(edit);

  const del = el("button", "danger", "Delete");
  del.type = "button";
  del.addEventListener("click", () => onDelete(character, del));
  actions.appendChild(del);

  wrapper.appendChild(actions);
  return wrapper;
}

async function onDelete(character, button) {
  if (!window.confirm(`Delete ${character.name}? This cannot be undone.`)) return;

  button.disabled = true;
  try {
    await deleteCharacter(character.characterId);
    setFlash(`${character.name} was removed`);
    window.location.href = "/index.html";
  } catch (err) {
    button.disabled = false;
    showStatus(
      "error",
      err.status === 404 ? "Character not found. It may already have been removed." : `Could not delete. ${err.message}`
    );
  }
}

async function load() {
  if (!id) {
    showStatus("error", "Character not found. No character was selected.");
    return;
  }

  showStatus("loading", "Loading...");
  try {
    const character = await getCharacter(id);
    clearStatus();
    document.title = `${character.name} | Character Details`;
    container.replaceChildren(buildDetails(character));
  } catch (err) {
    if (err.status === 404) {
      showStatus("error", "Character not found. It may have been removed.");
    } else {
      showStatus("error", `Could not load this character. ${err.message}`);
    }
  }
}

initPage();
load();
