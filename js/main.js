lucide.createIcons();

// Lets the stylesheet animate #mm past its own .hidden class. If this file
// never runs, .hidden keeps the menu closed exactly as before.
document.documentElement.classList.add('js-menu');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ---------------------------------------------------------------------------
// Consentimiento — Ley 1581 de 2012 (Colombia).
// Google Analytics no se carga hasta que el visitante acepta.
// ---------------------------------------------------------------------------
const GA_ID = 'G-0ZZJQ00T7D';
const CONSENT_KEY = 'apccore-consent';

const store = {
  get() {
    try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
  },
  set(v) {
    try { localStorage.setItem(CONSENT_KEY, v); } catch { /* modo privado */ }
  },
};

function loadAnalytics() {
  if (document.querySelector('script[data-ga]')) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const s = document.createElement('script');
  s.async = true;
  s.dataset.ga = '1';
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
}

const banner = document.getElementById('consentBanner');
if (banner) {
  if (store.get() === 'granted') {
    loadAnalytics();
  } else {
    banner.hidden = false;
  }

  const decide = (value) => {
    store.set(value);
    banner.hidden = true;
    if (value === 'granted') loadAnalytics();
  };

  document.getElementById('consentAccept')?.addEventListener('click', () => decide('granted'));
  document.getElementById('consentReject')?.addEventListener('click', () => decide('denied'));

  // Permite revocar el consentimiento más tarde (exigido por la Ley 1581).
  document.querySelectorAll('[data-consent-open]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      banner.hidden = false;
    });
  });
}

// ---------------------------------------------------------------------------
// Menú móvil
// ---------------------------------------------------------------------------
const mb = document.getElementById('mb');
const mm = document.getElementById('mm');

if (mb && mm) {
  mb.setAttribute('aria-controls', 'mm');
  mb.setAttribute('aria-expanded', 'false');
  mb.setAttribute('aria-label', 'Menú');

  const setOpen = (open) => {
    mm.classList.toggle('is-open', open);
    mb.setAttribute('aria-expanded', String(open));
    mb.setAttribute('aria-label', open ? 'Cerrar menú' : 'Menú');
  };

  mb.addEventListener('click', () => setOpen(!mm.classList.contains('is-open')));

  mm.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mm.classList.contains('is-open')) {
      setOpen(false);
      mb.focus();
    }
  });

  document.addEventListener('pointerdown', (e) => {
    if (!mm.classList.contains('is-open')) return;
    if (mm.contains(e.target) || mb.contains(e.target)) return;
    setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mm.classList.contains('is-open')) setOpen(false);
  });
}

// ---------------------------------------------------------------------------
// El overlay oscurece el fondo al hacer scroll. rAF-throttled y escrito
// directo — ver estilos.css: transicionar un valor ligado al scroll lo
//rezaga detrás del scrollbar.
// ---------------------------------------------------------------------------
const overlay = document.getElementById('scrollOverlay');
if (overlay) {
  const base = 0.4;
  const range = 0.52;
  let raf = 0;
  let last = -1;

  const paint = () => {
    raf = 0;
    const p = reduceMotion.matches ? 0.15 : Math.min(window.scrollY / window.innerHeight, 1);
    if (Math.abs(p - last) < 0.002) return;
    last = p;
    overlay.style.opacity = base + range * p;
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(paint);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  paint();
}

// ---------------------------------------------------------------------------
// Las tarjetas de servicios entran una vez, la primera vez que la cuadrícula
// llega al viewport. Sin estado oculto en CSS: si esto no corre, se quedan quietas.
// ---------------------------------------------------------------------------
const cards = document.querySelectorAll('#servicios article');
if (cards.length && 'IntersectionObserver' in window && !reduceMotion.matches) {
  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  cards.forEach((card, i) => {
    card.style.animationDelay = i * 40 + 'ms';
    io.observe(card);
  });
}