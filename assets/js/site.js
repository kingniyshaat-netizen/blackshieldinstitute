// ===============================
// Blackshield Institute — Site JS
// PASSAGES: single source of truth
// ===============================

// Official PASSAGES list (01–12)
const PASSAGES = [
  { n: "01", title: "My parents phone number" },
  { n: "02", title: "My parents names" },
  { n: "03", title: "My parents addresse" },
  { n: "04", title: "Who can I trust" },
  { n: "05", title: "Im lost find a cop" },
  { n: "06", title: "I'm a big boy now" },
  { n: "07", title: "I'm a big Girl now" },
  { n: "08", title: "The Power in the know" },
  { n: "09", title: "What it means to grow up" },
  { n: "10", title: "Teen years and the brain" },
  { n: "11", title: "My boundaries my limits" },
  { n: "12", title: "Relationship and consent" }
];

// Paths (keep these consistent with your repo structure)
function coverPath(n) {
  return `passages-${n}.png`;
}
function pdfPath(n) {
  return `downloads/passages-${n}.pdf`;
}
function viewerPath(n) {
  return `passage.html?book=${n}`;
}

// Render PASSAGES grid into any container with id="passagesGrid"
function renderPassagesGrid() {
  const el = document.getElementById("passagesGrid");
  if (!el) return;

  el.innerHTML = PASSAGES.map((b) => {
    const cover = coverPath(b.n);
    const pdf = pdfPath(b.n);
    const viewer = viewerPath(b.n);

    return `
      <div class="book">
        <a href="${viewer}" aria-label="Open PASSAGES Book ${b.n} viewer">
          <img
            src="${cover}"
            alt="PASSAGES Book ${b.n} cover"
            loading="lazy"
            onerror="this.style.opacity='.18'; this.title='Missing cover: ${cover} (check filename/case/path)';"
          />
        </a>

        <div class="bookMeta">
          <div class="num">BOOK ${b.n}</div>
          <div class="title">${escapeHtml(b.title)}</div>

          <div class="actions">
            <a class="smallBtn" href="${viewer}">Open Viewer</a>
            <a class="smallBtn" href="${pdf}" target="_blank" rel="noopener">Open PDF</a>
            <a class="smallBtn" href="${cover}" target="_blank" rel="noopener">View Cover</a>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Footer year helper
function setYear() {
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
}

// HTML escaping for safety
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  renderPassagesGrid();
  setYear();
});
