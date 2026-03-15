const PLAYROOM_SECTION_MANIFEST_PATH = "../../interactive/manifest.json";

async function loadSectionManifest() {
  try {
    const response = await fetch(PLAYROOM_SECTION_MANIFEST_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Manifest file not found");
    }
    return await response.json();
  } catch (error) {
    console.error("Section manifest error:", error);
    return null;
  }
}

function createToolCard(tool) {
  const card = document.createElement("article");
  card.className = "info-card";

  const h3 = document.createElement("h3");
  h3.textContent = tool.title;

  const p = document.createElement("p");
  p.textContent = tool.description || "";

  const a = document.createElement("a");
  a.href = tool.path;
  a.className = "btn btn-primary";
  a.textContent = "Launch";

  card.appendChild(h3);
  card.appendChild(p);
  card.appendChild(a);

  return card;
}

async function buildSectionTools() {
  const sectionSlug = document.body.dataset.section;
  const grid = document.getElementById("section-tool-grid");
  const heading = document.getElementById("section-title");
  const intro = document.getElementById("section-description");

  if (!sectionSlug || !grid) return;

  const manifest = await loadSectionManifest();
  if (!manifest || !Array.isArray(manifest.categories)) return;

  const category = manifest.categories.find(cat => cat.slug === sectionSlug);

  if (!category) {
    grid.innerHTML = `
      <article class="info-card">
        <h3>Section not found</h3>
        <p>No matching section exists in interactive/manifest.json.</p>
      </article>
    `;
    return;
  }

  if (heading) heading.textContent = category.title;
  if (intro) intro.textContent = category.description || "";

  grid.innerHTML = "";

  const tools = Array.isArray(category.tools) ? category.tools : [];

  if (!tools.length) {
    grid.innerHTML = `
      <article class="info-card">
        <h3>No tools uploaded yet</h3>
        <p>This section is live, but no tools have been added to the manifest yet.</p>
      </article>
    `;
    return;
  }

  tools.forEach(tool => {
    grid.appendChild(createToolCard(tool));
  });
}

document.addEventListener("DOMContentLoaded", buildSectionTools);
