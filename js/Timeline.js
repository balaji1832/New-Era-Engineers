// <!-- Our Installation Success Stories--Timeline Script -->

// Scroll indicator logic (desktop only)
const indicator = document.querySelector('.timeline-indicator');
const timeline = document.querySelector('.timeline');

window.addEventListener('scroll', () => {
  if(window.innerWidth > 992){ // Only for desktop
    const timelineTop = timeline.offsetTop;
    const timelineHeight = timeline.scrollHeight;
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;

    let progress = ((scrollTop + windowHeight/2) - timelineTop) / timelineHeight;
    progress = Math.max(0, Math.min(1, progress));
    indicator.style.height = `${progress * 100}%`;
  }
});
