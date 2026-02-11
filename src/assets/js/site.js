(() => {
  const body = document.body;

  if (!body.classList.contains("home-page")) {
    return;
  }

  const landscapeQuery = window.matchMedia("(orientation: landscape) and (min-width: 1000px)");
  const progressStart = 10;
  let progressRange = Math.max(260, window.innerHeight * 0.3);
  let ticking = false;
  let motionEnabled = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const setVars = (spread, reveal, wordmarkFade, tail) => {
    body.style.setProperty("--spread-progress", spread.toFixed(4));
    body.style.setProperty("--reveal-progress", reveal.toFixed(4));
    body.style.setProperty("--wordmark-fade", wordmarkFade.toFixed(4));
    body.style.setProperty("--offset-progress", tail.toFixed(4));
  };

  const setStaticMode = () => {
    motionEnabled = false;
    body.classList.remove("home-landscape-motion", "has-home-interaction");
    setVars(1, 1, 1, 0);
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

    const spread = clamp(stage / 0.38, 0, 1);
    const reveal = clamp((stage - 0.34) / 0.5, 0, 1);
    const wordmarkFade = clamp((stage - 0.22) / 0.4, 0, 1);
    const tail = clamp((raw - 1) / 0.85, 0, 1);

    setVars(spread, reveal, wordmarkFade, tail);
  };

  const applyMode = () => {
    progressRange = Math.max(260, window.innerHeight * 0.3);

    if (landscapeQuery.matches) {
      setMotionMode();
      updateProgress();
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
      ticking = false;
    });
  };

  applyMode();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", applyMode, { passive: true });
  landscapeQuery.addEventListener("change", applyMode);
})();
