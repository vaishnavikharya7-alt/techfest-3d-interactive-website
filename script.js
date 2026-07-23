/* ============================================
   TECHFEST 2025 — Main Script
   - Three.js interactive 3D AI core
   - GSAP scroll choreography
   - Custom cursor, particles, counters
   - Section data injection
   ============================================ */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* --------------------------------------------------
   DATA
-------------------------------------------------- */
const EVENTS = [
  { num:'01', title:'Neural Architectures', desc:'Live surgery on transformer models — dissect, rewire, recombine.', track:'AI', icon:'brain' },
  { num:'02', title:'Quantum Horizons', desc:'Quantum computing in production. Qubits, error correction, real speedup.', track:'QUANTUM', icon:'atom' },
  { num:'03', title:'Robotic Ballet', desc:'Autonomous machines learning to move with intent and grace.', track:'ROBOTICS', icon:'robot' },
  { num:'04', title:'Holographic Worlds', desc:'Volumetric displays, spatial computing, the death of the flat screen.', track:'XR', icon:'cube' },
  { num:'05', title:'Bio-Synthesis', desc:'Where wet biology meets silicon. Engineered life, designed evolution.', track:'BIOTECH', icon:'dna' },
  { num:'06', title:'Cipher Wars', desc:'Cryptography, zero-knowledge proofs, the math that protects civilization.', track:'SECURITY', icon:'shield' },
];

const COMPETITIONS = [
  { prize:'$500K', title:'Neural Hackathon', sub:'48 hours. One model. Infinite possibility.', teams:'320+', days:'48h' },
  { prize:'$300K', title:'Robot Wars', sub:'Autonomous combat under adversarial conditions.', teams:'128', days:'3 days' },
  { prize:'$250K', title:'Quantum Challenge', sub:'Solve what classical computers cannot.', teams:'64', days:'24h' },
  { prize:'$200K', title:'Drone Racing', sub:'Sub-millisecond telemetry. Mach-class reflexes.', teams:'96', days:'2 days' },
];

const WORKSHOPS = [
  { num:'01', title:'Building LLMs from Scratch', host:'Dr. Mira Patel · Stanford', dur:'6 hrs', level:'Advanced' },
  { num:'02', title:'Quantum Circuits with Qiskit', host:'IBM Quantum Team', dur:'4 hrs', level:'Intermediate' },
  { num:'03', title:'ROS 2 & Autonomous Systems', host:'Boston Dynamics Lab', dur:'8 hrs', level:'Advanced' },
  { num:'04', title:'WebGPU & Real-time Graphics', host:'Google Chrome Team', dur:'5 hrs', level:'Intermediate' },
  { num:'05', title:'CRISPR & Synthetic Biology', host:'MIT BioEngineering', dur:'6 hrs', level:'Beginner' },
  { num:'06', title:'Zero-Knowledge Proofs', host:'Ethereum Foundation', dur:'4 hrs', level:'Advanced' },
];

const SPEAKERS = [
  { name:'Dr. Mira Patel', role:'Stanford AI Lab', topic:'The post-transformer era', seed:'spk1' },
  { name:'Marcus Chen', role:'DeepMind', topic:'General agents, narrow truths', seed:'spk2' },
  { name:'Dr. Anya Volkov', role:'OpenAI', topic:'Alignment as engineering', seed:'spk3' },
  { name:'Kenji Nakamura', role:'Boston Dynamics', topic:'When robots learn to fall', seed:'spk4' },
  { name:'Dr. Sara Lindqvist', role:'CERN', topic:'Quantum error correction at scale', seed:'spk5' },
  { name:'Rajesh Kumar', role:'NVIDIA', topic:'The omniverse is not a metaphor', seed:'spk6' },
  { name:'Dr. Elena Rossi', role:'MIT Media Lab', topic:'Synthetic biology as design', seed:'spk7' },
  { name:'Theo Adebayo', role:'Anthropic', topic:'Constitutional AI in production', seed:'spk8' },
];

