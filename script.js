/* ===================================================
   STAR FIELD (ambient canvas, always running)
=================================================== */
(function starField(){
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, stars = [];
  const STAR_COUNT_BASE = 140;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(220, Math.floor((w * h) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.02,
      driftY: (Math.random() - 0.5) * 0.02
    }));
  }

  function tick(t){
    ctx.clearRect(0, 0, w, h);
    for (const s of stars){
      s.phase += s.twinkleSpeed;
      s.x += s.driftX;
      s.y += s.driftY;
      if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
      if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
      const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 242, 236, ${alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(tick);
})();

/* ===================================================
   SHOOTING STARS (random, occasional)
=================================================== */
(function shootingStars(){
  const holder = document.getElementById('shooting-stars');
  function spawn(){
    const el = document.createElement('div');
    el.className = 'shooting-star';
    el.style.top = Math.random() * 40 + '%';
    el.style.left = (60 + Math.random() * 35) + '%';
    holder.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }
  setInterval(spawn, 3400);
  setTimeout(spawn, 900);
})();

/* ===================================================
   CONSTELLATION DOTS (welcome screen)
=================================================== */
(function constellationDots(){
  const path = document.getElementById('constellation-path');
  const group = document.getElementById('constellation-dots');
  if (!path || !group) return;
  const len = path.getTotalLength();
  const pointCount = 7;
  for (let i = 0; i < pointCount; i++){
    const pt = path.getPointAtLength((len / (pointCount - 1)) * i);
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', pt.x);
    c.setAttribute('cy', pt.y);
    c.setAttribute('r', i === pointCount - 1 ? 4 : 2.6);
    c.classList.add('const-dot');
    c.style.animationDelay = (0.5 + i * 0.32) + 's';
    group.appendChild(c);
  }
})();

/* ===================================================
   WELCOME -> MAIN TRANSITION
=================================================== */
(function enterFlow(){
  const welcome = document.getElementById('welcome');
  const main = document.getElementById('main-content');
  const btn = document.getElementById('enter-btn');

  btn.addEventListener('click', () => {
    welcome.classList.add('fade-out');
    main.hidden = false;
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      main.querySelector('.hero').scrollIntoView({ behavior: 'instant' in window ? 'instant' : 'auto' });
    }, 50);
    triggerMusicStart();
  });
})();

/* ===================================================
   MUSIC TOGGLE
=================================================== */
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('music-toggle');
let musicStarted = false;

function triggerMusicStart(){
  if (musicStarted) return;
  musicStarted = true;
  bgm.volume = 0.55;
  const p = bgm.play();
  if (p && p.catch){
    p.then(() => musicBtn.classList.add('playing')).catch(() => {
      // autoplay blocked; wait for explicit toggle
    });
  } else {
    musicBtn.classList.add('playing');
  }
}

musicBtn.addEventListener('click', () => {
  if (bgm.paused){
    bgm.play().then(() => musicBtn.classList.add('playing')).catch(() => {});
  } else {
    bgm.pause();
    musicBtn.classList.remove('playing');
  }
});

/* ===================================================
   GALLERY BUILD + LIGHTBOX
=================================================== */
(function gallery(){
  const track = document.getElementById('gallery-track');
  const captions = [
    'the first blur before we knew',
    'us, mid-laugh, always',
    'quiet afternoons',
    'the one where you were sulking',
    'red day, good day',
    'that grainy camera filter era',
    'silly filters, real love'
  ];
  const photos = Array.from({ length: 7 }, (_, i) => `assets/photos/${i + 1}.jpg`);

  photos.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${src}" alt="${captions[i] || 'A memory of us'}" loading="lazy" />
      <span class="frame-index">${String(i + 1).padStart(2, '0')}</span>
    `;
    item.addEventListener('click', () => openLightbox(src, captions[i]));
    track.appendChild(item);
  });

  // reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.gallery-item').forEach(el => io.observe(el));

  // lightbox
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.innerHTML = `
    <button id="lightbox-close" class="glass-pill" aria-label="Close">✕</button>
    <img id="lightbox-img" src="" alt="" />
  `;
  document.body.appendChild(lightbox);
  const lbImg = document.getElementById('lightbox-img');

  function openLightbox(src, caption){
    lbImg.src = src;
    lbImg.alt = caption || '';
    lightbox.classList.add('open');
  }
  function closeLightbox(){ lightbox.classList.remove('open'); }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.id === 'lightbox-close') closeLightbox();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
})();

/* ===================================================
   SECRET HEART
=================================================== */
(function secretHeart(){
  const btn = document.getElementById('heart-btn');
  const msg = document.getElementById('secret-message');
  let opened = false;

  btn.addEventListener('click', () => {
    opened = !opened;
    btn.classList.toggle('opened', opened);
    if (opened){
      msg.hidden = false;
      requestAnimationFrame(() => msg.style.opacity = 1);
    } else {
      msg.hidden = true;
    }
  });
})();

/* ===================================================
   CONFETTI (canvas based, no dependency)
=================================================== */
(function confettiEngine(){
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let running = false;
  const colors = ['#d9b56a', '#e8cf9c', '#5fd8ff', '#f4f2ec', '#1e3a8a'];

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function burst(){
    const count = 140;
    for (let i = 0; i < count; i++){
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 120,
        y: canvas.height * 0.25,
        vx: (Math.random() - 0.5) * 9,
        vy: Math.random() * -8 - 3,
        gravity: 0.22 + Math.random() * 0.08,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        life: 0,
        maxLife: 140 + Math.random() * 60,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }
    if (!running){ running = true; requestAnimationFrame(loop); }
  }

  function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.vy += p.gravity * 0.1;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect'){
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    particles = particles.filter(p => p.life < p.maxLife && p.y < canvas.height + 40);
    if (particles.length > 0){
      requestAnimationFrame(loop);
    } else {
      running = false;
    }
  }

  const confettiBtn = document.getElementById('confetti-btn');
  if (confettiBtn) confettiBtn.addEventListener('click', burst);

  // small celebratory burst automatically when entering main content
  document.getElementById('enter-btn').addEventListener('click', () => {
    setTimeout(burst, 600);
  });
})();
