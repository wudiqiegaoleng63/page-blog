(() => {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("#site-nav");
  const menu = document.querySelector(".mobile-menu");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const readingProgress = document.querySelector("[data-reading-progress]");
  const cursorGlow = document.querySelector("[data-cursor-glow]");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const navLinks = [...document.querySelectorAll("[data-nav-link]")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
    const icon = themeToggle?.querySelector(".theme-icon");
    if (icon) icon.textContent = theme === "dark" ? "☾" : "☼";
    themeColorMeta?.setAttribute("content", theme === "dark" ? "#20252b" : "#efe7e3");
    try { localStorage.setItem("lishaoyang-theme", theme); } catch (_) { /* private mode */ }
  };

  let savedTheme = null;
  try { savedTheme = localStorage.getItem("lishaoyang-theme"); } catch (_) { /* private mode */ }
  setTheme(savedTheme === "dark" ? "dark" : "light");

  themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  const closeMenu = () => {
    nav?.classList.remove("is-open");
    menu?.setAttribute("aria-expanded", "false");
  };

  menu?.addEventListener("click", () => {
    const isOpen = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!isOpen));
    nav?.classList.toggle("is-open", !isOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const handleScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  const updateReadingProgress = () => {
    if (!readingProgress) return;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
    readingProgress.style.transform = `scaleX(${progress})`;
  };
  updateReadingProgress();
  window.addEventListener("scroll", updateReadingProgress, { passive: true });

  root.classList.add("has-js");
  const revealTargets = [
    ...document.querySelectorAll(".hero-copy > *, .hero-orbit, .section-kicker, .section-heading, .about-copy, .stat, .project-card, .note-row, .life-card, .contact-content, .contact-footer"),
  ];
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index * 32, 260)}ms`);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
        if (entry.target.id) {
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: "-25% 0px -60%", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }

  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    let glowFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (glowFrame) return;
      glowFrame = window.requestAnimationFrame(() => {
        cursorGlow.style.setProperty("--cursor-x", `${pointerX}px`);
        cursorGlow.style.setProperty("--cursor-y", `${pointerY}px`);
        cursorGlow.classList.add("is-active");
        glowFrame = 0;
      });
    }, { passive: true });
    document.addEventListener("pointerleave", () => cursorGlow.classList.remove("is-active"));
  }

  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".project-card, .life-card, .profile-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty("--tilt-x", `${(x * 5).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(-y * 5).toFixed(2)}deg`);
        card.classList.add("is-tilting");
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
  }

})();
