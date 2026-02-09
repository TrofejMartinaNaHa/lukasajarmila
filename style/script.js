document.addEventListener("DOMContentLoaded", () => {
  // === SIDE MENU TOGGLE ===
  const menuToggle = document.getElementById("menu-toggle");
  const sideMenu = document.getElementById("side-menu");
  if (menuToggle) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      sideMenu.classList.toggle("active");
    })
    
      // === BANNER SLIDER (3 obrázky + tečky) ===
  const banner = document.getElementById("banner-slider");
  if (banner) {
    const slides = banner.querySelectorAll(".banner-slide");
    const dots = banner.querySelectorAll(".banner-dot");
    let current = 0;
    let timer = null;
    const intervalMs = 4500;

    function showSlide(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle("is-active", idx === current));
      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === current));
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    function start() {
      stop();
      timer = setInterval(nextSlide, intervalMs);
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = parseInt(dot.dataset.slide, 10);
        showSlide(i);
        start(); // po kliknutí znovu nastartuje auto-rotaci
      });
    });

    // pauza při hoveru (desktop)
    banner.addEventListener("mouseenter", stop);
    banner.addEventListener("mouseleave", start);

    // na touch: první dotyk jen "probudí" a zruší interval, po uvolnění zase jede
    banner.addEventListener("touchstart", stop, { passive: true });
    banner.addEventListener("touchend", start, { passive: true });

    // init
    showSlide(0);
    start();
  };
  }
  document.addEventListener("click", (e) => {
    if (sideMenu && sideMenu.classList.contains("active")) {
      if (!sideMenu.contains(e.target) && e.target !== menuToggle) {
        sideMenu.classList.remove("active");
      }
    }
  });

  // === KUKÁTKO EFEKT – scroll-based ===
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

  // === LIGHTBOX OBRÁZKY ===
  // (jen z hlavní galerie v .foto-ukazka-vlozene)
  const galleryImgs = document.querySelectorAll(".foto-ukazka-vlozene .galerie-grid img");
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

  // === LIGHTBOX TEXTY ===
  const lbText = document.getElementById("lightbox-text");
  const textSlides = lbText.querySelectorAll(".text-slide");
  const lbTextClose = lbText.querySelector(".close");
  const lbTextPrev = lbText.querySelector(".prev");
  const lbTextNext = lbText.querySelector(".next");
  let textIndex = 0;

  function showTextSlide(i) {
    textSlides.forEach((s, idx) => s.classList.toggle("active", idx === i));
  }
  function openTextLightbox(i) {
    textIndex = i;
    lbText.style.display = "flex";
    showTextSlide(i);
    lbText.scrollTop = 0;
    sideMenu.classList.remove("active");
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

  // Napojení odkazů side-menu
  document.querySelectorAll("#side-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = parseInt(link.dataset.textIndex, 10);
      openTextLightbox(idx);
    });
  });

  // === Klávesové ovládání ===
  document.addEventListener("keydown", (e) => {
    if (lbText.style.display === "flex") {
      if (e.key === "ArrowLeft") lbTextPrev.click();
      if (e.key === "ArrowRight") lbTextNext.click();
      if (e.key === "Escape") closeTextLightbox();
    }
    if (lbGallery.style.display === "flex") {
      if (e.key === "ArrowLeft") lbGalleryPrev.click();
      if (e.key === "ArrowRight") lbGalleryNext.click();
      if (e.key === "Escape") closeGallery();
    }
  });

  // === Swipe na mobilech ===
  function addSwipe(el, onLeft, onRight) {
    let startX = 0;
    el.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    el.addEventListener("touchend", e => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 15) diff > 0 ? onRight() : onLeft();
    });
  }
  addSwipe(lbGallery, () => lbGalleryNext.click(), () => lbGalleryPrev.click());
  addSwipe(lbText, () => lbTextNext.click(), () => lbTextPrev.click());
});
