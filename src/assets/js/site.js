(() => {
  const body = document.body;
  const isHomePage = body.classList.contains("home-page");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = reduceMotionQuery.matches;

  if (!isHomePage) {
    return;
  }

  const threshold = 60;
  const subtitleLinks = Array.from(document.querySelectorAll("[data-expand-link]"));

  body.classList.add("has-home-interaction");

  const syncExpandedState = () => {
    if (window.scrollY > threshold) {
      body.classList.add("is-expanded");
    } else {
      body.classList.remove("is-expanded");
    }
  };

  const jumpToTarget = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    const behavior = prefersReducedMotion ? "auto" : "smooth";
    target.scrollIntoView({ behavior, block: "start" });
  };

  subtitleLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("data-expand-link");
      body.classList.add("is-expanded");
      jumpToTarget(targetId);
    });
  });

  window.addEventListener("scroll", syncExpandedState, { passive: true });

  if (window.location.hash && window.location.hash !== "#top") {
    body.classList.add("is-expanded");
  } else {
    syncExpandedState();
  }
})();
