/* ============================================
   首页逻辑 v2.0
   ============================================ */

// ── 摸摸巴猪 ──
const petMessages = [
  '呼噜呼噜～ 好舒服 😌',
  '再摸一下嘛～ 🥺',
  '我是世界上最快乐的动物！',
  '摸头杀！谢谢你 🐾',
  '嗯嗯嗯～ 继续继续！',
  '我要睡着了... zzz 😴',
  '你是我最好的朋友！',
  '啊～ 好痒好痒 🤭',
  '巴猪感谢你的爱！ 💛',
  '我可以在这里泡一整天 🛁',
  '今天也是美好的一天 🌸',
  '有你在真好 🤗',
];
const hatItems = ['🌸','🎀','🍓','🌺','⭐','🎵','🍉','🌻','👑','🎩','🍄','🌈'];

let moodValue = 60;
const moodFill  = document.getElementById('moodFill');
const moodEmoji = document.getElementById('moodEmoji');
const petMsg    = document.getElementById('petMsg');
const capyMain  = document.getElementById('capyMain');
const capyItem  = document.getElementById('capyItem');

function showPetMsg(text) {
  petMsg.textContent = text;
  petMsg.classList.add('show');
  clearTimeout(petMsg._t);
  petMsg._t = setTimeout(() => petMsg.classList.remove('show'), 2500);
}

function triggerCapyAnim(type) {
  capyMain.classList.remove('bounce','happy','shake');
  void capyMain.offsetWidth;
  capyMain.classList.add(type);
  // 动画结束后自动清除，避免残留
  capyMain.addEventListener('animationend', () => {
    capyMain.classList.remove(type);
  }, { once: true });
}

// 心情等级配置
const moodLevels = [
  { min: 85, emoji: '🥰', label: '超级开心！',  bg: 'linear-gradient(90deg,#f4a060,#f472b6)', pulse: true  },
  { min: 60, emoji: '😊', label: '心情不错～',  bg: 'linear-gradient(90deg,#c08050,#f4a882)', pulse: false },
  { min: 35, emoji: '😐', label: '还好啦...',   bg: 'linear-gradient(90deg,#a07040,#c08050)', pulse: false },
  { min: 0,  emoji: '😢', label: '有点难过...',  bg: 'linear-gradient(90deg,#806040,#a07040)', pulse: false },
];

function updateMood(delta) {
  const prev = moodValue;
  moodValue = Math.min(100, Math.max(0, moodValue + delta));
  moodFill.style.width = moodValue + '%';

  const level = moodLevels.find(l => moodValue >= l.min);
  moodFill.style.background = level.bg;

  // 表情变化时加弹跳动画
  if (moodEmoji.textContent !== level.emoji) {
    moodEmoji.textContent = level.emoji;
    moodEmoji.style.transform = 'scale(1.5)';
    setTimeout(() => moodEmoji.style.transform = '', 300);
  }

  // 进度条脉冲（心情很高时）
  if (level.pulse) {
    moodFill.style.boxShadow = '0 0 8px rgba(244,114,182,0.5)';
  } else {
    moodFill.style.boxShadow = '';
  }

  // 心情满了特效
  if (prev < 100 && moodValue === 100) {
    triggerCapyAnim('happy');
    spawnHearts(capyMain);
    Toast.show('巴猪心情满满！🥰 +3 🪙');
    Coins.add(3);
  }
}

// 点击「摸摸我」按钮
document.getElementById('petBtn').addEventListener('click', (e) => {
  const msg = petMessages[Math.floor(Math.random() * petMessages.length)];
  showPetMsg(msg);
  triggerCapyAnim('happy');          // 晃头动画
  capyItem.textContent = hatItems[Math.floor(Math.random() * hatItems.length)];
  updateMood(10);
  Coins.add(2);
  spawnCoinPop(2, e.clientX, e.clientY);
  spawnHearts(capyMain);
  SFX.pet();
  Toast.show('摸了巴猪 +2 🪙');
});

// 直接点击巴猪
capyMain.addEventListener('click', (e) => {
  // 根据心情决定动画类型
  const anim = moodValue >= 60 ? 'happy' : 'bounce';
  triggerCapyAnim(anim);

  // 随机换头顶道具
  capyItem.textContent = hatItems[Math.floor(Math.random() * hatItems.length)];

  // 心情 +5，进度条变化
  updateMood(5);
  Coins.add(1);
  spawnCoinPop(1, e.clientX, e.clientY);
  spawnHearts(capyMain);
  SFX.pet();

  // 水波纹
  const rc = document.getElementById('rippleContainer');
  const r = document.createElement('div');
  r.className = 'ripple';
  r.style.cssText = `width:60px;height:60px;left:50%;top:50%;margin:-30px 0 0 -30px`;
  rc.appendChild(r);
  setTimeout(() => r.remove(), 900);

  // 进度条闪烁提示
  moodFill.style.transition = 'width 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  setTimeout(() => { moodFill.style.transition = ''; }, 400);
});

