/* ===================================================================
   SAMRIDDHI GURUNG — PORTFOLIO
   Shared by index.html and resqnet.html. No dependencies.
   =================================================================== */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initActiveNav();
  initVideoPlayers();
  initReveal();
  initYear();
});

/* -----------------------------------------------------------------
   THEME
   The initial theme is applied by a small inline script in <head>
   (saved choice, else the OS preference) so the page never flashes.
   ----------------------------------------------------------------- */
const THEME_KEY = 'sg-theme';

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const sync = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    btn.setAttribute('aria-pressed', String(!isDark));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#0A0C11' : '#F7F8FB');
  };

  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
    sync();
  });

  sync();
}

/* -----------------------------------------------------------------
   MOBILE NAVIGATION
   ----------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* -----------------------------------------------------------------
   ACTIVE SECTION INDICATOR
   Highlights the nav link (or case-study TOC link) for the section
   currently in view. Links opt in with [data-spy] on their list.
   ----------------------------------------------------------------- */
function initActiveNav() {
  const lists = document.querySelectorAll('[data-spy]');
  if (!lists.length || !('IntersectionObserver' in window)) return;

  lists.forEach((list) => {
    const links = Array.from(list.querySelectorAll('a[href*="#"]'));
    const map = new Map();
    links.forEach((link) => {
      const id = link.getAttribute('href').split('#')[1];
      const section = id && document.getElementById(id);
      if (section) map.set(section, link);
    });
    if (!map.size) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.remove('is-active'));
        map.get(entry.target)?.classList.add('is-active');
      });
    }, { rootMargin: '-35% 0px -60% 0px' });

    map.forEach((_, section) => observer.observe(section));
  });
}

/* -----------------------------------------------------------------
   VIDEO PLAYER
   Markup: <div class="video-player" data-video ...>
     data-video-src     local file, e.g. assets/video/resqnet-demo.mp4
     data-video-poster  optional poster image for the local file
     data-video-embed   YouTube or Vimeo URL (used if no src is set)
     data-video-title   accessible title for the video / iframe
   With neither src nor embed set, the placeholder inside the element
   stays visible. See assets/video/README.md.
   ----------------------------------------------------------------- */
function initVideoPlayers() {
  document.querySelectorAll('[data-video]').forEach((player) => {
    const src = (player.dataset.videoSrc || '').trim();
    const embed = (player.dataset.videoEmbed || '').trim();
    const title = player.dataset.videoTitle || 'Demo video';

    if (src) {
      const video = document.createElement('video');
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('aria-label', title);
      if (player.dataset.videoPoster) video.poster = player.dataset.videoPoster;
      const source = document.createElement('source');
      source.src = src;
      source.type = src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
      video.appendChild(source);
      player.replaceChildren(video);
      return;
    }

    const embedUrl = embed && toEmbedUrl(embed);
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.title = title;
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      player.replaceChildren(iframe);
    }
  });
}

function toEmbedUrl(url) {
  let u;
  try { u = new URL(url); } catch (e) { return null; }
  const host = u.hostname.replace(/^www\./, '');

  if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    if (u.searchParams.get('v')) return `https://www.youtube-nocookie.com/embed/${u.searchParams.get('v')}`;
    const parts = u.pathname.split('/').filter(Boolean);
    if ((parts[0] === 'embed' || parts[0] === 'shorts') && parts[1]) {
      return `https://www.youtube-nocookie.com/embed/${parts[1]}`;
    }
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = u.pathname.split('/').filter(Boolean).find((p) => /^\d+$/.test(p));
    if (id) return `https://player.vimeo.com/video/${id}`;
  }
  return null;
}

/* -----------------------------------------------------------------
   REVEAL ON SCROLL (skipped when reduced motion is requested)
   ----------------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  items.forEach((el) => observer.observe(el));
}

/* -----------------------------------------------------------------
   FOOTER YEAR
   ----------------------------------------------------------------- */
function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}
