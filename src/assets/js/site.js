(() => {
  const body = document.body;

  if (!body.classList.contains("home-page")) {
    return;
  }

  const landscapeQuery = window.matchMedia("(orientation: landscape) and (min-width: 1000px)");
  const progressStart = 10;
  let progressRange = Math.max(150, window.innerHeight * 0.18);
  let ticking = false;
  let motionEnabled = false;
  let lastAlign = 1;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const setVars = (spread, reveal, wordmarkFade, tail, align) => {
    body.style.setProperty("--spread-progress", spread.toFixed(4));
    body.style.setProperty("--reveal-progress", reveal.toFixed(4));
    body.style.setProperty("--wordmark-fade", wordmarkFade.toFixed(4));
    body.style.setProperty("--offset-progress", tail.toFixed(4));
    body.style.setProperty("--align-progress", align.toFixed(4));
    lastAlign = align;
  };

  const setStaticMode = () => {
    motionEnabled = false;
    body.classList.remove("home-landscape-motion", "has-home-interaction");
    setVars(1, 1, 1, 0, 1);
  };

  const setMotionMode = () => {
    motionEnabled = true;
    body.classList.add("home-landscape-motion", "has-home-interaction");
  };

  const updateProgress = () => {
    if (!motionEnabled) {
      return;
    }

    const y = window.scrollY;
    const raw = (y - progressStart) / progressRange;
    const stage = clamp(raw, 0, 1);

    const spread = clamp(stage / 0.22, 0, 1);
    const reveal = clamp((stage - 0.16) / 0.26, 0, 1);
    const wordmarkFade = clamp((stage - 0.1) / 0.22, 0, 1);
    const tail = clamp((raw - 1) / 0.85, 0, 1);
    const align = clamp((stage - 0.08) / 0.24, 0, 1);

    setVars(spread, reveal, wordmarkFade, tail, align);
  };

  const updateSubtitleShifts = () => {
    if (!motionEnabled) {
      return;
    }

    const words = Array.from(document.querySelectorAll(".subtitle-word"));
    const cards = Array.from(document.querySelectorAll(".sections-grid .section-card"));

    if (words.length !== cards.length || words.length === 0) {
      return;
    }

    body.style.setProperty("--align-progress", "0");
    void body.offsetWidth;

    words.forEach((word, index) => {
      const wordRect = word.getBoundingClientRect();
      const cardRect = cards[index].getBoundingClientRect();
      const shift = cardRect.left - wordRect.left;
      word.style.setProperty("--target-shift", `${shift.toFixed(2)}px`);
    });

    body.style.setProperty("--align-progress", lastAlign.toFixed(4));
  };

  const applyMode = () => {
    progressRange = Math.max(150, window.innerHeight * 0.18);

    if (landscapeQuery.matches) {
      setMotionMode();
      updateProgress();
      window.requestAnimationFrame(updateSubtitleShifts);
      return;
    }

    setStaticMode();
  };

  const onScroll = () => {
    if (!motionEnabled || ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      updateProgress();
      updateSubtitleShifts();
      ticking = false;
    });
  };

  applyMode();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", applyMode, { passive: true });
  window.addEventListener("load", updateSubtitleShifts, { once: true });
  landscapeQuery.addEventListener("change", applyMode);
})();
