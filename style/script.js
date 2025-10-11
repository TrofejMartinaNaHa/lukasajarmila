// === Toggle side menu ===
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // nezavře se okamžitě klikem na hamburger
  sideMenu.classList.toggle('active');
});

// Kliknutí mimo menu zavře side menu
document.addEventListener('click', (e) => {
  if (sideMenu.classList.contains('active')) {
    if (!sideMenu.contains(e.target) && e.target !== menuToggle) {
      sideMenu.classList.remove('active');
    }
  }
});

// === Kukátkový efekt ===
const kukatkoSections = document.querySelectorAll('.kukatko-section');
let activeSection = null;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  let previousSectionBottom = 0;

  kukatkoSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const layer = section.querySelector('.layer-bottom');
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
        if (activeSection) {
          const prevLayer = activeSection.querySelector('.layer-bottom');
          prevLayer.style.clipPath = "circle(0 at 50% 50%)";
        }
        activeSection = section;
      }

      const linearProgress = (scrollY - startY) / (endY - startY);

      if (linearProgress < 0.1) {
        layer.style.clipPath = "circle(0 at 50% 50%)"; // čistý TOP
      } else if (linearProgress < 0.15) {
        const progress = (linearProgress - 0.1) / 0.05;
        const r = progress * radius;
        layer.style.clipPath = `circle(${r}px at 50% ${sectionHeight/2}px)`;
      } else if (linearProgress < 0.9) {
        layer.style.clipPath = `circle(${radius}px at 50% ${sectionHeight/2}px)`;
      } else {
        const progress = (1 - linearProgress) / 0.1;
        const r = progress * radius;
        layer.style.clipPath = `circle(${r}px at 50% ${sectionHeight/2}px)`;
      }

      previousSectionBottom = endY;
    } else if (activeSection === section && scrollY > endY) {
      layer.style.clipPath = "circle(0 at 50% 50%)";
      activeSection = null;
    }
  });
});

// === Lightbox galerie ===
const galleryImages = document.querySelectorAll('.galerie-grid img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox .close');
const prevBtn = document.querySelector('.lightbox .prev');
const nextBtn = document.querySelector('.lightbox .next');

let currentIndex = 0;

function showLightbox(index) {
  currentIndex = index;
  lightbox.style.display = "block";
  lightboxImg.src = galleryImages[index].src;
}

galleryImages.forEach((img, index) => {
  img.addEventListener('click', (e) => {
    e.stopPropagation(); // nezavře side-menu při kliknutí na galerii
    showLightbox(index);
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = "none";
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
});

// Zavření klikem mimo obrázek
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }
});

// === Ovládání klávesnicí ===
document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === "block") {
    if (e.key === "Escape") {
      lightbox.style.display = "none";
    } else if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[currentIndex].src;
    } else if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      lightboxImg.src = galleryImages[currentIndex].src;
    }
  }
});
