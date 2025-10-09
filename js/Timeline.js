  const indicator = document.querySelector('.timeline-indicator');
    const container = document.querySelector('.timeline-container');
    const timeline = document.querySelector('.timeline');

    container.addEventListener('scroll', () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const timelineHeight = timeline.scrollHeight;

      // Progress relative to container scroll
      let progress = scrollTop / (timelineHeight - containerHeight);
      progress = Math.max(0, Math.min(1, progress));

      indicator.style.height = `${progress * 100}%`;
    });
