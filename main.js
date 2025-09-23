/***** ========= 小工具 ========= *****/
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const escapeRE = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

/***** ========= 狀態 ========= *****/
let CURRENT = { profileKey: 'lulu', qa: [], words: [] };
let INLINE_MODE = 0;
let currentInput = null;
let USED_MAP = {};

/***** ========= 題庫覆蓋（爸媽專區：JSON 存取） ========= *****/
const DATA_KEY = 'vocab_dataset_v1';
const DRAFT_KEY = 'vocab_draft';

function applyDataset(ds){
  if (!ds || !ds.LESSONS || !ds.BANK) throw new Error('資料格式不完整');
  window.PROFILES = ds.PROFILES || window.PROFILES;
  window.DUP = ds.DUP || window.DUP || [];
  window.LESSONS = ds.LESSONS;
  window.SIMPLE_TRANSLATE = ds.SIMPLE_TRANSLATE || window.SIMPLE_TRANSLATE || {};
  window.POS = ds.POS || window.POS || {};
  window.BANK = ds.BANK;
  window.__DATASET_META__ = { custom: true, version: ds.version || 1, ts: ds.ts || Date.now() };
}
function loadDatasetFromStorage(){
  const raw = localStorage.getItem(DATA_KEY);
  if (!raw) return false;
  try{ const ds = JSON.parse(raw); applyDataset(ds); return true; } catch{ return false; }
}
function exportDataset(){
  const file = { version:1, ts:Date.now(), PROFILES, DUP, LESSONS, SIMPLE_TRANSLATE, POS, BANK };
  const blob = new Blob([JSON.stringify(file,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url;
  const d = new Date();
  a.download = `vocab-dataset_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}.json`;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
/* 新增：匯出為 lessons.js 片段（可直接貼） */
function exportDatasetAsLessonsJS(){
  const code =
`// ===== paste below into lessons.js =====
const PROFILES = ${JSON.stringify(PROFILES, null, 2)};
const DUP = ${JSON.stringify(DUP, null, 2)};
const LESSONS = ${JSON.stringify(LESSONS, null, 2)};
const SIMPLE_TRANSLATE = ${JSON.stringify(SIMPLE_TRANSLATE, null, 2)};
const POS = ${JSON.stringify(POS, null, 2)};
const BANK = ${JSON.stringify(BANK, null, 2)};

window.PROFILES = PROFILES;
window.DUP = DUP;
window.LESSONS = LESSONS;
window.SIMPLE_TRANSLATE = SIMPLE_TRANSLATE;
window.POS = POS;
window.BANK = BANK;
// ===== end =====
`;
  const blob = new Blob([code], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'lessons-snippet.js';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
function importDatasetFromFile(file){
  return new Promise((resolve,reject)=>{
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('讀檔失敗'));
    fr.onload = () => {
      try{ const ds = JSON.parse(fr.result); ds.ts = Date.now();
        localStorage.setItem(DATA_KEY, JSON.stringify(ds)); applyDataset(ds); resolve(ds);
      }catch(e){ reject(new Error('JSON 格式不正確')); }
    };
    fr.readAsText(file);
  });
}
function resetDatasetToDefault(){ if(confirm('確定恢復為預設題庫？（會覆蓋此裝置的自訂）')){ localStorage.removeItem(DATA_KEY); location.reload(); } }
function updateDatasetBadge(){
  const el = $('#datasetBadge'); if (!el) return;
  const meta = window.__DATASET_META__;
  if (meta?.custom){
    const d = new Date(meta.ts || Date.now());
    el.textContent = `使用自訂題庫（${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}）`;
  }else el.textContent = `使用預設題庫`;
}

/***** ========= 草稿 ========= *****/
function getSelectedLessons() { return $$('.lessonCk:checked').map(el => el.value); }
function setSelectedLessons(ids = []) { $$('.lessonCk').forEach(el => { el.checked = ids.includes(el.value); }); }
function saveDraft() {
  try {
    const answers = $$('#questionList input.answer').map(inp => inp.value || '');
    const draft = { ts: Date.now(), profileKey: CURRENT.profileKey, lessons: getSelectedLessons(), qa: CURRENT.qa, answers };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {}
}
function hasAnyAnswerFilled() { return $$('#questionList input.answer').some(inp => (inp.value||'').trim().length>0); }
function tryRestoreDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY); if (!raw) return;
    const draft = JSON.parse(raw); if (!draft || !Array.isArray(draft.qa)) return;
    if (draft.profileKey && draft.profileKey !== CURRENT.profileKey) switchProfile(draft.profileKey);
    setSelectedLessons(draft.lessons || []);
    CURRENT.qa = draft.qa; renderQA();
    if (Array.isArray(draft.answers)) draft.answers.forEach((val,i)=>{ const el=$(`#q_${i}`); if (el) el.value = val || ''; });
  } catch {}
}

/***** ========= Tabs ========= *****/
function initTabs() {
  $('#tab-lulu')?.addEventListener('click', () => switchProfile('lulu'));
  $('#tab-sherry')?.addEventListener('click', () => switchProfile('sherry'));
  const saved = localStorage.getItem('vocab_profile'); switchProfile(saved || 'lulu');
}
function switchProfile(key) {
  CURRENT.profileKey = key; localStorage.setItem('vocab_profile', key);
  $('#tab-lulu')?.classList.toggle('active', key === 'lulu');
  $('#tab-sherry')?.classList.toggle('active', key === 'sherry');
  renderLessonList(); updateHeaderMeta();
}

/***** ========= Lessons ========= *****/
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

  $$('.toggle-btn').forEach(btn => btn.addEventListener('click', () => $('#words_' + btn.dataset.id).classList.toggle('hidden')));

  box.addEventListener('change', e => {
    if (e.target && e.target.classList.contains('lessonCk')) { updateHeaderMeta(); saveDraft(); }
  });
}
function buildWordPool() {
  const pool = {};
  getSelectedLessons().forEach(id => { (LESSONS[id]?.words || []).forEach(w => { if (BANK[w]) pool[w] = BANK[w]; }); });
  return pool;
}

/***** ========= 出題 ========= *****/
function pickTemplate(entryArr){ return Array.isArray(entryArr) && entryArr.length ? pick(entryArr) : {en:'______', zh:''}; }
function makeQA(pool, MUST = 10) {
  const vocab = Object.keys(pool);
  if (vocab.length < MUST) { alert('可用單字少於 10 個，請多勾選幾個課次。'); return []; }
  const chosen = [...vocab].sort(() => Math.random() - 0.5).slice(0, MUST);
  return chosen.map(w => [w, pickTemplate(pool[w])]);
}

/***** ========= Word Bank 標記 ========= *****/
function markUsed(word, used=true){
  const chip = $(`#wordBank .bank-chip[data-word="${CSS.escape(word)}"]`);
  if (chip) chip.classList.toggle('used', used);
}
function setAnswerForIndex(idx, word){
  const prev = USED_MAP[idx];
  if (prev && prev !== word) markUsed(prev, false);
  if (word) { USED_MAP[idx] = word; markUsed(word, true); }
  else { if (prev) markUsed(prev, false); delete USED_MAP[idx]; }
}

/***** ========= Render ========= *****/
function formatWordBank(words) {
  return `<div class="bank-grid">${words.sort().map(w => `<div class="bank-chip" data-word="${w}" tabindex="0">${w}</div>`).join('')}</div>`;
}
function renderQA() {
  const qList = $('#questionList'), aList = $('#answerList');
  qList.innerHTML = ''; aList.innerHTML = '';

  CURRENT.qa.forEach(([ans, tpl], i) => {
    const li = document.createElement('li');
    li.innerHTML = tpl.en.replace('______', `<input id="q_${i}" class="answer" type="text" autocomplete="off" />`);
    qList.appendChild(li);

    const ai = document.createElement('li');
    ai.innerHTML = `<span class="keyword">${ans}</span> — ${tpl.zh}`;
    aList.appendChild(ai);
  });

  const words = CURRENT.qa.map(([w]) => w);
  $('#wordBank').innerHTML = formatWordBank(words);

  USED_MAP = {};
  $$('#wordBank .bank-chip').forEach(c => c.classList.remove('used'));

  INLINE_MODE = 0; updateInlineButton(); renderInlineBlocks();

  currentInput = null;
  $$('#questionList input.answer').forEach(inp => {
    inp.addEventListener('focus', () => (currentInput = inp));
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); gradeSheet(); } });
    inp.addEventListener('input', () => {
      const idx = Number(inp.id.split('_')[1]);
      const val = (inp.value || '').trim();
      if (!val) setAnswerForIndex(idx, null);
      saveDraft();
    });
    inp.addEventListener('blur', saveDraft);
  });

  const first = $('#questionList input.answer'); if (first) first.focus();

  $('#answerPanel').classList.add('hidden');
  $('#scoreBox').innerHTML = '';
  updateHeaderMeta(); saveDraft();
}

