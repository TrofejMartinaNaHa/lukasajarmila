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
     TOP NAV – hide on scroll (jen pod 785 px)
     ========================================================= */
  const topNav = document.querySelector(".top-nav");
  let lastScrollY = window.scrollY;
  let ticking = false;
  const mobileMQ = window.matchMedia("(max-width: 784px)");

  function updateTopNav() {
    const currentY = window.scrollY;
    const diff = currentY - lastScrollY;

    if (mobileMQ.matches) {
      if (currentY <= 10) {
        topNav.classList.remove("nav-hidden");
      } else if (Math.abs(diff) > 6) {
        if (diff > 0) {
          // scroll dolů
          topNav.classList.add("nav-hidden");
        } else {
          // scroll nahoru
          topNav.classList.remove("nav-hidden");
        }
      }
    } else {
      // nad breakpointem je menu vždy viditelné
      topNav.classList.remove("nav-hidden");
    }

    lastScrollY = currentY;
    ticking = false;
  }

  if (topNav) {
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateTopNav);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener("resize", updateTopNav);
  }

  /* =========================================================
     KUKÁTKO – scroll reveal efekt
     ========================================================= */
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
      const radius = Math.min(rect.width, rect.height) * 0.45;

      const buffer = viewportH * 0.3;
      const startY = sectionTop - viewportH + buffer;
      const endY = sectionTop + sectionH - buffer;

      if (scrollY >= startY && scrollY <= endY) {
        const p = (scrollY - startY) / (endY - startY);

        if (p < 0.1) {
          layer.style.clipPath = "circle(0 at 50% 50%)";
        } else if (p < 0.15) {
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

  /* =========================================================
     LIGHTBOX – GALERIE
     ========================================================= */
  const galleryImgs = document.querySelectorAll(".galerie-grid img");
  const lbGallery = document.getElementById("lightbox-gallery");
  const lbImg = document.getElementById("lightbox-img");

  if (lbGallery && lbImg && galleryImgs.length) {
    const closeBtn = lbGallery.querySelector(".close");
    const prevBtn = lbGallery.querySelector(".prev");
    const nextBtn = lbGallery.querySelector(".next");
    let index = 0;

    function openGallery(i) {
      index = i;
      lbImg.src = galleryImgs[i].src;
      lbGallery.style.display = "flex";
    }

    function closeGallery() {
      lbGallery.style.display = "none";
    }

    galleryImgs.forEach((img, i) => {
      img.addEventListener("click", () => openGallery(i));
    });

    closeBtn.addEventListener("click", closeGallery);

    prevBtn.addEventListener("click", () => {
      index = (index - 1 + galleryImgs.length) % galleryImgs.length;
      lbImg.src = galleryImgs[index].src;
    });

    nextBtn.addEventListener("click", () => {
      index = (index + 1) % galleryImgs.length;
      lbImg.src = galleryImgs[index].src;
    });

    lbGallery.addEventListener("click", (e) => {
      if (e.target === lbGallery) closeGallery();
    });
  }

  /* =========================================================
     LIGHTBOX – TEXTY
     ========================================================= */
  const lbText = document.getElementById("lightbox-text");
  const slides = lbText?.querySelectorAll(".text-slide");
  const btnClose = lbText?.querySelector(".close");
  const btnPrev = lbText?.querySelector(".prev");
  const btnNext = lbText?.querySelector(".next");

  let textIndex = 0;

  function showSlide(i) {
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
  }

  function openTextLightbox(i) {
    textIndex = i;
    lbText.style.display = "flex";
    showSlide(i);
    lbText.scrollTop = 0;
    sideMenu?.classList.remove("active");
  }

  function closeTextLightbox() {
    lbText.style.display = "none";
  }

  btnClose?.addEventListener("click", closeTextLightbox);
  btnPrev?.addEventListener("click", () => {
    textIndex = (textIndex - 1 + slides.length) % slides.length;
    showSlide(textIndex);
    lbText.scrollTop = 0;
  });
  btnNext?.addEventListener("click", () => {
    textIndex = (textIndex + 1) % slides.length;
    showSlide(textIndex);
    lbText.scrollTop = 0;
  });

  lbText?.addEventListener("click", (e) => {
    if (e.target === lbText) closeTextLightbox();
  });

  document.querySelectorAll("#side-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openTextLightbox(parseInt(link.dataset.textIndex, 10));
    });
  });

  /* =========================================================
     KLÁVESY + SWIPE
     ========================================================= */
  document.addEventListener("keydown", (e) => {
    if (lbText?.style.display === "flex") {
      if (e.key === "ArrowLeft") btnPrev.click();
      if (e.key === "ArrowRight") btnNext.click();
      if (e.key === "Escape") closeTextLightbox();
    }
    if (lbGallery?.style.display === "flex") {
      if (e.key === "Escape") lbGallery.style.display = "none";
    }
  });

});
