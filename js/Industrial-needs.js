// <!-- Serving Diverse Industrial Needs -->

const track = document.querySelector('.carousel-track');
const nextBtn = document.querySelector('.carousel-next-btn');
const prevBtn = document.querySelector('.carousel-prev-btn');

let scrollAmount = 0;

// Include margin in card width
function updateCardWidth() {
  const card = track.querySelector('.card');
  const style = getComputedStyle(card);
  const marginRight = parseFloat(style.marginRight);
  return card.offsetWidth + marginRight;
}

nextBtn.addEventListener('click', () => {
  const maxScroll = track.scrollWidth - track.clientWidth;
  scrollAmount += updateCardWidth();
  if (scrollAmount > maxScroll) scrollAmount = maxScroll;
  track.style.transform = `translateX(-${scrollAmount}px)`;
});

prevBtn.addEventListener('click', () => {
  scrollAmount -= updateCardWidth();
  if (scrollAmount < 0) scrollAmount = 0;
  track.style.transform = `translateX(-${scrollAmount}px)`;
});
