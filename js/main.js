/**
 * main.js
 * Dr. Alfredo Elías Alfaro Ramos — Personal Campaign Website
 *
 * ES2022 module. All DOM-dependent code runs after DOMContentLoaded.
 * No eval(), no innerHTML with untrusted content (SDD §8 Security).
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════════════════════
  // Sub-Task 2 — Navbar
  //   • Hamburger menu open / close toggle
  //   • IntersectionObserver scroll-spy → active nav link
  // ═══════════════════════════════════════════════════════════════════

  /* ── Hamburger toggle ─────────────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navDrawer = document.getElementById('nav-drawer');

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navDrawer.classList.toggle('open');

      // Swap icon between fa-bars (closed) and fa-xmark (open)
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars',  !isOpen);
        icon.classList.toggle('fa-xmark',  isOpen);
      }

      // Update ARIA state
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute(
        'aria-label',
        isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
      );
      navDrawer.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close drawer when any drawer link is clicked (mobile UX)
    navDrawer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('open');

        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        navDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ── IntersectionObserver scroll-spy ─────────────────────────────── */
  const sections = document.querySelectorAll('main section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (sections.length && allNavLinks.length) {
    const setActive = (id) => {
      allNavLinks.forEach((link) => {
        const matches = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', matches);
      });
    };

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -60% 0px', // section must occupy top 40% of viewport
        threshold: 0,
      }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }


  // ═══════════════════════════════════════════════════════════════════
  // Sub-Task 3 — Hero Section (Swiper #inicio)
  // ═══════════════════════════════════════════════════════════════════

  /* ── Hero Swiper ──────────────────────────────────────────────────── */
  if (document.getElementById('hero-swiper')) {
    new Swiper('#hero-swiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      a11y: {
        prevSlideMessage: 'Diapositiva anterior',
        nextSlideMessage: 'Diapositiva siguiente',
      },
      keyboard: {
        enabled: true,
      },
    });
  }


  // ═══════════════════════════════════════════════════════════════════
  // Sub-Task 4 — About Me — Stat Counter Animation
  //   • IntersectionObserver on .about__stats
  //   • requestAnimationFrame count-up from 0 → target (ease-out, ~1500 ms)
  //   • Observer disconnects after first trigger so it fires only once
  // ═══════════════════════════════════════════════════════════════════

  const statsRow = document.querySelector('.about__stats');

  if (statsRow) {
    /**
     * Animate a single counter element from 0 to its data-target value.
     * Uses an ease-out curve: progress = 1 - (1 - t)^3
     * @param {HTMLElement} el   - the .stat-number element
     * @param {number}      duration - animation duration in ms
     */
    const animateCounter = (el, duration) => {
      const target  = parseInt(el.dataset.target, 10);
      const start   = performance.now();

      const tick = (now) => {
        const elapsed  = now - start;
        const t        = Math.min(elapsed / duration, 1);          // 0 → 1
        const eased    = 1 - Math.pow(1 - t, 3);                   // ease-out cubic
        const current  = Math.round(eased * target);

        el.textContent = current;

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target; // ensure exact final value
        }
      };

      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect(); // fire once only
            statsRow.querySelectorAll('.stat-number').forEach((numEl) => {
              animateCounter(numEl, 1500);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    counterObserver.observe(statsRow);
  }


  // ═══════════════════════════════════════════════════════════════════
  // Sub-Task 5 — Achievements Carousel (Swiper #logros)
  // ═══════════════════════════════════════════════════════════════════
  if (document.querySelector('#logros-swiper')) {
    new Swiper('#logros-swiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: '#logros-swiper .swiper-button-next',
        prevEl: '#logros-swiper .swiper-button-prev',
      },
      breakpoints: {
        640:  { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
      a11y: {
        prevSlideMessage: 'Logro anterior',
        nextSlideMessage: 'Logro siguiente',
      },
    });
  }


  // ═══════════════════════════════════════════════════════════════════
  // Sub-Task 6 — Research, Teaching, Community Work
  //   • No JS needed for static grid / timeline / blockquote
  // ═══════════════════════════════════════════════════════════════════


  // ═══════════════════════════════════════════════════════════════════
  // Sub-Task 7 — Publications Accordion + Awards Carousel (Swiper #premios)
  //   • Accordion: classList.toggle on each <details>-like element
  //   • new Swiper('#premios-swiper', { navigation arrows, loop })
  // ═══════════════════════════════════════════════════════════════════

  /* ── Publications Accordion ──────────────────────────────────────── */
  document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const group = trigger.closest('.accordion-group');
      const isOpen = group.classList.contains('open');

      // Close all groups
      document.querySelectorAll('.accordion-group').forEach((g) => {
        g.classList.remove('open');
        g.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });

      // If it was closed, open this one
      if (!isOpen) {
        group.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Awards Swiper ────────────────────────────────────────────────── */
  if (document.getElementById('premios-swiper')) {
    new Swiper('#premios-swiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: '#premios-swiper .swiper-button-next',
        prevEl: '#premios-swiper .swiper-button-prev',
      },
      breakpoints: {
        640:  { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
      a11y: {
        prevSlideMessage: 'Premio anterior',
        nextSlideMessage: 'Premio siguiente',
      },
    });
  }


  // ═══════════════════════════════════════════════════════════════════
  // Sub-Task 8 — Contact Form (Formspree)
  //   • fetch POST to Formspree endpoint
  //   • Inline success / error feedback — no page reload
  // ═══════════════════════════════════════════════════════════════════

  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Enviando…';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          status.textContent = '¡Mensaje enviado! Gracias por contactarme.';
          status.className = 'form-status form-status--success';
          form.reset();
        } else {
          throw new Error('server');
        }
      } catch {
        status.textContent = 'Ocurrió un error. Por favor, intente de nuevo.';
        status.className = 'form-status form-status--error';
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensaje';
      }
    });
  }


  // ═══════════════════════════════════════════════════════════════════
  // Sub-Task 9 — Scroll-Reveal Animations
  //   • IntersectionObserver adds .visible class to each .reveal element
  //   • CSS transition defined in styles.css (.reveal / .reveal.visible)
  //   • Each element is unobserved after first reveal (animate once)
  // ═══════════════════════════════════════════════════════════════════

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

}); // end DOMContentLoaded