/***** ========= 批改 ========= *****/
function buildStars(c,t){return '★'.repeat(Math.round(c/t*5))+'☆'.repeat(5-Math.round(c/t*5));}
function praise(c,t){ if(c===t) return '太棒了！小天才 🏆'; if(c>=t*0.8) return '好厲害！差一點就滿分 🌟'; if(c>=t*0.5) return '不錯哦～繼續加油 💪'; return '沒關係，下次會更好 🍀'; }
function gradeSheet(){
  let c=0;
  CURRENT.qa.forEach(([ans],i)=>{
    const el=$(`#q_${i}`); if(!el)return;
    const ok=(el.value||'').trim().toLowerCase()===ans.toLowerCase();
    el.classList.remove('correct','wrong'); el.classList.add(ok?'correct':'wrong'); if(ok)c++;
  });
  const t=CURRENT.qa.length;
  $('#scoreBox').innerHTML=`<div><span style="font-weight:700;">Score：${c} / ${t}</span>
    <span style="margin-left:.4rem;">${buildStars(c,t)}</span></div>
    <div style="color:#0369a1;">${praise(c,t)}</div>`;
}

/***** ========= 題下提示 / 解答 ========= *****/
const EXPLAINS = {
  run: { examples: [ { en: "run fast", zh: "跑很快" }, { en: "run to school", zh: "跑去學校" } ]},
  patience: { examples: [ { en: "have patience in class", zh: "上課要有耐心" }, { en: "show patience with homework", zh: "對作業有耐心" } ]},
  defeat: { examples: [ { en: "defeat the other team", zh: "打敗對手" }, { en: "defeat a bad habit", zh: "克服壞習慣" } ]},
  temper: { examples: [ { en: "lose one’s temper", zh: "發脾氣" }, { en: "control your temper", zh: "控制脾氣" } ]},
  complain: { examples: [ { en: "complain about the noise", zh: "抱怨噪音" }, { en: "complain to the teacher", zh: "向老師抱怨" } ]},
  remember: { examples: [ { en: "remember to bring your book", zh: "記得帶書" }, { en: "remember the rule", zh: "記得規則" } ]},
  encourage: { examples: [ { en: "encourage kids to try", zh: "鼓勵孩子嘗試" }, { en: "give words of encouragement", zh: "鼓勵的話" } ]},
  distinguish: { examples: [ { en: "distinguish A from B", zh: "分辨A與B" }, { en: "hard to distinguish", zh: "難以分辨" } ]},
  achieve: { examples: [ { en: "achieve a goal", zh: "達成目標" }, { en: "achieve success", zh: "獲得成功" } ]},
  command: { examples: [ { en: "give a command", zh: "下達命令" }, { en: "follow the command", zh: "遵守命令" } ]},
  figured: { examples: [ { en: "figure out the answer", zh: "想出答案" }, { en: "finally figure out", zh: "終於想通" } ]}
};
function inferPOSHint(en){
  const s = en.replace(/\s+/g,' ').trim();
  if (/^(?:The|This|That|A|An)\s+\w+(?:\s+\w+)?\s+______\s+\b(in|on|at|with|to|from|over|under|into|onto|through|across|behind|beside|near|around|before|after|by|for)\b/i.test(s))
    return '主詞 + 動詞 + 介系詞片語 → 多為「動詞」。';
  if (/^(We|I|They|He|She|It)\s+______\b/i.test(s)) return '主詞 + 動詞 → 多為「動詞」。';
  if (/\bto\s+______\b/i.test(s)) return 'to + 原形 → 「動詞原形」。';
  if (/\b(can|will|should|must|may|might|could|would|shall)\s+______\b/i.test(s)) return '助動詞後接原形。';
  if (/\b(a|an|the)\s+______\s+(?!to\b|that\b|who\b|which\b|whom\b|where\b|when\b)\w+\b/i.test(s)) return 'a/an + ______ + 名詞 → 多為「形容詞」。';
  if (/\b(is|am|are|was|were|feel|feels|felt|seem|looks?)\s+______\b/i.test(s)) return '連繫動詞後多為「形容詞」。';
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
function renderInlineBlocks(){
  const list = $('#questionList');
  list.querySelectorAll('.inline-ans').forEach(div => div.remove());
  if (INLINE_MODE === 0) return;

  CURRENT.qa.forEach(([ans, tpl], i) => {
    const li = list.children[i]; if (!li) return;
    const user = ($(`#q_${i}`)?.value || '').trim();
    const ok = user && user.toLowerCase() === ans.toLowerCase();

    const zhWord = SIMPLE_TRANSLATE?.[ans] ? SIMPLE_TRANSLATE[ans] : '';
    const posDict = (typeof POS !== 'undefined' && POS?.[ans]) ? POS[ans] : '';
    const posRule = inferPOSHint(tpl.en);
    const examplesHTML = renderExamples(ans);

    const div = document.createElement('div');
    div.className = 'inline-ans' + (INLINE_MODE === 2 ? (' ' + (ok ? 'correct' : 'wrong')) : '');

    if (INLINE_MODE === 1) {
      div.innerHTML = `
        ${posDict ? `<div class="exp-line">🏷️ <b>字典詞性：</b>${posDict}</div>` : ''}
        <div class="exp-line">📖 <b>句型線索：</b>${posRule}</div>
      `;
    } else {
      div.innerHTML = `
        <div class="exp-line">✅ <b>答案：</b>
          <span class="keyword ${ok?'correct':''}">${ans}</span>${zhWord?`（${zhWord}）`:''}
          — ${tpl.zh}
        </div>
        ${posDict ? `<div class="exp-line">🏷️ <b>字典詞性：</b>${posDict}</div>` : ''}
        <div class="exp-line">📖 <b>句型線索：</b>${posRule}</div>
        ${examplesHTML ? `<div class="exp-line exp-examples"><span class="exp-label">🌟 <b>延伸例句：</b></span>${examplesHTML}</div>` : ''}
      `;
    }
    li.appendChild(div);
  });
}
function updateInlineButton(){
  const btn = $('#inlineAnsBtn');
  if (!btn) return;
  if (INLINE_MODE === 0) btn.textContent = '💡 提示';
  else if (INLINE_MODE === 1) btn.textContent = '🔍 解答';
  else btn.textContent = '🙈 收起';
}
function cycleInlineMode(){ INLINE_MODE = (INLINE_MODE + 1) % 3; renderInlineBlocks(); updateInlineButton(); }

/***** ========= 右上角資訊 ========= *****/
function updateHeaderMeta(){
  const meta = $('#headerMeta'); if (!meta) return;
  const who = PROFILES[CURRENT.profileKey]?.title || '';
  const d = new Date();
  const dateStr = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
  const cnt = getSelectedLessons().length;
  meta.textContent = `${dateStr} · ${who} · 已選課次 ${cnt}`;
}

/***** ========= 產生 ========= *****/
function generate(){
  if (CURRENT.qa.length > 0 && hasAnyAnswerFilled()) {
    const ok = confirm('確定要重新產生題目嗎？\n目前的作答會被清空（已自動儲存草稿，可再復原）。');
    if (!ok) return;
  }
  const pool = buildWordPool(); if(!Object.keys(pool).length){ alert('請先勾選課次'); return; }
  CURRENT.qa = makeQA(pool, 10); if (CURRENT.qa.length === 0) return;
  renderQA();
  window.scrollTo({top:$('#output').offsetTop,behavior:'smooth'});
}

/***** ========= 齒輪與選單 ========= */
(function initGearMenu(){
  const gear = $('#parentGear'); const wrapper = gear?.parentElement;
  let pressTimer = null, opened = false;

  function toggleMenu(){ wrapper.classList.toggle('open'); opened = wrapper.classList.contains('open'); }
  function closeMenu(){ wrapper.classList.remove('open'); opened = false; }

  gear?.addEventListener('click', (e)=>{ e.stopPropagation(); toggleMenu(); });
  document.addEventListener('click', ()=>{ if(opened) closeMenu(); });

  gear?.addEventListener('mousedown', ()=>{ pressTimer=setTimeout(()=>{ closeMenu(); openParentModal(); },600); });
  gear?.addEventListener('touchstart', ()=>{ pressTimer=setTimeout(()=>{ closeMenu(); openParentModal(); },600); }, {passive:true});
  ['mouseup','mouseleave','touchend','touchcancel'].forEach(evt=>gear?.addEventListener(evt, ()=>clearTimeout(pressTimer)));

  $('#openParentBtn')?.addEventListener('click', ()=>{ closeMenu(); openParentModal(); });
})();

/***** ========= 匯入 / 匯出 / 預設 ========= */
function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){ t = document.createElement('div'); t.id='toast';
    t.style.cssText='position:fixed;right:14px;bottom:14px;background:#0ea5e9;color:#fff;padding:8px 12px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.12);z-index:9999;font-size:14px;transition:opacity .2s';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity='1'; clearTimeout(t._timer); t._timer=setTimeout(()=>t.style.opacity='0',1500);
}
$('#exportDatasetBtn')?.addEventListener('click', exportDataset);
$('#exportAsJsBtn')?.addEventListener('click', exportDatasetAsLessonsJS);
$('#importDatasetInput')?.addEventListener('change', async (e)=>{
  const file = e.target.files?.[0]; if (!file) return;
  try{ await importDatasetFromFile(file); renderLessonList(); updateDatasetBadge();
    alert('匯入成功！若已產生題目，請重新按「產生題目」套用新資料。');
  }catch(err){ alert('匯入失敗：' + err.message); }
  finally{ e.target.value = ''; }
});
$('#resetDatasetBtn')?.addEventListener('click', resetDatasetToDefault);

