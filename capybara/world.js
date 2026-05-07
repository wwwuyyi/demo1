/* 世界地图页逻辑 v2.0 */

const locations = {
  river: {
    icon: '🌊', name: '巴猪河',
    desc: '一条清澈的大河，巴猪最爱在这里游泳。水流平缓，水草丰美，是巴猪族群最常聚集的地方。',
    activities: ['🏊 游泳', '🌿 觅食', '🤝 社交'],
    reward: 8,
    story: '巴猪跳进河里，溅起一大片水花。它在水里转了好几圈，然后爬上岸，抖了抖身上的水，满足地叹了口气。',
  },
  hotspring: {
    icon: '♨️', name: '温泉谷',
    desc: '隐藏在山谷中的天然温泉，水温常年保持在 38°C。巴猪最爱在这里泡澡，有时一泡就是一整天。',
    activities: ['🛁 泡温泉', '😴 打盹', '🌸 赏花'],
    reward: 12,
    story: '巴猪慢慢走进温泉，热气腾腾。它闭上眼睛，发出满足的呼噜声。旁边的小鸟也跳进来凑热闹。',
  },
  grassland: {
    icon: '🌿', name: '大草原',
    desc: '一望无际的绿色草原，嫩草鲜美，是巴猪的天然食堂。每到傍晚，整个族群都会来这里吃晚饭。',
    activities: ['🌿 吃草', '☀️ 晒太阳', '🦜 和鸟玩'],
    reward: 6,
    story: '巴猪低下头，大口大口地吃着嫩草。一只鹭鸶飞来，站在它背上，两个好朋友就这样度过了整个下午。',
  },
  forest: {
    icon: '🌳', name: '神秘森林',
    desc: '一片古老的热带雨林，里面住着各种奇怪的动物。巴猪偶尔会来这里探险，但通常很快就迷路了。',
    activities: ['🔍 探险', '🍄 找蘑菇', '🦋 追蝴蝶'],
    reward: 15,
    story: '巴猪小心翼翼地走进森林，树叶沙沙作响。突然，一只五彩斑斓的蝴蝶飞过，巴猪忍不住追了上去……',
  },
  village: {
    icon: '🏡', name: '巴猪村',
    desc: '巴猪族群的大本营，这里住着二十多只巴猪。每天傍晚，大家聚在一起互相梳理毛发，温馨极了。',
    activities: ['🤗 互相梳毛', '🎵 唱歌', '🌙 看星星'],
    reward: 10,
    story: '回到村子，巴猪的朋友们都在等它。大家挤在一起，互相梳理毛发，分享今天的见闻，幸福极了。',
  },
  secret: {
    icon: '🔒', name: '神秘地点',
    desc: '???',
    activities: [],
    reward: 0,
    locked: true,
  },
};

const VISITED_KEY = 'bazhu_visited_v2';
const LOGS_KEY    = 'bazhu_logs_v2';
const COOLDOWN_KEY = 'bazhu_cooldown_v2';

let visited  = JSON.parse(localStorage.getItem(VISITED_KEY)  || '[]');
let logs     = JSON.parse(localStorage.getItem(LOGS_KEY)     || '[]');
let cooldowns = JSON.parse(localStorage.getItem(COOLDOWN_KEY) || '{}');

const COOLDOWN_MS = 2 * 60 * 1000; // 2分钟冷却

function saveVisited()  { localStorage.setItem(VISITED_KEY,  JSON.stringify(visited)); }
function saveLogs()     { localStorage.setItem(LOGS_KEY,     JSON.stringify(logs.slice(0, 20))); }
function saveCooldowns(){ localStorage.setItem(COOLDOWN_KEY, JSON.stringify(cooldowns)); }

// 标记已访问的地点
function updatePins() {
  document.querySelectorAll('.map-pin').forEach(pin => {
    const id = pin.dataset.id;
    if (visited.includes(id)) pin.classList.add('visited');
  });
}

// 点击地点
document.querySelectorAll('.map-pin').forEach(pin => {
  pin.addEventListener('click', () => {
    const id = pin.dataset.id;
    const loc = locations[id];
    if (!loc) return;

    const panel = document.getElementById('locationPanel');
    document.getElementById('panelIcon').textContent  = loc.icon;
    document.getElementById('panelTitle').textContent = loc.name;
    document.getElementById('panelDesc').textContent  = loc.locked ? '这个地方还没有解锁，继续探索其他地点吧！' : loc.desc;

    const actEl = document.getElementById('panelActivity');
    actEl.innerHTML = loc.activities.map(a => `<span class="activity-tag">${a}</span>`).join('');

    updatePanelState(id, loc);
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    document.getElementById('panelVisit').onclick = () => visitLocation(id, loc);
  });
});

