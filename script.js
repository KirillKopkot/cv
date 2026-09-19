(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile nav toggle */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Theme toggle: explicit choice persisted, otherwise follow OS preference */
  var themeToggle = document.getElementById("themeToggle");
  var root = document.documentElement;
  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem("cv-theme");
  } catch (e) {
    /* localStorage unavailable (private mode, etc.) — fall back to OS preference */
  }
  if (storedTheme === "light" || storedTheme === "dark") {
    root.setAttribute("data-theme", storedTheme);
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(storedTheme === "dark"));
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var isDark = current ? current === "dark" : prefersDark;
      var next = isDark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      themeToggle.setAttribute("aria-pressed", String(next === "dark"));
      try {
        localStorage.setItem("cv-theme", next);
      } catch (e) {
        /* ignore persistence failures */
      }
    });
  }

  /* Scroll-reveal + active nav link highlighting */
  var sections = document.querySelectorAll(".section, .hero");
  var navLinks = document.querySelectorAll(".nav__link");

  if (prefersReducedMotion) {
    sections.forEach(function (section) {
      section.classList.add("is-visible");
    });
  } else if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    sections.forEach(function (section) {
      revealObserver.observe(section);
    });
  } else {
    sections.forEach(function (section) {
      section.classList.add("is-visible");
    });
  }

  if ("IntersectionObserver" in window && navLinks.length) {
    var navSections = document.querySelectorAll("main .section, .footer");
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-50% 0px -45% 0px" }
    );
    navSections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
