const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const ROOT_FILES = [
  "product-1.html",
  "diamond-in-the-rough.html",
  "passages-series.html",
  "passages.html",
  "family-structure.html",
  "members-access.html",
  "playroom.html"
];

const ONE_FOLDER_DIRS = [
  "tiers",
  "products",
  "playroom",
  "interactive",
  "interactives"
];

const TWO_FOLDER_DIRS = [
  path.join("store", "bundles")
];

const CSS_FILE = path.join(ROOT, "assets", "css", "styles.css");

const CSS_PATCH = `
/* =========================================================
   BLACKSHIELD PATCH: RETURN NAVIGATION
   ========================================================= */

.return-nav {
  width: min(calc(100% - 32px), var(--max));
  margin: 18px auto 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
}

.return-nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 9px 13px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(0, 0, 0, 0.18);
  color: var(--gold-2) !important;
  text-decoration: none !important;
  font-weight: 900;
}

.return-nav a.primary-return {
  background: linear-gradient(180deg, var(--gold-2), #b78138);
  color: #1a1007 !important;
  border-color: transparent;
}

.return-nav a:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.return-nav a:focus-visible {
  outline: 3px solid var(--gold-2);
  outline-offset: 3px;
}

@media (max-width: 700px) {
  .return-nav {
    width: min(calc(100% - 20px), var(--max));
  }

  .return-nav a {
    width: 100%;
  }
}
`;

function rootReturnNav() {
  return `
<!-- BLACKSHIELD PATCH: return navigation -->
<nav class="return-nav" aria-label="Return navigation">
  <a class="primary-return" href="./index.html">← Home</a>
  <a href="./catalog.html">Catalog</a>
  <a href="./curriculum.html">Curriculum</a>
  <a href="./playroom.html">Playroom</a>
  <a href="./contact.html">Contact</a>
</nav>
<!-- END BLACKSHIELD PATCH -->
`;
}

function oneFolderReturnNav() {
  return `
<!-- BLACKSHIELD PATCH: return navigation -->
<nav class="return-nav" aria-label="Return navigation">
  <a class="primary-return" href="../index.html">← Home</a>
  <a href="../catalog.html">Catalog</a>
  <a href="../curriculum.html">Curriculum</a>
  <a href="../playroom.html">Playroom</a>
  <a href="../contact.html">Contact</a>
</nav>
<!-- END BLACKSHIELD PATCH -->
`;
}

function twoFolderReturnNav() {
  return `
<!-- BLACKSHIELD PATCH: return navigation -->
<nav class="return-nav" aria-label="Return navigation">
  <a class="primary-return" href="../../index.html">← Home</a>
  <a href="../../catalog.html">Catalog</a>
  <a href="../../curriculum.html">Curriculum</a>
  <a href="../../playroom.html">Playroom</a>
  <a href="../../contact.html">Contact</a>
</nav>
<!-- END BLACKSHIELD PATCH -->
`;
}

function getHtmlFilesInDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) return [];

  return fs
    .readdirSync(directoryPath)
    .filter((file) => file.toLowerCase().endsWith(".html"))
    .map((file) => path.join(directoryPath, file));
}

function patchCss() {
  if (!fs.existsSync(CSS_FILE)) {
    console.log(`CSS file not found: ${CSS_FILE}`);
    return;
  }

  const css = fs.readFileSync(CSS_FILE, "utf8");

  if (css.includes("BLACKSHIELD PATCH: RETURN NAVIGATION")) {
    console.log("CSS return navigation patch already exists.");
    return;
  }

  fs.writeFileSync(CSS_FILE, `${css.trim()}\n\n${CSS_PATCH.trim()}\n`, "utf8");
  console.log("Patched CSS return navigation styling.");
}

function ensureStylesheetPath(html, depth) {
  const expected =
    depth === 0
      ? "assets/css/styles.css"
      : depth === 1
      ? "../assets/css/styles.css"
      : "../../assets/css/styles.css";

  if (html.includes(expected)) return html;

  const hasAnyStylesheet = /<link[^>]+rel=["']stylesheet["'][^>]*>/i.test(html);

  if (!hasAnyStylesheet && /<\/head>/i.test(html)) {
    return html.replace(
      /<\/head>/i,
      `  <link rel="stylesheet" href="${expected}" />\n</head>`
    );
  }

  return html;
}

function insertReturnNav(html, navBlock) {
  if (html.includes("BLACKSHIELD PATCH: return navigation")) {
    return html;
  }

  if (/<\/header>/i.test(html)) {
    return html.replace(/<\/header>/i, `</header>\n${navBlock}`);
  }

  if (/<body[^>]*>/i.test(html)) {
    return html.replace(/<body([^>]*)>/i, `<body$1>\n${navBlock}`);
  }

  return `${navBlock}\n${html}`;
}

function patchFile(filePath, navBlock, depth) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipped missing file: ${path.relative(ROOT, filePath)}`);
    return;
  }

  const original = fs.readFileSync(filePath, "utf8");
  let patched = ensureStylesheetPath(original, depth);
  patched = insertReturnNav(patched, navBlock);

  if (patched === original) {
    console.log(`No change needed: ${path.relative(ROOT, filePath)}`);
    return;
  }

  fs.writeFileSync(filePath, patched, "utf8");
  console.log(`Patched: ${path.relative(ROOT, filePath)}`);
}

function run() {
  patchCss();

  ROOT_FILES.forEach((file) => {
    patchFile(path.join(ROOT, file), rootReturnNav(), 0);
  });

  ONE_FOLDER_DIRS.forEach((dir) => {
    const directoryPath = path.join(ROOT, dir);
    const htmlFiles = getHtmlFilesInDirectory(directoryPath);

    htmlFiles.forEach((filePath) => {
      patchFile(filePath, oneFolderReturnNav(), 1);
    });
  });

  TWO_FOLDER_DIRS.forEach((dir) => {
    const directoryPath = path.join(ROOT, dir);
    const htmlFiles = getHtmlFilesInDirectory(directoryPath);

    htmlFiles.forEach((filePath) => {
      patchFile(filePath, twoFolderReturnNav(), 2);
    });
  });

  console.log("Blackshield return navigation patch complete.");
}

run();