// 爱心粒子喷射
function spawnHearts(container) {
  const hearts = ['❤️','🧡','💛','💚','💙','💜','🩷','✨','⭐'];
  const count = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'heart-particle';
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      const angle = (Math.random() * 160 - 80); // -80 ~ +80 度
      const dist  = 40 + Math.random() * 50;
      const x = 50 + Math.sin(angle * Math.PI / 180) * (dist / 2);
      h.style.cssText = `left:${x}%;top:20%;font-size:${1 + Math.random() * 0.8}rem;`;
      h.style.setProperty('--tx', `${Math.sin(angle * Math.PI / 180) * dist}px`);
      h.style.animation = `heartFloat ${0.8 + Math.random() * 0.4}s ease-out forwards`;
      container.querySelector('.capy-overlay').appendChild(h);
      setTimeout(() => h.remove(), 1200);
    }, i * 60);
  }
}

// ── 快捷栏金币同步 ──
function updateQuickCoins() {
  const el = document.getElementById('quickCoins');
  if (el) el.textContent = `🪙 ${Coins.get()}`;
}
document.addEventListener('coins:change', updateQuickCoins);
updateQuickCoins();

// ── 商店装备同步：读取已装备道具显示在巴猪头顶 ──
function syncEquipped() {
  const equipped = localStorage.getItem('bazhu_equipped_v2') || '';
  if (!equipped || !capyItem) return;
  const shopItems = [
    { id:'flower',emoji:'🌸'},{ id:'crown',emoji:'👑'},{ id:'hat',emoji:'🎩'},
    { id:'bow',emoji:'🎀'},{ id:'star',emoji:'⭐'},{ id:'mushroom',emoji:'🍄'},
    { id:'rainbow',emoji:'🌈'},{ id:'leaf',emoji:'🍃'},
  ];
  const item = shopItems.find(i => i.id === equipped);
  if (item) capyItem.textContent = item.emoji;
}
syncEquipped();