const TIMELINE = [
  { time:'09:00 — DAY 01', title:'Opening Keynote', desc:'The state of intelligence — a 90-minute descent into the year ahead.' },
  { time:'11:00 — DAY 01', title:'Mainstage Demos', desc:'Six world-premiere technologies. Live. Unrehearsed. On the mainstage.' },
  { time:'14:00 — DAY 01', title:'Hackathon Kickoff', desc:'48 hours begin. 320 teams. One problem space. No safety nets.' },
  { time:'10:00 — DAY 02', title:'Workshop Marathon', desc:'Six tracks running in parallel. Bring a laptop, leave with new reflexes.' },
  { time:'20:00 — DAY 02', title:'Neon Night', desc:'Audiovisual performance where the AI conducts and the lasers follow.' },
  { time:'16:00 — DAY 03', title:'Finals & Judging', desc:'Live judging on the mainstage. Six tracks, one winner each.' },
  { time:'21:00 — DAY 03', title:'Closing Ceremony', desc:'Awards, world premieres, and a 30-minute look at Techfest 2026.' },
];

const SPONSORS = ['NVIDIA','Google','Microsoft','Meta','OpenAI','DeepMind','Stanford','MIT','Anthropic','Tesla','IBM','Intel'];

const GALLERY = [
  { tag:'2024 / Keynote', title:'The Hall of Signals', seed:'g1', size:'large' },
  { tag:'2024 / Hackathon', title:'Midnight Compile', seed:'g2', size:'tall' },
  { tag:'2023 / Robotics', title:'Mechanical Pulse', seed:'g3', size:'' },
  { tag:'2023 / Expo', title:'Floor of the Future', seed:'g4', size:'' },
  { tag:'2024 / Night', title:'Neon Cathedral', seed:'g5', size:'tall' },
  { tag:'2023 / Demo', title:'First Contact', seed:'g6', size:'' },
  { tag:'2024 / Awards', title:'The Final Signal', seed:'g7', size:'' },
];

/* --------------------------------------------------
   ICONS (inline SVG strings)
-------------------------------------------------- */
const ICONS = {
  brain:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 3a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 001 5 3 3 0 003 4 3 3 0 005 0V3a3 3 0 00-4 0z"/><path d="M15 3a3 3 0 013 3 3 3 0 012 5 3 3 0 01-1 5 3 3 0 01-3 4 3 3 0 01-5 0"/></svg>',
  atom:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>',
  robot:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4M9 13h0M15 13h0M9 17h6"/><circle cx="12" cy="3" r="1"/></svg>',
  cube:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 12l9-5M12 12v10M12 12L3 7"/></svg>',
  dna:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 2c0 6 16 6 16 12s-16 6-16 12M20 2c0 6-16 6-16 12s16 6 16 12M4 8h16M4 16h16"/></svg>',
  shield:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2L4 5v7c0 5 3 8 8 10 5-2 8-5 8-10V5z"/><path d="M9 12l2 2 4-4"/></svg>',
};

