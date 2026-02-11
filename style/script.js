document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     SIDE MENU TOGGLE
     ========================================================= */
  const menuToggle = document.getElementById("menu-toggle");
  const sideMenu = document.getElementById("side-menu");

  if (menuToggle && sideMenu) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      sideMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (
        sideMenu.classList.contains("active") &&
        !sideMenu.contains(e.target) &&
        e.target !== menuToggle
      ) {
        sideMenu.classList.remove("active");
      }
    });
  }

 /* =========================================================
   TOP NAV – hide on scroll (na všech šířkách)
   ========================================================= */
const topNav = document.querySelector(".top-nav");
let lastScrollY = window.scrollY;
let ticking = false;

function updateTopNav() {
  if (!topNav) return;

  const currentY = window.scrollY;
  const diff = currentY - lastScrollY;

  // Když je otevřené side-menu, necháme top-nav viditelné
  const sideMenuOpen = sideMenu?.classList.contains("active");
  if (sideMenuOpen) {
    topNav.classList.remove("nav-hidden");
    lastScrollY = currentY;
    ticking = false;
    return;
  }

  if (currentY <= 10) {
    topNav.classList.remove("nav-hidden");
  } else if (Math.abs(diff) > 6) {
    if (diff > 0) topNav.classList.add("nav-hidden"); // scroll dolů
    else topNav.classList.remove("nav-hidden");       // scroll nahoru
  }

  lastScrollY = currentY;
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(updateTopNav);
      ticking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  lastScrollY = window.scrollY;
  updateTopNav();
});

// inicializace
updateTopNav();


  /* =========================================================
     BANNER SLIDESHOW (3 fotky + doty) – bez úprav HTML
     ========================================================= */
  const banner = document.querySelector(".banner");
  const bannerImg = banner?.querySelector("img.banner-img");

  if (banner && bannerImg) {
    // zdroje banneru (1. je ten aktuální z HTML)
    const slides = [
      bannerImg.getAttribute("src"),
      "style/gallery1.jpg",
      "style/gallery5.jpg",
    ].filter(Boolean);

    let current = 0;
    let timer = null;
    const intervalMs = 4500;

    // vytvoření dotů
    const dotsWrap = document.createElement("div");
    dotsWrap.className = "banner-dots";

    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "banner-dot" + (i === 0 ? " is-active" : "");
      b.setAttribute("aria-label", `Banner slide ${i + 1}`);
      b.addEventListener("click", () => {
        goTo(i, true);
      });
      dotsWrap.appendChild(b);
      return b;
    });

    banner.appendChild(dotsWrap);

    function render() {
      bannerImg.src = slides[current];
      dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
    }

    function goTo(i, restartTimer = false) {
      current = (i + slides.length) % slides.length;
      render();
      if (restartTimer) startAuto();
    }

    function next() {
      goTo(current + 1, false);
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(next, intervalMs);
    }

    function stopAuto() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    // preload (rychlejší přepínání)
    slides.forEach((src) => {
      const im = new Image();
      im.src = src;
    });

    render();
    startAuto();

    // volitelně: pauza při hoveru (desktop)
    banner.addEventListener("mouseenter", stopAuto);
    banner.addEventListener("mouseleave", startAuto);
  }

  /* =========================================================
     KUKÁTKO – scroll reveal efekt
     ========================================================= */
  const kukatkoSections = document.querySelectorAll(".kukatko-section");

  window.addEventListener(
    "scroll",
    () => {
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
    },
    { passive: true }
  );

  /* =========================================================
     LIGHTBOX – GALERIE
     ========================================================= */
  const galleryImgs = document.querySelectorAll(".galerie-grid img");
  const lbGallery = document.getElementById("lightbox-gallery");
  const lbImg = document.getElementById("lightbox-img");

  let galleryIndex = 0;

  function openGallery(i) {
    if (!lbGallery || !lbImg || !galleryImgs.length) return;
    galleryIndex = i;
    lbImg.src = galleryImgs[i].src;
    lbGallery.style.display = "flex";
  }

  function closeGallery() {
    if (!lbGallery) return;
    lbGallery.style.display = "none";
  }

  if (lbGallery && lbImg && galleryImgs.length) {
    const lbGalleryClose = lbGallery.querySelector(".close");
    const lbGalleryPrev = lbGallery.querySelector(".prev");
    const lbGalleryNext = lbGallery.querySelector(".next");

    galleryImgs.forEach((img, i) => img.addEventListener("click", () => openGallery(i)));

    lbGalleryClose?.addEventListener("click", closeGallery);

    lbGalleryPrev?.addEventListener("click", () => {
      galleryIndex = (galleryIndex - 1 + galleryImgs.length) % galleryImgs.length;
      lbImg.src = galleryImgs[galleryIndex].src;
    });

    lbGalleryNext?.addEventListener("click", () => {
      galleryIndex = (galleryIndex + 1) % galleryImgs.length;
      lbImg.src = galleryImgs[galleryIndex].src;
    });

    lbGallery.addEventListener("click", (e) => {
      if (e.target === lbGallery) closeGallery();
    });
  }

  /* =========================================================
     LIGHTBOX – TEXTY
     ========================================================= */
  const lbText = document.getElementById("lightbox-text");
  const textSlides = lbText?.querySelectorAll(".text-slide") || [];
  const lbTextClose = lbText?.querySelector(".close");
  const lbTextPrev = lbText?.querySelector(".prev");
  const lbTextNext = lbText?.querySelector(".next");

  let textIndex = 0;

  function showTextSlide(i) {
    textSlides.forEach((s, idx) => s.classList.toggle("active", idx === i));
  }

  function openTextLightbox(i) {
    if (!lbText || !textSlides.length) return;
    textIndex = i;
    lbText.style.display = "flex";
    showTextSlide(i);
    lbText.scrollTop = 0;
    sideMenu?.classList.remove("active");
  }

  function closeTextLightbox() {
    if (!lbText) return;
    lbText.style.display = "none";
  }

  lbTextClose?.addEventListener("click", closeTextLightbox);

  lbTextPrev?.addEventListener("click", () => {
    textIndex = (textIndex - 1 + textSlides.length) % textSlides.length;
    showTextSlide(textIndex);
    lbText.scrollTop = 0;
  });

  lbTextNext?.addEventListener("click", () => {
    textIndex = (textIndex + 1) % textSlides.length;
    showTextSlide(textIndex);
    lbText.scrollTop = 0;
  });

  lbText?.addEventListener("click", (e) => {
    if (e.target === lbText) closeTextLightbox();
  });

  document.querySelectorAll("#side-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = parseInt(link.dataset.textIndex, 10);
      openTextLightbox(idx);
    });
  });

  /* =========================================================
     Klávesy (Lightbox)
     ========================================================= */
  document.addEventListener("keydown", (e) => {
    if (lbText?.style.display === "flex") {
      if (e.key === "ArrowLeft") lbTextPrev?.click();
      if (e.key === "ArrowRight") lbTextNext?.click();
      if (e.key === "Escape") closeTextLightbox();
    }
    if (lbGallery?.style.display === "flex") {
      if (e.key === "ArrowLeft") lbGallery.querySelector(".prev")?.click();
      if (e.key === "ArrowRight") lbGallery.querySelector(".next")?.click();
      if (e.key === "Escape") closeGallery();
    }
  });

  /* =========================================================
   Swipe (mobile) – galerie + texty (vylepšené proti scrollu)
   ========================================================= */
