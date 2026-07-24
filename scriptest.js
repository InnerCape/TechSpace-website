document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  var root = document.documentElement;
  var savedTheme = localStorage.getItem('techspace-theme');

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (themeBtn) themeBtn.textContent = '☀️';
    } else {
      root.removeAttribute('data-theme');
      if (themeBtn) themeBtn.textContent = '🌙';
    }
  }

  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('techspace-theme', next);
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu');
  var navEl = document.querySelector('nav');

  function closeMenu() {
    if (menu) menu.classList.remove('show');
    if (menuBtn) { menuBtn.classList.remove('active'); menuBtn.setAttribute('aria-expanded', 'false'); }
    if (navEl) navEl.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.classList.toggle('show');
      menuBtn.classList.toggle('active', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      if (navEl) navEl.classList.toggle('show', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';
  var hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== 'undefined';

  if (hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  if (reducedMotion || !revealEls.length) {
    // No motion preference, or nothing to reveal — just show everything.
    revealEls.forEach(function (el) { el.classList.add('in-view'); });

  } else if (hasScrollTrigger) {
    document.body.classList.add('js-reveal');
    // GSAP-driven reveal: grouped by parent container so siblings
    // (service cards, pricing cards, trust items…) stagger together
    // instead of firing independently.
    var buckets = new Map();
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      if (!buckets.has(parent)) buckets.set(parent, []);
      buckets.get(parent).push(el);
    });

    buckets.forEach(function (els) {
      gsap.set(els, { opacity: 0, y: 26 });
      ScrollTrigger.batch(els, {
        start: 'top 87%',
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.1,
            onComplete: function () {
              batch.forEach(function (el) { el.classList.add('in-view'); });
            }
          });
        }
      });
    });

  } else {
    // GSAP not available — fall back to the original IntersectionObserver approach.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }
  }

  /* ---------- Hero entrance timeline ---------- */
  if (hasGSAP && !reducedMotion) {
    var heroContent = document.querySelector('.hero-content');
    var heroVisual = document.querySelector('.hero-visual');

    if (heroContent || heroVisual) {
      document.body.classList.add('js-reveal');
      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (heroContent) {
        gsap.set(heroContent.querySelectorAll('h1, .hero-lead, .hero-buttons'), { opacity: 0, y: 24 });
        tl.to(heroContent.querySelectorAll('h1'), { opacity: 1, y: 0, duration: 0.9 }, 0.1)
          .to(heroContent.querySelectorAll('.hero-lead'), { opacity: 1, y: 0, duration: 0.8 }, 0.3)
          .to(heroContent.querySelectorAll('.hero-buttons'), { opacity: 1, y: 0, duration: 0.8 }, 0.42);
        heroContent.classList.add('in-view');
      }

      if (heroVisual) {
        gsap.set(heroVisual, { opacity: 0, y: 30, scale: 0.98 });
        tl.to(heroVisual, { opacity: 1, y: 0, scale: 1, duration: 1 }, 0.35);
        heroVisual.classList.add('in-view');
      }
    }
  }

  /* ---------- Contact form (Contato.html) ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = document.getElementById('submitBtn');
      var btnText = document.getElementById('btnText');
      var loader = document.getElementById('loader');
      var popup = document.getElementById('successPopup');

      submitBtn.disabled = true;
      if (btnText) btnText.classList.add('hidden');
      if (loader) loader.classList.remove('hidden');

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            contactForm.reset();
            if (popup) popup.classList.remove('hidden');
          } else {
            alert('Não foi possível enviar sua mensagem. Tente novamente ou fale com a gente pelo WhatsApp.');
          }
        })
        .catch(function () {
          alert('Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente.');
        })
        .finally(function () {
          submitBtn.disabled = false;
          if (btnText) btnText.classList.remove('hidden');
          if (loader) loader.classList.add('hidden');
        });
    });
  }

  /* ---------- Scroll progress bar ---------- */
  var progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    var updateProgress = function () {
      var el = document.documentElement;
      var scrollTop = el.scrollTop || document.body.scrollTop;
      var scrollHeight = el.scrollHeight - el.clientHeight;
      var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Hero cursor spotlight + subtle parallax ---------- */
  var heroSection = document.querySelector('.hero');
  if (heroSection && !reducedMotion) {
    var spotlightEl = heroSection.querySelector('.hero-spotlight');
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      if (spotlightEl) {
        spotlightEl.style.setProperty('--mx', x + 'px');
        spotlightEl.style.setProperty('--my', y + 'px');
      }
    });
  }

  /* ---------- Count-up stats ---------- */
  var countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'), 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      if (reducedMotion || isNaN(target)) {
        el.textContent = prefix + target + suffix;
        return;
      }
      var duration = 1200;
      var start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = prefix + value + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + target + suffix;
        }
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      countEls.forEach(function (el) { countObserver.observe(el); });
    } else {
      countEls.forEach(function (el) { animateCount(el); });
    }
  }

  /* ---------- Sticky WhatsApp button ---------- */
  var whatsBtn = document.getElementById('stickyWhats');
  if (whatsBtn) {
    var toggleWhats = function () {
      if (window.scrollY > 500) {
        whatsBtn.classList.add('show');
      } else {
        whatsBtn.classList.remove('show');
      }
    };
    window.addEventListener('scroll', toggleWhats, { passive: true });
    toggleWhats();
  }

});

/* Global: closes the contact-form success popup (called via inline onclick) */
function closePopup() {
  var popup = document.getElementById('successPopup');
  if (popup) popup.classList.add('hidden');
}