/* --------------------------------------------------
   INJECT CONTENT
-------------------------------------------------- */
function injectContent() {
  // Events
  document.getElementById('eventsGrid').innerHTML = EVENTS.map(e => `
    <article class="event-card reveal" data-cursor="hover">
      <div class="event-card-num">EVENT / ${e.num}</div>
      <div class="event-card-icon">${ICONS[e.icon]}</div>
      <h3 class="event-card-title">${e.title}</h3>
      <p class="event-card-desc">${e.desc}</p>
      <div class="event-card-meta">
        <span>${e.track}</span>
        <span class="event-card-meta-arrow">→</span>
      </div>
    </article>`).join('');

  // Competitions
  document.getElementById('compGrid').innerHTML = COMPETITIONS.map(c => `
    <article class="comp-card reveal" data-cursor="hover">
      <div class="comp-card-prize">PRIZE / ${c.prize}</div>
      <h3 class="comp-card-title">${c.title}</h3>
      <p class="comp-card-sub">${c.sub}</p>
      <div class="comp-card-stats">
        <div class="comp-card-stat"><strong>${c.teams}</strong>TEAMS</div>
        <div class="comp-card-stat"><strong>${c.days}</strong>DURATION</div>
      </div>
    </article>`).join('');

  // Workshops
  document.getElementById('workshopList').innerHTML = WORKSHOPS.map(w => `
    <article class="workshop-item reveal" data-cursor="hover">
      <div class="workshop-num">${w.num}</div>
      <div>
        <div class="workshop-title">${w.title}</div>
      </div>
      <div class="workshop-meta"><span class="workshop-meta-label">Host</span>${w.host}</div>
      <div class="workshop-meta"><span class="workshop-meta-label">Duration · Level</span>${w.dur} · ${w.level}</div>
      <div class="workshop-arrow">→</div>
    </article>`).join('');

  // Speakers
  document.getElementById('speakersGrid').innerHTML = SPEAKERS.map(s => `
    <article class="speaker-card reveal" data-cursor="hover">
      <img class="speaker-img" src="https://picsum.photos/seed/${s.seed}/400/520.jpg" alt="${s.name}" loading="lazy" />
      <div class="speaker-overlay"></div>
      <div class="speaker-info">
        <div class="speaker-name">${s.name}</div>
        <div class="speaker-role">${s.role}</div>
        <div class="speaker-topic">"${s.topic}"</div>
      </div>
    </article>`).join('');

  // Timeline
  document.getElementById('timelineTrack').innerHTML = TIMELINE.map((t,i) => {
    const isEven = i % 2 === 0;
    return `
      <div class="timeline-item reveal">
        ${isEven ? `<div class="timeline-content">
          <div class="timeline-time">${t.time}</div>
          <div class="timeline-title">${t.title}</div>
          <div class="timeline-desc">${t.desc}</div>
        </div>` : '<div class="timeline-empty"></div>'}
        <div class="timeline-node"><div class="timeline-dot"></div></div>
        ${!isEven ? `<div class="timeline-content">
          <div class="timeline-time">${t.time}</div>
          <div class="timeline-title">${t.title}</div>
          <div class="timeline-desc">${t.desc}</div>
        </div>` : '<div class="timeline-empty"></div>'}
      </div>`;
  }).join('');

  // Sponsors (doubled for seamless marquee)
  const sponsorHTML = SPONSORS.map(s => `
    <div class="sponsor-logo" data-cursor="hover">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12,2 22,8 22,16 12,22 2,16 2,8" /></svg>
      <span>${s}</span>
    </div>`).join('');
  document.getElementById('sponsorsMarquee').innerHTML = `<div class="sponsor-row">${sponsorHTML}${sponsorHTML}</div>`;

  // Gallery
  document.getElementById('galleryGrid').innerHTML = GALLERY.map(g => `
    <article class="gallery-item ${g.size === 'large' ? 'gallery-large' : ''} ${g.size === 'tall' ? 'gallery-tall' : ''} reveal" data-cursor="hover">
      <img src="https://picsum.photos/seed/${g.seed}/${g.size === 'large' ? '800/600' : g.size === 'tall' ? '400/600' : '400/300'}.jpg" alt="${g.title}" loading="lazy" />
      <div class="gallery-item-overlay">
        <div class="gallery-item-tag">${g.tag}</div>
        <div class="gallery-item-title">${g.title}</div>
      </div>
    </article>`).join('');
}

/* --------------------------------------------------
   CUSTOM CURSOR
-------------------------------------------------- */
function initCursor() {
  if (window.matchMedia('(max-width: 900px)').matches) return;
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();

  // Hover state on [data-cursor="hover"]
  document.addEventListener('mouseover', e => {
    if (e.target.closest('[data-cursor="hover"], a, button, input, textarea, select')) {
      ring.classList.add('is-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('[data-cursor="hover"], a, button, input, textarea, select')) {
      ring.classList.remove('is-hover');
    }
  });
}

/* --------------------------------------------------
   LOADER
-------------------------------------------------- */
function initLoader() {
  return new Promise(resolve => {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loaderBar');
    const pct = document.getElementById('loaderPct');
    const sub = document.getElementById('loaderSub');
    const stages = ['INITIALIZING SYSTEM','CALIBRATING NEURAL CORE','LOADING EXPERIENCE','READY'];
    let p = 0;
    const tick = () => {
      p += Math.random() * 8 + 2;
      if (p >= 100) p = 100;
      bar.style.width = p + '%';
      pct.textContent = Math.floor(p) + '%';
      const stage = Math.min(stages.length - 1, Math.floor(p / 26));
      sub.textContent = stages[stage];
      if (p < 100) setTimeout(tick, 60 + Math.random() * 80);
      else {
        setTimeout(() => {
          loader.classList.add('is-hidden');
          resolve();
        }, 500);
      }
    };
    tick();
  });
}

/* --------------------------------------------------
   SCROLL PROGRESS + NAV STATE
-------------------------------------------------- */
function initScrollUI() {
  const progress = document.getElementById('scrollProgress');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], header[id]');

  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = (h.scrollTop / max) * 100;
    progress.style.width = p + '%';

    if (h.scrollTop > 50) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');

    // Active link
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 200;
      if (h.scrollTop >= top) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('is-open');
    links.classList.toggle('is-open');
  });
  links.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      toggle.classList.remove('is-open');
      links.classList.remove('is-open');
    }
  });
}

