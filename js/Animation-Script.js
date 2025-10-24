// Top-edge trigger: reveal when element's top hits 75% of viewport height
const items = Array.from(document.querySelectorAll('.animate-item'));
const EXIT_DEBOUNCE_MS = 120;
const exitTimers = new WeakMap();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const el = entry.target;

    if (entry.isIntersecting) {
      // entering our shrunken root => show
      const pending = exitTimers.get(el);
      if (pending) { clearTimeout(pending); exitTimers.delete(el); }
      el.classList.add('visible');
    } else {
      // leaving => hide (debounced to avoid jitter at boundary)
      const id = setTimeout(() => {
        el.classList.remove('visible');
        exitTimers.delete(el);
      }, EXIT_DEBOUNCE_MS);
      exitTimers.set(el, id);
    }
  });
}, {
  threshold: 0,                 // fire when any pixel intersects
  root: null,                   // viewport (change if using a scroll container)
  rootMargin: '0px 0px -25% 0px'// shrink bottom by 25% => trigger when top reaches 75% viewport
});

items.forEach((el) => observer.observe(el));
