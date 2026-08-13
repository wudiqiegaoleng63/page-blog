(() => {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("#site-nav");
  const menu = document.querySelector(".mobile-menu");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const navLinks = [...document.querySelectorAll("[data-nav-link]")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
    const icon = themeToggle?.querySelector(".theme-icon");
    if (icon) icon.textContent = theme === "dark" ? "☾" : "☼";
    try { localStorage.setItem("mica-theme", theme); } catch (_) { /* private mode */ }
  };

  let savedTheme = null;
  try { savedTheme = localStorage.getItem("mica-theme"); } catch (_) { /* private mode */ }
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

  const handleScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-25% 0px -60%", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  const contactLink = document.querySelector('a[href^="mailto:"]');
  const toast = document.querySelector("[data-toast]");
  let toastTimer;
  contactLink?.addEventListener("click", () => {
    if (!toast) return;
    toast.textContent = "邮件地址是演示内容，替换成你的联系方式即可。";
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  });
})();
