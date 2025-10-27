let GAMES = []; // üres kezdetben

const catalog = document.getElementById('catalog');
const search = document.getElementById('search');
const tabs = document.querySelectorAll('.tab');

window.applyFilter = function() {
  const q = search.value.trim().toLowerCase();
  const activeTab = document.querySelector('.tab.active');
  const filter = activeTab ? activeTab.dataset.filter : 'all';

  let out = GAMES.filter(g => {
    if (filter === 'all') return true;
    if (Array.isArray(g.tag)) return g.tag.includes(filter);
    return g.tag === filter;
  });

  if (q) {
    out = out.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.desc.toLowerCase().includes(q)
    );
  }

  renderList(out);
};

// API-ból adatlekérés
async function loadGames() {
  try {
    const res = await fetch('http://localhost:3000/api/games');
    if (!res.ok) throw new Error("API hiba: " + res.status);
    const data = await res.json();

    // API oszlopnevekhez igazítás
    GAMES = data.map((g, i) => ({
      id: i + 1, // ha nincs ID az adatbázisban, sorszámot adunk
      title: g.title,
      tag: g.tag,
      price: g.price,
      desc: g.desc,
      thumb: g.thumbnail,  // API-ból a thumbnail mező
      shots: [] // ha nincs a DB-ben, üres tömb
    }));

    applyFilter(); // első render
  } catch (err) {
    console.error("Nem sikerült betölteni az adatokat:", err);
    catalog.innerHTML = `<p style="color:red">Nem sikerült betölteni az adatokat az API-ból.</p>`;
  }
}

