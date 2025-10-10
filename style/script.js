const kukatkoSections = document.querySelectorAll('.kukatko-section');
let activeSection = null;
let hasScrolled = false; // kontrola, jestli už proběhl první scroll

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  let previousSectionBottom = 0;

  // RESET: když je uživatel úplně nahoře
  if (scrollY === 0) {
    hasScrolled = false;
    kukatkoSections.forEach((section) => {
      const layer = section.querySelector('.layer-top');
      layer.style.maskImage = 'none';
      layer.style.webkitMaskImage = 'none';
    });
    return; // ukončíme funkci → nahoře jen TOP obrázky
  }

  if (!hasScrolled && scrollY > 0) {
    hasScrolled = true;
  }

  kukatkoSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const layer = section.querySelector('.layer-top');

    const sectionTop = rect.top + scrollY;
    const sectionHeight = rect.height;
    const sectionWidth = rect.width;

    // kruh = 90 % kratší hrany
    const diameter = Math.min(sectionWidth * 0.9, sectionHeight * 0.9);
    const radius = diameter / 2;

    // buffer pro jemnější začátek/konec
    const buffer = viewportHeight * 0.3;
    const startY = sectionTop - viewportHeight + buffer;
    const endY   = sectionTop + sectionHeight - buffer;

    if (!hasScrolled) {
      // před prvním scrollováním: vždy čistý TOP
      layer.style.maskImage = 'none';
      layer.style.webkitMaskImage = 'none';
      return;
    }

    if (scrollY >= startY && scrollY <= endY && scrollY > previousSectionBottom) {
      if (activeSection !== section) {
        activeSection = section;
      }

      // průběh scrollu sekcí 0–1
      const linearProgress = (scrollY - startY) / (endY - startY);
      let progress = Math.min(Math.max(linearProgress, 0), 1);

      // hranice
      const fadeStart = 0.10; // 10 %
      const fadeEnd   = 0.15; // 15 %
      const fadeOut   = 0.90; // 90 %

      let fadeIn;
      if (progress < fadeStart) {
        fadeIn = 0; // čistý TOP
      } else if (progress >= fadeStart && progress < fadeEnd) {
        // rychlý fade-in (10–15 %)
        const localProgress = (progress - fadeStart) / (fadeEnd - fadeStart);
        fadeIn = Math.min(Math.max(localProgress, 0), 1);
      } else if (progress >= fadeEnd && progress < fadeOut) {
        fadeIn = 1; // stabilní kruh
      } else if (progress >= fadeOut && progress <= 1) {
        // rychlý fade-out (90–100 %)
        const localProgress = (progress - fadeOut) / (1 - fadeOut);
        fadeIn = 1 - Math.min(Math.max(localProgress, 0), 1);
      }

      // pozice středu kruhu (posouvá se dolů skrz sekci)
      const cy = progress * (sectionHeight - diameter / 2) + diameter / 2;
      const cx = sectionWidth / 2;

      // MASKA: mimo kruh zůstává TOP (bílé), kruh je černý → uvnitř vidíme BOTTOM
      const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='${sectionWidth}' height='${sectionHeight}'>
          <rect width='100%' height='100%' fill='white'/>
          <circle cx='${cx}' cy='${cy}' r='${radius}' fill='black' fill-opacity='${fadeIn}'/>
        </svg>`;

      const encoded = encodeURIComponent(svg.trim());
      const maskURL = `url("data:image/svg+xml,${encoded}")`;

      layer.style.maskImage = maskURL;
      layer.style.webkitMaskImage = maskURL;
      layer.style.maskMode = 'luminance';
      layer.style.maskRepeat = 'no-repeat';
      layer.style.maskSize = '100% 100%';

      previousSectionBottom = endY;

    } else if (activeSection === section && scrollY > endY) {
      activeSection = null;
      setTimeout(() => {
        layer.style.maskImage = 'none';
        layer.style.webkitMaskImage = 'none';
      }, 300);
    }
  });
});
