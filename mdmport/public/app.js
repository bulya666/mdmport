(function (global) {
  let GAMES = [];
  let catalog, search, tabs;
  let modal, mTitle, mCover, mDesc, mPrice, mShots, mClose;
  let lightbox, lightboxImg, lbPrev, lbNext;
  let currentShots = [];
  let currentIndex = 0;

  // Egységes animációs wrapper
  function animateCatalog(callback) {
    if (!catalog) return callback();
    catalog.style.transition = "opacity 0.35s ease, transform 0.35s ease";
    catalog.style.opacity = "0";
    catalog.style.transform = "scale(0.97)";
    setTimeout(() => {
      callback();
      requestAnimationFrame(() => {
        catalog.style.opacity = "1";
        catalog.style.transform = "scale(1)";
      });
    }, 250);
  }

  // Inicializálás
  function init() {
    catalog = document.getElementById("catalog");
    search = document.getElementById("search");
    tabs = document.querySelectorAll(".tab");
    modal = document.getElementById("modal");
    mTitle = document.getElementById("m-title");
    mCover = document.getElementById("m-cover");
    mDesc = document.getElementById("m-desc");
    mPrice = document.getElementById("m-price");
    mShots = document.getElementById("m-shots");
    mClose = document.getElementById("m-close");
    lightbox = document.getElementById("lightbox");
    lightboxImg = document.getElementById("lightbox-img");
    lbPrev = document.getElementById("lb-prev");
    lbNext = document.getElementById("lb-next");

    if (!catalog) return console.error("Hiányzik a #catalog elem!");

    // Tabkezelés
    tabs.forEach(t =>
      t.addEventListener("click", () => {
        if (t.classList.contains("active")) return;
        tabs.forEach(x => x.classList.remove("active"));
        t.classList.add("active");
        applyFilter();
      })
    );
    if (tabs.length) tabs[0].classList.add("active");

    // Keresés debounce-elve
    if (search) search.addEventListener("input", debounce(applyFilter, 150));

    // Modal bezárás
    if (mClose) mClose.addEventListener("click", closeModal);
    if (modal)
      modal.addEventListener("click", e => {
        if (e.target === modal) closeModal();
      });

    // Lightbox vezérlés
    if (lightbox)
      lightbox.addEventListener("click", e => {
        if (e.target === lightbox) lightbox.style.display = "none";
      });
    if (lbPrev)
      lbPrev.addEventListener("click", e => {
        e.stopPropagation();
        showLightbox(currentIndex - 1);
      });
    if (lbNext)
      lbNext.addEventListener("click", e => {
        e.stopPropagation();
        showLightbox(currentIndex + 1);
      });

    // Billentyűvezérlés lightboxhoz
    document.addEventListener("keydown", e => {
      if (lightbox && lightbox.style.display === "flex") {
        if (e.key === "ArrowLeft") showLightbox(currentIndex - 1);
        if (e.key === "ArrowRight") showLightbox(currentIndex + 1);
        if (e.key === "Escape") lightbox.style.display = "none";
      }
    });

    bindFooterLinks(); // Footer linkek, pl. "Akciók"
    loadGames(); // API-ból betöltés
  }

  // Footer linkek kezelése (Ajánlott, Top, Ingyenes, Akciók)
  function bindFooterLinks() {
    const links = Array.from(document.querySelectorAll("a"));
    const map = {
      top: "top listák",
      free: "ingyenes",
      all: "ajánlott"
    };

    // normál tab linkek
    Object.entries(map).forEach(([key, txt]) => {
      const link = links.find(a =>
        a.textContent.trim().toLowerCase().includes(txt)
      );
      if (link)
        link.addEventListener("click", e => {
          e.preventDefault();
          const tab = document.querySelector(`.tab[data-filter="${key}"]`);
          if (tab) {
            tabs.forEach(x => x.classList.remove("active"));
            tab.classList.add("active");
          }
          applyFilter();
        });
    });

    // külön az "Akciók" link — nincs hozzá tab
    const akcioLink = links.find(a =>
      a.textContent.trim().toLowerCase().includes("akció")
    );
    if (akcioLink) {
      akcioLink.addEventListener("click", e => {
        e.preventDefault();
        tabs.forEach(x => x.classList.remove("active")); // levesszük az actívet
        showNoSalesCard(); // külön funkció a megjelenítésre
      });
    }
  }

  // Akciók kártya megjelenítése (önállóan)
  function showNoSalesCard() {
    animateCatalog(() => {
    catalog.innerHTML = `
  <div class="no-sales">
    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="no sales">
    <h2>Jelenleg nincsenek akciók</h2>
    <p>Térj vissza később, hátha új ajánlatok érkeznek 💸</p>
  </div>
`;

      requestAnimationFrame(() => {
        const card = catalog.querySelector(".no-sales");
        if (card) {
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          });
        }
      });
    });
  }

  // Keresés és szűrés animációval
  function applyFilter() {
    if (!search || !tabs) return;

    animateCatalog(() => {
      const q = search.value.trim().toLowerCase();
      const activeTab = document.querySelector(".tab.active");
      const filter = activeTab ? activeTab.dataset.filter : "all";

      let out = GAMES.filter(g => {
        if (filter === "all") return true;
        if (Array.isArray(g.tag)) return g.tag.includes(filter);
        return g.tag === filter;
      });

      if (q) {
        const query = q.toLowerCase();
        out = out.filter(
          g =>
            g.title.toLowerCase().includes(query) ||
            g.desc.toLowerCase().includes(query)
        );
      }

      renderList(out);
    });
  }

  // 🧠 Debounce (a keresés optimalizálására)
  function debounce(fn, ms) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // 🎨 Lista kirajzolása
  function renderList(list) {
    catalog.innerHTML = list
      .map(
        g => `
      <article class="card">
        <div class="thumb">
          <img src="${g.thumb}" alt="${escapeHtml(g.title)} screenshot"
               style="width:100%;height:100%;object-fit:cover">
        </div>
        <div class="meta">
          <h3>${escapeHtml(g.title)}</h3>
          <div class="muted">${escapeHtml(g.desc)}</div>
          <div class="price-row">
            <div class="price">${escapeHtml(g.price)}</div>
            <button class="check" data-id="${g.id}">Megnézem</button>
          </div>
        </div>
      </article>`
      )
      .join("");

    catalog.querySelectorAll(".check").forEach(btn =>
      btn.addEventListener("click", e => {
        const id = Number(e.currentTarget.dataset.id);
        openModal(GAMES.find(x => x.id === id));
      })
    );
  }

  // 🧾 Játékadatok betöltése
  async function loadGames() {
    try {
      const [gamesRes, photosRes] = await Promise.all([
        fetch("/api/games"),
        fetch("/api/gamephotos"),
      ]);

      if (!gamesRes.ok || !photosRes.ok) throw new Error("API hiba.");

      const [gamesData, photosData] = await Promise.all([
        gamesRes.json(),
        photosRes.json(),
      ]);

      const photoMap = photosData.reduce((acc, p) => {
        (acc[p.gameid] ||= []).push(`/images/${p.pic}`);
        return acc;
      }, {});

      GAMES = gamesData.map(g => ({
        id: g.id,
        title: g.title || "Ismeretlen játék",
        tag: g.tag || "other",
        price: g.price || "Ingyenes",
        desc: g.desc || "",
        thumb: g.thumbnail || "https://via.placeholder.com/200x120?text=No+Image",
        shots: photoMap[g.id] || [],
      }));

      applyFilter();
    } catch (err) {
      console.error("Betöltési hiba:", err);
      catalog.innerHTML =
        "<p style='color:red'>Nem sikerült betölteni az adatokat az API-ból.</p>";
    }
  }

  // 🪟 Modal funkciók
  function openModal(game) {
    if (!game || !modal) return;
    mTitle.textContent = game.title;
    mCover.src = game.thumb;
    mDesc.textContent = game.desc;
    mPrice.textContent = game.price;
    mShots.innerHTML = "";
    currentShots = game.shots;

    game.shots.forEach((s, idx) => {
      const i = document.createElement("img");
      i.src = s;
      i.alt = game.title + " shot";
      Object.assign(i.style, {
        width: "48%",
        borderRadius: "6px",
        cursor: "pointer",
        objectFit: "cover",
      });
      i.addEventListener("click", () => showLightbox(idx));
      mShots.appendChild(i);
    });

    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  // 💡 Lightbox vezérlés
  function showLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    if (index < 0) index = currentShots.length - 1;
    if (index >= currentShots.length) index = 0;
    currentIndex = index;
    lightboxImg.src = currentShots[currentIndex];
    lightbox.style.display = "flex";
  }

  // 🧰 HTML escaping helper
  function escapeHtml(s) {
    return (s + "").replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );
  }

  global.initGameCatalog = init;
})(window);