/***** ========= 爸媽專區（Modal 開關） ========= */
function openParentModal(){
  const kidSel = $('#kid');
  kidSel.value = (CURRENT.profileKey === 'lulu') ? 'Lulu' : 'Sherry';
  pmOnKidChange();
  $('#parentModal').classList.remove('hidden'); $('#parentModal').classList.add('flex');
}
function closeParentModal(){ $('#parentModal').classList.add('hidden'); $('#parentModal').classList.remove('flex'); }
$('#closeParentBtn')?.addEventListener('click', closeParentModal);

/***** ========= 自動挖空 / 自動加粗 ========= */
function buildWordVariants(word){
  const w = word.toLowerCase();
  const v = new Set([w, w + 's', w + 'es', w + 'ed', w + 'ing']);
  if (w.endsWith('e')) { v.add(w.slice(0,-1) + 'ing'); v.add(w.slice(0,-1) + 'ed'); }
  if (w.endsWith('y')) v.add(w.slice(0,-1) + 'ies');
  if (/[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]$/.test(w)) {
    const last = w[w.length-1]; v.add(w + last + 'ing'); v.add(w + last + 'ed');
  }
  return [...v].sort((a,b)=>b.length-a.length);
}
function autoBlankEN(word, enRaw){
  if (!enRaw) return { en: '', hit: false };
  if (enRaw.includes('______')) return { en: enRaw, hit: true };
  const pattern = new RegExp(`\\b(${buildWordVariants(word).map(escapeRE).join('|')})\\b`, 'i');
  const m = enRaw.match(pattern);
  if (!m) return { en: enRaw, hit: false };
  return { en: enRaw.replace(pattern, '______'), hit: true };
}
function autoBoldZH(word, zhRaw){
  if (!zhRaw) return zhRaw || '';
  if (/<\s*b[^>]*>/i.test(zhRaw)) return zhRaw;
  const key = (SIMPLE_TRANSLATE?.[word] || '').trim();
  if (!key) return zhRaw;
  return zhRaw.replace(new RegExp(escapeRE(key), 'g'), `<b>${key}</b>`);
}

