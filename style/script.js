// === Side menu toggle ===
const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.getElementById("side-menu");
if (menuToggle) {
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    sideMenu.classList.toggle("active");
  });
}
document.addEventListener("click", (e) => {
  if (sideMenu && sideMenu.classList.contains("active")) {
    if (!sideMenu.contains(e.target) && e.target !== menuToggle) {
      sideMenu.classList.remove("active");
    }
  }
});

// === Kukátko efekt ===
const kukatkoSections = document.querySelectorAll(".kukatko-section");
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const viewportH = window.innerHeight;
  kukatkoSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const layer = section.querySelector(".layer-bottom");
    if (!layer) return;
    const sectionTop = rect.top + scrollY;
    const sectionH = rect.height;
    const sectionW = rect.width;
    const radius = Math.min(sectionW, sectionH) * 0.45;
    const buffer = viewportH * 0.3;
    const startY = sectionTop - viewportH + buffer;
    const endY = sectionTop + sectionH - buffer;
    if (scrollY >= startY && scrollY <= endY) {
      const p = (scrollY - startY) / (endY - startY);
      if (p < 0.1) layer.style.clipPath = "circle(0 at 50% 50%)";
      else if (p < 0.15) {
        const r = ((p - 0.1) / 0.05) * radius;
        layer.style.clipPath = `circle(${r}px at 50% 50%)`;
      } else if (p < 0.9) {
        layer.style.clipPath = `circle(${radius}px at 50% 50%)`;
      } else {
        const r = ((1 - p) / 0.1) * radius;
        layer.style.clipPath = `circle(${r}px at 50% 50%)`;
      }
    } else {
      layer.style.clipPath = "circle(0 at 50% 50%)";
    }
  });
});

// === Lightbox obrázky ===
const galleryImgs = document.querySelectorAll(".galerie-grid img");
const lbGallery = document.getElementById("lightbox-gallery");
const lbImg = document.getElementById("lightbox-img");
const lbGalleryClose = lbGallery.querySelector(".close");
const lbGalleryPrev = lbGallery.querySelector(".prev");
const lbGalleryNext = lbGallery.querySelector(".next");
let galleryIndex = 0;

function openGallery(i) {
  galleryIndex = i;
  lbImg.src = galleryImgs[i].src;
  lbGallery.style.display = "flex";
}
function closeGallery() {
  lbGallery.style.display = "none";
}

galleryImgs.forEach((img, i) => {
  img.addEventListener("click", () => openGallery(i));
});
lbGalleryClose.addEventListener("click", closeGallery);
lbGalleryPrev.addEventListener("click", () => {
  galleryIndex = (galleryIndex - 1 + galleryImgs.length) % galleryImgs.length;
  lbImg.src = galleryImgs[galleryIndex].src;
});
lbGalleryNext.addEventListener("click", () => {
  galleryIndex = (galleryIndex + 1) % galleryImgs.length;
  lbImg.src = galleryImgs[galleryIndex].src;
});
lbGallery.addEventListener("click", (e) => {
  if (e.target === lbGallery) closeGallery();
});

// === Lightbox texty ===
const lbText = document.getElementById("lightbox-text");
const textSlides = lbText.querySelectorAll(".text-slide");
const lbTextClose = lbText.querySelector(".close");
const lbTextPrev = lbText.querySelector(".prev");
const lbTextNext = lbText.querySelector(".next");
let textIndex = 0;

function showTextSlide(i) {
  textSlides.forEach((s, idx) =>
    s.classList.toggle("active", idx === i)
  );
}
function openTextLightbox(i) {
  textIndex = i;
  lbText.style.display = "flex";
  showTextSlide(i);
  lbText.scrollTop = 0; // otevře vždy od začátku
  sideMenu.classList.remove("active"); // zavře side menu
}
function closeTextLightbox() {
  lbText.style.display = "none";
}

lbTextClose.addEventListener("click", closeTextLightbox);
lbTextPrev.addEventListener("click", () => {
  textIndex = (textIndex - 1 + textSlides.length) % textSlides.length;
  showTextSlide(textIndex);
  lbText.scrollTop = 0;
});
lbTextNext.addEventListener("click", () => {
  textIndex = (textIndex + 1) % textSlides.length;
  showTextSlide(textIndex);
  lbText.scrollTop = 0;
});
lbText.addEventListener("click", (e) => {
  if (e.target === lbText) closeTextLightbox();
});

// Napojení side menu odkazů
document.querySelectorAll("#side-menu a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const idx = parseInt(link.dataset.textIndex, 10);
    openTextLightbox(idx);
  });
});

// === Kliknutí na email v text-lightboxu => přejde na kontaktní formulář ===
const gotoContact = document.getElementById("goto-contact");
if (gotoContact) {
  gotoContact.addEventListener("click", (e) => {
    e.preventDefault();
    closeTextLightbox();
    const form = document.getElementById("message");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      form.focus();
    }
  });
}

// === Klávesové ovládání popupů ===
document.addEventListener("keydown", (e) => {
  // Galerie obrázků
  if (lbGallery.style.display === "flex") {
    if (e.key === "ArrowLeft") {
      lbGalleryPrev.click();
    } else if (e.key === "ArrowRight") {
      lbGalleryNext.click();
    } else if (e.key === "Escape") {
      closeGallery();
    }
  }

  // Galerie textů
  if (lbText.style.display === "flex") {
    if (e.key === "ArrowLeft") {
      lbTextPrev.click();
    } else if (e.key === "ArrowRight") {
      lbTextNext.click();
    } else if (e.key === "Escape") {
      closeTextLightbox();
    }
  }
});

// === Swipe ovládání (mobil) ===
function addSwipeSupport(container, onSwipeLeft, onSwipeRight) {
  let startX = 0;
  let endX = 0;

  container.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].screenX;
  });

  container.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].screenX;
    let diff = endX - startX;
    if (Math.abs(diff) > 50) { // prahová hodnota
      if (diff < 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }
  });
}

// Swipe pro obrázkovou galerii
addSwipeSupport(lbGallery, 
  () => lbGalleryNext.click(), 
  () => lbGalleryPrev.click()
);

// Swipe pro textovou galerii
addSwipeSupport(lbText, 
  () => lbTextNext.click(), 
  () => lbTextPrev.click()
);
