(() => {
  const body = document.body;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const hasSunraysBackdrop = () => body.dataset.backgroundStyle === "sunrays-glass";
  const langStorageKey = "arch_home_lang";
  const getStoredLang = () => {
    try {
      const stored = window.localStorage.getItem(langStorageKey);
      return stored === "fr" ? "fr" : "en";
    } catch {
      return "en";
    }
  };
  const setStoredLang = (lang) => {
    try {
      window.localStorage.setItem(langStorageKey, lang);
    } catch {
      // Ignore storage errors in private/restricted contexts.
    }
  };

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

  const initCommunicationLanguage = () => {
    if (!body.classList.contains("communication-page")) {
      return;
    }

    const lang = getStoredLang();
    const t = {
      en: {
        navRepresentation: "Captation and Restitution",
        navCommunication: "Communication",
        h1: "Communication",
        whatWeOffer: "What We Offer",
        idealFor: "Ideal For",
        storyTitle: "<strong>Immersive Storytelling for Architecture</strong>",
        storyIntro:
          "We use advanced photographic and immersive technologies to capture the true sensory atmosphere of your buildings. Our process combines:",
        storyBullet1: "High-dynamic-range photography",
        storyBullet2: "Immersive scans, 2D, or 360° immersive photography",
        storyBullet3: "Additional sensorial aspects (sounds, light, etc.) when needed",
        storyBullet4: "Sensitive atmosphere description by experts in spatial perception",
        storyTeam:
          "Our team does more than present a building in a photograph — we interpret its qualities.",
        diffTitle: "<strong>What Makes Us Different</strong>",
        diffBullet1: "Atmospheric and high-quality representation of your photographs",
        diffBullet2: "Sensitive interpretation by experts in architectural atmospheres",
        diffBullet3: "Immersive experience via 360° environments or refined 2D photography",
        diffBullet4: "Seamless integration into your website and digital platforms",
        diffBullet5:
          "We help your clients truly see the space you have designed — without outdated visualization techniques diminishing its impact.",
        idealBullet1: "Architects and design studios",
        idealBullet2: "Real estate developers",
        idealBullet3: "Cultural institutions",
        idealBullet4: "Hospitality and wellness spaces",
        expTitle: "Street to immersion",
        mapCaption: "Map pin: open exterior 360 street view.",
        mapSpotAria: "Open 360 view from this street spot",
        streetPanoCaption: "360 street panorama (scroll/drag horizontally, then click the building pin)",
        interiorPinAria: "Open interior 360 from this building",
        interiorPanoCaption: "360 interior panorama",
        interiorTitle: "Interior reading",
        interiorText1:
          "This viewpoint captures a transition space where light, circulation, and ceiling rhythm define the atmosphere. It is useful for discussing material continuity and how users perceive depth across connected rooms.",
        interiorText2:
          "The 360 interior sequence helps clients evaluate scale, openings, and ambient quality before final detailing.",
      },
      fr: {
        navRepresentation: "Captation and Restitution",
        navCommunication: "Communication",
        h1: "Communication",
        whatWeOffer: "Ce Que Nous Proposons",
        idealFor: "Pour Qui",
        storyTitle: "<strong>Narration Immersive pour l'Architecture</strong>",
        storyIntro:
          "Nous utilisons des technologies photographiques et immersives avancees pour capter la veritable atmosphere sensorielle de vos batiments. Notre approche combine :",
        storyBullet1: "Photographie a large plage dynamique",
        storyBullet2: "Scans immersifs, photographie 2D ou photographie immersive 360°",
        storyBullet3: "Aspects sensoriels complementaires (sons, lumiere, etc.) si necessaire",
        storyBullet4: "Lecture sensible des atmospheres par des experts de la perception spatiale",
        storyTeam:
          "Notre equipe ne se contente pas de montrer un batiment en photo — nous en interpretions les qualites.",
        diffTitle: "<strong>Ce Qui Nous Differencie</strong>",
        diffBullet1: "Representation atmospherique et qualitative de vos photographies",
        diffBullet2: "Interpretation sensible par des experts des atmospheres architecturales",
        diffBullet3: "Experience immersive via des environnements 360° ou une photographie 2D soignee",
        diffBullet4: "Integration fluide a votre site web et a vos plateformes numeriques",
        diffBullet5:
          "Nous aidons vos clients a vraiment percevoir l'espace que vous avez concu — sans techniques de visualisation depassees qui en diminuent l'impact.",
        idealBullet1: "Architectes et agences de design",
        idealBullet2: "Promoteurs immobiliers",
        idealBullet3: "Institutions culturelles",
        idealBullet4: "Espaces d'hotellerie et de bien-etre",
        expTitle: "De la rue a l'immersion",
        mapCaption: "Pin carte : ouvrir la vue 360 exterieure.",
        mapSpotAria: "Ouvrir la vue 360 depuis ce point de rue",
        streetPanoCaption: "Panorama 360 rue (defilez/glissez horizontalement puis cliquez le pin du batiment)",
        interiorPinAria: "Ouvrir la vue 360 interieure depuis ce batiment",
        interiorPanoCaption: "Panorama 360 interieur",
        interiorTitle: "Lecture interieure",
        interiorText1:
          "Ce point de vue capte un espace de transition ou la lumiere, la circulation et le rythme du plafond construisent l'atmosphere. Il facilite la discussion sur la continuite materielle et la perception de profondeur entre les pieces.",
        interiorText2:
          "La sequence interieure en 360 aide vos clients a evaluer les echelles, les ouvertures et la qualite ambiante avant les choix de detail final.",
      },
    }[lang];

    const update = (selector, value) => {
      if (!value) {
        return;
      }
      const node = document.querySelector(selector);
      if (node) {
        node.innerHTML = value;
      }
    };

    const updateText = (selector, value) => {
      if (!value) {
        return;
      }
      const node = document.querySelector(selector);
      if (node) {
        node.textContent = value;
      }
    };

    updateText(".subpage-nav a[href='representation/']", t.navRepresentation);
    updateText(".subpage-nav a[href='communication/']", t.navCommunication);
    updateText(".markdown-body > h1", t.h1);
    updateText("#what-we-offer > a", t.whatWeOffer);
    updateText("#ideal-for > a", t.idealFor);

    const i18nNodes = Array.from(document.querySelectorAll("[data-comm-i18n]"));
    i18nNodes.forEach((node) => {
      const key = node.getAttribute("data-comm-i18n");
      if (!key || !(key in t)) {
        return;
      }
      if (key === "storyTitle" || key === "diffTitle") {
        node.innerHTML = t[key];
      } else {
        node.textContent = t[key];
      }
    });

    const i18nAriaNodes = Array.from(document.querySelectorAll("[data-comm-i18n-aria]"));
    i18nAriaNodes.forEach((node) => {
      const key = node.getAttribute("data-comm-i18n-aria");
      if (!key || !(key in t)) {
        return;
      }
      node.setAttribute("aria-label", t[key]);
    });
  };

  const initInteractiveExperiences = () => {
    const experiences = Array.from(document.querySelectorAll("[data-comm-experience], [data-repr-experience]"));
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

      const getTargetId = (control) => {
        const dataTarget = control.dataset.target || "";
        if (dataTarget) {
          return dataTarget;
        }

        const href = control.getAttribute("href") || "";
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
          const pressed = getTargetId(spot) === targetId;
          spot.setAttribute("aria-pressed", pressed ? "true" : "false");
        });

        interiorPins.forEach((pin) => {
          pin.setAttribute("aria-pressed", targetId === "comm-interior-stack" ? "true" : "false");
        });
      };

      const bindRevealControl = (control) => {
        const targetId = getTargetId(control);
        if (!targetId) {
          return;
        }

        control.addEventListener("click", () => {
          revealPanoramas(targetId);
          window.history.replaceState(null, "", `#${targetId}`);
        });
      };

      mapSpots.forEach(bindRevealControl);
      interiorPins.forEach(bindRevealControl);

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
        let activePointerId = null;
        let startX = 0;
        let startScrollLeft = 0;
        const wheelSpeedFactor = 2.4;
        const dragSpeedFactor = 1.7;
        const interactiveSelector = "a, button, input, select, textarea, summary, [role='button']";

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
          if (event.button !== 0) {
            return;
          }

          if (event.pointerType === "touch") {
            return;
          }

          if (event.target instanceof Element && event.target.closest(interactiveSelector)) {
            return;
          }

          isDragging = true;
          activePointerId = event.pointerId;
          startX = event.clientX;
          startScrollLeft = scroller.scrollLeft;
          scroller.classList.add("is-dragging");
          if (typeof scroller.setPointerCapture === "function") {
            scroller.setPointerCapture(event.pointerId);
          }
        });

        scroller.addEventListener("pointermove", (event) => {
          if (!isDragging || event.pointerId !== activePointerId) {
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

          if (
            activePointerId !== null &&
            typeof scroller.hasPointerCapture === "function" &&
            scroller.hasPointerCapture(activePointerId) &&
            typeof scroller.releasePointerCapture === "function"
          ) {
            scroller.releasePointerCapture(activePointerId);
          }

          isDragging = false;
          activePointerId = null;
          scroller.classList.remove("is-dragging");
        };

        scroller.addEventListener("pointerup", stopDragging);
        scroller.addEventListener("pointercancel", stopDragging);
        scroller.addEventListener("lostpointercapture", stopDragging);
      });
    });
  };

  if (!body.classList.contains("home-page")) {
    initCommunicationLanguage();
    initInteractiveExperiences();
    updateBackdropDepth();
    window.addEventListener("scroll", updateBackdropDepth, { passive: true });
    window.addEventListener("resize", updateBackdropDepth, { passive: true });
    return;
  }

  const roomStage = document.querySelector("[data-room-scene]");
  const panel = document.getElementById("pillar-panel");
  const backdrop = document.getElementById("panel-backdrop");
  const panelTitle = document.getElementById("panel-title");
  const panelBody = document.getElementById("panel-body");
  const panelPoints = document.getElementById("panel-points");
  const panelCta = document.getElementById("panel-cta");
  const closeButton = document.getElementById("panel-close");

  if (!roomStage || !panel || !backdrop || !panelTitle || !panelBody || !panelPoints || !panelCta || !closeButton) {
    return;
  }

  const hotspots = Array.from(roomStage.querySelectorAll(".room-hotspot"));
  const langButtons = Array.from(document.querySelectorAll("[data-lang]"));
  const i18nHeadline = document.querySelector('[data-i18n="headline"]');
  const i18nContactTitle = document.querySelector('[data-i18n="contactTitle"]');
  const i18nContactText = document.querySelector('[data-i18n="contactText"]');
  const i18nContactCta = document.querySelector('[data-i18n="contactCta"]');
  const homeI18n = {
    en: {
      headline: "Explore the room.",
      contactTitle: "Contact",
      contactText:
        "Have a project in mind or want to learn more about Archimmersion? Send us a note and we will get back to you.",
      contactCta: "Email Us",
      panels: {
        "hotspot-caption": {
          openLabel: "Open Captation and Restitution section",
          title: "CAPTATION AND RESTITUTION",
          tooltip: "Captation & Restitution",
          lead: "Faithful 3D Scan & Immersive Representation",
          body:
            "We intervene on-site to capture your building with precision and sensitivity. Using advanced 3D scanning technologies, we provide a faithful, immersive, and atmosphere-driven digital restitution — ideal for renovation, design development, and communication.",
          ctaLabel: "Open Captation and Restitution",
        },
        "hotspot-laptop": {
          openLabel: "Open Communication section",
          title: "COMMUNICATION",
          tooltip: "Communication",
          lead:
            "Immersive Architectural Communication for professional websites and magazines.\nBeyond vision. We capture architecture as it is experienced.",
          body:
            "Through advanced imaging technologies and an expert eye for atmosphere, we translate spaces into immersive experiences — faithful, sensory, and atmospheric. Using cutting-edge tools — from 360° immersive environments to high-fidelity 2D photography — we present your project as a true sensory experience, seamlessly integrated into your website or delivered directly to your clients.",
          ctaLabel: "Open Communication",
        },
      },
    },
    fr: {
      headline: "Explorez la piece.",
      contactTitle: "Contact",
      contactText:
        "Vous avez un projet en tete ou souhaitez en savoir plus sur Archimmersion ? Envoyez-nous un message et nous vous repondrons rapidement.",
      contactCta: "Envoyer un email",
      panels: {
        "hotspot-caption": {
          openLabel: "Ouvrir la section Captation et Restitution",
          title: "CAPTATION ET RESTITUTION",
          tooltip: "Captation & Restitution",
          lead: "Scan 3D fidele et representation immersive",
          body:
            "Nous intervenons sur site pour capturer votre batiment avec precision et sensibilite. Grace a des technologies avancees de scan 3D, nous produisons une restitution numerique fidele, immersive et guidee par l'atmosphere, ideale pour la renovation, le developpement de projet et la communication.",
          ctaLabel: "Ouvrir Captation et Restitution",
        },
        "hotspot-laptop": {
          openLabel: "Ouvrir la section Communication",
          title: "COMMUNICATION",
          tooltip: "Communication",
          lead:
            "Communication architecturale immersive pour les sites professionnels et les magazines.\nAu-dela de la vision. Nous captons l'architecture telle qu'elle est vecue.",
          body:
            "Grace a des technologies d'imagerie avancees et a un regard expert sur les atmospheres, nous traduisons les espaces en experiences immersives, fideles, sensorielles et atmospheriques. Avec des outils de pointe — des environnements immersifs 360° a la photographie 2D haute fidelite — nous presentons votre projet comme une veritable experience sensorielle, integree a votre site web ou livree directement a vos clients.",
          ctaLabel: "Ouvrir Communication",
        },
      },
    },
  };
  let currentLang = "en";
  let activeHotspot = null;
  let hideTimer = null;

  const setActiveHotspot = (nextActiveId) => {
    hotspots.forEach((hotspot) => {
      const isActive = hotspot.id === nextActiveId;
      hotspot.classList.toggle("is-active", isActive);
      hotspot.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const setLanguage = (nextLang) => {
    if (!homeI18n[nextLang]) {
      return;
    }

    currentLang = nextLang;
    setStoredLang(currentLang);
    const copy = homeI18n[currentLang];

    if (i18nHeadline) {
      i18nHeadline.textContent = copy.headline;
    }
    if (i18nContactTitle) {
      i18nContactTitle.textContent = copy.contactTitle;
    }
    if (i18nContactText) {
      i18nContactText.textContent = copy.contactText;
    }
    if (i18nContactCta) {
      i18nContactCta.textContent = copy.contactCta;
    }

    hotspots.forEach((hotspot) => {
      const panelCopy = copy.panels[hotspot.id];
      if (panelCopy && panelCopy.openLabel) {
        hotspot.setAttribute("aria-label", panelCopy.openLabel);
      }
      const tooltipTextNodes = hotspot.querySelectorAll("[data-tooltip-text]");
      if (tooltipTextNodes.length && panelCopy && panelCopy.tooltip) {
        tooltipTextNodes.forEach((node) => {
          node.textContent = panelCopy.tooltip;
        });
      }
    });

    langButtons.forEach((button) => {
      const isCurrent = button.dataset.lang === currentLang;
      button.classList.toggle("is-active", isCurrent);
      button.setAttribute("aria-pressed", isCurrent ? "true" : "false");
    });

    if (activeHotspot) {
      fillPanel(activeHotspot);
    }
  };

  const fillPanel = (hotspot) => {
    const translation = (homeI18n[currentLang] && homeI18n[currentLang].panels[hotspot.id]) || {};
    const title = translation.title || hotspot.dataset.panelTitle || "";
    const leadText = translation.lead || "";
    const bodyText = translation.body || hotspot.dataset.panelBody || "";
    const pointData = hotspot.dataset.panelPoints || "";
    const fallbackPoints = pointData.split("|").map((point) => point.trim()).filter(Boolean).slice(0, 5);
    const points = Array.isArray(translation.points) && translation.points.length ? translation.points : fallbackPoints;

    panelTitle.textContent = title;
    panelBody.hidden = true;
    panelBody.textContent = "";
    panelBody.innerHTML = "";
    panelPoints.hidden = true;
    panelPoints.textContent = "";

    if (leadText || bodyText) {
      if (leadText) {
        const leadNode = document.createElement("strong");
        const leadLines = leadText.split("\n");
        leadLines.forEach((line, index) => {
          leadNode.appendChild(document.createTextNode(line));
          if (index < leadLines.length - 1) {
            leadNode.appendChild(document.createElement("br"));
          }
        });
        panelBody.appendChild(leadNode);
      }

      if (bodyText) {
        if (leadText) {
          panelBody.appendChild(document.createElement("br"));
          panelBody.appendChild(document.createElement("br"));
        }
        panelBody.appendChild(document.createTextNode(bodyText));
      }

      panelBody.hidden = false;
    } else {
      points.forEach((point) => {
        const item = document.createElement("li");
        item.textContent = point;
        panelPoints.appendChild(item);
      });

      panelPoints.hidden = false;
    }

    const ctaHref = hotspot.dataset.panelCtaHref || "";
    const ctaLabel = translation.ctaLabel || hotspot.dataset.panelCtaLabel || "Open section";

    if (ctaHref) {
      panelCta.href = ctaHref;
      panelCta.textContent = ctaLabel;
      panelCta.hidden = false;
      return;
    }

    panelCta.hidden = true;
  };

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.lang || "en");
    });
  });

  setLanguage(getStoredLang());

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
    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const href = panelCta.getAttribute("href") || "";
    if (!href || href === "#") {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    try {
      const targetUrl = new URL(href, document.baseURI || window.location.href);
      window.location.assign(targetUrl.href);
    } catch {
      window.location.assign(href);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });

  if ("IntersectionObserver" in window) {
    let roomIsIntersecting = false;
    let roomRevealed = false;
    const minRevealScroll = () => Math.max(window.innerHeight * 0.42, 220);

    const cleanupRevealListeners = () => {
      window.removeEventListener("scroll", tryRevealRoom);
      window.removeEventListener("resize", tryRevealRoom);
    };

    const revealRoom = () => {
      if (roomRevealed) {
        return;
      }
      roomRevealed = true;
      roomStage.classList.add("is-visible");
      roomObserver.disconnect();
      cleanupRevealListeners();
    };

    const tryRevealRoom = () => {
      if (roomIsIntersecting && window.scrollY >= minRevealScroll()) {
        revealRoom();
      }
    };

    const roomObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          roomIsIntersecting = entry.isIntersecting;
          tryRevealRoom();
        });
      },
      {
        threshold: 0.52,
        rootMargin: "0px 0px -18% 0px",
      },
    );

    roomObserver.observe(roomStage);
    window.addEventListener("scroll", tryRevealRoom, { passive: true });
    window.addEventListener("resize", tryRevealRoom, { passive: true });
    window.setTimeout(tryRevealRoom, 250);
  } else {
    roomStage.classList.add("is-visible");
  }
})();
