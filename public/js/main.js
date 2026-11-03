/* ===================================================================
   SAMRIDDHI GURUNG — PORTFOLIO
   Shared by index.html and resqnet.html. No dependencies.
   =================================================================== */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initAmbientCanvas();
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
   AMBIENT BACKGROUND
   Particle constellation on <canvas id="canvas-ambient">, drawn in
   --accent-pink and --accent-blue. Particles drift, bounce off the
   viewport edges and move away from the mouse. Pauses while the tab is
   hidden; draws one still frame when reduced motion is requested.
   ----------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('canvas-ambient');
  if (!canvas || canvas.dataset.ready) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.dataset.ready = 'true';

  const MOUSE_RADIUS = 140;
  const PARTICLE_ALPHA = 0.65;
  const LINE_ALPHA = 0.55;
  const SPRITE_PX = 48;      // sprite canvas size, drawn at 2x
  const SPRITE_DOT_R = 3;    // dot radius in CSS px, the largest particle
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mouse = { x: null, y: null };

  let particles = [];
  let colors = [];
  let sprites = [];
  let width = 0;
  let height = 0;
  let maxDistance = 150;
  let frameId = null;
  let lastTime = 0;

  // Glow is pre-rendered: shadowBlur on every particle every frame is slow.
  const makeSprite = (color) => {
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = SPRITE_PX;
    const s = sprite.getContext('2d');
    s.fillStyle = s.shadowColor = color;
    s.shadowBlur = 16;
    s.beginPath();
    s.arc(SPRITE_PX / 2, SPRITE_PX / 2, SPRITE_DOT_R * 2, 0, Math.PI * 2);
    s.fill();
    return sprite;
  };

  const readColors = () => {
    const styles = getComputedStyle(document.documentElement);
    colors = ['--accent-pink', '--accent-blue'].map((name) => styles.getPropertyValue(name).trim());
    sprites = colors.map(makeSprite);
  };

  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
    pushX: 0,
    pushY: 0,
    size: Math.random() * 2 + 1,
    density: Math.random() * 20 + 5,
    group: particles.length % 2
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;

    // Keep particles in place proportionally, so a mobile address bar
    // collapsing doesn't reshuffle the whole field.
    if (width && height) {
      particles.forEach((p) => {
        p.x *= nextWidth / width;
        p.y *= nextHeight / height;
      });
    }
    width = nextWidth;
    height = nextHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    maxDistance = width < 768 ? 100 : 150;
    const count = Math.round(Math.min(80, Math.max(28, (width * height) / 18000)));
    while (particles.length < count) particles.push(createParticle());
    particles.length = count;

    if (frameId === null) draw();
  };

  // dt is in 60fps frames, so speed doesn't depend on the refresh rate.
  const step = (dt) => {
    const decay = Math.pow(0.9, dt);

    particles.forEach((p) => {
      if (mouse.x !== null) {
        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        if (dx === 0 && dy === 0) dx = 1;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * p.density * 0.04 * dt;
          p.pushX += (dx / dist) * force;
          p.pushY += (dy / dist) * force;
        }
      }

      p.pushX *= decay;
      p.pushY *= decay;
      p.x += (p.vx + p.pushX) * dt;
      p.y += (p.vy + p.pushY) * dt;

      if (p.x < 0 || p.x > width) {
        p.x = Math.max(0, Math.min(width, p.x));
        p.vx = p.x === 0 ? Math.abs(p.vx) : -Math.abs(p.vx);
        p.pushX = 0;
      }
      if (p.y < 0 || p.y > height) {
        p.y = Math.max(0, Math.min(height, p.y));
        p.vy = p.y === 0 ? Math.abs(p.vy) : -Math.abs(p.vy);
        p.pushY = 0;
      }
    });
  };

  const strokeSegment = (x1, y1, x2, y2, group) => {
    ctx.strokeStyle = colors[group];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 0.8;

    // A pink-to-blue pair is drawn half in each colour.
    const maxDistanceSq = maxDistance * maxDistance;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq >= maxDistanceSq) continue;

        ctx.globalAlpha = (1 - Math.sqrt(distSq) / maxDistance) * LINE_ALPHA;
        if (a.group === b.group) {
          strokeSegment(a.x, a.y, b.x, b.y, a.group);
        } else {
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          strokeSegment(a.x, a.y, midX, midY, a.group);
          strokeSegment(midX, midY, b.x, b.y, b.group);
        }
      }
    }

    ctx.globalAlpha = PARTICLE_ALPHA;
    particles.forEach((p) => {
      const half = (SPRITE_PX / 4) * (p.size / SPRITE_DOT_R);
      ctx.drawImage(sprites[p.group], p.x - half, p.y - half, half * 2, half * 2);
    });
  }

  const frame = (now) => {
    const dt = Math.min((now - lastTime) / (1000 / 60), 3);
    lastTime = now;
    step(dt);
    draw();
    frameId = requestAnimationFrame(frame);
  };

  const syncPlayback = () => {
    if (motion.matches || document.hidden) {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
      draw();
    } else if (frameId === null) {
      lastTime = performance.now();
      frameId = requestAnimationFrame(frame);
    }
  };

  readColors();
  resize();
  syncPlayback();

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', syncPlayback);
  motion.addEventListener('change', syncPlayback);

  // pointerType check: a tap on a touch screen shouldn't park a repelling
  // "cursor" on the page.
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  const clearMouse = () => { mouse.x = null; mouse.y = null; };
  document.documentElement.addEventListener('mouseleave', clearMouse);
  window.addEventListener('blur', clearMouse);

  new MutationObserver(() => {
    readColors();
    if (frameId === null) draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
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