function renderList(list){
  catalog.innerHTML = '';
  list.forEach(g => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="thumb"><img src="${g.thumb}" alt="${escapeHtml(g.title)} screenshot" style="width:100%;height:100%;object-fit:cover"></div>
      <div class="meta">
        <h3>${escapeHtml(g.title)}</h3>
        <div class="muted">${escapeHtml(g.desc)}</div>
        <div class="price-row">
          <div class="price">${escapeHtml(g.price)}</div>
          <button class="buy" data-id="${g.id}">Megnézem</button>
        </div>
      </div>`;
    catalog.appendChild(card);
  });

  // gombok események
  catalog.querySelectorAll('.buy').forEach(btn => btn.addEventListener('click', (e)=>{
    const id = Number(e.currentTarget.dataset.id);
    openModal(GAMES.find(x=>x.id===id));
  }));
}

function escapeHtml(s){return (s+'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]);}

// --- A többi részt (applyFilter, tabok, modal, stb.) meghagyhatod ahogy van ---

// betöltés induláskor
document.addEventListener("DOMContentLoaded", loadGames);

    // tabs
    tabs.forEach(t=> t.addEventListener('click', ()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      applyFilter();
    }));
    // set first tab active
    tabs[0].classList.add('active');

    search.addEventListener('input', applyFilter);

    // modal
    const modal = document.getElementById('modal');
    const mTitle = document.getElementById('m-title');
    const mCover = document.getElementById('m-cover');
    const mDesc = document.getElementById('m-desc');
    const mPrice = document.getElementById('m-price');
    const mShots = document.getElementById('m-shots');
    const mClose = document.getElementById('m-close');

    function openModal(game){
      if(!game) return;
      mTitle.textContent = game.title;
      mCover.src = game.thumb;
      mDesc.textContent = game.desc;
      mPrice.textContent = game.price;
      mShots.innerHTML = '';
      game.shots.forEach(s=>{
        const i = document.createElement('img');
        i.src = s; i.alt = game.title + ' shot'; i.style.width='48%'; i.style.borderRadius='6px';
        i.style.objectFit='cover'; mShots.appendChild(i);
      });
      modal.style.display='flex'; modal.setAttribute('aria-hidden','false');
    }
    function closeModal(){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); }
    mClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

    // initial render
    renderList(GAMES);
    // lightbox elemek
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

let currentShots = [];
let currentIndex = 0;

// nagyított kép megjelenítése
function showLightbox(index){
  if(index < 0) index = currentShots.length - 1;
  if(index >= currentShots.length) index = 0;
  currentIndex = index;
  lightboxImg.src = currentShots[currentIndex];
  lightbox.style.display = 'flex';
}

// képek hozzáadásánál kattintás esemény
function openModal(game){
  if(!game) return;
  mTitle.textContent = game.title;
  mCover.src = game.thumb;
  mDesc.textContent = game.desc;
  mPrice.textContent = game.price;
  mShots.innerHTML = '';
  currentShots = game.shots; // lightbox-hoz eltároljuk

  game.shots.forEach((s,idx)=>{
    const i = document.createElement('img');
    i.src = s; 
    i.alt = game.title + ' shot'; 
    i.style.width='48%'; 
    i.style.borderRadius='6px';
    i.style.cursor='pointer';
    i.style.objectFit='cover';
    
    // kattintásra nagyítás
    i.addEventListener('click', ()=>{
      showLightbox(idx);
    });

    mShots.appendChild(i);
  });
  modal.style.display='flex'; 
  modal.setAttribute('aria-hidden','false');
}

// lightbox bezárás
lightbox.addEventListener('click', (e)=>{ 
  if(e.target===lightbox){ // csak ha a háttérre kattint
    lightbox.style.display='none'; 
  }
});

// nyíl gombok
lbPrev.addEventListener('click', (e)=>{ 
  e.stopPropagation(); 
  showLightbox(currentIndex-1);
});
lbNext.addEventListener('click', (e)=>{ 
  e.stopPropagation(); 
  showLightbox(currentIndex+1);
});

// billentyű kezelése
document.addEventListener('keydown', (e)=>{
  if(lightbox.style.display==='flex'){
    if(e.key==='ArrowLeft') showLightbox(currentIndex-1);
    if(e.key==='ArrowRight') showLightbox(currentIndex+1);
    if(e.key==='Escape') lightbox.style.display='none';
  }
});
(function(){
const y = document.getElementById('year');
if(y) y.textContent = new Date().getFullYear();


// Hírlevél (front-end validáció + fake küldés)
const form = document.getElementById('newsletter');
const email = document.getElementById('news-email');
const msg = document.getElementById('news-msg');
form?.addEventListener('submit', (e)=>{
e.preventDefault();
const v = email.value.trim();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){
msg.textContent = 'Érvénytelen e-mail cím';
msg.style.color = '#ff6b6b';
email.focus();
return;
}
msg.textContent = 'Köszönjük! Ellenőrizd a postaládádat.';
msg.style.color = 'var(--acc)';
form.reset();
});


// Back to top
const toTop = document.getElementById('backToTop');
toTop?.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));


// Téma váltó (persist localStorage)
const toggle = document.getElementById('themeToggle');
const root = document.documentElement;
const KEY = 'mdmport-theme';
const saved = localStorage.getItem(KEY);
if(saved === 'light') { root.classList.add('light'); toggle && (toggle.checked = false); }
if(saved === 'dark') { root.classList.remove('light'); toggle && (toggle.checked = true); }
toggle?.addEventListener('change', ()=>{
const dark = toggle.checked;
if(dark){ root.classList.remove('light'); localStorage.setItem(KEY,'dark'); }
else{ root.classList.add('light'); localStorage.setItem(KEY,'light'); }
});


// Nyelvváltó (demo – csak UI)
document.querySelectorAll('.lang-btn').forEach(btn=>{
btn.addEventListener('click', ()=>{
document.querySelectorAll('.lang-btn').forEach(b=> b.setAttribute('aria-pressed','false'));
btn.setAttribute('aria-pressed','true');
// Itt illesztheted be a valódi i18n váltást
});
});
})();

document.addEventListener("DOMContentLoaded", () => {
  // Footer "Top listák" link
  const topListLink = document.querySelector('footer a[href="#"]:contains("Top listák")');

  // Ha megtaláltuk a linket
  if (topListLink) {
    topListLink.addEventListener("click", (e) => {
      e.preventDefault();

      // Megkeressük a "Top eladások" tabot
      const topTab = document.querySelector('.tab[data-filter="top"]');

      if (topTab) {
        topTab.click(); // ugyanazt csinálja, mintha rákattintanánk
        topTab.scrollIntoView({ behavior: "smooth", block: "center" }); // opcionális: odagörget
      }
    });
  }
});

