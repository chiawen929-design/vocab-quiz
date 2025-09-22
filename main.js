/***** ========= 小工具 ========= *****/
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

/***** ========= 狀態 ========= *****/
let CURRENT = { profileKey: 'lulu', qa: [], words: [] };
// INLINE_MODE: 0=隱藏, 1=只顯示提示(詞性+規則), 2=顯示完整解答
let INLINE_MODE = 0;

/***** ========= 延伸例句（可自行擴充） ========= *****/
const EXPLAINS = {
  run: { examples: [
    { en: "run fast", zh: "跑很快" },
    { en: "run to school", zh: "跑去學校" }
  ]},
  patience: { examples: [
    { en: "have patience in class", zh: "上課要有耐心" },
    { en: "show patience with homework", zh: "對作業有耐心" }
  ]},
  defeat: { examples: [
    { en: "defeat the other team", zh: "打敗對手" },
    { en: "defeat a bad habit", zh: "克服壞習慣" }
  ]},
  temper: { examples: [
    { en: "lose one’s temper", zh: "發脾氣" },
    { en: "control your temper", zh: "控制脾氣" }
  ]},
  complain: { examples: [
    { en: "complain about the noise", zh: "抱怨噪音" },
    { en: "complain to the teacher", zh: "向老師抱怨" }
  ]},
  remember: { examples: [
    { en: "remember to bring your book", zh: "記得帶書" },
    { en: "remember the rule", zh: "記得規則" }
  ]},
  encourage: { examples: [
    { en: "encourage kids to try", zh: "鼓勵孩子嘗試" },
    { en: "give words of encouragement", zh: "鼓勵的話" }
  ]},
  distinguish: { examples: [
    { en: "distinguish A from B", zh: "分辨A與B" },
    { en: "hard to distinguish", zh: "難以分辨" }
  ]},
  achieve: { examples: [
    { en: "achieve a goal", zh: "達成目標" },
    { en: "achieve success", zh: "獲得成功" }
  ]},
  command: { examples: [
    { en: "give a command", zh: "下達命令" },
    { en: "follow the command", zh: "遵守命令" }
  ]},
  figured: { examples: [
    { en: "figure out the answer", zh: "想出答案" },
    { en: "finally figure out", zh: "終於想通" }
  ]}
};

/* =============== Tabs =============== */
function initTabs() {
  $('#tab-lulu')?.addEventListener('click', () => switchProfile('lulu'));
  $('#tab-sherry')?.addEventListener('click', () => switchProfile('sherry'));
  switchProfile('lulu');
}
function switchProfile(key) {
  CURRENT.profileKey = key;
  $('#tab-lulu').classList.toggle('active', key === 'lulu');
  $('#tab-sherry').classList.toggle('active', key === 'sherry');
  renderLessonList();
}

/* =============== Lessons =============== */
function renderLessonList() {
  const group = PROFILES[CURRENT.profileKey].group;
  const box = $('#lessonList');
  const html = Object.entries(LESSONS)
    .filter(([, obj]) => obj.group === group)
    .map(([id, obj]) => {
      const wordsHtml = (obj.words || []).map(w => {
        const zh = SIMPLE_TRANSLATE[w] || '';
        const pos = POS[w] || '';
        const dup = DUP.includes(w);
        return `
          <div class="word-card">
            <div class="word-en">${w}</div>
            ${dup ? '<span class="dup-star">*</span>' : ''}
            <div class="word-pos">${pos}</div>
            <div class="word-zh">${zh}</div>
          </div>`;
      }).join('');
      return `<div class="lesson-box">
        <div class="lesson-bar">
          <label class="flex items-center gap-2">
            <input type="checkbox" class="lessonCk" value="${id}" checked />
            <span>${obj.title}</span>
          </label>
          <span class="toggle ml-auto toggle-btn" data-id="${id}">展開 / 收合</span>
        </div>
        <div id="words_${id}" class="word-list hidden">
          ${wordsHtml}
        </div>
      </div>`;
    }).join('');
  box.innerHTML = html;
  $$('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () =>
      $('#words_' + btn.dataset.id).classList.toggle('hidden')
    );
  });
}
function getSelectedLessons() {
  return $$('.lessonCk:checked').map(el => el.value);
}
function buildWordPool() {
  const pool = {};
  getSelectedLessons().forEach(id => {
    (LESSONS[id]?.words || []).forEach(w => {
      if (BANK[w]) pool[w] = BANK[w];
    });
  });
  return pool;
}

