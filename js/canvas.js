/* ===================================================================
   AETHER // SYNAPSE OS - Ambient Kinetic Constellation Canvas
   Fluid particle network with cursor-interactive physics
   =================================================================== */

class AmbientCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 140 };
    this.animationFrameId = null;
    this.particleCount = 55;
    this.maxDistance = 150;
    this.isMinimal = document.documentElement.getAttribute('data-theme') === 'minimal';

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.createParticles();
    this.animate();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);

    // Adjust particle count dynamically based on screen size
    if (this.width < 768) {
      this.particleCount = 30;
      this.maxDistance = 100;
    } else {
      this.particleCount = 60;
      this.maxDistance = 150;
    }
    this.createParticles();
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const vx = (Math.random() - 0.5) * 0.7;
      const vy = (Math.random() - 0.5) * 0.7;
      this.particles.push({
        x,
        y,
        size,
        vx,
        vy,
        baseX: x,
        baseY: y,
        density: Math.random() * 20 + 5
      });
    }
  }

  updateTheme(isMinimal) {
    this.isMinimal = isMinimal;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const isMinimal = document.documentElement.getAttribute('data-theme') === 'minimal';
    const primaryColor = isMinimal ? 'rgba(255, 255, 255,' : 'rgba(0, 242, 254,';
    const accentColor = isMinimal ? 'rgba(160, 174, 192,' : 'rgba(157, 78, 221,';

    // Draw and update particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Physics update
      p.x += p.vx;
      p.y += p.vy;

      // Screen bounce
      if (p.x < 0 || p.x > this.width) p.vx = -p.vx;
      if (p.y < 0 || p.y > this.height) p.vy = -p.vy;

      // Mouse interactivity (smooth repulsion & return)
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          const dirX = (dx / dist) * force * p.density * 0.4;
          const dirY = (dy / dist) * force * p.density * 0.4;
          p.x -= dirX;
          p.y -= dirY;
        }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = i % 3 === 0 ? `${accentColor} 0.65)` : `${primaryColor} 0.65)`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = i % 3 === 0 ? `${accentColor} 0.8)` : `${primaryColor} 0.8)`;
      this.ctx.fill();

      // Connect nearby particles with glowing lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (dist < this.maxDistance) {
          const opacity = (1 - dist / this.maxDistance) * 0.22;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `${primaryColor} ${opacity})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.shadowBlur = 0;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ambientCanvas = new AmbientCanvas('canvas-ambient');
});
