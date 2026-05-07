/* ============================================
   巴猪乐园 · 核心工具库 v2.0
   ============================================ */

// ── 爱心币系统 ──
const Coins = {
  key: 'bazhu_coins_v2',
  get() { return parseInt(localStorage.getItem(this.key) || '30'); },
  add(n) {
    const v = this.get() + n;
    localStorage.setItem(this.key, v);
    this._notify(v, n);
    return v;
  },
  spend(n) {
    const v = this.get() - n;
    if (v < 0) return false;
    localStorage.setItem(this.key, v);
    this._notify(v, -n);
    return true;
  },
  _notify(total, delta) {
    document.dispatchEvent(new CustomEvent('coins:change', { detail: { total, delta } }));
  }
};

// ── 导航栏金币显示 ──
function initNavCoins() {
  const el = document.getElementById('navCoins');
  if (!el) return;
  el.textContent = Coins.get();
  document.addEventListener('coins:change', e => {
    const from = parseInt(el.textContent) || 0;
    const to   = e.detail.total;
    // 数字滚动
    const dur = 500, start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * ease);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // 弹跳
    el.classList.remove('coin-bump');
    void el.offsetWidth;
    el.classList.add('coin-bump');
  });
}

// ── 导航滚动效果 ──
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 移动端菜单
  const btn = document.getElementById('navMenuBtn');
  const links = document.querySelector('.nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => links.classList.toggle('open'));
  }
}

// ── Toast 通知 ──
const Toast = {
  container: null,
  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },
  show(msg, duration = 2500) {
    if (!this.container) this.init();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    this.container.appendChild(t);
    setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => t.remove(), 300);
    }, duration);
  }
};

// ── 金币弹出动画 ──
function spawnCoinPop(amount, x, y) {
  const el = document.createElement('div');
  el.className = 'coin-pop';
  el.textContent = `+${amount} 🪙`;
  el.style.left = (x ?? window.innerWidth / 2) + 'px';
  el.style.top  = (y ?? window.innerHeight / 2) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

// ── IntersectionObserver 滚动进场 ──
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ── Canvas 粒子背景 ──
function initParticleCanvas() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const EMOJIS = ['🐾','🌿','🍃','✨','🌸','💧','⭐','🌼'];
  const COUNT = window.innerWidth < 600 ? 14 : 24;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: H + 20,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      size: 10 + Math.random() * 12,
      speedY: 0.25 + Math.random() * 0.45,
      speedX: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      opacity: 0.08 + Math.random() * 0.18,
      life: 0,
      maxLife: 1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => {
      const p = createParticle();
      p.y = Math.random() * H; // 初始散布全屏
      return p;
    });
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();

      if (p.y < -30) particles[i] = createParticle();
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  tick();
}

// ── 鼠标磁吸效果 ──
function initMagnet() {
  document.querySelectorAll('[data-magnet]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ── 数字滚动动画 ──
function animateNumber(el, from, to, duration = 800) {
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * ease);
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ── 打字机效果 ──
function typewriter(el, text, speed = 40) {
  el.textContent = '';
  let i = 0;
  return new Promise(resolve => {
    const tick = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speed);
      } else resolve();
    };
    tick();
  });
}

// ── 页面初始化入口 ──
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initNavCoins();
  initReveal();
  initParticleCanvas();
  initMagnet();
});

// ── Web Audio 音效系统 ──
const SFX = (() => {
  let ctx = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }
  // 播放一段简单音调序列
  function play(notes, type = 'sine', vol = 0.18) {
    try {
      const ac = getCtx();
      notes.forEach(([freq, start, dur]) => {
        const osc  = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, ac.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
        osc.start(ac.currentTime + start);
        osc.stop(ac.currentTime + start + dur + 0.05);
      });
    } catch(e) {}
  }
  return {
    // 摸摸：轻柔上扬两音
    pet()    { play([[440,0,.12],[554,.1,.15]], 'sine', 0.14); },
    // 喂食：短促清脆
    feed()   { play([[660,0,.08],[880,.07,.08]], 'triangle', 0.12); },
    // 答对：欢快三音
    correct(){ play([[523,0,.1],[659,.1,.1],[784,.2,.18]], 'sine', 0.16); },
    // 答错：低沉两音
    wrong()  { play([[330,0,.12],[262,.1,.18]], 'sawtooth', 0.10); },
    // 金币：高频叮
    coin()   { play([[1047,0,.06],[1319,.05,.08]], 'sine', 0.12); },
    // 购买成功
    buy()    { play([[523,0,.08],[659,.08,.08],[784,.16,.12],[1047,.24,.2]], 'sine', 0.15); },
  };
})();
