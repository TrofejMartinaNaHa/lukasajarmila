document.addEventListener("DOMContentLoaded", () => {
  // === SIDE MENU TOGGLE ===
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

  // === KUKÁTKO EFEKT – původní scroll-based verze ===
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
      const radius = Math.min(sectionW, sectionH) * 0.45; // nikdy nepřesáhne okraje
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

  // === LIGHTBOX TEXTY ===
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

  // === Jednoduchá kalkulačka (Ceník) ===
  const simpleForm = document.getElementById("simple-price-form");
  const simpleOutput = document.getElementById("simple-price-output");
  if (simpleForm && simpleOutput) {
    const optionBoxes = simpleForm.querySelectorAll(".option-box");
    let selected = { size: null, weight: null };

    optionBoxes.forEach(box => {
      box.addEventListener("click", () => {
        const group = box.parentElement.dataset.group;
        box.parentElement.querySelectorAll(".option-box").forEach(b => b.classList.remove("active"));
        box.classList.add("active");
        selected[group] = box.dataset.value;
        updateSimplePrice();
      });
    });

    function updateSimplePrice() {
      const { size, weight } = selected;
      let priceText = "–";
      if (weight === "lehci" && !size) priceText = "od 250 Kč/ks";
      if (weight === "tezsi" && !size) priceText = "od 500 Kč/ks";
      if (size === "mensi" && weight === "lehci") priceText = "od 250 Kč";
      if (size === "vetsi" && weight === "lehci") priceText = "od 500 Kč";
      if (size === "mensi" && weight === "tezsi") priceText = "od 500 Kč";
      if (size === "vetsi" && weight === "tezsi") priceText = "od 500 Kč";
      simpleOutput.textContent = priceText;
    }
  }
});

// === Kalkulačka v ceníku ===
const calcButtons = document.querySelectorAll(".calc-btn");
const calcOutput = document.getElementById("calc-output");

if (calcButtons.length && calcOutput) {
  const selections = { size: null, weight: null };

  calcButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.parentElement.dataset.group;
      const value = btn.dataset.value;

      // reset aktivního tlačítka v dané skupině
      btn.parentElement.querySelectorAll(".calc-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      selections[group] = value;
      updateCalc();
    });
  });

  function updateCalc() {
    const { size, weight } = selections;
    let price = "–";

    if (size || weight) {
      // základní logika
      if (weight === "light") price = "od 250 Kč";
      if (weight === "heavy") price = "od 500 Kč";

      if (size === "large" && weight === "light") price = "od 500 Kč";
      if (size === "large" && weight === "heavy") price = "od 500 Kč";
    }
    calcOutput.textContent = price;
  }
}