// ── 心情条触摸支持 ──
(function initMoodTouch() {
  const track = document.querySelector('.mood-track');
  const fill  = document.getElementById('moodFill');
  if (!track || !fill) return;

  function setFromEvent(clientX) {
    const rect = track.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    fill.style.transition = 'none';
    updateMood(Math.round(pct * 100) - moodValue);
    requestAnimationFrame(() => { fill.style.transition = ''; });
  }

  // 点击轨道跳转
  track.addEventListener('click', e => setFromEvent(e.clientX));

  // 拖拽滑块（鼠标）
  const thumb = fill.querySelector ? fill : track;
  let dragging = false;
  track.addEventListener('mousedown', e => { dragging = true; setFromEvent(e.clientX); e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (dragging) setFromEvent(e.clientX); });
  document.addEventListener('mouseup',   () => { dragging = false; });

  // 触摸
  track.addEventListener('touchstart', e => { dragging = true; setFromEvent(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('touchmove', e => { if (dragging) setFromEvent(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('touchend',  () => { dragging = false; });
})();

// ── 数字滚动（进入视口时触发）──
const statNums = document.querySelectorAll('.stat-num[data-target]');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      animateNumber(el, 0, parseInt(el.dataset.target), 1200);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));

// ── 冷知识 ──
const facts = [
  { icon: '📏', title: '超级大块头', text: '巴猪是世界上最大的啮齿动物，体重可达 65 公斤！' },
  { icon: '🏊', title: '游泳健将', text: '可以在水下憋气长达 5 分钟，脚趾间有蹼。' },
  { icon: '🧘', title: '佛系代表', text: '性格极其温和，被称为"动物界的外交官"。' },
  { icon: '🌡️', title: '温泉爱好者', text: '超爱泡温泉！日本动物园的视频风靡全网。' },
  { icon: '👨‍👩‍👧‍👦', title: '群居动物', text: '通常 10-20 只一起生活，互相梳理毛发。' },
  { icon: '🌿', title: '素食主义', text: '只吃植物，每天吃掉相当于体重 3% 的食物。' },
  { icon: '🦜', title: '鸟类好友', text: '鸟儿站在背上帮它吃虫子，互利共赢！' },
  { icon: '😴', title: '睡眠大师', text: '每天睡眠长达 12 小时，真正的躺平达人。' },
];

const factsGrid = document.getElementById('factsGrid');
facts.forEach((f, i) => {
  const card = document.createElement('div');
  card.className = `fact-card reveal reveal-delay-${(i % 4) + 1}`;
  card.innerHTML = `
    <div class="fact-icon">${f.icon}</div>
    <div class="fact-title">${f.title}</div>
    <div class="fact-text">${f.text}</div>
  `;
  card.addEventListener('click', () => {
    card.style.borderColor = 'rgba(200,134,74,0.5)';
    setTimeout(() => card.style.borderColor = '', 600);
  });
  factsGrid.appendChild(card);
});

// ── 喂食游戏 ──
const foods = [
  { emoji: '🌿', happy: '😋', msg: '嫩草！最爱了～', satiety: 8 },
  { emoji: '🍉', happy: '🤩', msg: '西瓜！太甜了！', satiety: 15 },
  { emoji: '🥕', happy: '😄', msg: '胡萝卜，脆脆的！', satiety: 10 },
  { emoji: '🍓', happy: '🥰', msg: '草莓！甜甜的！', satiety: 12 },
  { emoji: '🌽', happy: '😊', msg: '玉米，香香的～', satiety: 10 },
  { emoji: '🍎', happy: '😁', msg: '苹果！咔嚓咔嚓！', satiety: 11 },
  { emoji: '🥦', happy: '🤗', msg: '西兰花，营养满满！', satiety: 9 },
  { emoji: '🍌', happy: '😆', msg: '香蕉！软软甜甜！', satiety: 10 },
];
const feedFace    = document.getElementById('feedFace');
const feedCount   = document.getElementById('feedCount');
const feedBubble  = document.getElementById('feedBubble');
const feedPFill   = document.getElementById('feedProgressFill');
const foodBar     = document.getElementById('foodBar');
let feedTotal = 0;
let satiety = 0;

function updateSatiety(add) {
  satiety = Math.min(100, satiety + add);
  if (feedPFill) feedPFill.style.width = satiety + '%';
  if (satiety >= 100) {
    feedFace.textContent = '🎉';
    Toast.show('巴猪吃饱啦！超级开心！+5 🪙');
    Coins.add(5);
    spawnCoinPop(5, window.innerWidth / 2, window.innerHeight / 2);
    satiety = 0;
    setTimeout(() => { feedFace.textContent = '😊'; if (feedPFill) feedPFill.style.width = '0%'; }, 2000);
  }
}

function showFeedBubble(msg) {
  if (!feedBubble) return;
  feedBubble.textContent = msg;
  feedBubble.classList.add('show');
  clearTimeout(feedBubble._t);
  feedBubble._t = setTimeout(() => feedBubble.classList.remove('show'), 1800);
}

foods.forEach(food => {
  const btn = document.createElement('button');
  btn.className = 'food-btn';
  btn.textContent = food.emoji;
  btn.title = food.msg;
  btn.addEventListener('click', (e) => {
    feedTotal++;
    feedCount.textContent = feedTotal;
    feedFace.textContent = food.happy;
    feedFace.classList.remove('pop');
    void feedFace.offsetWidth;
    feedFace.classList.add('pop');
    showFeedBubble(food.msg);
    updateMood(5);
    updateSatiety(food.satiety);
    Coins.add(1);
    spawnCoinPop(1, e.clientX, e.clientY);
    SFX.feed();

    const fl = document.createElement('div');
    fl.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;font-size:1.8rem;pointer-events:none;z-index:9997;animation:coinFly 1s ease forwards`;
    fl.textContent = food.emoji;
    document.body.appendChild(fl);
    setTimeout(() => fl.remove(), 1000);

    setTimeout(() => { feedFace.textContent = '😊'; }, 1400);
  });
  foodBar.appendChild(btn);
});

// ── 相册 ──
const LIKES_KEY = 'bazhu_likes_v2';
const savedLikes = JSON.parse(localStorage.getItem(LIKES_KEY) || '{}');

const galleryItems = [
  { id:'walk',  emoji: '🐾', caption: '悠闲散步中', likes: 128 },
  { id:'spa',   emoji: '🛁', caption: '泡温泉啦！', likes: 256 },
  { id:'sleep', emoji: '😴', caption: '午睡时间',   likes: 312 },
  { id:'grass', emoji: '🌿', caption: '吃草草',     likes: 89  },
  { id:'friend',emoji: '🤝', caption: '交新朋友',   likes: 174 },
  { id:'swim',  emoji: '🌊', caption: '游泳冠军',   likes: 203 },
  { id:'music', emoji: '🎵', caption: '心情很好',   likes: 145 },
  { id:'spring',emoji: '🌸', caption: '春天来了',   likes: 267 },
];

const galleryGrid = document.getElementById('galleryGrid');
galleryItems.forEach((item, i) => {
  // 读取持久化的点赞数
  let likes = savedLikes[item.id] ?? item.likes;
  const card = document.createElement('div');
  card.className = `gallery-card reveal reveal-delay-${(i % 4) + 1}`;
  card.innerHTML = `
    <button class="like-btn">❤️</button>
    <span class="gallery-emoji">${item.emoji}</span>
    <div class="gallery-caption">${item.caption}</div>
    <div class="gallery-likes">❤️ <span class="lc">${likes}</span></div>
  `;
  const likeBtn = card.querySelector('.like-btn');
  const lc = card.querySelector('.lc');
  likeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    likes++;
    lc.textContent = likes;
    savedLikes[item.id] = likes;
    localStorage.setItem(LIKES_KEY, JSON.stringify(savedLikes));
    likeBtn.classList.remove('liked');
    void likeBtn.offsetWidth;
    likeBtn.classList.add('liked');
    updateMood(2);
  });
  galleryGrid.appendChild(card);
});

// reveal 重新触发（动态插入的元素）
setTimeout(initReveal, 50);

// 心情自然衰减
setInterval(() => updateMood(-1), 8000);
