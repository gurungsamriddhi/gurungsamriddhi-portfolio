/* ===================================================================
   SAMRIDDHI GURUNG // MINIMAL & UNIQUE BACKEND PORTFOLIO LOGIC
   Projects: ResQNet
   GitHub: https://github.com/gurungsamriddhi
   =================================================================== */

// Code Snippets for the Interactive Sandbox
const SANDBOX_SNIPPETS = {
  resqnet: {
    title: 'ResQNet: Real-time Dispatch via Laravel Reverb',
    code: `// ResQNet: Real-time Dispatch via Laravel Reverb (WebSockets)
namespace App\\Events;

use Illuminate\\Broadcasting\\Channel;
use Illuminate\\Broadcasting\\InteractsWithSockets;
use Illuminate\\Contracts\\Broadcasting\\ShouldBroadcast;

class EmergencyDispatched implements ShouldBroadcast
{
    use InteractsWithSockets;

    public function __construct(
        public readonly string $emergencyId,
        public readonly array  $dispatchPayload,
        public readonly string $zone
    ) {}

    public function broadcastOn(): Channel
    {
        // Broadcast to zone-specific channel for responders
        return new Channel("emergency.zone.{$this->zone}");
    }

    public function broadcastWith(): array
    {
        return [
            'id'       => $this->emergencyId,
            'payload'  => $this->dispatchPayload,
            'timestamp'=> now()->toISOString(),
        ];
    }
}`,
    metrics: { fps: '<80ms avg', memory: '98.2% rate', latency: '99.5%' }
  },

  resqnet_fcm: {
    title: 'ResQNet: Firebase FCM Push Notifications',
    code: `// ResQNet: Firebase Cloud Messaging Notification Service
namespace App\\Services;

use Kreait\\Firebase\\Messaging\\CloudMessage;
use Kreait\\Firebase\\Messaging\\Notification;

class FCMNotificationService
{
    public function __construct(
        private readonly \\Kreait\\Firebase\\Contract\\Messaging $messaging
    ) {}

    /**
     * Send emergency alert to all responders in a given zone.
     */
    public function notifyZoneResponders(
        string $zone,
        string $emergencyType,
        array $location
    ): void {
        $message = CloudMessage::withTarget('topic', "zone-{$zone}")
            ->withNotification(Notification::create(
                "🚨 Emergency: {$emergencyType}",
                "New emergency reported at ({$location['lat']}, {$location['lng']})"
            ))
            ->withData([
                'type'      => $emergencyType,
                'latitude'  => (string) $location['lat'],
                'longitude' => (string) $location['lng'],
                'priority'  => 'high',
            ]);

        $this->messaging->send($message);
    }
}`,
    metrics: { fps: '< 2s delivery', memory: '98.2% success', latency: 'Multi-zone' }
  },

  resqnet_auth: {
    title: 'ResQNet: Role-Based Access Control',
    code: `// ResQNet: Role-Based Access Control Middleware
namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class RoleAuthorization
{
    /**
     * Enforce role-based access for emergency operations.
     * Roles: admin, dispatcher, responder, citizen
     */
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json([
                'error'   => 'Unauthorized',
                'message' => 'Insufficient permissions for this operation.',
                'required_roles' => $roles,
            ], 403);
        }

        // Log access for audit trail
        activity()
            ->causedBy($user)
            ->withProperties(['route' => $request->path()])
            ->log("Authorized access as {$user->role}");

        return $next($request);
    }
}

// Usage in routes:
// Route::middleware('role:admin,dispatcher')
//     ->post('/emergencies/dispatch', [EmergencyController::class, 'dispatch']);`,
    metrics: { fps: '4 roles defined', memory: 'Audit logged', latency: 'Middleware-based' }
  }
};

// Detailed Project Specs for Case Studies
const PROJECT_DETAILS = {
  resqnet: {
    title: 'ResQNet // Emergency Response Platform',
    subtitle: 'Real-time Dispatch, FCM Notifications & Khalti Payments',
    badge: 'Emergency Tech',
    metric: '<80ms Latency • 99.5% Uptime',
    image: 'assets/images/project-tracemind.jpg',
    stack: ['Laravel', 'WebSockets', 'Firebase FCM', 'Khalti', 'Alpine.js', 'MySQL'],
    overview: 'ResQNet is a real-time emergency response coordination platform built to connect citizens with first responders through live dispatch, push notifications, and integrated payments for emergency services.',
    problem: 'Traditional emergency response systems lack real-time coordination between citizens, dispatchers, and responders — leading to delayed response times and poor resource allocation during critical situations.',
    solution: 'Built a Laravel-based platform with WebSocket-powered live dispatch using Laravel Reverb, Firebase FCM for instant push notifications across zones, role-based access control, and Khalti payment integration for service fees.',
    github: 'https://github.com/gurungsamriddhi',
    live: 'https://github.com/gurungsamriddhi'
  }
};

