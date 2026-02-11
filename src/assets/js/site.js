(() => {
  const body = document.body;

  if (!body.classList.contains("home-page")) {
    return;
  }

  const openThreshold = 80;
  const closeThreshold = 8;
  let expanded = false;
  let ticking = false;

  const setExpanded = (nextState) => {
    expanded = nextState;
    body.classList.toggle("is-expanded", expanded);
  };

  const evaluate = () => {
    const y = window.scrollY;

    if (!expanded && y > openThreshold) {
      setExpanded(true);
    } else if (expanded && y < closeThreshold) {
      setExpanded(false);
    }
  };

  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      evaluate();
      ticking = false;
    });
  };

  body.classList.add("has-home-interaction");

  if (window.location.hash && window.location.hash !== "#top") {
    setExpanded(true);
  } else {
    evaluate();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();
