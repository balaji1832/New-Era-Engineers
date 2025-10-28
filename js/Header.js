
document.addEventListener("DOMContentLoaded", function () {
  /* =========================
   * Hover mega menu (desktop)
   * Only one open at a time + 2s delayed close
   * ========================= */
  const DESKTOP_BP = 992;
  const CLOSE_DELAY = 2000;

  if (window.innerWidth > DESKTOP_BP) {
    const dropdowns = Array.from(document.querySelectorAll(".navbar .nav-item.dropdown"));
    const timers = new WeakMap();
    let currentOpen = null;

    function getInstance(dropdown) {
      const toggle = dropdown.querySelector('[data-bs-toggle="dropdown"]');
      return toggle ? bootstrap.Dropdown.getOrCreateInstance(toggle) : null;
    }
    function clearTimer(dropdown) {
      const t = timers.get(dropdown);
      if (t) { clearTimeout(t); timers.delete(dropdown); }
    }
    function forceClose(dropdown) {
      const inst = getInstance(dropdown);
      if (inst) inst.hide();
      clearTimer(dropdown);
      if (currentOpen === dropdown) currentOpen = null;
    }
    function openDropdown(dropdown) {
      if (currentOpen && currentOpen !== dropdown) forceClose(currentOpen);
      clearTimer(dropdown);
      const inst = getInstance(dropdown);
      if (inst) inst.show();
      currentOpen = dropdown;
    }
    function scheduleClose(dropdown) {
      clearTimer(dropdown);
      const id = setTimeout(() => {
        const stillHovered = dropdown.matches(":hover");
        if (!stillHovered || currentOpen === dropdown) forceClose(dropdown);
      }, CLOSE_DELAY);
      timers.set(dropdown, id);
    }

    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("mouseenter", () => openDropdown(dropdown));
      dropdown.addEventListener("mouseleave", () => scheduleClose(dropdown));
    });

    document.addEventListener("show.bs.dropdown", (e) => {
      const dd = e.target.closest(".nav-item.dropdown");
      if (!dd) return;
      if (currentOpen && currentOpen !== dd) forceClose(currentOpen);
      currentOpen = dd;
    });

    document.addEventListener("hide.bs.dropdown", (e) => {
      const dd = e.target.closest(".nav-item.dropdown");
      clearTimer(dd);
      if (currentOpen === dd) currentOpen = null;
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth <= DESKTOP_BP && currentOpen) forceClose(currentOpen);
    });
  }

  /* =========================
   * Search toggle + live search
   * ========================= */
  const box = document.getElementById("neSearchBox");
  const input = document.getElementById("neSearchInput");
  const resultsEl = document.getElementById("neSearchResults");
  const btnMobile = document.getElementById("neSearchToggleMobile");
  const btnDesktop = document.getElementById("neSearchToggle");

  // Optional: set to "search.html" (or your route) for your own results page
  const LOCAL_SEARCH_PAGE = null;

  let searchTimer;
  let currentIndex = -1; // keyboard highlight index
  let currentResults = [];

  function toggleSearch() {
    const isOpen = box?.classList.contains("open");
    isOpen ? closeSearch() : openSearch();
  }
  function openSearch() {
    box?.classList.add("open");
    setTimeout(() => input && input.focus(), 150);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (!box?.matches(":hover") &&
          !(document.activeElement && document.activeElement.closest && document.activeElement.closest("#neSearchBox"))) {
        closeSearch();
      }
    }, 2000);
  }
  function closeSearch() {
    box?.classList.remove("open");
    clearTimeout(searchTimer);
    clearResults();
    if (input) input.value = "";
  }

  btnMobile?.addEventListener("click", toggleSearch);
  btnDesktop?.addEventListener("click", toggleSearch);

  box?.addEventListener("mouseenter", () => clearTimeout(searchTimer));
  box?.addEventListener("mouseleave", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => closeSearch(), 2000);
  });

  /* ===== Build a lightweight index from existing nav + mega menu links ===== */
  const rawLinks = Array.from(document.querySelectorAll(
    ".dropdown-menu a[href], .navbar a.nav-link[href]"
  ));
  const index = [];
  const seen = new Set();
  rawLinks.forEach(a => {
    const href = (a.getAttribute("href") || "").trim();
    if (!href || href.startsWith("#")) return;
    const title = (a.textContent || a.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
    if (!title) return;
    const key = href + "||" + title.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    index.push({ title, href, group: findGroupHeading(a) });
  });
  function findGroupHeading(linkEl) {
    const col = linkEl.closest(".col-lg-2, .col-lg-3, .col-md-4");
    const h = col ? col.querySelector("h6") : null;
    return h ? h.textContent.trim() : null;
  }

  /* ===== Search ranking ===== */
  function normalize(s) { return (s || "").toLowerCase().replace(/\s+/g, " ").trim(); }
  function scoreItem(q, item) {
    const t = normalize(item.title);
    const g = normalize(item.group || "");
    const starts = t.startsWith(q);
    const incl = t.includes(q);
    const gIncl = g && g.includes(q);
    let score = 0;
    if (starts) score += 100;
    if (incl) score += 40;
    if (gIncl) score += 15;
    score += Math.max(0, 20 - t.length / 10);
    return score;
  }
  function searchIndex(query, limit = 8) {
    const q = normalize(query);
    if (!q) return [];
    return index
      .map(item => ({ item, s: scoreItem(q, item) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, limit)
      .map(x => x.item);
  }

  /* ===== JS-only overlay styling & positioning ===== */
  const headerEl = document.querySelector(".ne-header.sticky-top");
  if (headerEl) headerEl.style.zIndex = "1080"; // keep header above page

  function initResultsStyles() {
    if (!resultsEl) return;
    resultsEl.style.position      = "fixed";              // escape clipping
    resultsEl.style.display       = "none";               // hidden until open
    resultsEl.style.background    = "#fff";
    resultsEl.style.border        = "1px solid rgba(0,0,0,.08)";
    resultsEl.style.borderRadius  = "10px";
    resultsEl.style.boxShadow     = "0 10px 28px rgba(0,0,0,.16)";
    resultsEl.style.maxHeight     = "340px";
    resultsEl.style.overflowY     = "scroll";             // scrollable
    resultsEl.style.overflowX     = "hidden";
    resultsEl.style.zIndex        = "4000";               // above hero/sections
    resultsEl.style.textAlign     = "left";
    resultsEl.style.padding       = "0";
    resultsEl.style.scrollbarWidth = "none";              // Firefox
    resultsEl.style.msOverflowStyle = "none";             // IE/Edge
    // Chrome/Safari scrollbar hide
    const styleTag = document.createElement("style");
    styleTag.textContent = `#neSearchResults::-webkit-scrollbar{display:none}`;
    document.head.appendChild(styleTag);
  }
  initResultsStyles();

  function pinResultsToInput() {
    if (!resultsEl || !input) return;
    const rect = input.getBoundingClientRect();
    const gap = 8;
    resultsEl.style.left  = rect.left + "px";
    resultsEl.style.top   = rect.bottom + gap + "px";
    resultsEl.style.width = rect.width + "px";
  }
  function showResults() {
    if (!resultsEl) return;
    pinResultsToInput();
    resultsEl.style.display = "block";
    window.addEventListener("resize", pinResultsToInput);
    document.addEventListener("scroll", pinResultsToInput, true); // capture
  }
  function hideResults() {
    if (!resultsEl) return;
    resultsEl.style.display = "none";
    window.removeEventListener("resize", pinResultsToInput);
    document.removeEventListener("scroll", pinResultsToInput, true);
  }

  // Wrap open/close to also show/hide overlay
  const _openSearch = openSearch;
  const _closeSearch = closeSearch;
  openSearch = function () { _openSearch && _openSearch(); showResults(); };
  closeSearch = function () { _closeSearch && _closeSearch(); hideResults(); };

  /* ===== Render results (inline styling + hover grey) ===== */
  function renderResults(items) {
    currentResults = items;
    currentIndex = -1;
    if (!resultsEl) return;

    resultsEl.innerHTML = "";

    if (!items.length) { hideResults(); return; }

    showResults();

    items.forEach((it, i) => {
      const a = document.createElement("a");
      a.href = it.href;
      a.className = "list-group-item d-flex justify-content-between align-items-start";
      a.setAttribute("role", "option");
      a.setAttribute("data-index", String(i));

      // inline cosmetics (JS only)
      a.style.border = "0";
      a.style.borderBottom = "1px solid rgba(0,0,0,.06)";
      a.style.padding = "10px 14px";
      a.style.textDecoration = "none";
      a.style.color = "#000";
      a.style.transition = "background 0.2s ease";
      a.style.cursor = "pointer";

      // Hover background grey
      a.addEventListener("mouseenter", () => { a.style.background = "#c5bfbfff"; });
      a.addEventListener("mouseleave", () => {
        // keep keyboard highlight if this item is active
        const idx = Number(a.getAttribute("data-index"));
        a.style.background = (idx === currentIndex) ? "rgba(0,0,0,.06)" : "";
      });

      // hide .html filenames on right
      const shortPath = shortHref(it.href);
      const rightText = shortPath.endsWith(".html") ? "" : escapeHtml(shortPath);

      a.innerHTML = `
        <div class="me-2">
          <div class="fw-semibold">${escapeHtml(it.title)}</div>
          ${it.group ? `<small class="text-muted">${escapeHtml(it.group)}</small>` : ""}
        </div>
        ${rightText ? `<span class="small text-muted">${rightText}</span>` : ""}
      `;
      resultsEl.appendChild(a);
    });

    const last = resultsEl.lastElementChild;
    if (last) last.style.borderBottom = "0";
  }

  function clearResults() {
    currentResults = [];
    currentIndex = -1;
    if (resultsEl) resultsEl.innerHTML = "";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[c]));
  }
  function shortHref(href) {
    try { return href.replace(location.origin, "").replace(/[?#].*$/, ""); }
    catch { return href; }
  }

  /* ===== Input events ===== */
  input?.addEventListener("input", () => {
    clearTimeout(searchTimer); // don't autoclose while typing
    const q = input.value.trim();
    if (!q) { clearResults(); hideResults(); return; }
    const hits = searchIndex(q);
    renderResults(hits);
    pinResultsToInput();
  });

  // Keyboard nav on input
  input?.addEventListener("keydown", (e) => {
    if (!currentResults.length) {
      if (e.key === "Enter") { e.preventDefault(); performFullSearch(input.value.trim()); }
      return;
    }
    const items = resultsEl.querySelectorAll(".list-group-item");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      updateActive(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateActive(items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentIndex >= 0) {
        const a = items[currentIndex];
        if (a) window.location.href = a.href;
      } else {
        performFullSearch(input.value.trim());
      }
    } else if (e.key === "Escape") {
      closeSearch();
    }
  });

  function updateActive(items) {
    items.forEach((el, i) => {
      const isActive = i === currentIndex;
      el.classList.toggle("active", isActive);
      el.style.background = isActive ? "rgba(0,0,0,.06)" : "";
    });
    // keep the highlighted item in view
    if (currentIndex >= 0 && items[currentIndex]) {
      const el = items[currentIndex];
      const parent = resultsEl;
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;
      const viewTop = parent.scrollTop;
      const viewBottom = viewTop + parent.clientHeight;
      if (elTop < viewTop) parent.scrollTop = elTop;
      else if (elBottom > viewBottom) parent.scrollTop = elBottom - parent.clientHeight;
    }
  }

  // Click on a suggestion
  resultsEl?.addEventListener("click", () => { closeSearch(); });

  // Close on Escape (global)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && box?.classList.contains("open")) closeSearch();
  });

  /* ===== Full search fallback ===== */
  function performFullSearch(query) {
    if (!query) return;
    if (LOCAL_SEARCH_PAGE) {
      const url = `${LOCAL_SEARCH_PAGE}?q=${encodeURIComponent(query)}`;
      window.location.href = url;
    } else {
      const host = window.location.hostname || "neweraengineers.com";
      const url = `https://www.google.com/search?q=site:${host}+${encodeURIComponent(query)}`;
      window.location.href = url;
    }
  }
});

