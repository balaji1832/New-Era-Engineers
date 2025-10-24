
document.addEventListener("DOMContentLoaded", function () {
  /* =========================
   * Hover mega menu (desktop)
   * Only one open at a time + 2s delayed close
   * ========================= */
  const DESKTOP_BP = 992;
  const CLOSE_DELAY = 2000;

  if (window.innerWidth > DESKTOP_BP) {
    const dropdowns = Array.from(document.querySelectorAll(".navbar .nav-item.dropdown"));
    const timers = new WeakMap(); // dropdown -> timeout id
    let currentOpen = null;

    function getInstance(dropdown) {
      const toggle = dropdown.querySelector('[data-bs-toggle="dropdown"]');
      return toggle ? bootstrap.Dropdown.getOrCreateInstance(toggle) : null;
    }

    function clearTimer(dropdown) {
      const t = timers.get(dropdown);
      if (t) {
        clearTimeout(t);
        timers.delete(dropdown);
      }
    }

    function forceClose(dropdown) {
      const inst = getInstance(dropdown);
      if (inst) inst.hide();
      clearTimer(dropdown);
      if (currentOpen === dropdown) currentOpen = null;
    }

    function openDropdown(dropdown) {
      // Close any other open dropdown immediately
      if (currentOpen && currentOpen !== dropdown) {
        forceClose(currentOpen);
      }
      clearTimer(dropdown);
      const inst = getInstance(dropdown);
      if (inst) inst.show();
      currentOpen = dropdown;
    }

    function scheduleClose(dropdown) {
      clearTimer(dropdown);
      const id = setTimeout(() => {
        // Only close if it's still the tracked open one or not hovered anymore
        const stillHovered = dropdown.matches(":hover");
        if (!stillHovered || currentOpen === dropdown) {
          forceClose(dropdown);
        }
      }, CLOSE_DELAY);
      timers.set(dropdown, id);
    }

    dropdowns.forEach((dropdown) => {
      // Keep open while hovering anywhere inside the dropdown (including its menu)
      dropdown.addEventListener("mouseenter", () => openDropdown(dropdown));
      dropdown.addEventListener("mouseleave", () => scheduleClose(dropdown));
    });

    // If a dropdown opens via keyboard/click, still enforce single-open rule
    document.addEventListener("show.bs.dropdown", (e) => {
      const dd = e.target.closest(".nav-item.dropdown");
      if (!dd) return;
      if (currentOpen && currentOpen !== dd) {
        forceClose(currentOpen);
      }
      currentOpen = dd;
    });

    // Cleanup when bootstrap hides it for any reason
    document.addEventListener("hide.bs.dropdown", (e) => {
      const dd = e.target.closest(".nav-item.dropdown");
      clearTimer(dd);
      if (currentOpen === dd) currentOpen = null;
    });

    // Optional: if resized into mobile breakpoint, close any open menu
    window.addEventListener("resize", () => {
      if (window.innerWidth <= DESKTOP_BP && currentOpen) {
        forceClose(currentOpen);
      }
    });
  }

  /* =========================
   * Search toggle 
   * ========================= */
  const box = document.getElementById("neSearchBox");
  const input = document.getElementById("neSearchInput");
  const btnMobile = document.getElementById("neSearchToggleMobile");
  const btnDesktop = document.getElementById("neSearchToggle");

  let searchTimer;

  function toggleSearch() {
    const isOpen = box?.classList.contains("open");

    if (isOpen) {
      box.classList.remove("open");
      clearTimeout(searchTimer);
    } else {
      box?.classList.add("open");
      setTimeout(() => input && input.focus(), 200);

      // auto close after 2 seconds if no interaction inside
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        if (!box?.matches(":hover") && !(document.activeElement && document.activeElement.closest && document.activeElement.closest("#neSearchBox"))) {
          box?.classList.remove("open");
        }
      }, 2000);
    }
  }

  btnMobile?.addEventListener("click", toggleSearch);
  btnDesktop?.addEventListener("click", toggleSearch);

  // Reset auto-close if user interacts inside
  box?.addEventListener("mouseenter", () => clearTimeout(searchTimer));
  box?.addEventListener("mouseleave", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => box?.classList.remove("open"), 2000);
  });
  input?.addEventListener("input", () => clearTimeout(searchTimer));

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && box?.classList.contains("open")) {
      box.classList.remove("open");
      clearTimeout(searchTimer);
    }
  });
});

