/* 问答页逻辑 v2.0 */

const questions = [
  { q: '巴猪是世界上最大的什么动物？', options: ['灵长类动物','啮齿动物','有蹄类动物','食肉动物'], answer: 1, explain: '巴猪是世界上最大的啮齿动物，体重可达 65 公斤！' },
  { q: '巴猪可以在水下憋气多长时间？', options: ['1 分钟','3 分钟','5 分钟','10 分钟'], answer: 2, explain: '巴猪可以在水下憋气长达 5 分钟，是游泳高手！' },
  { q: '巴猪的脚趾之间有什么特殊结构？', options: ['爪子','蹼','吸盘','毛发'], answer: 1, explain: '巴猪脚趾间有蹼，帮助它们在水中快速游泳。' },
  { q: '巴猪通常以多少只为一群生活？', options: ['1-3 只','5-8 只','10-20 只','50 只以上'], answer: 2, explain: '巴猪喜欢群居，通常 10-20 只一起生活。' },
  { q: '巴猪每天大约睡多少小时？', options: ['4 小时','8 小时','12 小时','20 小时'], answer: 2, explain: '巴猪每天睡眠长达 12 小时，真正的躺平达人！' },
  { q: '巴猪是什么食性的动物？', options: ['肉食性','杂食性','草食性','腐食性'], answer: 2, explain: '巴猪只吃植物，是纯粹的素食主义者。' },
  { q: '哪个国家的动物园因巴猪泡温泉而出名？', options: ['中国','美国','巴西','日本'], answer: 3, explain: '日本动物园的巴猪泡温泉视频风靡全网！' },
  { q: '巴猪被称为"动物界的外交官"，原因是什么？', options: ['它会说话','性格温和，和所有动物都能相处','它是动物园明星','它会表演节目'], answer: 1, explain: '巴猪性格极其温和，几乎和所有动物都能和平相处。' },
  { q: '巴猪的原产地是哪里？', options: ['非洲','亚洲','南美洲','北美洲'], answer: 2, explain: '巴猪原产于南美洲，主要分布在亚马逊流域。' },
  { q: '巴猪成年后体重大约是多少？', options: ['10-20 公斤','35-65 公斤','80-100 公斤','超过 150 公斤'], answer: 1, explain: '成年巴猪体重通常在 35-65 公斤之间。' },
  { q: '巴猪的天敌不包括以下哪种动物？', options: ['美洲豹','水蟒','鳄鱼','大象'], answer: 3, explain: '大象不是巴猪的天敌，美洲豹、水蟒和鳄鱼才是。' },
  { q: '巴猪一次能生几只幼崽？', options: ['1 只','2-8 只','10 只以上','只生 1 只'], answer: 1, explain: '巴猪每胎通常产 2-8 只幼崽，平均约 4 只。' },
  { q: '巴猪的寿命大约是多少年？', options: ['3-5 年','8-12 年','20-30 年','超过 50 年'], answer: 1, explain: '野生巴猪寿命约 8-12 年，圈养可达 12 年以上。' },
  { q: '巴猪的牙齿有什么特点？', options: ['没有牙齿','只有门牙','会持续生长','和人类一样'], answer: 2, explain: '巴猪是啮齿动物，门牙会持续生长，需要不断啃食来磨牙。' },
  { q: '巴猪喜欢在什么时间段活动？', options: ['正午','深夜','清晨和傍晚','全天随机'], answer: 2, explain: '巴猪通常在清晨和傍晚最活跃，避开正午的高温。' },
  { q: '以下哪个说法关于巴猪是正确的？', options: ['它是肉食动物','它不会游泳','它是独居动物','它的汗腺分泌物可防晒'], answer: 3, explain: '巴猪皮肤会分泌一种天然防晒物质，保护皮肤不被晒伤！' },
];

const COIN_PER_CORRECT = 5;
let current = 0, score = 0, earnedCoins = 0, answered = false;
let shuffled = shuffle(questions);

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

const liveScore  = document.getElementById('liveScore');
const liveCoins  = document.getElementById('liveCoins');
const quizFill   = document.getElementById('quizFill');
const quizProg   = document.getElementById('quizProgress');
const quizQ      = document.getElementById('quizQuestion');
const quizOpts   = document.getElementById('quizOptions');
const quizFB     = document.getElementById('quizFeedback');
const quizNext   = document.getElementById('quizNext');