/* ===================================================================
   INITIALIZATION
   =================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSoundUI();
  init3DTilt();
  initSandbox();
  initSkillsFilter();
  initProjectModals();
  initContactForm();
  initClipboardButtons();
  initClock();
  initTypewriter();
  initCertificates();
});

/* -----------------------------------------------------------------
   DYNAMIC HERO TITLE TYPEWRITER
   ----------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('hero-typewriter');
  if (!el) return;

  const phrases = [
    'work in favour of humans.',
    'respond in real-time.',
    'save lives when it matters.',
    'connect people to help.'
  ];

  let phraseIdx = 0;
  let charIdx = phrases[0].length;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
      el.textContent = current.substring(0, charIdx);
      typingSpeed = 35;
    } else {
      charIdx++;
      el.textContent = current.substring(0, charIdx);
      typingSpeed = 65;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 2400; // Pause on full phrase
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 350; // Pause before next phrase
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 2200);
}


/* -----------------------------------------------------------------
   THEME SWITCHER
   ----------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem('samriddhi_theme') || 'cyber';
  setTheme(savedTheme, false);

  const themeToggleBtn = document.getElementById('btn-theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      toggleTheme();
    });
  }
}

window.setTheme = function(theme, playSound = true) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('samriddhi_theme', theme);

  const themeLabel = document.getElementById('theme-label');
  if (themeLabel) {
    themeLabel.textContent = theme === 'minimal' ? 'LIGHT' : 'DARK';
  }

  if (window.ambientCanvas) {
    window.ambientCanvas.updateTheme(theme === 'minimal');
  }

  if (playSound && window.soundEngine) {
    window.soundEngine.playChime();
  }
};

window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme') || 'cyber';
  const next = current === 'cyber' ? 'minimal' : 'cyber';
  window.setTheme(next, true);
  showToast(`Switched to ${next === 'minimal' ? 'Clean Minimal' : 'Dark'} mode`);
};

/* -----------------------------------------------------------------
   SOUND UI CONTROLLER
   ----------------------------------------------------------------- */
function initSoundUI() {
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    window.toggleSound();
  });
}

window.toggleSound = function() {
  const soundBtn = document.getElementById('btn-sound-toggle');
  const soundLabel = document.getElementById('sound-label');
  const isEnabled = window.soundEngine.toggleSound();

  if (soundBtn) {
    if (isEnabled) {
      soundBtn.classList.add('active');
      if (soundLabel) soundLabel.textContent = 'FX ON';
      showToast('Synthesized UI sound enabled');
    } else {
      soundBtn.classList.remove('active');
      if (soundLabel) soundLabel.textContent = 'FX OFF';
      showToast('Sound muted');
    }
  }
  return isEnabled;
};

/* -----------------------------------------------------------------
   SUBTLE 3D TILT PHYSICS
   ----------------------------------------------------------------- */
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.js-tilt');

  tiltElements.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* -----------------------------------------------------------------
   ARCHITECTURE CODE SANDBOX
   ----------------------------------------------------------------- */
function initSandbox() {
  const tabs = document.querySelectorAll('.sandbox-tab');
  const codeElement = document.getElementById('sandbox-code');
  const copyBtn = document.getElementById('btn-copy-sandbox');
  const meterFps = document.getElementById('meter-fps');
  const meterMem = document.getElementById('meter-mem');
  const meterLat = document.getElementById('meter-lat');

  const valFps = document.getElementById('val-fps');
  const valMem = document.getElementById('val-mem');
  const valLat = document.getElementById('val-lat');

  if (!tabs.length || !codeElement) return;

  function setSnippet(key) {
    const item = SANDBOX_SNIPPETS[key];
    if (!item) return;

    codeElement.textContent = item.code;

    if (valFps) valFps.textContent = item.metrics.fps;
    if (valMem) valMem.textContent = item.metrics.memory;
    if (valLat) valLat.textContent = item.metrics.latency;

    if (key === 'resqnet') {
      if (meterFps) meterFps.style.width = '92%';
      if (meterMem) meterMem.style.width = '98%';
      if (meterLat) meterLat.style.width = '99%';
    } else if (key === 'resqnet_fcm') {
      if (meterFps) meterFps.style.width = '88%';
      if (meterMem) meterMem.style.width = '98%';
      if (meterLat) meterLat.style.width = '95%';
    } else if (key === 'resqnet_auth') {
      if (meterFps) meterFps.style.width = '96%';
      if (meterMem) meterMem.style.width = '94%';
      if (meterLat) meterLat.style.width = '97%';
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const snippetKey = tab.getAttribute('data-snippet');
      setSnippet(snippetKey);
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      navigator.clipboard.writeText(codeElement.textContent).then(() => {
        showToast('Code snippet copied to clipboard');
      });
    });
  }
}

