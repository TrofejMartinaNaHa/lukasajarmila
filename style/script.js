const kukatkoSections = document.querySelectorAll('.kukatko-section');
let activeSection = null;
let hasScrolled = false;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  let previousSectionBottom = 0;

  // Před prvním pohybem -> čistý TOP obrázek
  if (!hasScrolled) {
    if (scrollY > 0) {
      hasScrolled = true;
    } else {
      kukatkoSections.forEach((section) => {
        const bottomLayer = section.querySelector('.layer-bottom');
        bottomLayer.style.clipPath = 'circle(0 at 50% 50%)'; // schovat
      });
      return;
    }
  }

  kukatkoSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const bottomLayer = section.querySelector('.layer-bottom'); // BOTTOM = clipujeme

    const sectionTop = rect.top + scrollY;
    const sectionHeight = rect.height;
    const sectionWidth = rect.width;

    const diameter = Math.min(sectionWidth * 0.9, sectionHeight * 0.9);
    const radius = diameter / 2;

    const buffer = viewportHeight * 0.3;
    const startY = sectionTop - viewportHeight + buffer;
    const endY = sectionTop + sectionHeight - buffer;

    if (scrollY >= startY && scrollY <= endY && scrollY > previousSectionBottom) {
      if (activeSection !== section) {
        activeSection = section;
      }

      const linearProgress = (scrollY - startY) / (endY - startY);
      let progress = Math.min(Math.max(linearProgress, 0), 1);

      // zóny pro fade
      const fadeStart = 0.10;
      const fadeEnd   = 0.15;
      const fadeOut   = 0.90;

      let fadeIn;
      if (progress < fadeStart) {
        fadeIn = 0;
      } else if (progress >= fadeStart && progress < fadeEnd) {
        fadeIn = (progress - fadeStart) / (fadeEnd - fadeStart);
      } else if (progress >= fadeEnd && progress < fadeOut) {
        fadeIn = 1;
      } else if (progress >= fadeOut && progress <= 1) {
        fadeIn = 1 - (progress - fadeOut) / (1 - fadeOut);
      }

      const cy = progress * (sectionHeight - radius * 2) + radius;
      const cx = sectionWidth / 2;

      if (fadeIn > 0) {
        const visibleRadius = radius * fadeIn;
        // BOTTOM nahoře, ořezaný kruhem → v kruhu vidíme BOTTOM, kolem TOP
        bottomLayer.style.clipPath = `circle(${visibleRadius}px at ${cx}px ${cy}px)`;
      } else {
        bottomLayer.style.clipPath = 'circle(0 at 50% 50%)';
      }

      previousSectionBottom = endY;
    } else if (activeSection === section && scrollY > endY) {
      activeSection = null;
      setTimeout(() => {
        bottomLayer.style.clipPath = 'circle(0 at 50% 50%)';
      }, 300);
    }
  });
});
