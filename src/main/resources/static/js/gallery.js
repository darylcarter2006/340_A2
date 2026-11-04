import { listCharacters } from "/js/api.js";
import { el, initPage, showStatus, clearStatus } from "/js/layout.js";

const PLACEHOLDER = "/images/placeholder.svg";

const grid = document.getElementById("character-grid");
const form = document.getElementById("search-form");
const nameInput = document.getElementById("search-name");
const speciesSelect = document.getElementById("search-species");
const clearButton = document.getElementById("clear-search");

// Species options are built from the full list once, so they stay put while filtering
let speciesLoaded = false;

function buildCard(character) {
  const card = el("div", "character-card");

  const img = el("img");
  img.src = character.imageUrl || PLACEHOLDER;
  img.alt = character.name;
  img.addEventListener("error", () => {
    if (!img.src.endsWith(PLACEHOLDER)) img.src = PLACEHOLDER;
  });
  card.appendChild(img);

  card.appendChild(el("h3", "", character.name));

  const info = el("p");
  info.append(`Species: ${character.species || "Unknown"}`, document.createElement("br"), `Role: ${character.role || "Unknown"}`);
  card.appendChild(info);

  const link = el("a", "", "View Details");
  link.href = `/details.html?id=${encodeURIComponent(character.characterId)}`;
  card.appendChild(link);

  return card;
}

function fillSpeciesOptions(characters) {
  const species = [...new Set(characters.map((c) => c.species).filter(Boolean))].sort();
  for (const name of species) {
    const option = el("option", "", name);
    option.value = name;
    speciesSelect.appendChild(option);
  }
  speciesLoaded = true;
}

// Only the newest request may update the page, so overlapping searches
// cannot append their cards on top of each other
let latestRequest = 0;

async function loadGallery() {
  const requestId = ++latestRequest;
  grid.replaceChildren();
  showStatus("loading", "Loading...");

  try {
    const characters = await listCharacters({
      name: nameInput.value,
      species: speciesSelect.value,
    });

    if (requestId !== latestRequest) return; // a newer search replaced this one

    if (!speciesLoaded) fillSpeciesOptions(characters);

    if (characters.length === 0) {
      showStatus("empty", "No characters found.");
      return;
    }

    clearStatus();
    for (const character of characters) {
      grid.appendChild(buildCard(character));
    }
  } catch (err) {
    if (requestId !== latestRequest) return;
    showStatus("error", `Could not load characters. ${err.message}`);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  loadGallery();
});

clearButton.addEventListener("click", () => {
  nameInput.value = "";
  speciesSelect.value = "";
  loadGallery();
});

initPage();
loadGallery();
