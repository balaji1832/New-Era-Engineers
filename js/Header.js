document.addEventListener("DOMContentLoaded", function () {
  /* Hover mega menu with 2s delayed close (desktop only) */
  if (window.innerWidth > 992) {
    document.querySelectorAll(".navbar .nav-item.dropdown").forEach(function (dropdown) {
      let timer;
      const toggle = dropdown.querySelector('[data-bs-toggle="dropdown"]');
      const instance = bootstrap.Dropdown.getOrCreateInstance(toggle);

      dropdown.addEventListener("mouseenter", function () {
        clearTimeout(timer);
        instance.show();
      });
      dropdown.addEventListener("mouseleave", function () {
        timer = setTimeout(() => instance.hide(), 2000);
      });
    });
  }

  /* Search toggle (mobile + desktop share same box) */
  const box = document.getElementById("neSearchBox");
  const input = document.getElementById("neSearchInput");
  const btnMobile = document.getElementById("neSearchToggleMobile");
  const btnDesktop = document.getElementById("neSearchToggle");

  let searchTimer;

  function toggleSearch() {
    const isOpen = box.classList.contains("open");

    if (isOpen) {
      box.classList.remove("open");
      clearTimeout(searchTimer);
    } else {
      box.classList.add("open");
      setTimeout(() => input && input.focus(), 200);

      // auto close after 2 seconds if no click inside
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        if (!box.matches(":hover") && !document.activeElement.closest("#neSearchBox")) {
          box.classList.remove("open");
        }
      }, 2000);
    }
  }

  btnMobile?.addEventListener("click", toggleSearch);
  btnDesktop?.addEventListener("click", toggleSearch);

  // Reset auto-close if user clicks or types inside
  box?.addEventListener("mouseenter", () => clearTimeout(searchTimer));
  box?.addEventListener("mouseleave", () => {
    searchTimer = setTimeout(() => box.classList.remove("open"), 2000);
  });
  input?.addEventListener("input", () => clearTimeout(searchTimer));

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && box.classList.contains("open")) {
      box.classList.remove("open");
      clearTimeout(searchTimer);
    }
  });
});