/***** ========= 爸媽專區：資料寫入 / 渲染 ========= */
function saveDatasetToLocal(){
  const ds = { version:1, ts:Date.now(), PROFILES, DUP, LESSONS, SIMPLE_TRANSLATE, POS, BANK };
  localStorage.setItem(DATA_KEY, JSON.stringify(ds));
  showToast('已儲存'); updateDatasetBadge();
}

/* 編輯流程 */
function pmToggleWordHeader(header){
  const wordEl = header.closest('.word');
  if (!wordEl) return;
  if (!header.querySelector('.actions')?.contains(window.__pmLastClickTarget)) {
    wordEl.classList.toggle('open');
  }
}
function pmEnterEdit(btn){
  const word = btn.closest('.word');
  if(word.dataset.originalHtml == null){ word.dataset.originalHtml = word.innerHTML; }
  word.classList.add('editing');
  word.querySelector('.main').setAttribute('contenteditable','true');
  word.querySelector('.pos').setAttribute('contenteditable','true');
  word.querySelector('.meaning').setAttribute('contenteditable','true');
  const pairs = word.querySelector('.pairs'); pairs.style.display='flex'; word.classList.add('open');
  pairs.querySelectorAll('.en, .zh').forEach(n=>n.setAttribute('contenteditable','true'));
  word.querySelector('.btn-edit').style.display='none';
  word.querySelector('.btn-save').style.display='inline-block';
  word.querySelector('.btn-cancel').style.display='inline-block';
  word.querySelector('.btn-addpair').style.display='inline-block';
}
function pmSaveEdit(btn){
  const card = btn.closest('.word');
  const lid = $('#lesson-list').value;
  if (!lid){ alert('請先選擇課次'); return; }

  const w = card.querySelector('.main').textContent.trim();
  const pos = card.querySelector('.pos').textContent.trim();
  const zh  = card.querySelector('.meaning').textContent.trim();
  if (!w){ alert('單字不能空白'); return; }

  const rawPairs = [...card.querySelectorAll('.pair')].map(p=>({
    en:(p.querySelector('.en')?.textContent||'').trim(),
    zh:(p.querySelector('.zh')?.textContent||'').trim()
  })).filter(p=>p.en||p.zh);

  const pairs = rawPairs.map(p=>{
    const enFix = autoBlankEN(w, p.en);
    const zhFix = autoBoldZH(w, p.zh);
    return { en: enFix.en, zh: zhFix };
  });

  SIMPLE_TRANSLATE[w] = zh;
  POS[w] = pos;
  if (pairs.length) BANK[w] = pairs; else BANK[w] = BANK[w] || [];

  const arr = LESSONS[lid].words || (LESSONS[lid].words = []);
  if (!arr.includes(w)) arr.push(w);

  saveDatasetToLocal();
  pmRenderWords();
}
function pmCancelEdit(btn){
  const word = btn.closest('.word');
  if(word.dataset.originalHtml){ word.innerHTML = word.dataset.originalHtml; }
}
function pmAddPair(btn){
  const word = btn.closest('.word');
  const pairs = word.querySelector('.pairs');
  const block = document.createElement('div');
  block.className='pair';
  block.innerHTML = '<div class="en" contenteditable="true">（輸入英文例句即可，系統會自動把關鍵單字挖空）</div><div class="zh" contenteditable="true">（輸入中文翻譯；會嘗試自動加粗主要譯語）</div>';
  pairs.appendChild(block);
}
function pmAddWord(){
  const lid = $('#lesson-list').value;
  if (!lid){ alert('請先選擇課次'); return; }
  const list = $('#word-list');
  const div = document.createElement('div');
  div.className='word editing open';
  div.innerHTML = `
    <div class="word-header">
      <span class="main" contenteditable="true">（新單字）</span>
      <span class="pos" contenteditable="true">(詞性)</span>
      <span class="meaning" contenteditable="true">（中文解釋）</span>
      <div class="actions">
        <button class="btn btn-edit" style="display:none" data-action="edit">編輯</button>
        <button class="btn btn-save" data-action="save">完成</button>
        <button class="btn btn-cancel" data-action="cancel">取消</button>
        <button class="btn btn-addpair" data-action="addpair">＋新增例句</button>
      </div>
    </div>
    <div class="pairs">
      <div class="pair">
        <div class="en" contenteditable="true">（輸入英文例句即可，系統會自動把關鍵單字挖空）</div>
        <div class="zh" contenteditable="true">（輸入中文翻譯；會嘗試自動加粗主要譯語）</div>
      </div>
    </div>`;
  list.prepend(div);
  $('#empty-tip')?.remove();
}
/* 新增：刪除課次 */
function pmDeleteLesson(){
  const lid = $('#lesson-list').value;
  if (!lid){ alert('請先選擇要刪除的課次'); return; }
  const title = LESSONS[lid]?.title || lid;
  if (!confirm(`確定要刪除課次「${title}」嗎？\n此動作會移除此課次與其單字關聯，但不會刪除單字本身的翻譯、詞性與例句。`)) return;
  delete LESSONS[lid];
  saveDatasetToLocal();
  pmOnKidChange();
}
function pmAddLesson(){
  const name = $('#lesson-new').value.trim();
  if(!name) return;
  const kid = $('#kid').value.toLowerCase();
  const group = (kid==='lulu')?'g1':'g4';
  const id = `${group}-${Date.now().toString().slice(-6)}`;
  LESSONS[id] = { title: name, group, words: [] };
  saveDatasetToLocal();
  const select = $('#lesson-list');
  const opt = document.createElement('option'); opt.textContent=name; opt.value=id;
  select.appendChild(opt); select.value=id;
  $('#lesson-new').value='';
  pmRenderWords();
}
function pmOnKidChange(){
  const kid = $('#kid').value.toLowerCase();
  const group = (kid==='lulu')?'g1':'g4';
  const select = $('#lesson-list');
  const entries = Object.entries(LESSONS).filter(([,o])=>o.group===group);
  select.innerHTML = '<option value="">選擇課次</option>' + entries.map(([id,o])=>`<option value="${id}">${o.title}</option>`).join('');
  $('#word-list').innerHTML = '<p id="empty-tip" class="pm-muted">請先選擇課次，或新增一個課次。</p>';
}
function pmRenderWords(){
  const lid = $('#lesson-list').value;
  const list = $('#word-list');
  list.innerHTML = '';
  if (!lid){
    list.innerHTML = '<p id="empty-tip" class="pm-muted">請先選擇課次，或新增一個課次。</p>'; return;
  }
  const words = LESSONS[lid]?.words || [];
  if (!words.length){
    list.innerHTML = '<p id="empty-tip" class="pm-muted">目前沒有單字，請點右上角「＋ 新增單字卡」。</p>'; return;
  }
  words.forEach(w=>{
    const zh = SIMPLE_TRANSLATE[w] || '';
    const pos = POS[w] || '';
    const pairs = BANK[w] || [];
    const pairsHTML = pairs.map(p=>`
      <div class="pair">
        <div class="en">${p.en || ''}</div>
        <div class="zh">${p.zh || ''}</div>
      </div>`).join('');
    const card = document.createElement('div');
    card.className = 'word';
    card.innerHTML = `
      <div class="word-header">
        <span class="main">${w}</span>
        <span class="pos">${pos}</span>
        <span class="meaning">${zh}</span>
        <div class="actions">
          <button class="btn btn-edit" data-action="edit">編輯</button>
          <button class="btn btn-save" style="display:none" data-action="save">完成</button>
          <button class="btn btn-cancel" style="display:none" data-action="cancel">取消</button>
          <button class="btn btn-addpair" style="display:none" data-action="addpair">＋新增例句</button>
          <button class="btn btn-del" data-action="remove">移出課次</button>
        </div>
      </div>
      <div class="pairs">${pairsHTML}</div>`;
    list.appendChild(card);
  });
}
function pmRemoveFromLesson(btn){
  const card = btn.closest('.word');
  const w = card.querySelector('.main').textContent.trim();
  const lid = $('#lesson-list').value; if (!lid) return;
  if (!confirm(`要把「${w}」從此課次移除嗎？（不會刪除該單字的翻譯/詞性/例句）`)) return;
  LESSONS[lid].words = (LESSONS[lid].words||[]).filter(x=>x!==w);
  saveDatasetToLocal(); pmRenderWords();
}