// 实时更新面板状态（含倒计时）
let countdownTimer = null;
function updatePanelState(id, loc) {
  const rewardEl = document.getElementById('panelReward');
  const visitBtn = document.getElementById('panelVisit');
  if (!rewardEl || !visitBtn) return;

  if (loc.locked) {
    rewardEl.style.display = 'none';
    visitBtn.disabled = true;
    visitBtn.textContent = '🔒 尚未解锁';
    clearInterval(countdownTimer);
    return;
  }

  function refresh() {
    const lastVisit = cooldowns[id] || 0;
    const remaining = COOLDOWN_MS - (Date.now() - lastVisit);
    const onCooldown = remaining > 0;
    rewardEl.style.display = 'block';
    if (onCooldown) {
      const secs = Math.ceil(remaining / 1000);
      const m = Math.floor(secs / 60), s = secs % 60;
      rewardEl.textContent = `⏳ ${m}:${String(s).padStart(2,'0')} 后可再探索`;
      visitBtn.disabled = true;
      visitBtn.textContent = '⏳ 休息中...';
    } else {
      rewardEl.textContent = `探索奖励：+${loc.reward} 🪙`;
      visitBtn.disabled = false;
      visitBtn.textContent = visited.includes(id) ? '再次探索 🔄' : '探索这里 🐾';
      clearInterval(countdownTimer);
    }
  }

  clearInterval(countdownTimer);
  refresh();
  countdownTimer = setInterval(refresh, 1000);
}

document.getElementById('panelClose').addEventListener('click', () => {
  document.getElementById('locationPanel').style.display = 'none';
  clearInterval(countdownTimer);
});

function visitLocation(id, loc) {
  if (loc.locked) return;

  // 冷却检查
  const lastVisit = cooldowns[id] || 0;
  if (Date.now() - lastVisit < COOLDOWN_MS) {
    Toast.show('巴猪还在休息，稍后再来吧 😴');
    return;
  }

  // 记录冷却时间
  cooldowns[id] = Date.now();
  saveCooldowns();

  // 奖励金币
  Coins.add(loc.reward);
  spawnCoinPop(loc.reward, window.innerWidth / 2, window.innerHeight / 2);
  Toast.show(`探索了 ${loc.name}！+${loc.reward} 🪙`);

  // 标记已访问
  if (!visited.includes(id)) visited.push(id);
  saveVisited();
  updatePins();

  // 添加日志并持久化
  addLog(loc);

  // 更新面板（触发实时倒计时）
  updatePanelState(id, loc);

  // 检查是否解锁秘密地点
  if (visited.length >= 4 && !visited.includes('secret')) {
    unlockSecret();
  }
}

function unlockSecret() {
  const secretPin = document.querySelector('.map-pin[data-id="secret"]');
  if (secretPin) {
    secretPin.classList.remove('locked');
    secretPin.querySelector('.pin-label').textContent = '🌟 秘密基地';
  }
  locations.secret = {
    icon: '🌟', name: '秘密基地',
    desc: '恭喜你发现了巴猪的秘密基地！这里藏着巴猪最珍贵的宝贝：一块超大的西瓜和一个永远温热的温泉。',
    activities: ['🍉 吃大西瓜', '♨️ 私人温泉', '⭐ 许愿'],
    reward: 30,
    locked: false,
  };
  Toast.show('🌟 解锁了秘密基地！快去探索！');
}

function addLog(loc) {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  logs.unshift({ icon: loc.icon, name: loc.name, reward: loc.reward, time: timeStr, story: loc.story });
  saveLogs();
  renderLogs();
}

function renderLogs() {
  const list = document.getElementById('logList');
  if (logs.length === 0) {
    list.innerHTML = '<div class="log-empty">还没有探索记录，点击地图上的地点开始吧！</div>';
    return;
  }
  list.innerHTML = '';
  logs.slice(0, 8).forEach(log => {
    const item = document.createElement('div');
    item.className = 'log-item';
    item.innerHTML = `
      <span class="log-icon">${log.icon}</span>
      <span class="log-text">${log.story || '探索了 ' + log.name}</span>
      <span class="log-coins">+${log.reward} 🪙</span>
      <span class="log-time">${log.time}</span>
    `;
    list.appendChild(item);
  });
}

updatePins();
renderLogs(); // 恢复持久化的探索日志
