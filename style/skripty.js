// Dynamické zvětšování masky podle scrollu
const beforeLayer = document.querySelector('.layer--before');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = scrollTop / docHeight;

  // vertikální posun masky – sleduje scroll
  const maxMove = document.body.scrollHeight - window.innerHeight;
  const yOffset = scrollTop; // maska se pohybuje stejně jako scroll

  beforeLayer.style.webkitMaskPosition = `center ${yOffset}px`;
  beforeLayer.style.maskPosition = `center ${yOffset}px`;
});
