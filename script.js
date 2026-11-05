/* ==========================================================================
   Usman Arif — portfolio interactions
   Vanilla JS, no dependencies. Progressive enhancement only.
   ========================================================================== */
(function () {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Sticky header state ---------- */
  const header = $("#siteHeader");
  if (header) {
    const onScrollHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  const toggle = $("#navToggle");
  const menu   = $("#navMenu");

  const closeMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    header?.classList.remove("is-menu-open");
  };

  const openMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
    header?.classList.add("is-menu-open");
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    // Close after choosing a destination
    $$("a", menu).forEach((link) => link.addEventListener("click", closeMenu));

    // Close on Escape, return focus to the toggle
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        toggle.focus();
      }
    });

    // Close when tapping outside the panel
    document.addEventListener("click", (e) => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    // Reset state when resizing back to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");

  if (!revealEls.length) {
    // nothing to do
  } else if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ---------- Scroll-spy for nav highlighting ---------- */
  const navLinks = $$('.nav-menu > li > a[href^="#"]');
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = sections.find((s) => s.el === entry.target);
          if (!match) return;
          navLinks.forEach((l) => l.classList.remove("is-active"));
          match.link.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s.el));
  }

  /* ---------- Back to top ---------- */
  const toTop = $("#toTop");
  if (toTop) {
    const onScrollTop = () => {
      toTop.classList.toggle("is-visible", window.scrollY > 600);
    };
    onScrollTop();
    window.addEventListener("scroll", onScrollTop, { passive: true });
  }

  /* ---------- Subtle hero parallax (desktop, motion-safe only) ---------- */
  const heroBg = $(".hero-bg");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (heroBg && finePointer && !prefersReduced) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 700);
        heroBg.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Outbound link safety ---------- */
  $$('a[target="_blank"]').forEach((a) => {
    const rel = a.getAttribute("rel") || "";
    if (!rel.includes("noopener")) {
      a.setAttribute("rel", (rel + " noopener noreferrer").trim());
    }
  });
})();