/***** ========= 事件委派（爸媽專區所有按鈕） ========= */
(function bindParentActions(){
  const list = document.getElementById('word-list');
  if (!list) return;

  list.addEventListener('mousedown', (e)=>{ window.__pmLastClickTarget = e.target; }, {capture:true});
  list.addEventListener('click', (e) => {
    const header = e.target.closest('.word-header');
    const inActions = !!e.target.closest('.actions');
    if (header && !inActions) { pmToggleWordHeader(header); return; }
    const btn = e.target.closest('[data-action]'); if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'save') return pmSaveEdit(btn);
    if (action === 'cancel') return pmCancelEdit(btn);
    if (action === 'edit') return pmEnterEdit(btn);
    if (action === 'addpair') return pmAddPair(btn);
    if (action === 'remove') return pmRemoveFromLesson(btn);
  });
})();

/* 綁定 Modal 上方控制列 / 標頭按鈕 */
$('#btnAddLesson')?.addEventListener('click', pmAddLesson);
$('#btnDeleteLesson')?.addEventListener('click', pmDeleteLesson);
$('#btnAddWord')?.addEventListener('click', pmAddWord);
$('#kid')?.addEventListener('change', pmOnKidChange);
$('#lesson-list')?.addEventListener('change', pmRenderWords);

