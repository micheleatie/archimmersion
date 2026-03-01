(() => {
  const body = document.body;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const hasSunraysBackdrop = () => body.dataset.backgroundStyle === "sunrays-glass";

  const updateBackdropDepth = () => {
    if (!hasSunraysBackdrop() || body.classList.contains("home-page")) {
      body.style.removeProperty("--sunrays-blur");
      body.style.removeProperty("--sunrays-veil-opacity");
      return;
    }

    const y = window.scrollY;
    const range = Math.max(window.innerHeight * 0.95, 520);
    const progress = clamp(y / range, 0, 1);
    const veilOpacity = 0.12 + progress * 0.18;

    body.style.setProperty("--sunrays-blur", "0px");
    body.style.setProperty("--sunrays-veil-opacity", veilOpacity.toFixed(3));
  };

  const initCommunicationExperience = () => {
    if (!body.classList.contains("communication-page")) {
      return;
    }

    const experiences = Array.from(document.querySelectorAll("[data-comm-experience]"));
    if (!experiences.length) {
      return;
    }

    experiences.forEach((experience) => {
      const mapSpots = Array.from(experience.querySelectorAll("[data-map-spot]"));
      const interiorPins = Array.from(experience.querySelectorAll("[data-interior-pin]"));
      const panoramaStacks = Array.from(experience.querySelectorAll("[data-panorama-stack]"));
      const scrollers = Array.from(experience.querySelectorAll("[data-panorama-scroll]"));

      if (!mapSpots.length || !panoramaStacks.length) {
        return;
      }

      const getTargetId = (spot) => {
        const dataTarget = spot.dataset.target || "";
        if (dataTarget) {
          return dataTarget;
        }

        const href = spot.getAttribute("href") || "";
        const hashIndex = href.indexOf("#");
        return hashIndex >= 0 ? href.slice(hashIndex + 1) : "";
      };

      const revealPanoramas = (targetId) => {
        if (!targetId) {
          return;
        }

        const showExteriorWithInterior = targetId === "comm-interior-stack";

        panoramaStacks.forEach((stack) => {
          const isTarget = stack.id === targetId;
          const isExteriorCompanion = showExteriorWithInterior && stack.id === "comm-panorama-stack";
          const shouldShow = isTarget || isExteriorCompanion;

          stack.classList.toggle("is-visible", shouldShow);
          stack.hidden = !shouldShow;
        });

        mapSpots.forEach((spot) => {
          const pressed = getTargetId(spot) === targetId && targetId === "comm-panorama-stack";
          spot.setAttribute("aria-pressed", pressed ? "true" : "false");
        });

        interiorPins.forEach((pin) => {
          pin.setAttribute("aria-pressed", targetId === "comm-interior-stack" ? "true" : "false");
        });
      };

      mapSpots.forEach((mapSpot) => {
        const targetId = getTargetId(mapSpot);

        mapSpot.addEventListener("click", () => {
          revealPanoramas(targetId);
        });

        mapSpot.addEventListener("pointerup", () => {
          revealPanoramas(targetId);
        });

        mapSpot.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            revealPanoramas(targetId);
          }
        });
      });

      interiorPins.forEach((pin) => {
        pin.addEventListener("click", () => {
          revealPanoramas("comm-interior-stack");
        });

        pin.addEventListener("pointerup", () => {
          revealPanoramas("comm-interior-stack");
        });

        pin.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            revealPanoramas("comm-interior-stack");
          }
        });
      });

      const currentHashId = window.location.hash.replace("#", "");
      if (currentHashId) {
        revealPanoramas(currentHashId);
      }

      window.addEventListener("hashchange", () => {
        const hashId = window.location.hash.replace("#", "");
        if (hashId) {
          revealPanoramas(hashId);
        }
      });

      scrollers.forEach((scroller) => {
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        const wheelSpeedFactor = 2.4;
        const dragSpeedFactor = 1.7;

        scroller.addEventListener(
          "wheel",
          (event) => {
            if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
              return;
            }

            event.preventDefault();
            scroller.scrollLeft += event.deltaY * wheelSpeedFactor;
          },
          { passive: false },
        );

        scroller.addEventListener("pointerdown", (event) => {
          isDragging = true;
          startX = event.clientX;
          startScrollLeft = scroller.scrollLeft;
          scroller.classList.add("is-dragging");
          scroller.setPointerCapture(event.pointerId);
        });

        scroller.addEventListener("pointermove", (event) => {
          if (!isDragging) {
            return;
          }

          event.preventDefault();
          const delta = event.clientX - startX;
          scroller.scrollLeft = startScrollLeft - delta * dragSpeedFactor;
        });

        const stopDragging = () => {
          if (!isDragging) {
            return;
          }

          isDragging = false;
          scroller.classList.remove("is-dragging");
        };

        scroller.addEventListener("pointerup", stopDragging);
        scroller.addEventListener("pointercancel", stopDragging);
      });
    });
  };

  if (!body.classList.contains("home-page")) {
    initCommunicationExperience();
    updateBackdropDepth();
    window.addEventListener("scroll", updateBackdropDepth, { passive: true });
    window.addEventListener("resize", updateBackdropDepth, { passive: true });
    return;
  }

  const roomStage = document.querySelector("[data-room-scene]");
  const panel = document.getElementById("pillar-panel");
  const backdrop = document.getElementById("panel-backdrop");
  const panelTitle = document.getElementById("panel-title");
  const panelPoints = document.getElementById("panel-points");
  const panelCta = document.getElementById("panel-cta");
  const closeButton = document.getElementById("panel-close");

  if (!roomStage || !panel || !backdrop || !panelTitle || !panelPoints || !panelCta || !closeButton) {
    return;
  }

  const hotspots = Array.from(roomStage.querySelectorAll(".room-hotspot"));
  let activeHotspot = null;
  let hideTimer = null;

  const setActiveHotspot = (nextActiveId) => {
    hotspots.forEach((hotspot) => {
      const isActive = hotspot.id === nextActiveId;
      hotspot.classList.toggle("is-active", isActive);
      hotspot.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const fillPanel = (hotspot) => {
    const title = hotspot.dataset.panelTitle || "";
    const pointData = hotspot.dataset.panelPoints || "";
    const points = pointData
      .split("|")
      .map((point) => point.trim())
      .filter(Boolean)
      .slice(0, 5);

    panelTitle.textContent = title;
    panelPoints.textContent = "";

    points.forEach((point) => {
      const item = document.createElement("li");
      item.textContent = point;
      panelPoints.appendChild(item);
    });

    const ctaHref = hotspot.dataset.panelCtaHref || "";
    const ctaLabel = hotspot.dataset.panelCtaLabel || "Open section";

    if (ctaHref) {
      panelCta.href = ctaHref;
      panelCta.textContent = ctaLabel;
      panelCta.hidden = false;
      return;
    }

    panelCta.hidden = true;
  };

  const openPanel = (hotspot) => {
    if (!hotspot) {
      return;
    }

    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    fillPanel(hotspot);
    activeHotspot = hotspot;
    setActiveHotspot(hotspot.id);

    panel.hidden = false;
    backdrop.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    body.classList.add("room-panel-open");

    window.requestAnimationFrame(() => {
      panel.classList.add("is-open");
      backdrop.classList.add("is-open");
    });
  };

  const closePanel = () => {
    if (panel.hidden) {
      return;
    }

    panel.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    body.classList.remove("room-panel-open");
    setActiveHotspot(null);

    hideTimer = window.setTimeout(() => {
      panel.hidden = true;
      backdrop.hidden = true;
      if (activeHotspot) {
        activeHotspot.focus();
      }
      activeHotspot = null;
      hideTimer = null;
    }, 240);
  };

  hotspots.forEach((hotspot) => {
    hotspot.addEventListener("click", () => {
      openPanel(hotspot);
    });

    hotspot.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPanel(hotspot);
      }
    });
  });

  closeButton.addEventListener("click", closePanel);
  backdrop.addEventListener("click", closePanel);
  panelCta.addEventListener("click", (event) => {
    const href = panelCta.getAttribute("href");
    if (!href || href === "#") {
      event.preventDefault();
      return;
    }

    window.location.assign(href);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });

  if ("IntersectionObserver" in window) {
    const roomObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            roomStage.classList.add("is-visible");
            roomObserver.disconnect();
          }
        });
      },
      {
        threshold: 0.24,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    roomObserver.observe(roomStage);
  } else {
    roomStage.classList.add("is-visible");
  }
})();