function renderQuestion() {
  answered = false;
  quizNext.style.display = 'none';
  quizFB.className = 'quiz-feedback';
  quizFB.innerHTML = '';

  const q = shuffled[current];
  quizProg.textContent = `第 ${current + 1} 题 / 共 ${shuffled.length} 题`;
  quizFill.style.width = (current / shuffled.length * 100) + '%';
  quizQ.textContent = q.q;
  quizOpts.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i, btn));
    quizOpts.appendChild(btn);
  });
}

function selectAnswer(idx, btn) {
  if (answered) return;
  answered = true;
  const q = shuffled[current];
  document.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);

  if (idx === q.answer) {
    score++;
    earnedCoins += COIN_PER_CORRECT;
    btn.classList.add('correct');
    Coins.add(COIN_PER_CORRECT);
    liveScore.textContent = score;
    liveCoins.textContent = earnedCoins;
    spawnCoinPop(COIN_PER_CORRECT, window.innerWidth / 2, window.innerHeight / 2);
    SFX.correct();
    quizFB.innerHTML = `✅ 答对了！+${COIN_PER_CORRECT} 🪙<br><span style="font-weight:600;opacity:0.8">${q.explain}</span>`;
    quizFB.className = 'quiz-feedback show ok';
  } else {
    document.querySelectorAll('.quiz-option')[q.answer].classList.add('correct');
    btn.classList.add('wrong');
    SFX.wrong();
    quizFB.innerHTML = `❌ 答错了。<br><span style="font-weight:600;opacity:0.8">${q.explain}</span>`;
    quizFB.className = 'quiz-feedback show no';
  }
  quizNext.style.display = 'inline-flex';
}

quizNext.addEventListener('click', () => {
  current++;
  if (current >= shuffled.length) showResult();
  else renderQuestion();
});

function showResult() {
  quizFill.style.width = '100%';
  document.getElementById('quizBody').style.display = 'none';
  const result = document.getElementById('quizResult');
  result.style.display = 'block';

  const total = shuffled.length;
  document.getElementById('resultScore').textContent = `${score} / ${total}`;

  let emoji, title, desc;
  if (score === total)          { emoji='🏆'; title='满分！巴猪专家！'; desc='你对巴猪了如指掌，巴猪要给你颁奖了！'; }
  else if (score >= total*.75)  { emoji='🎉'; title='非常棒！'; desc='你对巴猪了解很深，继续加油！'; }
  else if (score >= total*.5)   { emoji='😊'; title='还不错哦！'; desc='多和巴猪相处，你会了解更多的！'; }
  else                          { emoji='🥺'; title='需要多学习！'; desc='没关系，多看看巴猪冷知识，下次一定行！'; }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultDesc').textContent  = desc;
  document.getElementById('resultReward').textContent =
    `🪙 本局共获得 ${earnedCoins} 爱心币！当前共 ${Coins.get()} 枚`;

  // 满分撒花
  if (score === total) spawnConfetti();
}

function spawnConfetti() {
  const colors = ['🎊','🎉','⭐','🌟','✨','🏆','🥳','🎈'];
  for (let i = 0; i < 24; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = colors[Math.floor(Math.random() * colors.length)];
      el.style.cssText = `
        position:fixed; pointer-events:none; z-index:9999;
        font-size:${1.2 + Math.random() * 1.2}rem;
        left:${Math.random() * 100}vw; top:-40px;
        animation: confettiFall ${1.5 + Math.random() * 1.5}s ease-in forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3200);
    }, i * 80);
  }
  // 注入动画
  if (!document.getElementById('confettiStyle')) {
    const s = document.createElement('style');
    s.id = 'confettiStyle';
    s.textContent = `@keyframes confettiFall {
      0%   { transform: translateY(0) rotate(0deg);   opacity:1; }
      100% { transform: translateY(105vh) rotate(720deg); opacity:0; }
    }`;
    document.head.appendChild(s);
  }
}

document.getElementById('retryBtn').addEventListener('click', () => {
  current = 0; score = 0; earnedCoins = 0;
  shuffled = shuffle(questions);
  liveScore.textContent = '0';
  liveCoins.textContent = '0';
  quizFill.style.width = '0%';
  document.getElementById('quizBody').style.display = 'block';
  document.getElementById('quizResult').style.display = 'none';
  renderQuestion();
});

renderQuestion();
