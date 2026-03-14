const PASSAGES_BOOKS = {
  "01": {
    title: "My Parents Phone Number",
    synopsis: "A foundational PASSAGES title designed to help children remember and safely use important phone numbers. This book builds practical recall, confidence, and readiness for real-world situations."
  },
  "02": {
    title: "My Parents Names",
    synopsis: "This title helps children clearly learn and remember the names of their parents or guardians. It reinforces identity, communication, and practical information every child should know."
  },
  "03": {
    title: "My Parents Address",
    synopsis: "A practical early-learning title that teaches children how to remember their address and understand why location knowledge matters. It supports safety, memory, and real-world readiness."
  },
  "04": {
    title: "Who Can I Trust",
    synopsis: "This book introduces the concept of trust, safe adults, and wise judgment in a child-friendly way. It helps young readers think carefully about who to go to when they need help."
  },
  "05": {
    title: "Im Lost Find a Cop",
    synopsis: "A straightforward guide for children on what to do if they become lost. It teaches calm action, safe choices, and the importance of finding the right authority figure for help."
  },
  "06": {
    title: "I'm a Big Boy Now",
    synopsis: "A growth-centered PASSAGES title that supports maturity, self-control, responsibility, and confidence. It helps young boys understand what growth should look like in practical daily life."
  },
  "07": {
    title: "I'm a Big Girl Now",
    synopsis: "A development-focused title for girls that highlights growth, responsibility, self-respect, and confidence. It reinforces maturity and healthy self-awareness in a supportive format."
  },
  "08": {
    title: "The Power in the Know",
    synopsis: "This title teaches that knowledge is power. It encourages awareness, understanding, and the confidence that comes from being informed and prepared."
  },
  "09": {
    title: "What It Means to Grow Up",
    synopsis: "A practical introduction to maturity, life changes, and responsible development. This book helps readers think clearly about what growth should mean in real life."
  },
  "10": {
    title: "Teen Years and the Brain",
    synopsis: "This title explores development, thinking, behavior, and the challenges of the teen years with a direct and understandable approach. It supports self-awareness and better choices."
  },
  "11": {
    title: "My Boundaries My Limits",
    synopsis: "A clear guide to personal boundaries, self-protection, and respectful limits. It teaches readers the importance of knowing where they end and what they should protect."
  },
  "12": {
    title: "Relationship and Consent",
    synopsis: "A structured title focused on respect, accountability, boundaries, and consent. It introduces relationship ethics in a serious, readable, and developmentally aware way."
  }
};

function setYear() {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

function createPassagesGrid() {
  const mount = document.getElementById("passages-grid");
  if (!mount) return;

  Object.entries(PASSAGES_BOOKS).forEach(([num, book]) => {
    const card = document.createElement("article");
    card.className = "passages-card";

    card.innerHTML = `
      <img src="assets/images/passages/passages-${num}.png" alt="PASSAGES ${num} cover">
      <div class="passages-meta">
        <div class="passages-num">Book ${num}</div>
        <div class="passages-title">${book.title}</div>
        <div class="passages-desc">${book.synopsis}</div>
        <div class="button-row">
          <a class="btn btn-primary" href="passages.html?b=${num}">View</a>
          <a class="btn" href="downloads/passages/passages-${num}.pdf" target="_blank" rel="noopener">PDF</a>
        </div>
      </div>
    `;

    const img = card.querySelector("img");
    img.addEventListener("error", () => {
      img.style.opacity = ".18";
      img.title = `Missing file: assets/images/passages/passages-${num}.png`;
    });

    mount.appendChild(card);
  });
}

function getBookNumber() {
  const params = new URLSearchParams(window.location.search);
  let bookNum = params.get("b") || "01";
  if (bookNum.length === 1) bookNum = `0${bookNum}`;
  if (!PASSAGES_BOOKS[bookNum]) bookNum = "01";
  return bookNum;
}

function createPassagesViewer() {
  const mount = document.getElementById("passages-viewer");
  if (!mount) return;

  const bookNum = getBookNumber();
  const book = PASSAGES_BOOKS[bookNum];
  const coverPath = `assets/images/passages/passages-${bookNum}.png`;
  const pdfPath = `downloads/passages/passages-${bookNum}.pdf`;

  mount.innerHTML = `
    <div class="viewer-cover">
      <img id="viewer-cover-image" src="${coverPath}" alt="${book.title} cover">
    </div>

    <div class="viewer-panel">
      <h1>PASSAGES ${bookNum} — ${book.title}</h1>
      <div class="viewer-meta">Blackshield Institute • PASSAGES Series • Book ${bookNum}</div>
      <div class="viewer-synopsis">${book.synopsis}</div>
      <div class="button-row">
        <a class="btn" href="passages-series.html">Back to Series</a>
        <a class="btn btn-primary" href="${pdfPath}" target="_blank" rel="noopener">Open PDF</a>
        <a class="btn" href="${coverPath}" target="_blank" rel="noopener">Open Cover</a>
      </div>
      <div class="viewer-note">
        If a PDF or image 404s, that file is not yet present in the expected deployment folder.
      </div>
    </div>
  `;

  const cover = document.getElementById("viewer-cover-image");
  cover.addEventListener("error", () => {
    const holder = cover.parentElement;
    holder.innerHTML = `
      <div class="viewer-panel">
        Missing cover for Book ${bookNum}. Expected file:
        <br><strong>${coverPath}</strong>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  createPassagesGrid();
  createPassagesViewer();
});
