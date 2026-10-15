/* ===================================================================
   SUSHMA H S // MINIMAL & UNIQUE BACKEND PORTFOLIO LOGIC
   Projects: TraceMind, CVantage-AI, BulkApply, Legacy
   GitHub: https://github.com/sushmashivamadegowda
   =================================================================== */

// Code Snippets for the Interactive Sandbox
const SANDBOX_SNIPPETS = {
  tracemind: {
    title: 'TraceMind Distributed Trace & Span Collector',
    code: `# TraceMind: Distributed Tracing & AI Agent Observability
from fastapi import Request
import time
import uuid
from typing import Dict, Any

class TraceMindCollector:
    """
    Captures asynchronous microservice execution spans, 
    tracks dependency bottlenecks, and logs AI agent tool calls.
    """
    def __init__(self, service_name: str):
        self.service_name = service_name
        self.spans: Dict[str, Any] = {}

    async def trace_execution(self, trace_id: str, span_name: str):
        span_id = str(uuid.uuid4())[:8]
        start_time = time.perf_counter()
        
        # Simulated sub-service execution
        try:
            yield span_id
        finally:
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            self.spans[span_id] = {
                "trace_id": trace_id,
                "service": self.service_name,
                "span": span_name,
                "latency_ms": round(elapsed_ms, 2),
                "status": "HEALTHY" if elapsed_ms < 250 else "DEGRADED"
            }

tracer = TraceMindCollector("order-service")`,
    metrics: { fps: '214 ms P85', memory: '1,840 Traces/s', latency: '99.8% Uptime' }
  },

  cvantage: {
    title: 'CVantage-AI Semantic Candidate Match Engine',
    code: `# CVantage-AI: Semantic Resume Parsing & Vector Matching
import numpy as np
from pydantic import BaseModel, Field
from typing import List

class CandidateProfile(BaseModel):
    candidate_id: str
    skills: List[str]
    experience_years: float
    embedding_vector: List[float]

def compute_job_match(
    candidate: CandidateProfile, 
    job_embedding: np.ndarray,
    required_skills: set
) -> float:
    """
    Computes hybrid match score combining cosine similarity 
    over dense vector embeddings and normalized skill-set overlap.
    """
    cand_vec = np.array(candidate.embedding_vector)
    cosine_sim = np.dot(cand_vec, job_embedding) / (
        np.linalg.norm(cand_vec) * np.linalg.norm(job_embedding)
    )
    
    cand_skills = set(candidate.skills)
    skill_overlap = len(cand_skills & required_skills) / max(len(required_skills), 1)
    
    # 70% semantic embedding + 30% strict skill taxonomy
    total_score = (0.7 * cosine_sim) + (0.3 * skill_overlap)
    return round(float(total_score) * 100, 1)  # e.g., 94.0% match`,
    metrics: { fps: '94% Match Fit', memory: '1,847 Parsed', latency: '0.12s Analysis' }
  },

  bulkapply: {
    title: 'BulkApply Asynchronous Queue & Dispatch Engine',
    code: `# BulkApply: Distributed Application Queue Dispatcher
import asyncio
from typing import Dict, Any

class BulkApplyQueue:
    """
    Dispatches automated job applications across multiple 
    target boards with concurrency limits and anti-blocking jitter.
    """
    def __init__(self, max_concurrency: int = 5):
        self.queue = asyncio.Queue()
        self.semaphore = asyncio.Semaphore(max_concurrency)

    async def enqueue_application(self, job_meta: Dict[str, Any]):
        await self.queue.put(job_meta)

    async def worker(self, worker_id: int):
        while not self.queue.empty():
            job = await self.queue.get()
            async with self.semaphore:
                # Dispatch headless workflow with safe jitter
                print(f"[Worker-{worker_id}] Submitting to {job['portal']} for {job['title']}...")
                await asyncio.sleep(0.5)  # Anti-throttling rate limit
                self.queue.task_done()

# Verified 78.5% application success rate across 3,400+ submissions`,
    metrics: { fps: '78.5% Success', memory: '3,421 Processed', latency: '14 Channels' }
  }
};

