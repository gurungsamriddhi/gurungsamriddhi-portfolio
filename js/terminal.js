/* ===================================================================
   SUSHMA H S // MINIMAL & UNIQUE TERMINAL & COMMAND HUD
   GitHub: https://github.com/sushmashivamadegowda
   Projects: TraceMind, CVantage-AI, BulkApply, Legacy
   =================================================================== */

class TerminalEngine {
  constructor() {
    this.history = [];
    this.historyIndex = -1;
    this.commands = {
      'help': () => this.cmdHelp(),
      'whoami': () => this.cmdWhoami(),
      'projects': () => this.cmdProjects(),
      'skills': () => this.cmdSkills(),
      'certs': () => this.cmdCerts(),
      'cloud': () => this.cmdCerts(),
      'exp': () => this.cmdExp(),
      'timeline': () => this.cmdExp(),
      'git log': () => this.cmdGitLog(),
      'cat resume.md': () => this.cmdResume(),
      'contact': () => this.cmdContact(),
      'phone': () => this.cmdPhone(),
      'clear': () => this.cmdClear(),
      'theme': (arg) => this.cmdTheme(arg),
      'sound': (arg) => this.cmdSound(arg),
      'sudo': (arg) => this.cmdSudo(arg),
      'exit': () => this.toggleDrawer(false),
      'matrix': () => this.cmdMatrix()
    };

    this.init();
  }

  init() {
    this.initCommandPalette();
    this.initTerminalDrawer();
  }

