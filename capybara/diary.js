/* 日记页逻辑 v2.0 */

// 日期显示
const now = new Date();
document.getElementById('writeDate').textContent =
  `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`;

// 字数统计
const textarea = document.getElementById('diaryInput');
const charCount = document.getElementById('charCount');
textarea.addEventListener('input', () => { charCount.textContent = textarea.value.length; });

// 心情选择
let selectedMood = '😌';
document.querySelectorAll('.mood-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMood = btn.dataset.mood;
  });
});

// 默认日记数据
const defaultDiaries = [
  {
    date: '2026年4月13日', mood: '😌',
    title: '今天泡了三个小时温泉',
    body: '早上起来，阳光暖暖的，我就直接跳进温泉里了。水温刚刚好，我闭上眼睛，感觉整个世界都是我的。旁边的小鸟在我背上跳来跳去，我懒得理它，继续泡。这就是生活。',
    tags: ['温泉', '佛系', '快乐'], user: false,
  },
  {
    date: '2026年4月12日', mood: '😋',
    title: '吃了一整片草地',
    body: '今天发现了一片超嫩的草，我和朋友们一起吃了好久好久。吃饱了就躺下来晒太阳，一只鹭鸶站在我背上，我们就这样待了一个下午。完美的一天。',
    tags: ['吃草', '朋友', '阳光'], user: false,
  },
  {
    date: '2026年4月11日', mood: '😴',
    title: '下雨天最适合睡觉',
    body: '哗哗哗，下雨了。我找了一棵大树躲着，然后就睡着了。梦里我在一片无边无际的草地上跑，跑累了就泡温泉。醒来发现雨停了，天边有彩虹，今天也是好日子。',
    tags: ['下雨', '睡觉', '彩虹'], user: false,
  },
];

const STORAGE_KEY = 'bazhu_diaries_v2';
let diaries = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultDiaries;

function saveDiaries() { localStorage.setItem(STORAGE_KEY, JSON.stringify(diaries)); }

// 筛选功能
let currentFilter = 'all';
document.getElementById('diaryFilter').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  currentFilter = btn.dataset.mood;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTimeline();
});

// 渲染时间轴（支持删除 + 筛选）
function renderTimeline() {
  const tl = document.getElementById('timeline');
  tl.innerHTML = '';
  const reversed = [...diaries].reverse();
  const filtered = currentFilter === 'all'
    ? reversed
    : reversed.filter(d => d.mood === currentFilter);

  if (filtered.length === 0) {
    tl.innerHTML = `<div style="text-align:center;color:var(--text-4);padding:var(--sp-7);font-size:0.9rem;font-weight:700">没有找到这个心情的日记 🥺</div>`;
    return;
  }

  filtered.forEach((d, i) => {
    const realIdx = diaries.indexOf(d);
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.style.transitionDelay = `${i * 60}ms`;
    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="diary-card">
        <div class="diary-meta">
          <span class="diary-mood-badge">${d.mood}</span>
          <span class="diary-date-text">${d.date}</span>
          ${d.user ? '<span class="diary-user-badge">✏️ 我写的</span>' : ''}
          ${d.user ? `<button class="diary-del-btn" title="删除">🗑️</button>` : ''}
        </div>
        <div class="diary-title-text">${d.title}</div>
        <div class="diary-body-text">${d.body}</div>
        <div class="diary-tags-row">
          ${d.tags.map(t => `<span class="diary-tag">#${t}</span>`).join('')}
        </div>
      </div>
    `;
    item.querySelector('.diary-card').addEventListener('click', e => {
      if (e.target.closest('.diary-del-btn')) return;
      item.querySelector('.diary-card').classList.toggle('expanded');
    });
    const delBtn = item.querySelector('.diary-del-btn');
    if (delBtn) {
      delBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm('确定删除这篇日记吗？')) return;
        diaries.splice(realIdx, 1);
        saveDiaries();
        renderTimeline();
        Toast.show('日记已删除');
      });
    }
    tl.appendChild(item);
    requestAnimationFrame(() => requestAnimationFrame(() => item.classList.add('visible')));
  });
}

// 发布日记
document.getElementById('submitDiary').addEventListener('click', () => {
  const text = textarea.value.trim();
  if (!text) { Toast.show('请先写点什么吧～ 🥺'); return; }
  const dateStr = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`;
  diaries.push({
    date: dateStr,
    mood: selectedMood,
    title: text.slice(0, 20) + (text.length > 20 ? '...' : ''),
    body: text,
    tags: ['我写的', '巴猪'],
    user: true,
  });
  saveDiaries();
  renderTimeline();
  textarea.value = '';
  charCount.textContent = '0';
  Coins.add(3);
  Toast.show('日记发布成功！+3 🪙 巴猪很感动 🥺');
  // 滚动到时间轴顶部，让用户看到刚发布的日记
  setTimeout(() => {
    const tl = document.getElementById('timeline');
    if (tl) tl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
});

renderTimeline();