// Detailed Project Specs for Case Studies
const PROJECT_DETAILS = {
  tracemind: {
    title: 'TraceMind // Distributed AI Observability',
    subtitle: 'Microservice Tracing & AI Agent Evaluation Platform',
    badge: 'Observability & Systems',
    metric: '214ms Latency • 99.8% Uptime',
    image: 'assets/images/project-tracemind.jpg',
    stack: ['Python', 'FastAPI', 'OpenTelemetry', 'PostgreSQL', 'Docker', 'Asyncio'],
    overview: 'TraceMind is a high-precision observability platform designed to monitor distributed backend microservices and track AI agent execution chains. It visualizes trace execution waterfalls, latency spikes, and error propagation in real-time.',
    problem: 'Diagnosing cascading latency bottlenecks and unpredictable agent tool calls across distributed microservices requires hours of manual log parsing without unified trace context.',
    solution: 'Built an asynchronous trace collector in FastAPI with OpenTelemetry standards, mapping parent-child execution spans into an interactive visual heatmap and timeline with sub-millisecond trace ingestion overhead.',
    github: 'https://github.com/sushmashivamadegowda',
    live: 'https://github.com/sushmashivamadegowda'
  },
  cvantage: {
    title: 'CVantage-AI // Candidate Intelligence Engine',
    subtitle: 'AI-Native Resume Parsing & Semantic Vector Matching',
    badge: 'AI & Data Engineering',
    metric: '94% Match Fit • 1,800+ Parsed',
    image: 'assets/images/project-cvantage.jpg',
    stack: ['Python', 'FastAPI', 'Pydantic v2', 'scikit-learn', 'Vector Embeddings', 'PostgreSQL'],
    overview: 'CVantage-AI automates candidate screening through AI-native resume parsing, skill ontology extraction, and semantic vector match ranking against technical job requirements.',
    problem: 'Keyword-based ATS parsers fail when resumes use diverse phrasing or synonyms, resulting in qualified engineers being filtered out erroneously.',
    solution: 'Engineered a dual-stage scoring architecture combining semantic embeddings with strict domain taxonomies, delivering candidate intelligence profiles with multi-dimensional radar metrics.',
    github: 'https://github.com/sushmashivamadegowda',
    live: 'https://github.com/sushmashivamadegowda'
  },
  bulkapply: {
    title: 'BulkApply // Automated Dispatch Engine',
    subtitle: 'High-Throughput Job Application Automation & Queue Pipeline',
    badge: 'Automation & Backend',
    metric: '78.5% Success • 3.4k Dispatched',
    image: 'assets/images/project-bulkapply.jpg',
    stack: ['Python', 'FastAPI', 'Playwright', 'Asyncio Queues', 'PostgreSQL', 'Docker'],
    overview: 'BulkApply is a distributed job application automation suite that coordinates concurrent headless browser pipelines across platforms like LinkedIn, Indeed, and Glassdoor with rate-limiting and session recovery.',
    problem: 'Applying to hundreds of job listings manually is repetitive and tedious, while crude automation bots frequently get rate-limited or blocked.',
    solution: 'Constructed an asynchronous worker queue utilizing adaptive delays, session persistence, and anti-detection mechanisms, achieving a verified 78.5% submission success rate across 3,400+ applications.',
    github: 'https://github.com/sushmashivamadegowda',
    live: 'https://github.com/sushmashivamadegowda'
  },
  legacy: {
    title: 'Legacy // Architecture Modernization Engine',
    subtitle: 'Schema Refactoring & Monolith-to-Microservices Migration',
    badge: 'Database & Architecture',
    metric: '94.1% Accuracy • 0.05% Drift',
    image: 'assets/images/project-legacy.jpg',
    stack: ['Python', 'Django', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'MySQL'],
    overview: 'Legacy provides automated schema refactoring workflows, migration flows, and backwards-compatible adapters to safely transition monolithic relational databases into decoupled microservice architectures.',
    problem: 'Refactoring tightly-coupled monolithic databases frequently introduces schema drift, breaking legacy API consumers and triggering downtime during service decomposition.',
    solution: 'Formulated a multi-stage migration pipeline with automated schema analysis, dual-write proxy adapters, and composite indexing, cutting migration risk with a negligible 0.05% drift rate.',
    github: 'https://github.com/sushmashivamadegowda',
    live: 'https://github.com/sushmashivamadegowda'
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
    'scale without friction.',
    'respond in sub-milliseconds.',
    'never fail under load.',
    'power intelligent agents.'
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
  const savedTheme = localStorage.getItem('sushma_theme') || 'cyber';
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
  localStorage.setItem('sushma_theme', theme);

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

    if (key === 'tracemind') {
      if (meterFps) meterFps.style.width = '92%';
      if (meterMem) meterMem.style.width = '88%';
      if (meterLat) meterLat.style.width = '98%';
    } else if (key === 'cvantage') {
      if (meterFps) meterFps.style.width = '94%';
      if (meterMem) meterMem.style.width = '92%';
      if (meterLat) meterLat.style.width = '96%';
    } else if (key === 'bulkapply') {
      if (meterFps) meterFps.style.width = '80%';
      if (meterMem) meterMem.style.width = '95%';
      if (meterLat) meterLat.style.width = '90%';
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
        <div>&bull; Validating schema with Pydantic... &check;</div>
        <div>&bull; Dispatching packet to hssushma2004@gmail.com...</div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.playSuccess();
      statusBox.className = 'transmission-status success';
      statusBox.innerHTML = `
        <div style="font-weight: 700;">&check; MESSAGE SENT SUCCESSFULLY</div>
        <div style="font-size: 0.75rem; margin-top: 0.2rem; color: var(--text-secondary);">
          Thank you, <b>${name}</b>. Sushma will get back to you at <b>${email}</b> shortly.
        </div>
      `;

      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Transmit Message to Sushma</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      `;

      showToast('Message sent to Sushma!');
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
      navigator.clipboard.writeText('hssushma2004@gmail.com').then(() => {
        showToast('Email copied: hssushma2004@gmail.com');
      });
    });
  });

  const copyPhoneButtons = document.querySelectorAll('.js-copy-phone');
  copyPhoneButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.soundEngine) window.soundEngine.playClick();
      navigator.clipboard.writeText('+918904261543').then(() => {
        showToast('Phone copied: +91-8904261543');
      });
    });
  });
}

/* -----------------------------------------------------------------
   LIVE CLOCK IN STATUS PILL (BENGALURU LOCAL TIME)
   ----------------------------------------------------------------- */
function initClock() {
  const clockElement = document.getElementById('live-clock');
  if (!clockElement) return;

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { 
      timeZone: 'Asia/Kolkata', 
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

