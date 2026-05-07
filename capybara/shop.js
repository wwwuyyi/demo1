/* 商店页逻辑 v2.0 */

const OWNED_KEY    = 'bazhu_owned_v2';
const EQUIPPED_KEY = 'bazhu_equipped_v2';

let owned    = JSON.parse(localStorage.getItem(OWNED_KEY) || '[]');
let equipped = localStorage.getItem(EQUIPPED_KEY) || '';

const shopItems = [
  { id: 'flower',   emoji: '🌸', name: '樱花发饰', price: 10 },
  { id: 'crown',    emoji: '👑', name: '小皇冠',   price: 25 },
  { id: 'hat',      emoji: '🎩', name: '绅士帽',   price: 20 },
  { id: 'bow',      emoji: '🎀', name: '蝴蝶结',   price: 8  },
  { id: 'star',     emoji: '⭐', name: '星星头饰', price: 15 },
  { id: 'mushroom', emoji: '🍄', name: '蘑菇帽',   price: 18 },
  { id: 'rainbow',  emoji: '🌈', name: '彩虹光环', price: 35 },
  { id: 'leaf',     emoji: '🍃', name: '树叶帽',   price: 5  },
];

function save() {
  localStorage.setItem(OWNED_KEY, JSON.stringify(owned));
  localStorage.setItem(EQUIPPED_KEY, equipped);
}

function updateCoinsDisplay() {
  document.getElementById('shopCoins').textContent = Coins.get();
}

function updatePreview() {
  const item = shopItems.find(i => i.id === equipped);
  const previewItem = document.getElementById('previewItem');
  const previewName = document.getElementById('previewName');
  if (previewItem) {
    previewItem.textContent = item ? item.emoji : '';
    // 试穿弹跳动画
    previewItem.style.transform = 'translateX(-50%) scale(1.5)';
    setTimeout(() => { previewItem.style.transform = 'translateX(-50%) scale(1)'; }, 300);
  }
  if (previewName) previewName.textContent = item ? item.name : '未装备';
}

function renderShop() {
  const grid = document.getElementById('shopGrid');
  grid.innerHTML = '';
  shopItems.forEach((item, i) => {
    const isOwned = owned.includes(item.id);
    const canAfford = Coins.get() >= item.price;
    const card = document.createElement('div');
    card.className = `shop-card reveal reveal-delay-${(i % 4) + 1}${isOwned ? ' owned' : ''}`;
    card.innerHTML = `
      <span class="shop-card-emoji">${item.emoji}</span>
      <div class="shop-card-name">${item.name}</div>
      <div class="shop-card-price">🪙 ${item.price}</div>
      ${isOwned
        ? `<span class="owned-tag">✓ 已拥有</span>`
        : `<button class="btn ${canAfford ? 'btn-gold' : 'btn-soft'}" data-id="${item.id}" ${!canAfford ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>购买</button>`
      }
    `;
    if (!isOwned) {
      const btn = card.querySelector('button');
      if (btn && !btn.disabled) {
        btn.addEventListener('click', () => buyItem(item, card));
      }
    }
    grid.appendChild(card);
  });
  setTimeout(initReveal, 50);
}

function renderWardrobe() {
  const grid = document.getElementById('wardrobeGrid');
  if (owned.length === 0) {
    grid.innerHTML = '<span class="wardrobe-empty">还没有道具，快去购买吧！</span>';
    return;
  }
  grid.innerHTML = '';
  owned.forEach(id => {
    const item = shopItems.find(i => i.id === id);
    if (!item) return;
    const el = document.createElement('div');
    el.className = `wardrobe-item${equipped === id ? ' equipped' : ''}`;
    el.textContent = item.emoji;
    el.title = item.name;
    el.addEventListener('click', () => {
      equipped = equipped === id ? '' : id;
      save();
      updatePreview();
      renderWardrobe();
    });
    grid.appendChild(el);
  });
}

function buyItem(item, card) {
  if (!Coins.spend(item.price)) {
    Toast.show(`还差 ${item.price - Coins.get()} 🪙，去答题赚币吧 🧠`);
    // 高亮「去赚币」按钮
    const earnBtn = document.querySelector('.coins-display .btn-soft');
    if (earnBtn) {
      earnBtn.style.transform = 'scale(1.08)';
      earnBtn.style.boxShadow = '0 0 0 3px rgba(168,96,48,0.3)';
      setTimeout(() => { earnBtn.style.transform = ''; earnBtn.style.boxShadow = ''; }, 1200);
    }
    return;
  }
  owned.push(item.id);
  save();
  SFX.buy();
  updateCoinsDisplay();
  renderShop();
  renderWardrobe();
  Toast.show(`购买成功！巴猪戴上了 ${item.emoji} ${item.name}`);
}

// 监听金币变化
document.addEventListener('coins:change', updateCoinsDisplay);

updateCoinsDisplay();
updatePreview();
renderShop();
renderWardrobe();