/* =============== Make QA =============== */
// 隨機抽「10 個不重複單字」，每個單字隨機取 easy/medium/hard 其中一句
function pickByLevel(entry) {
  if (!entry) return { en: '______', zh: '' };
  // 允許 entry.easy/medium/hard 是單物件或陣列
  const bucket = v =>
    Array.isArray(v) ? v.filter(x => x && x.en) : (v && v.en ? [v] : []);
  const candidates = [
    ...bucket(entry.easy),
    ...bucket(entry.medium),
    ...bucket(entry.hard),
    ...bucket(entry.extra) // 若你採用 extra 擴充
  ];
  if (!candidates.length) return { en: '______', zh: '' };
  return pick(candidates);
}
function makeQA(pool, MUST = 10) {
  const vocab = Object.keys(pool);
  if (vocab.length < MUST) {
    alert('可用單字少於 10 個，請多勾選幾個課次。');
    return [];
  }
  const chosen = [...vocab].sort(() => Math.random() - 0.5).slice(0, MUST);
  return chosen.map(w => [w, pickByLevel(pool[w])]);
}

/* =============== Render =============== */
function formatWordBank(words) {
  return `<div class="bank-grid">${words
    .sort()
    .map(w => `<div class="bank-chip" data-word="${w}">${w}</div>`)
    .join('')}</div>`;
}
function renderQA() {
  const qList = $('#questionList'),
        aList = $('#answerList');
  qList.innerHTML = '';
  aList.innerHTML = '';

  CURRENT.qa.forEach(([ans, tpl], i) => {
    const li = document.createElement('li');
    li.innerHTML = tpl.en.replace(
      '______',
      `<input id="q_${i}" class="answer" type="text" />`
    );
    qList.appendChild(li);

    const ai = document.createElement('li');
    ai.innerHTML = `<span class="keyword">${ans}</span> — ${tpl.zh}`;
    aList.appendChild(ai);
  });

  const words = CURRENT.qa.map(([w]) => w);
  $('#wordBank').innerHTML = formatWordBank(words);

  // 重置 inline 狀態與按鈕文字
  INLINE_MODE = 0;
  updateInlineButton();

  // bank 點貼答案到焦點輸入框
  let currentInput = null;
  $$('#questionList input.answer').forEach(inp =>
    inp.addEventListener('focus', () => (currentInput = inp))
  );
  $('#wordBank').addEventListener('click', e => {
    const chip = e.target.closest('.bank-chip');
    if (!chip || !currentInput) return;
    currentInput.value = chip.dataset.word;
  });

  $('#answerPanel').classList.add('hidden');
  $('#scoreBox').innerHTML = '';
}

/***** ========= 批改 & 分數 ========= *****/
function buildStars(c,t){return '★'.repeat(Math.round(c/t*5))+'☆'.repeat(5-Math.round(c/t*5));}
function praise(c,t){ if(c===t) return '太棒了！小天才 🏆'; if(c>=t*0.8) return '好厲害！差一點就滿分 🌟'; if(c>=t*0.5) return '不錯哦～繼續加油 💪'; return '沒關係，下次會更好 🍀'; }
function gradeSheet(){
  let c=0; CURRENT.qa.forEach(([ans],i)=>{const el=$(`#q_${i}`); if(!el)return;
    const ok=(el.value||'').trim().toLowerCase()===ans.toLowerCase();
    el.classList.remove('correct','wrong'); el.classList.add(ok?'correct':'wrong'); if(ok)c++;});
  const t=CURRENT.qa.length;
  $('#scoreBox').innerHTML=`<div><span style="font-weight:700;">Score：${c} / ${t}</span>
    <span style="margin-left:.4rem;">${buildStars(c,t)}</span></div>
    <div style="color:#0369a1;">${praise(c,t)}</div>`;
}

/***** ========= 題下提示 / 解答 ========= *****/
// 規則型線索（句型偵測）
function inferPOSHint(en){
  const s = en.replace(/\s+/g,' ').trim();
  if (/^(?:The|This|That|A|An)\s+\w+(?:\s+\w+)?\s+______\s+\b(in|on|at|with|to|from|over|under|into|onto|through|across|behind|beside|near|around|before|after|by|for)\b/i.test(s))
    return '主詞 + 動詞 + 介系詞片語 → 通常是「動詞」。';
  if (/^(We|I|They|He|She|It)\s+______\b/i.test(s))
    return '主詞 + 動詞 → 通常是「動詞」。';
  if (/\bto\s+______\b/i.test(s))
    return 'to + 原形動詞 → 填「動詞原形」。';
  if (/\b(can|will|should|must|may|might|could|would|shall)\s+______\b/i.test(s))
    return '助動詞後接原形 → 填「動詞原形」。';
  if (/\b(a|an|the)\s+______\s+(?!to\b|that\b|who\b|which\b|whom\b|where\b|when\b)\w+\b/i.test(s))
    return 'a/an + ______ + 名詞 → 多半是「形容詞」。';
  if (/\b(a|an|the)\s+\w*(?:ous|ful|able|ible|al|ish|ic|ive|less|y)\s+______\b/i.test(s))
    return 'a/an + 形容詞 + ______ → 多半是「名詞」。';
  if (/\b(a|an|the)\s+______(?:\s+(to|that|who|which|whom|where|when)\b|\b|[.?!,;])/i.test(s))
    return 'a/an + ______（句末/接關係詞）→ 多半是「名詞」。';
  if (/\b(is|am|are|was|were|feel|feels|felt|seem|seems|look|looks|looked|sound|sounds)\s+______\b/i.test(s))
    return 'be/感覺/連繫動詞 + ______ → 多半是「形容詞」。';
  if (/\band\s+______\b/i.test(s))
    return 'and + ______ → 與前詞性一致。';
  return '依文意判斷詞性，注意前後文線索。';
}
function renderExamples(word){
  const data = EXPLAINS[word];
  if (!data) return '';
  if (Array.isArray(data.examples) && data.examples.length){
    const lis = data.examples.map(ex => `<li>${ex.en}${ex.zh ? `（${ex.zh}）` : ''}</li>`).join('');
    return `<ul class="example-list">${lis}</ul>`;
  }
  return '';
}

