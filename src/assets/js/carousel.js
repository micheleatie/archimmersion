(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const autoplayDelayMs = 4600;

  const collectFallbackGalleries = () => {
    const fallbackTargets = [];
    const headings = Array.from(document.querySelectorAll("h2, h3"));

    headings.forEach((heading) => {
      if (heading.textContent.trim().toLowerCase() !== "gallery") {
        return;
      }

      let next = heading.nextElementSibling;
      while (
        next &&
        !next.matches("[data-carousel]") &&
        next.tagName !== "UL" &&
        next.tagName !== "OL"
      ) {
        next = next.nextElementSibling;
      }

      if (!next || next.matches("[data-carousel]")) {
        return;
      }

      if ((next.tagName === "UL" || next.tagName === "OL") && next.querySelectorAll("img").length > 1) {
        fallbackTargets.push(next);
      }
    });

    return fallbackTargets;
  };

  const uniqueTargets = (() => {
    const explicit = Array.from(document.querySelectorAll("[data-carousel]"));
    const fallback = collectFallbackGalleries();
    return Array.from(new Set([...explicit, ...fallback]));
  })();

  const createCarouselMarkup = (slides) => {
    const root = document.createElement("section");
    root.className = "carousel";
    root.tabIndex = 0;
    root.setAttribute("aria-roledescription", "carousel");

    const frame = document.createElement("div");
    frame.className = "carousel-frame";

    const image = document.createElement("img");
    image.className = "carousel-image";
    image.loading = "lazy";
    image.decoding = "async";

    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "carousel-arrow carousel-arrow--prev";
    prevButton.setAttribute("aria-label", "Previous image");
    prevButton.innerHTML = '<span aria-hidden="true">&#10094;</span>';

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "carousel-arrow carousel-arrow--next";
    nextButton.setAttribute("aria-label", "Next image");
    nextButton.innerHTML = '<span aria-hidden="true">&#10095;</span>';

    const caption = document.createElement("p");
    caption.className = "carousel-caption";
    caption.setAttribute("aria-live", "polite");

    const dots = document.createElement("div");
    dots.className = "carousel-dots";

    const dotButtons = slides.map((slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Go to image ${index + 1}`);
      dot.setAttribute("aria-pressed", "false");
      dots.appendChild(dot);
      return dot;
    });

    frame.append(image, prevButton, nextButton);
    root.append(frame, caption, dots);

    let currentIndex = 0;
    let userNavigated = false;
    let autoplayId = null;

    const stopAutoplay = () => {
      userNavigated = true;
      if (autoplayId) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    };

    const applySlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      const current = slides[currentIndex];
      image.src = current.src;
      image.alt = current.alt;
      caption.textContent = current.alt || " ";

      dotButtons.forEach((dot, dotIndex) => {
        dot.setAttribute("aria-pressed", dotIndex === currentIndex ? "true" : "false");
      });
    };

    const moveBy = (offset, fromUser) => {
      if (fromUser) {
        stopAutoplay();
      }
      applySlide(currentIndex + offset);
    };

    const goTo = (index, fromUser) => {
      if (fromUser) {
        stopAutoplay();
      }
      applySlide(index);
    };

    const startAutoplay = () => {
      if (reduceMotion || slides.length < 2 || userNavigated || autoplayId) {
        return;
      }

      autoplayId = window.setInterval(() => {
        applySlide(currentIndex + 1);
      }, autoplayDelayMs);
    };

    prevButton.addEventListener("click", () => moveBy(-1, true));
    nextButton.addEventListener("click", () => moveBy(1, true));

    image.addEventListener("click", () => moveBy(1, true));

    dotButtons.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => goTo(dotIndex, true));
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveBy(-1, true);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveBy(1, true);
      }
    });

    applySlide(0);
    startAutoplay();

    return root;
  };

  uniqueTargets.forEach((target) => {
    if (target.dataset.carouselEnhanced === "true") {
      return;
    }

    const slides = Array.from(target.querySelectorAll("img"))
      .map((img) => ({
        src: img.getAttribute("src") || "",
        alt: img.getAttribute("alt") || "",
      }))
      .filter((slide) => slide.src);

    if (slides.length < 2) {
      return;
    }

    const carousel = createCarouselMarkup(slides);

    if (target.matches("[data-carousel]")) {
      target.dataset.carouselEnhanced = "true";
      target.classList.add("carousel-host");
      target.innerHTML = "";
      target.appendChild(carousel);
      return;
    }

    const host = document.createElement("div");
    host.className = "carousel-host";
    host.dataset.carouselEnhanced = "true";
    target.replaceWith(host);
    host.appendChild(carousel);
  });
})();