/* --------------------------------------------------
   COUNTERS
-------------------------------------------------- */
function animateCounters() {
  const counters = document.querySelectorAll('.counter, [data-count]');
  counters.forEach(el => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const start = performance.now();
    const startVal = 0;
    const formatter = (v) => {
      if (isDecimal) return v.toFixed(1);
      if (target >= 1000) return Math.floor(v).toLocaleString();
      return Math.floor(v).toString();
    };
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatter(startVal + (target - startVal) * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* --------------------------------------------------
   REVEAL ON SCROLL
-------------------------------------------------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
  els.forEach(el => io.observe(el));
}

/* --------------------------------------------------
   EVENT CARD MOUSE GLOW
-------------------------------------------------- */
function initCardGlow() {
  document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
}

/* --------------------------------------------------
   CONTACT FORM
-------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = '× ALL FIELDS REQUIRED';
      status.style.color = '#db2777';
      return;
    }
    status.style.color = 'var(--cyan)';
    status.textContent = 'TRANSMITTING...';
    setTimeout(() => {
      status.textContent = '✓ SIGNAL RECEIVED · STAND BY';
      form.reset();
    }, 1200);
  });
}

/* --------------------------------------------------
   THREE.JS — INTERACTIVE AI CORE
-------------------------------------------------- */
function initThree() {
  const canvas = document.getElementById('heroCanvas');
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03040a, 0.08);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // Post-processing: bloom
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.9, 0.7, 0.05);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // Lights
  scene.add(new THREE.AmbientLight(0x223355, 0.6));
  const keyLight = new THREE.PointLight(0x06b6d4, 30, 30);
  keyLight.position.set(5, 5, 5);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0x7c3aed, 20, 30);
  fillLight.position.set(-5, -3, 4);
  scene.add(fillLight);
  const rimLight = new THREE.PointLight(0x2563eb, 15, 30);
  rimLight.position.set(0, 0, -6);
  scene.add(rimLight);

  // --- Core group ---
  const group = new THREE.Group();
  scene.add(group);

  // Central crystal: icosahedron
  const crystalGeo = new THREE.IcosahedronGeometry(1.1, 1);
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x0a1a3a,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.9,
    flatShading: true,
    transparent: true,
    opacity: 0.9,
  });
  const crystal = new THREE.Mesh(crystalGeo, crystalMat);
  group.add(crystal);

  // Wireframe overlay
  const wireGeo = new THREE.IcosahedronGeometry(1.12, 1);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.4 });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  group.add(wire);

  // Inner core
  const innerGeo = new THREE.IcosahedronGeometry(0.5, 0);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  group.add(inner);

  // Orbiting torus rings
  const ringMat1 = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 1.2, metalness: 1, roughness: 0.3 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.025, 16, 100), ringMat1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.018, 16, 100), new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x7c3aed, emissiveIntensity: 1, metalness: 1, roughness: 0.3 }));
  const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.014, 16, 100), new THREE.MeshStandardMaterial({ color: 0x2563eb, emissive: 0x2563eb, emissiveIntensity: 0.8, metalness: 1, roughness: 0.3 }));
  ring1.rotation.x = Math.PI / 2;
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.y = Math.PI / 4;
  ring3.rotation.x = Math.PI / 6;
  ring3.rotation.z = Math.PI / 5;
  group.add(ring1, ring2, ring3);

  // Orbiting electrons
  const electrons = [];
  const electronGeo = new THREE.SphereGeometry(0.08, 16, 16);
  for (let i = 0; i < 6; i++) {
    const mat = new THREE.MeshBasicMaterial({ color: i % 2 ? 0x06b6d4 : 0x7c3aed });
    const e = new THREE.Mesh(electronGeo, mat);
    e.userData = {
      radius: 2.0 + (i % 3) * 0.4,
      speed: 0.6 + Math.random() * 0.8,
      offset: (i / 6) * Math.PI * 2,
      axis: i % 3,
    };
    electrons.push(e);
    group.add(e);
  }

  // Outer wireframe shell (rotates slowly)
  const shellGeo = new THREE.IcosahedronGeometry(3.6, 1);
  const shellMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.12 });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  group.add(shell);

  // Particles
  const particleCount = 800;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const c1 = new THREE.Color(0x06b6d4);
  const c2 = new THREE.Color(0x7c3aed);
  const c3 = new THREE.Color(0x2563eb);
  for (let i = 0; i < particleCount; i++) {
    const r = 3 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
    const col = [c1, c2, c3][Math.floor(Math.random() * 3)];
    colors[i*3] = col.r;
    colors[i*3+1] = col.g;
    colors[i*3+2] = col.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Mouse parallax
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', e => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  });
  // Touch
  window.addEventListener('touchmove', e => {
    if (e.touches[0]) {
      mouse.tx = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
    }
  }, { passive: true });

  // Scroll influence
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  // Resize
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  // Animate
  const clock = new THREE.Clock();
  const render = () => {
    const t = clock.getElapsedTime();
    const dt = clock.getDelta();

    // Smooth mouse
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    // Group rotation driven by mouse + scroll
    group.rotation.y = mouse.x * 0.6 + t * 0.15;
    group.rotation.x = mouse.y * 0.4 + Math.sin(t * 0.3) * 0.05;

    // Scroll moves group up & shrinks slightly
    const sScroll = Math.min(1, scrollY / window.innerHeight);
    group.position.y = sScroll * 2;
    group.scale.setScalar(1 - sScroll * 0.3);

    // Crystal spin
    crystal.rotation.x = t * 0.4;
    crystal.rotation.y = t * 0.5;
    wire.rotation.x = -t * 0.3;
    wire.rotation.y = -t * 0.4;
    inner.rotation.x = t * 0.8;
    inner.rotation.z = t * 0.6;
    inner.scale.setScalar(1 + Math.sin(t * 3) * 0.1);

    // Rings spin
    ring1.rotation.z = t * 0.5;
    ring2.rotation.z = -t * 0.4;
    ring3.rotation.z = t * 0.3;
    ring2.rotation.x = Math.PI / 3 + Math.sin(t * 0.5) * 0.2;

    // Electrons orbit
    electrons.forEach(e => {
      const { radius, speed, offset, axis } = e.userData;
      const a = t * speed + offset;
      if (axis === 0) {
        e.position.set(Math.cos(a) * radius, Math.sin(a) * radius, Math.sin(a * 2) * 0.3);
      } else if (axis === 1) {
        e.position.set(Math.cos(a) * radius, Math.cos(a * 2) * 0.4, Math.sin(a) * radius);
      } else {
        e.position.set(Math.sin(a * 1.5) * 0.5, Math.cos(a) * radius, Math.sin(a) * radius);
      }
    });

    // Shell slow rotation
    shell.rotation.y = t * 0.06;
    shell.rotation.x = t * 0.04;

    // Particles drift
    particles.rotation.y = t * 0.02;
    particles.rotation.x = t * 0.01;

    // Light pulse
    keyLight.intensity = 25 + Math.sin(t * 2) * 8;
    fillLight.intensity = 18 + Math.sin(t * 2.3 + 1) * 6;

    // Bloom intensity pulses subtly
    bloom.strength = 0.85 + Math.sin(t * 1.5) * 0.1;

    composer.render();
    requestAnimationFrame(render);
  };
  render();
}

/* --------------------------------------------------
   GSAP — HERO INTRO + SCROLL CHOREOGRAPHY
-------------------------------------------------- */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero intro (after loader)
  const tl = gsap.timeline({ delay: 0.2 });
  tl.from('.hero-tag', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero-title-line', { y: 80, opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out' }, '-=0.4')
    .from('.hero-sub', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.hero-actions .btn', { y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
    .from('.hero-stats', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .from('.hud-corner', { opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.6')
    .from('.scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.2');

  // Section heads
  gsap.utils.toArray('.section-head').forEach(head => {
    gsap.from(head.children, {
      scrollTrigger: { trigger: head, start: 'top 80%' },
      y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out'
    });
  });

  // Parallax on hero content as you scroll
  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5
    },
    y: 120, opacity: 0.2, ease: 'none'
  });
}

/* --------------------------------------------------
   BOOT
-------------------------------------------------- */
(async function boot() {
  injectContent();
  initCursor();
  initScrollUI();
  initReveal();
  initCardGlow();
  initContactForm();
  initThree();
  initGSAP();

  await initLoader();

  // After loader: animate counters
  setTimeout(animateCounters, 400);
})();
