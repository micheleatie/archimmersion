(() => {
  const body = document.body;

  if (!body.classList.contains("home-page")) {
    return;
  }

  const progressStart = 24;
  const progressEnd = 360;
  let expanded = false;
  let ticking = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const setProgress = () => {
    const y = window.scrollY;
    const raw = (y - progressStart) / (progressEnd - progressStart);
    const progress = clamp(raw, 0, 1);
    body.style.setProperty("--home-progress", progress.toFixed(4));

    const nextExpanded = progress > 0.62;
    if (nextExpanded !== expanded) {
      expanded = nextExpanded;
      body.classList.toggle("is-expanded", expanded);
    }

    body.classList.toggle("home-content-active", progress > 0.35);
  };

  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      setProgress();
      ticking = false;
    });
  };

  body.classList.add("has-home-interaction");

  if (window.location.hash && window.location.hash !== "#top") {
    body.style.setProperty("--home-progress", "1");
    body.classList.add("is-expanded", "home-content-active");
    expanded = true;
  } else {
    setProgress();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();
