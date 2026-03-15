const PLAYROOM_MANIFEST_PATH = "interactive/manifest.json";

async function loadPlayroomManifest() {
  try {
    const response = await fetch(PLAYROOM_MANIFEST_PATH, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Manifest file not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Playroom manifest error:", error);
    return null;
  }
}

function createCard(title, description, link) {
  const card = document.createElement("article");
  card.className = "info-card";

  const h3 = document.createElement("h3");
  h3.textContent = title;

  const p = document.createElement("p");
  p.textContent = description || "";

  const a = document.createElement("a");
  a.href = link;
  a.className = "btn btn-primary";
  a.textContent = "Open";

  card.appendChild(h3);
  card.appendChild(p);
  card.appendChild(a);

  return card;
}

async function buildPlayroom() {

  const manifest = await loadPlayroomManifest();
  if (!manifest) return;

  const grid = document.getElementById("playroom-category-grid");
  if (!grid) return;

  grid.innerHTML = "";

  manifest.categories.forEach(cat => {

    const card = createCard(
      cat.title,
      "Open the " + cat.title + " interactive section.",
      cat.index
    );

    grid.appendChild(card);

  });

}

document.addEventListener("DOMContentLoaded", buildPlayroom);