  /* -----------------------------------------------------------------
     COMMAND PALETTE (CTRL+K)
     ----------------------------------------------------------------- */
  initCommandPalette() {
    const backdrop = document.getElementById('cmd-palette-backdrop');
    const input = document.getElementById('cmd-palette-input');
    const list = document.getElementById('cmd-palette-list');
    const triggerBtn = document.getElementById('btn-cmd-palette');

    if (!backdrop || !input || !list) return;

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.togglePalette();
      } else if (e.key === 'Escape' && backdrop.classList.contains('active')) {
        this.togglePalette(false);
      }
    });

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.togglePalette());
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.togglePalette(false);
    });

    input.addEventListener('input', () => {
      if (window.soundEngine) window.soundEngine.playKeypress();
      const query = input.value.toLowerCase().trim();
      const items = list.querySelectorAll('.cmd-item');
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
      });
    });

    input.addEventListener('keydown', (e) => {
      const visibleItems = Array.from(list.querySelectorAll('.cmd-item')).filter(
        (el) => el.style.display !== 'none'
      );
      if (!visibleItems.length) return;

      const activeIdx = visibleItems.findIndex((el) => el.classList.contains('selected'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (activeIdx + 1) % visibleItems.length;
        visibleItems.forEach((el) => el.classList.remove('selected'));
        visibleItems[nextIdx].classList.add('selected');
        visibleItems[nextIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (activeIdx - 1 + visibleItems.length) % visibleItems.length;
        visibleItems.forEach((el) => el.classList.remove('selected'));
        visibleItems[prevIdx].classList.add('selected');
        visibleItems[prevIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = visibleItems[activeIdx >= 0 ? activeIdx : 0];
        if (selected) {
          selected.click();
        }
      }
    });

    list.addEventListener('click', (e) => {
      const item = e.target.closest('.cmd-item');
      if (!item) return;

      const action = item.getAttribute('data-action');
      if (window.soundEngine) window.soundEngine.playClick();
      this.executePaletteAction(action);
      this.togglePalette(false);
    });
  }

  togglePalette(forceState) {
    const backdrop = document.getElementById('cmd-palette-backdrop');
    const input = document.getElementById('cmd-palette-input');
    if (!backdrop) return;

    const isActive = forceState !== undefined ? forceState : !backdrop.classList.contains('active');
    if (isActive) {
      backdrop.classList.add('active');
      if (input) {
        input.value = '';
        input.focus();
      }
      if (window.soundEngine) window.soundEngine.playClick();
    } else {
      backdrop.classList.remove('active');
    }
  }

  executePaletteAction(action) {
    switch (action) {
      case 'nav-projects':
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'nav-skills':
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'nav-certs':
        (document.getElementById('certs') || document.getElementById('certifications'))?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'nav-sandbox':
        document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'nav-experience':
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'nav-contact':
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'toggle-theme':
        window.toggleTheme();
        break;
      case 'toggle-sound':
        window.toggleSound();
        break;
      case 'open-terminal':
        this.toggleDrawer(true);
        break;
      case 'hire-me':
        this.cmdSudo('hire');
        break;
      default:
        break;
    }
  }

  /* -----------------------------------------------------------------
     CLI TERMINAL DRAWER
     ----------------------------------------------------------------- */
  initTerminalDrawer() {
    const drawer = document.getElementById('terminal-drawer');
    const input = document.getElementById('terminal-cmd-input');
    const closeBtn = document.getElementById('terminal-close-btn');
    const triggerBtns = document.querySelectorAll('.js-open-terminal');

    if (!drawer || !input) return;

    triggerBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        this.toggleDrawer();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        this.toggleDrawer(false);
      });
    }

    input.addEventListener('keydown', (e) => {
      if (window.soundEngine) window.soundEngine.playKeypress();

      if (e.key === 'Enter') {
        const cmdText = input.value.trim();
        if (cmdText) {
          this.history.push(cmdText);
          this.historyIndex = this.history.length;
          this.executeCLI(cmdText);
          input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        if (this.history.length && this.historyIndex > 0) {
          this.historyIndex--;
          input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          input.value = '';
        }
      }
    });
  }

  toggleDrawer(forceState) {
    const drawer = document.getElementById('terminal-drawer');
    const input = document.getElementById('terminal-cmd-input');
    if (!drawer) return;

    const isOpen = forceState !== undefined ? forceState : !drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.add('open');
      if (input) input.focus();
    } else {
      drawer.classList.remove('open');
    }
  }

  printOutput(htmlContent) {
    const outputArea = document.getElementById('terminal-output');
    if (!outputArea) return;

    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = htmlContent;
    outputArea.appendChild(line);

    const body = document.getElementById('terminal-drawer-body');
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  executeCLI(rawCmd) {
    this.printOutput(`<span style="color: var(--accent-emerald)">guest@sushma-backend:~$</span> ${this.escapeHtml(rawCmd)}`);

    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim().toLowerCase();

    const fullCmd = rawCmd.toLowerCase();

    if (this.commands[fullCmd]) {
      this.commands[fullCmd](arg);
    } else if (this.commands[cmd]) {
      this.commands[cmd](arg);
    } else {
      this.printOutput(
        `<span style="color: #f43f5e">Command not recognized: '${this.escapeHtml(rawCmd)}'. Type <span style="color: var(--accent-cyan)">'help'</span> for available commands.</span>`
      );
    }
  }

  /* -----------------------------------------------------------------
     CLI COMMAND HANDLERS
     ----------------------------------------------------------------- */
  cmdHelp() {
    this.printOutput(`
      <div style="margin: 0.35rem 0;">
        <span style="color: var(--accent-cyan); font-weight: bold;">AVAILABLE SYSTEM COMMANDS:</span><br>
        &bull; <span style="color: var(--accent-cyan)">whoami</span> - Identity, backend specialization & location<br>
        &bull; <span style="color: var(--accent-cyan)">projects</span> - View TraceMind, CVantage-AI, BulkApply, Legacy<br>
        &bull; <span style="color: var(--accent-cyan)">skills</span> - Python, FastAPI, PostgreSQL, SQLAlchemy, Docker<br>
        &bull; <span style="color: var(--accent-cyan)">certs / cloud</span> - View Cloud certifications section<br>
        &bull; <span style="color: var(--accent-cyan)">timeline / exp</span> - Smartborn, Varcons Technologies, Education<br>
        &bull; <span style="color: var(--accent-cyan)">git log</span> - Recent git commits and milestones<br>
        &bull; <span style="color: var(--accent-cyan)">cat resume.md</span> - Display full qualifications digest<br>
        &bull; <span style="color: var(--accent-cyan)">contact</span> - Output email & phone coordinates<br>
        &bull; <span style="color: var(--accent-cyan)">phone</span> - Print direct phone (+91-8904261543)<br>
        &bull; <span style="color: var(--accent-cyan)">theme [dark|light]</span> - Switch visual mode<br>
        &bull; <span style="color: var(--accent-cyan)">sound [on|off]</span> - Toggle Web Audio synthesizer<br>
        &bull; <span style="color: var(--accent-cyan)">sudo hire</span> - Direct developer hiring handshake<br>
        &bull; <span style="color: var(--accent-cyan)">clear</span> - Clear terminal buffer
      </div>
    `);
  }

  cmdWhoami() {
    this.printOutput(`
      <div style="margin: 0.35rem 0; line-height: 1.6;">
        <span style="color: var(--accent-cyan); font-weight: 700;">Sushma H S // Software Developer & Backend Specialist</span><br>
        Hands-on experience delivering production backend services using Python, FastAPI, Django, and PostgreSQL.<br>
        <span style="color: var(--text-muted)">Location: Bengaluru, India &bull; GitHub: github.com/sushmashivamadegowda</span>
      </div>
    `);
  }

  cmdProjects() {
    this.printOutput(`
      <div style="margin: 0.35rem 0;">
        <span style="color: var(--accent-cyan); font-weight: 700;">FEATURED PROJECTS:</span><br>
        [01] <b>TraceMind</b> &mdash; <i>FastAPI &bull; OpenTelemetry &bull; Python</i> [214ms P85, Distributed Tracing]<br>
        [02] <b>CVantage-AI</b> &mdash; <i>Python &bull; Vector Embeddings &bull; Pydantic</i> [94% Match Fit, Resume Intelligence]<br>
        [03] <b>BulkApply</b> &mdash; <i>Asyncio Queues &bull; Playwright &bull; FastAPI</i> [78.5% Success, 3.4k Dispatched]<br>
        [04] <b>Legacy</b> &mdash; <i>SQLAlchemy &bull; Django &bull; PostgreSQL</i> [Schema Modernization & Migration]
      </div>
    `);
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }

  cmdSkills() {
    this.printOutput(`
      <div style="margin: 0.35rem 0;">
        <span style="color: var(--accent-cyan); font-weight: 700;">TECHNICAL SKILLS:</span><br>
        &bull; <b>Languages:</b> Python, SQL, JavaScript (basics)<br>
        &bull; <b>Frameworks:</b> FastAPI, Django, Flask (beginner), SQLAlchemy, Pydantic, React<br>
        &bull; <b>Databases:</b> PostgreSQL, MySQL (schema design, indexing, query optimization, joins)<br>
        &bull; <b>Tools:</b> Git, GitHub, VS Code, Postman, Docker (basics), Agile/Scrum
      </div>
    `);
  }

  cmdCerts() {
    this.printOutput(`
      <div style="margin: 0.35rem 0;">
        <span style="color: var(--accent-cyan); font-weight: 700;">ANTHROPIC & CLAUDE CREDENTIALS:</span><br>
        &bull; <a href="https://verify.skilljar.com/c/baduj3uyjvqh" target="_blank" style="color: var(--text-bright); text-decoration: underline;">Model Context Protocol: Advanced Topics</a> (Sep 2026)<br>
        &bull; <a href="https://verify.skilljar.com/c/t8ymqrnvqk4q" target="_blank" style="color: var(--text-bright); text-decoration: underline;">Introduction to Model Context Protocol</a> (Sep 2026)<br>
        &bull; <a href="https://verify.skilljar.com/c/kozwjqcb6kjb" target="_blank" style="color: var(--text-bright); text-decoration: underline;">Introduction to subagents</a> (Sep 2026)<br>
        &bull; <a href="https://verify.skilljar.com/c/29kt8o9b7ui9" target="_blank" style="color: var(--text-bright); text-decoration: underline;">Introduction to agent skills</a> (Sep 2026)<br>
        &bull; <a href="https://verify.skilljar.com/c/cvrazcsieq4p" target="_blank" style="color: var(--text-bright); text-decoration: underline;">Claude Code in Action</a> (Sep 2026)<br>
        &bull; <a href="https://verify.skilljar.com/c/9qfp3q85p48y" target="_blank" style="color: var(--text-bright); text-decoration: underline;">Claude Code 101</a> (Sep 2026)<br>
        &bull; <a href="https://verify.skilljar.com/c/fuxumghauqot" target="_blank" style="color: var(--text-bright); text-decoration: underline;">Building with the Claude API</a> (Sep 2026)<br>
        &bull; <a href="https://verify.skilljar.com/c/94yk9bt8kce9" target="_blank" style="color: var(--text-bright); text-decoration: underline;">Claude Platform 101</a> (Aug 2026)<br>
        &bull; <a href="https://verify.skilljar.com/c/52q673gqp9hj" target="_blank" style="color: var(--text-bright); text-decoration: underline;">Claude 101</a> (Aug 2026)<br>
        <span style="color: var(--accent-emerald); font-size: 0.72rem;">&check; Official Skilljar certificates verified. Click to open certificate.</span>
      </div>
    `);
    const target = document.getElementById('certs') || document.getElementById('certifications');
    target?.scrollIntoView({ behavior: 'smooth' });
  }

  cmdExp() {
    this.printOutput(`
      <div style="margin: 0.35rem 0;">
        <span style="color: var(--accent-cyan); font-weight: 700;">CAREER EXPERIENCE:</span><br>
        &bull; <b>Software Developer @ Smartborn</b> (Jun 2026 &mdash; Present) &bull; FastAPI, PostgreSQL, 40% API speedup<br>
        &bull; <b>Software Developer Intern @ Smartborn</b> (Dec 2025 &mdash; Jun 2026) &bull; 5+ features, 30+ bugs resolved<br>
        &bull; <b>Tech Intern @ Varcons Technologies</b> (Jan 2025 &mdash; Apr 2025) &bull; 35% refactoring & SQL optimization<br>
        &bull; <b>B.E. in Computer Science & Engineering</b> &mdash; Dr. SMCE, Nelamangala (CGPA: 8.1/10)
      </div>
    `);
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
  }

  cmdGitLog() {
    this.printOutput(`
      <div style="margin: 0.35rem 0; font-family: var(--font-mono); font-size: 0.78rem;">
        <span style="color: #fbbf24">commit 7a91d2c</span> (HEAD -&gt; <span style="color: var(--accent-cyan)">main</span>)<br>
        Author: Sushma H S &lt;hssushma2004@gmail.com&gt;<br>
        Date:   Thu Oct 15 2026<br><br>
        &nbsp;&nbsp;&nbsp;&nbsp;feat(tracemind): implement distributed OpenTelemetry execution span tracker<br><br>
        <span style="color: #fbbf24">commit 4e82b01</span><br>
        Author: Sushma H S &lt;hssushma2004@gmail.com&gt;<br>
        Date:   Sun Oct 04 2026<br><br>
        &nbsp;&nbsp;&nbsp;&nbsp;feat(cvantage-ai): optimize vector cosine similarity scoring across 1.8k candidate resumes
      </div>
    `);
  }

  cmdResume() {
    this.printOutput(`
      <div style="margin: 0.35rem 0; border-left: 2px solid var(--accent-cyan); padding-left: 0.75rem;">
        <span style="color: var(--accent-cyan); font-weight: bold;">SUSHMA H S &mdash; RESUME SUMMARY</span><br>
        Software Developer | Python &bull; FastAPI &bull; PostgreSQL &bull; Django<br>
        Location: Bengaluru, India &bull; Phone: +91-8904261543 &bull; Email: hssushma2004@gmail.com<br>
        Education: B.E. in CSE, Dr. SMCE (CGPA: 8.1/10)<br>
        GitHub: <a href="https://github.com/sushmashivamadegowda" target="_blank" style="color: var(--accent-cyan)">github.com/sushmashivamadegowda</a>
      </div>
    `);
  }

  cmdContact() {
    this.printOutput(`
      <div style="margin: 0.35rem 0;">
        <span style="color: var(--accent-cyan); font-weight: 700;">CHANNELS:</span><br>
        &bull; Email: <a href="mailto:hssushma2004@gmail.com" style="color: var(--accent-cyan)">hssushma2004@gmail.com</a><br>
        &bull; Phone: <span style="color: var(--accent-emerald)">+91-8904261543</span><br>
        &bull; GitHub: <a href="https://github.com/sushmashivamadegowda" target="_blank" style="color: var(--accent-cyan)">github.com/sushmashivamadegowda</a><br>
        &bull; LinkedIn: <a href="https://linkedin.com/in/sushmahs" target="_blank" style="color: var(--accent-cyan)">linkedin.com/in/sushmahs</a>
      </div>
    `);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  cmdPhone() {
    this.printOutput(`
      <div style="margin: 0.35rem 0;">
        <span style="color: var(--accent-emerald); font-weight: 700;">Direct Phone:</span> +91-8904261543
      </div>
    `);
  }

  cmdClear() {
    const outputArea = document.getElementById('terminal-output');
    if (outputArea) outputArea.innerHTML = '';
  }

  cmdTheme(mode) {
    if (mode === 'light' || mode === 'minimal') {
      window.setTheme('minimal');
      this.printOutput(`<span style="color: var(--accent-cyan)">Theme switched to Light Minimal mode.</span>`);
    } else {
      window.setTheme('cyber');
      this.printOutput(`<span style="color: var(--accent-cyan)">Theme switched to Dark Minimal mode.</span>`);
    }
  }

  cmdSound(state) {
    if (state === 'on') {
      if (!window.soundEngine.enabled) window.toggleSound();
      this.printOutput(`<span style="color: var(--accent-emerald)">Web Audio synthesized sound enabled.</span>`);
    } else if (state === 'off') {
      if (window.soundEngine.enabled) window.toggleSound();
      this.printOutput(`<span style="color: var(--text-muted)">Sound effects muted.</span>`);
    } else {
      const active = window.toggleSound();
      this.printOutput(`<span style="color: var(--accent-cyan)">Sound is now ${active ? 'ACTIVE' : 'MUTED'}.</span>`);
    }
  }

  cmdSudo(arg) {
    if (arg === 'hire' || arg === 'hire-me') {
      if (window.soundEngine) window.soundEngine.playSuccess();
      this.printOutput(`
        <div style="margin: 0.45rem 0; padding: 0.75rem; background: rgba(52, 211, 153, 0.12); border: 1px solid var(--accent-emerald); border-radius: 6px;">
          <span style="color: var(--accent-emerald); font-weight: bold;">ACCESS GRANTED: PRIORITY SUSHMA CANDIDACY INITIALIZED!</span><br>
          Routing direct transmission to Sushma H S...<br>
          Direct: +91-8904261543 | hssushma2004@gmail.com
        </div>
      `);
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.getElementById('input-name');
        if (nameInput) nameInput.focus();
      }, 700);
    } else {
      this.printOutput(`<span style="color: #f43f5e">Permission denied: Did you mean <span style="color: var(--accent-cyan)">'sudo hire'</span>?</span>`);
    }
  }

  cmdMatrix() {
    this.printOutput(`<span style="color: var(--accent-emerald)">All microservices active... OpenTelemetry spans synced. ⚡</span>`);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.terminalEngine = new TerminalEngine();
});
