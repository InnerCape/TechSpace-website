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

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
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

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero cursor spotlight + subtle parallax ---------- */
  var heroSection = document.querySelector('.hero');
  if (heroSection && !reducedMotion) {
    var heroFieldEl = heroSection.querySelector('.hero-field');
    var spotlightEl = heroSection.querySelector('.hero-spotlight');
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      if (spotlightEl) {
        spotlightEl.style.setProperty('--mx', x + 'px');
        spotlightEl.style.setProperty('--my', y + 'px');
      }
      if (heroFieldEl) {
        var relX = (x / rect.width - 0.5) * 14;
        var relY = (y / rect.height - 0.5) * 14;
        heroFieldEl.style.transform = 'translate(' + relX + 'px,' + relY + 'px)';
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

  /* ---------- WhatsApp tracking ---------- */
  var WA_NUMBER = '27677519907';
  var WA_BASE = 'https://wa.me/' + WA_NUMBER;

  var waMessages = {
    'nav-btn': function (page) {
      return 'Olá! Gostaria de solicitar um orçamento (página: ' + page + ').';
    },
    'pricing-presenca': function () {
      return 'Olá! Tenho interesse no Plano Presença Digital e gostaria de receber mais informações.';
    },
    'pricing-crescimento': function () {
      return 'Olá! Tenho interesse no Plano Crescimento Digital e gostaria de receber mais informações.';
    },
    'pricing-ecossistema': function () {
      return 'Olá! Tenho interesse no Plano Ecossistema Empresarial e gostaria de receber mais informações.';
    },
    'pricing-custom': function () {
      return 'Olá! Tenho interesse em um plano personalizado e gostaria de receber mais informações.';
    },
    'cta-section': function (page) {
      return 'Olá! Gostaria de solicitar um orçamento (página: ' + page + ').';
    },
    'sticky-whats': function (page) {
      return 'Olá! Gostaria de solicitar um orçamento (página: ' + page + ').';
    },
    'contact-card': function () {
      return 'Olá! Gostaria de solicitar um orçamento e receber mais informações.';
    },
    'services-cta': function () {
      return 'Olá! Tenho interesse em construir um projeto e gostaria de receber mais informações.';
    }
  };

  function getPageName() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var pageMap = {
      'index.html': 'Início',
      'Criacao de site.html': 'Criação de Sites',
      'Contato.html': 'Contato',
      'Portofolio.html': 'Portfólio'
    };
    return pageMap[path] || path.replace('.html', '');
  }

  function trackWAClick(e) {
    var link = e.currentTarget;
    var source = link.getAttribute('data-wa-source');
    if (!source) return;

    e.preventDefault();
    var messageFn = waMessages[source];
    var page = getPageName();
    var text = messageFn ? messageFn(page) : 'Olá! Gostaria de solicitar um orçamento (página: ' + page + ').';
    var url = WA_BASE + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
  }

  document.querySelectorAll('[data-wa-source]').forEach(function (link) {
    link.addEventListener('click', trackWAClick);
  });

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