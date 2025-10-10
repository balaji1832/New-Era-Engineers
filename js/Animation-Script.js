
const items = document.querySelectorAll('.animate-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible'); // add animation class
    } else {
      entry.target.classList.remove('visible'); // remove class when out of view
    }
  });
}, { threshold: 0.35 });

items.forEach(item => {
  observer.observe(item);
});
