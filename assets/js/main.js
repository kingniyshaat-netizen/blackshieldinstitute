const PLAYROOM_MANIFEST_PATH = "interactive/manifest.json";

async function loadPlayroomManifest() {
  const response = await fetch(PLAYROOM_MANIFEST_PATH, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load playroom manifest: ${response.status}`);
  }
  return response.json();
}

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildCategoryCard(category) {
  const article = document.createElement("article");
  article.className = "info-card";

  article.innerHTML = `
    <h3>${category.title}</h3>
    <p>${category.description}</p>
    <a class="btn btn-primary" href="${category.index}">Open Section</a>
  `;

  return article;
}

function buildToolCard(categoryTitle, tool) {
  const article = document.createElement("article");
  article.className = "info-card";

  article.innerHTML = `
    <h3>${tool.title}</h3>
    <p>${tool.description}</p>
    <p><strong>Section:</strong> ${categoryTitle}</p>
    <a class="btn btn-primary" href="${tool.path}">Launch</a>
  `;

  return article;
}

async function initPlayroomLoader() {
  const categoryGrid = document.getElementById("playroom-category-grid");
  const toolGrid = document.getElementById("playroom-tool-grid");

  if (!categoryGrid && !toolGrid) return;

  try {
    const manifest = await loadPlayroomManifest();
    const categories = Array.isArray(manifest.categories) ? manifest.categories : [];

    if (categoryGrid) {
      categoryGrid.innerHTML = "";
      categories.forEach((category) => {
        categoryGrid.appendChild(buildCategoryCard(category));
      });
    }

    if (toolGrid) {
      toolGrid.innerHTML = "";
      categories.forEach((category) => {
        const tools = Array.isArray(category.tools) ? category.tools : [];
        tools.forEach((tool) => {
          toolGrid.appendChild(buildToolCard(category.title, tool));
        });
      });
    }
  } catch (error) {
    const fallback = `
      <article class="info-card">
        <h3>Playroom manifest not found</h3>
        <p>The interactive launcher system could not load <strong>${PLAYROOM_MANIFEST_PATH}</strong>.</p>
      </article>
    `;
    if (categoryGrid) categoryGrid.innerHTML = fallback;
    if (toolGrid) toolGrid.innerHTML = fallback;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", initPlayroomLoader);
