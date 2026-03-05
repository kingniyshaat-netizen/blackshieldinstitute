// PASSAGES data (single source of truth)
const PASSAGES = [
  { n:"01", title:"My parents phone number", cover:"assets/images/passages/passages-01.png", pdf:"downloads/passages-01.pdf" },
  { n:"02", title:"My parents names", cover:"assets/images/passages/passages-02.png", pdf:"downloads/passages-02.pdf" },
  { n:"03", title:"My parents address", cover:"assets/images/passages/passages-03.png", pdf:"downloads/passages-03.pdf" },
  { n:"04", title:"Who can I trust", cover:"assets/images/passages/passages-04.png", pdf:"downloads/passages-04.pdf" },
  { n:"05", title:"Im lost find a cop", cover:"assets/images/passages/passages-05.png", pdf:"downloads/passages-05.pdf" },
  { n:"06", title:"I'm a big boy now", cover:"assets/images/passages/passages-06.png", pdf:"downloads/passages-06.pdf" },
  { n:"07", title:"I'm a big Girl now", cover:"assets/images/passages/passages-07.png", pdf:"downloads/passages-07.pdf" },
  { n:"08", title:"The Power in the know", cover:"assets/images/passages/passages-08.png", pdf:"downloads/passages-08.pdf" },
  { n:"09", title:"What it means to grow up", cover:"assets/images/passages/passages-09.png", pdf:"downloads/passages-09.pdf" },
  { n:"10", title:"Teen years and the brain", cover:"assets/images/passages/passages-10.png", pdf:"downloads/passages-10.pdf" },
  { n:"11", title:"My boundaries my limits", cover:"assets/images/passages/passages-11.png", pdf:"downloads/passages-11.pdf" },
  { n:"12", title:"Relationship and consent", cover:"assets/images/passages/passages-12.png", pdf:"downloads/passages-12.pdf" }
];

// Render grid into any container with id="passagesGrid"
function renderPassagesGrid(){
  const el = document.getElementById("passagesGrid");
  if(!el) return;

  el.innerHTML = PASSAGES.map(b => `
    <div class="book">
      <img src="${b.cover}" alt="Passages Book ${b.n} cover"
           loading="lazy"
           onerror="this.style.opacity='.15'; this.title='Missing: ${b.cover}'" />
      <div class="bookMeta">
        <div class="num">BOOK ${b.n}</div>
        <div class="title">${escapeHtml(b.title)}</div>
        <div class="actions">
          <a class="smallBtn" href="${b.cover}" target="_blank" rel="noopener">View Cover</a>
          <a class="smallBtn" href="${b.pdf}" target="_blank" rel="noopener">Open PDF</a>
        </div>
      </div>
    </div>
  `).join("");
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (m)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
  }[m]));
}

function setYear(){
  const yr = document.getElementById("yr");
  if(yr) yr.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderPassagesGrid();
  setYear();
});