/***** ========= Init ========= *****/
window.addEventListener('DOMContentLoaded',()=>{
  loadDatasetFromStorage(); updateDatasetBadge();

  if (typeof PROFILES==='undefined' || typeof LESSONS==='undefined' || typeof BANK==='undefined') {
    console.error('lessons.js 未載入或結構不符'); return;
  }

  initTabs();

  $('#generateBtn')?.addEventListener('click',generate);
  $('#printBtn')?.addEventListener('click',()=>window.print());
  $('#gradeBtnSheet')?.addEventListener('click',gradeSheet);
  $('#inlineAnsBtn')?.addEventListener('click',cycleInlineMode);
  updateInlineButton(); updateHeaderMeta();

  // WordBank 互動
  const bank = $('#wordBank');
  if (bank) {
    bank.addEventListener('click', e => {
      const chip = e.target.closest('.bank-chip');
      if (!chip || !currentInput) return;
      const word = chip.dataset.word;
      const idx = Number(currentInput.id.split('_')[1]);
      currentInput.value = word; setAnswerForIndex(idx, word);
      currentInput.focus(); saveDraft();
    });
    bank.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('bank-chip')) {
        e.preventDefault();
        if (currentInput) {
          const chip = e.target; const word = chip.dataset.word;
          const idx = Number(currentInput.id.split('_')[1]);
          currentInput.value = word; setAnswerForIndex(idx, word);
          currentInput.focus(); saveDraft();
        }
      }
    });
  }

  tryRestoreDraft();
});

/* 離開頁面前提示（避免誤關） */
window.addEventListener('beforeunload', (e) => {
  if (hasAnyAnswerFilled()) { e.preventDefault(); e.returnValue = ''; }
});