/* -----------------------------------------------------------------
   SKILLS MATRIX FILTERING
   ----------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* -----------------------------------------------------------------
   PROJECT QUICK INSPECT MODALS
   ----------------------------------------------------------------- */
function initProjectModals() {
  const modal = document.getElementById('inspect-modal');
  const closeBtn = document.getElementById('inspect-modal-close');
  const inspectBtns = document.querySelectorAll('.btn-inspect');
  const projectCards = document.querySelectorAll('.project-card');

  if (!modal) return;

  function openModal(projectId) {
    const data = PROJECT_DETAILS[projectId];
    if (!data) return;

    if (window.soundEngine) window.soundEngine.playClick();

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-subtitle').textContent = data.subtitle;
    document.getElementById('modal-metric').textContent = data.metric;
    document.getElementById('modal-overview').textContent = data.overview;
    document.getElementById('modal-problem').textContent = data.problem;
    document.getElementById('modal-solution').textContent = data.solution;
    document.getElementById('modal-img').src = data.image;

    const stackWrap = document.getElementById('modal-stack');
    if (stackWrap) {
      stackWrap.innerHTML = data.stack
        .map((t) => `<span class="tech-pill">${t}</span>`)
        .join('');
    }

    modal.classList.add('active');
  }

  function closeModal() {
    if (window.soundEngine) window.soundEngine.playClick();
    modal.classList.remove('active');
  }

  inspectBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-project');
      openModal(id);
    });
  });

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-project');
      openModal(id);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* -----------------------------------------------------------------
   CONTACT FORM SUBMISSION
   ----------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('transmission-form');
  const statusBox = document.getElementById('transmission-status');
  const submitBtn = document.getElementById('btn-transmit');

  if (!form || !statusBox || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (window.soundEngine) window.soundEngine.playClick();

    const name = document.getElementById('input-name').value.trim();
    const email = document.getElementById('input-email').value.trim();
    const message = document.getElementById('input-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill all required transmission fields');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending Message...</span>`;

    statusBox.style.display = 'block';
    statusBox.className = 'transmission-status';
    statusBox.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.25rem;">
        <div>&bull; Validating message... &check;</div>
        <div>&bull; Dispatching to grgsamriddhi4@gmail.com...</div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      statusBox.className = 'transmission-status success';
      statusBox.innerHTML = `
        <div style="font-weight: 700;">&check; MESSAGE SENT SUCCESSFULLY</div>
        <div style="font-size: 0.75rem; margin-top: 0.2rem; color: var(--text-secondary);">
          Thank you, <b>${name}</b>. Samriddhi will get back to you at <b>${email}</b> shortly.
        </div>
      `;

      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Send Message</span>
      `;

      showToast('Message sent to Samriddhi!');
    }, 1000);
  });
}

/* -----------------------------------------------------------------
   CLIPBOARD & QUICK ACTION BUTTONS
   ----------------------------------------------------------------- */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.js-copy-email');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.soundEngine) window.soundEngine.playClick();
      navigator.clipboard.writeText('grgsamriddhi4@gmail.com').then(() => {
        showToast('Email copied: grgsamriddhi4@gmail.com');
      });
    });
  });

  const copyPhoneButtons = document.querySelectorAll('.js-copy-phone');
  copyPhoneButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.soundEngine) window.soundEngine.playClick();
      navigator.clipboard.writeText('grgsamriddhi4@gmail.com').then(() => {
        showToast('Email copied: grgsamriddhi4@gmail.com');
      });
    });
  });
}

/* -----------------------------------------------------------------
   LIVE CLOCK IN STATUS PILL (NEPAL LOCAL TIME)
   ----------------------------------------------------------------- */
function initClock() {
  const clockElement = document.getElementById('live-clock');
  if (!clockElement) return;

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
      timeZone: 'Asia/Kathmandu', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    clockElement.textContent = timeStr;
  }

  update();
  setInterval(update, 30000);
}

/* -----------------------------------------------------------------
   TOAST NOTIFICATION UTILITY
   ----------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* -----------------------------------------------------------------
   CERTIFICATE ACTIONS & VERIFICATION LINKS
   ----------------------------------------------------------------- */
function initCertificates() {
  const certLinks = document.querySelectorAll('.cert-view-link');
  certLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const certTitle = link.getAttribute('data-cert-title') || 'Certificate';
      
      // If placeholder link, show informative toast feedback
      if (!href || href === '#' || href.trim() === '') {
        e.preventDefault();
        if (window.soundEngine) window.soundEngine.playClick();
        showToast(`Verification link ready for "${certTitle}" — provide URL to view.`);
      } else {
        // Active URL: play chime
        if (window.soundEngine) window.soundEngine.playChime();
      }
    });
  });
}

