    document.addEventListener("DOMContentLoaded", function () {
      /* Hover mega menu with 3s delayed close (desktop only) */
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
          dropdown.addEventListener("mouseenter", function () { clearTimeout(timer); });
        });
      }

      /* Search toggle (mobile + desktop share same box) */
      const box   = document.getElementById("neSearchBox");
      const input = document.getElementById("neSearchInput");
      const btnMobile  = document.getElementById("neSearchToggleMobile");
      const btnDesktop = document.getElementById("neSearchToggle");

      function toggleSearch() {
        const open = box.classList.contains("open");
        box.classList.toggle("open");
        if (!open) setTimeout(() => input && input.focus(), 200);
      }
      btnMobile?.addEventListener("click", toggleSearch);
      btnDesktop?.addEventListener("click", toggleSearch);

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && box.classList.contains("open")) box.classList.remove("open");
      });
    });
  