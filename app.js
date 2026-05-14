/* =========================================
   ИзиКлауд — app.js
   ========================================= */

// ── Sticky CTA ──────────────────────────────────────────────────────────────
const stickyCta = document.getElementById('stickyCta');
const heroSection = document.querySelector('.hero');

function updateSticky() {
  if (!stickyCta || !heroSection) return;
  const heroBottom = heroSection.getBoundingClientRect().bottom;
  if (heroBottom < 0) {
    stickyCta.classList.add('visible');
  } else {
    stickyCta.classList.remove('visible');
  }
}

window.addEventListener('scroll', updateSticky, { passive: true });
updateSticky();

// ── Hero region tab switch ───────────────────────────────────────────────────
function switchHeroTab(region) {
  const usaHero = document.getElementById('hprices-usa');
  const trHero  = document.getElementById('hprices-tr');

  const usaFull = document.getElementById('prices-usa');
  const trFull  = document.getElementById('prices-tr');

  const tabUsa  = document.getElementById('htab-usa');
  const tabTr   = document.getElementById('htab-tr');

  if (!usaHero || !trHero) return;

  // tabs
  tabUsa?.classList.remove('active');
  tabTr?.classList.remove('active');

  // hero toggle
  if (region === 'usa') {
    tabUsa?.classList.add('active');

    usaHero.classList.remove('hidden');
    trHero.classList.add('hidden');

    usaFull?.classList.remove('hidden');
    trFull?.classList.add('hidden');
  } else {
    tabTr?.classList.add('active');

    trHero.classList.remove('hidden');
    usaHero.classList.add('hidden');

    trFull?.classList.remove('hidden');
    usaFull?.classList.add('hidden');
  }

  // save selection (🔥 важно)
  localStorage.setItem('region', region);
}

// ── Ripple effect on clickable elements ─────────────────────────────────────
function addRipple(el) {
  el.style.position = el.style.position || 'relative';
  el.style.overflow = 'hidden';

  el.addEventListener('click', function (e) {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

document.querySelectorAll(
  '.hprice-card, .fpr-row, .btn-primary, .btn-secondary, .qcta-tg, .qcta-max, .sticky-btn-tg, .sticky-btn-max, .sub-item, .btn-nav'
).forEach(addRipple);

// ── Track clicks (Yandex Metrika) ────────────────────────────────────────────
function trackClick(goal) {
  if (typeof ym === 'function') {
    ym(108566033, 'reachGoal', goal);
  }
}

// ── FAQ smooth open/close ────────────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const summary = item.querySelector('summary');
  const body    = item.querySelector('.faq-body');
  if (!summary || !body) return;

  summary.addEventListener('click', e => {
    e.preventDefault();
    const isOpen = item.hasAttribute('open');

    // close all others
    document.querySelectorAll('.faq-item[open]').forEach(other => {
      if (other !== item) {
        const otherBody = other.querySelector('.faq-body');
        if (otherBody) {
          otherBody.style.maxHeight = '0';
          otherBody.style.opacity  = '0';
        }
        setTimeout(() => other.removeAttribute('open'), 260);
      }
    });

    if (isOpen) {
      body.style.maxHeight = '0';
      body.style.opacity   = '0';
      setTimeout(() => item.removeAttribute('open'), 260);
    } else {
      item.setAttribute('open', '');
      body.style.maxHeight = '0';
      body.style.opacity   = '0';
      requestAnimationFrame(() => {
        body.style.transition = 'max-height 0.28s ease, opacity 0.22s ease';
        body.style.maxHeight  = body.scrollHeight + 'px';
        body.style.opacity    = '1';
      });
    }
  });

  // init styles
  body.style.overflow   = 'hidden';
  body.style.transition = 'max-height 0.28s ease, opacity 0.22s ease';
  if (!item.hasAttribute('open')) {
    body.style.maxHeight = '0';
    body.style.opacity   = '0';
  }
});

// ── Scroll-reveal animation ──────────────────────────────────────────────────
function revealOnScroll() {
  const targets = document.querySelectorAll(
    '.feature-card, .how-step, .faq-item, .review-card, .fpr-row, .hprice-card, .sub-item, .tip-card'
  );

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  targets.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.4s ease ${(i % 6) * 60}ms, transform 0.4s ease ${(i % 6) * 60}ms`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'none';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(el => observer.observe(el));
}

revealOnScroll();

// ── Price cards hover glow (touch-friendly) ──────────────────────────────────
document.querySelectorAll('.hprice-card:not(.hprice-more)').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 8px 32px rgba(42,171,238,0.18)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

// ── Horizontal scroll drag (reviews & screenshots) ──────────────────────────
document.querySelectorAll('.reviews-scroll').forEach(el => {
  let isDown   = false;
  let startX   = 0;
  let scrollL  = 0;

  el.addEventListener('mousedown', e => {
    isDown  = true;
    startX  = e.pageX - el.offsetLeft;
    scrollL = el.scrollLeft;
    el.style.cursor = 'grabbing';
  });
  el.addEventListener('mouseleave', () => { isDown = false; el.style.cursor = ''; });
  el.addEventListener('mouseup',    () => { isDown = false; el.style.cursor = ''; });
  el.addEventListener('mousemove',  e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollL - walk;
  });
});

// ── Copy-to-clipboard toast for future use ───────────────────────────────────
function showToast(msg) {
  const existing = document.querySelector('.iz-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'iz-toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%) translateY(12px);
    background: rgba(42,171,238,0.95);
    color: #fff;
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 0.82rem;
    padding: 10px 20px;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    pointer-events: none;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(8px)';
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

// ── Counters animation (stats if added later) ────────────────────────────────
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  function update(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target).toLocaleString('ru');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Auto-highlight price row on hash ─────────────────────────────────────────
function highlightFromHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;
  setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.style.transition = 'box-shadow 0.3s';
    target.style.boxShadow  = '0 0 0 3px var(--tg, #2AABEE)';
    setTimeout(() => { target.style.boxShadow = ''; }, 1500);
  }, 400);
}
highlightFromHash();

// ── UTM persistence through Telegram links ───────────────────────────────────
function appendUTM() {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  if (!utmSource) return;

  document.querySelectorAll('a[href*="t.me/izicl0ud_bot"]').forEach(link => {
    try {
      const url = new URL(link.href);
      if (!url.searchParams.has('utm_source')) {
        url.searchParams.set('utm_source', utmSource);
        link.href = url.toString();
      }
    } catch (_) {}
  });
}
appendUTM();

// ── Mobile: add tap highlight feedback ──────────────────────────────────────
if ('ontouchstart' in window) {
  document.querySelectorAll('.fpr-row, .hprice-card, .sub-item').forEach(el => {
    el.addEventListener('touchstart', () => {
      el.style.opacity = '0.85';
    }, { passive: true });
    el.addEventListener('touchend', () => {
      setTimeout(() => { el.style.opacity = ''; }, 150);
    }, { passive: true });
  });
}

// ── Active nav link highlighting ─────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.footer-links a[href^="#"]');

function updateActiveNav() {
  const scrollY = window.scrollY + 80;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.footer-links a[href="#${id}"]`);
    if (!link) return;
    if (scrollY >= top && scrollY < top + height) {
      link.style.color = 'var(--tg)';
    } else {
      link.style.color = '';
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

// ── Expose globals ───────────────────────────────────────────────────────────
window.trackClick    = trackClick;
window.showToast     = showToast;
