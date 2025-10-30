// src/assets/js/app.js

(function (global) {
  let GAMES = [];
  let catalog, search, tabs;
  let modal, mTitle, mCover, mDesc, mPrice, mShots, mClose;
  let lightbox, lightboxImg, lbPrev, lbNext;
  let currentShots = [];
  let currentIndex = 0;

  // inicializálás
  function init() {
    catalog = document.getElementById('catalog');
    search = document.getElementById('search');
    tabs = document.querySelectorAll('.tab');
    modal = document.getElementById('modal');
    mTitle = document.getElementById('m-title');
    mCover = document.getElementById('m-cover');
    mDesc = document.getElementById('m-desc');
    mPrice = document.getElementById('m-price');
    mShots = document.getElementById('m-shots');
    mClose = document.getElementById('m-close');
    lightbox = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightbox-img');
    lbPrev = document.getElementById('lb-prev');
    lbNext = document.getElementById('lb-next');

    if (!catalog) {
      console.error("app.js: hiányoznak a szükséges HTML elemek!");
      return;
    }

    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      applyFilter();
    }));
    if (tabs.length) tabs[0].classList.add('active');
    if (search) search.addEventListener('input', applyFilter);

    if (mClose) mClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    if (lightbox) {
      lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.style.display = 'none'; });
    }
    if (lbPrev) lbPrev.addEventListener('click', e => { e.stopPropagation(); showLightbox(currentIndex - 1); });
    if (lbNext) lbNext.addEventListener('click', e => { e.stopPropagation(); showLightbox(currentIndex + 1); });

    document.addEventListener('keydown', e => {
      if (lightbox && lightbox.style.display === 'flex') {
        if (e.key === 'ArrowLeft') showLightbox(currentIndex - 1);
        if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
        if (e.key === 'Escape') lightbox.style.display = 'none';
      }
    });

    loadGames();
  }

// adatlekérés
async function loadGames() {
  try {
    // 1️⃣ játékok lekérése
    const [gamesRes, photosRes] = await Promise.all([
      fetch('http://localhost:3000/api/games'),
      fetch('http://localhost:3000/api/gamephotos')
    ]);

    if (!gamesRes.ok || !photosRes.ok)
      throw new Error("API hiba a lekérésnél.");

    const gamesData = await gamesRes.json();
    const photosData = await photosRes.json();

    // 2️⃣ játékokat és képeket összekapcsoljuk gameid alapján
    GAMES = gamesData.map((g, i) => {
      const relatedPhotos = photosData
        .filter(p => p.gameid === g.id)
        .map(p => `/images/${p.pic}`); // képfájlok útvonala a public/images-ből

      return {
        id: g.id,
        title: g.title || 'Ismeretlen játék',
        tag: g.tag || 'other',
        price: g.price || 'Ingyenes',
        desc: g.desc || '',
        thumb: g.thumbnail || 'https://via.placeholder.com/200x120?text=No+Image',
        shots: relatedPhotos
      };
    });

    applyFilter();

  } catch (err) {
    console.error("Nem sikerült betölteni az adatokat:", err);
    if (catalog)
      catalog.innerHTML = `<p style="color:red">Nem sikerült betölteni az adatokat az API-ból.</p>`;
  }
}


  // lista kirajzolása
  function renderList(list) {
    if (!catalog) return;
    catalog.innerHTML = '';

    list.forEach(g => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="thumb">
          <img src="${g.thumb}" alt="${escapeHtml(g.title)} screenshot" style="width:100%;height:100%;object-fit:cover">
        </div>
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

    catalog.querySelectorAll('.buy').forEach(btn =>
      btn.addEventListener('click', e => {
        const id = Number(e.currentTarget.dataset.id);
        openModal(GAMES.find(x => x.id === id));
      })
    );
  }

  // szűrés
  function applyFilter() {
    if (!search || !tabs) return;
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
        g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q)
      );
    }

    renderList(out);
  }

  // modal
  function openModal(game) {
    if (!game || !modal) return;
    mTitle.textContent = game.title;
    mCover.src = game.thumb;
    mDesc.textContent = game.desc;
    mPrice.textContent = game.price;
    mShots.innerHTML = '';
    currentShots = game.shots;

    game.shots.forEach((s, idx) => {
      const i = document.createElement('img');
      i.src = s;
      i.alt = game.title + ' shot';
      i.style.width = '48%';
      i.style.borderRadius = '6px';
      i.style.cursor = 'pointer';
      i.style.objectFit = 'cover';
      i.addEventListener('click', () => showLightbox(idx));
      mShots.appendChild(i);
    });

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  // lightbox
  function showLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    if (index < 0) index = currentShots.length - 1;
    if (index >= currentShots.length) index = 0;
    currentIndex = index;
    lightboxImg.src = currentShots[currentIndex];
    lightbox.style.display = 'flex';
  }

  // HTML escaping
  function escapeHtml(s) {
    return (s + '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  }

  // export init függvény Angular számára
  global.initGameCatalog = init;
})(window);

