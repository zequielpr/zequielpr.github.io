const canvas = document.getElementById('p-canvas');
const ctx = canvas.getContext('2d');
const PARTICLE_COUNT = 72;
const CONNECT_DIST = 110;
const mouse = { x: null, y: null };
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.8 + 0.6;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.3;
    this.pulse = Math.random() * Math.PI * 2;
    this.bright = Math.random() > 0.85;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += 0.03;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    const glow = this.alpha + Math.sin(this.pulse) * 0.15;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r + (this.bright ? 1 : 0), 0, Math.PI * 2);
    ctx.fillStyle = this.bright
      ? `rgba(93,202,165,${Math.min(glow + 0.3, 1)})`
      : `rgba(29,158,117,${glow})`;
    ctx.fill();
    if (this.bright) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r + 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(93,202,165,${glow * 0.12})`;
      ctx.fill();
    }
  }
}

function connect() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < CONNECT_DIST) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(93,202,165,${(1 - dist/CONNECT_DIST) * 0.25})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
    if (mouse.x !== null) {
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 140) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(93,202,165,${(1 - dist/140) * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connect();
  requestAnimationFrame(loop);
}

resize();
particles = Array.from({length: PARTICLE_COUNT}, () => new Particle());
window.addEventListener('resize', resize);
document.querySelector('.hero').addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
document.querySelector('.hero').addEventListener('mouseleave', () => {
  mouse.x = null; mouse.y = null;
});
loop();