function addSwipe(el, onLeft, onRight) {
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let isTracking = false;

  // citlivost
  const MIN_X = 70;        // minimální horizontální posun v px
  const RATIO = 1.8;       // X musí být aspoň 1.8× větší než Y

  el.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return; // jen 1 prst
      isTracking = true;
      startX = lastX = e.touches[0].clientX;
      startY = lastY = e.touches[0].clientY;
    },
    { passive: true }
  );

  el.addEventListener(
    "touchmove",
    (e) => {
      if (!isTracking || e.touches.length !== 1) return;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    },
    { passive: true }
  );

  el.addEventListener(
    "touchend",
    () => {
      if (!isTracking) return;
      isTracking = false;

      const dx = lastX - startX;
      const dy = lastY - startY;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // pokud je to spíš scroll (vertikální), nic nedělej
      if (absX < MIN_X) return;
      if (absX < absY * RATIO) return;

      // swipe doprava = předchozí, doleva = další
      if (dx > 0) onRight();
      else onLeft();
    },
    { passive: true }
  );
}

if (lbGallery) {
  addSwipe(
    lbGallery,
    () => lbGallery.querySelector(".next")?.click(),
    () => lbGallery.querySelector(".prev")?.click()
  );
}

if (lbText) {
  addSwipe(
    lbText,
    () => lbTextNext?.click(),
    () => lbTextPrev?.click()
  );
}

  /* =========================================================
     Kalkulačka v ceníku (calc-btn + #calc-output)
     ========================================================= */
  const calcButtons = document.querySelectorAll(".calc-btn");
  const calcOutput = document.getElementById("calc-output");

  if (calcButtons.length && calcOutput) {
    const selections = { size: null, weight: null };

    calcButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const group = btn.parentElement.dataset.group;
        const value = btn.dataset.value;

        // reset aktivního tlačítka ve skupině
        btn.parentElement.querySelectorAll(".calc-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        selections[group] = value;
        updateCalc();
      });
    });

    function updateCalc() {
      const { size, weight } = selections;
      let price = "–";

      if (size || weight) {
        if (weight === "light") price = "od 250 Kč";
        if (weight === "heavy") price = "od 500 Kč";

        if (size === "large" && weight === "light") price = "od 500 Kč";
        if (size === "large" && weight === "heavy") price = "od 500 Kč";
      }

      calcOutput.textContent = price;
    }
  }
});