// 依 INLINE_MODE 渲染提示/解答；提示階段會同時顯示「字典詞性 POS」
function renderInlineBlocks(){
  const list = $('#questionList');
  list.querySelectorAll('.inline-ans').forEach(div => div.remove());
  if (INLINE_MODE === 0) return;

  CURRENT.qa.forEach(([ans, tpl], i) => {
    const li = list.children[i];
    if (!li) return;

    const user = ($(`#q_${i}`)?.value || '').trim();
    const ok = user && user.toLowerCase() === ans.toLowerCase();

    const zhWord = SIMPLE_TRANSLATE?.[ans] ? SIMPLE_TRANSLATE[ans] : '';
    const posDict = (typeof POS !== 'undefined' && POS?.[ans]) ? POS[ans] : ''; // 直接讀取你的 POS 字典
    const posRule = inferPOSHint(tpl.en);
    const examplesHTML = renderExamples(ans);

    const div = document.createElement('div');
    div.className = 'inline-ans' + (INLINE_MODE === 2 ? (' ' + (ok ? 'correct' : 'wrong')) : '');

    if (INLINE_MODE === 1) {
      // 階段 1：只顯示「詞性提示」（POS + 規則）
      div.innerHTML = `
        ${posDict ? `<div class="exp-line">🏷️ <b>字典詞性：</b>${posDict}</div>` : ''}
        <div class="exp-line">📖 <b>句型線索：</b>${posRule}</div>
      `;
    } else {
      // 階段 2：顯示完整解答 + 詞性提示（POS + 規則）+ 延伸例句
      div.innerHTML = `
        <div class="exp-line">✅ <b>答案：</b>
          <span class="keyword ${ok?'correct':''}">${ans}</span>${zhWord?`（${zhWord}）`:''}
          — ${tpl.zh}
        </div>
        ${posDict ? `<div class="exp-line">🏷️ <b>字典詞性：</b>${posDict}</div>` : ''}
        <div class="exp-line">📖 <b>句型線索：</b>${posRule}</div>
        ${examplesHTML ? `
          <div class="exp-line exp-examples">
            <span class="exp-label">🌟 <b>延伸例句：</b></span>
            ${examplesHTML}
          </div>` : ''}
      `;
    }

    li.appendChild(div);
  });
}

// 按鈕文字依狀態更新
function updateInlineButton(){
  const btn = $('#inlineAnsBtn');
  if (!btn) return;
  if (INLINE_MODE === 0) btn.textContent = '💡 提示';
  else if (INLINE_MODE === 1) btn.textContent = '🔍 解答';
  else btn.textContent = '🙈 收起';
}
function cycleInlineMode(){
  INLINE_MODE = (INLINE_MODE + 1) % 3; // 0 -> 1 -> 2 -> 0
  renderInlineBlocks();
  updateInlineButton();
}

/***** ========= 產生 ========= *****/
function generate(){
  const pool = buildWordPool();
  if(!Object.keys(pool).length){ alert('請先勾選課次'); return; }
  CURRENT.qa = makeQA(pool, 10);  // 固定 10 題
  if (CURRENT.qa.length === 0) return;
  renderQA();
  window.scrollTo({top:$('#output').offsetTop,behavior:'smooth'});
}

/***** ========= Init ========= *****/
window.addEventListener('DOMContentLoaded',()=>{
  if (typeof PROFILES==='undefined' || typeof LESSONS==='undefined' || typeof BANK==='undefined') {
    console.error('lessons.js 未載入或結構不符'); return;
  }
  initTabs();
  $('#generateBtn').addEventListener('click',generate);
  $('#printBtn')?.addEventListener('click',()=>window.print());
  $('#gradeBtnSheet').addEventListener('click',gradeSheet);
  $('#inlineAnsBtn').addEventListener('click',cycleInlineMode);
  updateInlineButton();
});
