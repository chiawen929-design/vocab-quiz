// —— 孩子設定（頁籤）——
const PROFILES = {
  lulu:   { title: "Lulu（小一 6歲）",  group: "g1" },
  sherry: { title: "Sherry（小四 9歲）", group: "g4" }
};

// 固定重複單字（每課都有）
const DUP = ["encourage","defeat","distinguish","achieve","command"];

// —— 課次清單 ——（group 控制顯示給哪位孩子）
const LESSONS = {
  "g4-1": { title: "第一課", group: "g4",
    words: ["enormous","interfered","stationary","abandon","appeared",
            "encourage","defeat","distinguish","achieve","command"]
  },
  "g4-2": { title: "第二課", group: "g4",
    words: ["figured","complain","patience","temper","remember",
            "encourage","defeat","distinguish","achieve","command"]
  },
  "g1-1": { title: "A 組", group: "g1",
    words: ["cat","dog","run","big","happy",
            "encourage","defeat","distinguish","achieve","command"]
  }
};

// —— 單字中文主要翻譯 —— 
const SIMPLE_TRANSLATE = {
  enormous: "巨大的",
  interfered: "干擾；干涉",
  stationary: "靜止的",
  abandon: "拋棄；放棄",
  appeared: "出現；看起來",
  figured: "想出；認為",
  complain: "抱怨",
  patience: "耐心",
  temper: "脾氣",
  remember: "記得",
  encourage: "鼓勵",
  defeat: "打敗；克服",
  distinguish: "分辨；區分",
  achieve: "達成；實現",
  command: "命令；指揮",
  cat: "貓", dog: "狗",
  run: "跑步", big: "大", happy: "開心"
};

// —— 詞性 —— 
const POS = {
  enormous: "adj.",
  interfered: "v. (past)",
  stationary: "adj.",
  abandon: "v.",
  appeared: "v. (past)",
  figured: "v. (past)",
  complain: "v.",
  patience: "n.",
  temper: "n.",
  remember: "v.",
  encourage: "v.",
  defeat: "v./n.",
  distinguish: "v.",
  achieve: "v.",
  command: "n./v.",
  cat: "n.", dog: "n.",
  run: "v.", big: "adj.", happy: "adj."
};

// —— 題庫 —— 
const BANK = {
  enormous: [
    {en:'The dog is ______.', zh:'那隻狗很<b>巨大</b>。'},
    {en:'The ______ tree gave shade to the whole playground.', zh:'這棵<b>巨大的</b>樹讓整個操場都有樹蔭。'},
    {en:'The storm caused ______ damage to the small town.', zh:'這場風暴造成小鎮<b>巨大的</b>破壞。'}
  ],
  interfered: [
    {en:'The noise ______ with my sleep.', zh:'噪音<b>干擾</b>了我的睡眠。'},
    {en:'He ______ in the game and made the players angry.', zh:'他<b>介入</b>比賽，惹怒了選手們。'},
    {en:'The loud construction ______ with our online class, so the teacher rescheduled.', zh:'吵雜的施工<b>干擾</b>了我們的線上課，所以老師只好改期。'}
  ],
  stationary: [
    {en:'The car is ______ at the red light.', zh:'那輛車在紅燈時保持<b>靜止</b>。'},
    {en:'The bike stayed ______ even though the wind was strong.', zh:'雖然風很大，腳踏車仍然<b>靜止</b>不動。'},
    {en:'The soldiers remained ______ until they received the command to move.', zh:'士兵們一直保持<b>靜止</b>，直到收到移動的命令。'}
  ],
  abandon: [
    {en:'Do not ______ your pet.', zh:'不要<b>拋棄</b>你的寵物。'},
    {en:'The team had to ______ the game because of heavy rain.', zh:'因為大雨，球隊不得不<b>放棄</b>比賽。'},
    {en:'She felt sad when her best friend decided to ______ their plan without explanation.', zh:'當最好的朋友毫無解釋地<b>放棄</b>他們的計畫時，她感到很難過。'}
  ],
  appeared: [
    {en:'The moon ______ in the sky.', zh:'月亮<b>出現</b>在天空中。'},
    {en:'A rainbow suddenly ______ after the rain stopped.', zh:'雨停後突然<b>出現</b>一道彩虹。'},
    {en:'He ______ calm, but inside he was very nervous about the test.', zh:'他<b>看起來</b>很冷靜，但內心對考試其實很緊張。'}
  ],
  figured: [
    {en:'I ______ the answer was 10.', zh:'我<b>認為</b>答案是10。'},
    {en:'She ______ out how to fix the broken toy.', zh:'她<b>想出</b>如何修好壞掉的玩具。'},
    {en:'He ______ it was better to stay quiet than to argue with his teacher.', zh:'他<b>認為</b>保持沉默比和老師爭論更好。'}
  ],
  complain: [
    {en:'He likes to ______ about homework.', zh:'他喜歡<b>抱怨</b>作業。'},
    {en:'The children ______ that the food was too cold.', zh:'孩子們<b>抱怨</b>食物太冷了。'},
    {en:'Instead of ______, we should think of ways to solve the problem.', zh:'與其<b>抱怨</b>，不如想辦法解決問題。'}
  ],
  patience: [
    {en:'Mom has ______ with the baby.', zh:'媽媽對嬰兒很有<b>耐心</b>。'},
    {en:'You need ______ when you learn a new skill.', zh:'學習新技能需要<b>耐心</b>。'},
    {en:'His ______ finally ran out after waiting for the bus for an hour.', zh:'等公車一小時後，他的<b>耐心</b>終於用盡了。'}
  ],
  temper: [
    {en:'He has a bad ______.', zh:'他<b>脾氣</b>不好。'},
    {en:'She lost her ______ when her brother broke her toy.', zh:'弟弟弄壞她的玩具時，她發了<b>脾氣</b>。'},
    {en:'It takes practice to control one’s ______ during stressful times.', zh:'在壓力大的時候，控制<b>脾氣</b>需要練習。'}
  ],
  remember: [
    {en:'I ______ my teacher’s name.', zh:'我<b>記得</b>老師的名字。'},
    {en:'Please ______ to bring your homework tomorrow.', zh:'請<b>記得</b>明天帶作業。'},
    {en:'He couldn’t ______ where he had placed his keys after the party.', zh:'派對結束後，他<b>記不起</b>把鑰匙放在哪裡。'}
  ],
  encourage: [
    {en:'Teachers ______ students to read.', zh:'老師<b>鼓勵</b>學生閱讀。'},
    {en:'My coach always ______ me before a big game.', zh:'大比賽前，教練總是<b>鼓勵</b>我。'},
    {en:'Parents should ______ children to try new things even if they might fail.', zh:'父母應該<b>鼓勵</b>孩子嘗試新事物，即使可能會失敗。'}
  ],
  defeat: [
    {en:'Our team will ______ theirs.', zh:'我們隊會<b>打敗</b>他們。'},
    {en:'The hero finally ______ the dragon.', zh:'英雄終於<b>打敗</b>了惡龍。'},
    {en:'They worked together to ______ their fear of speaking in public.', zh:'他們齊心協力<b>戰勝</b>上台說話的恐懼。'}
  ],
  distinguish: [
    {en:'Can you ______ red from pink?', zh:'你能<b>分辨</b>紅色和粉紅色嗎？'},
    {en:'It’s hard to ______ twins because they look alike.', zh:'雙胞胎長得很像，很難<b>分辨</b>。'},
    {en:'Good readers can ______ between facts and opinions in a story.', zh:'好的讀者能<b>分辨</b>故事中的事實與意見。'}
  ],
  achieve: [
    {en:'She wants to ______ her goal.', zh:'她想<b>達成</b>目標。'},
    {en:'He ______ high grades by studying hard.', zh:'他努力學習，<b>取得</b>好成績。'},
    {en:'The team felt proud to ______ success after months of hard work.', zh:'經過數月努力後，團隊對<b>達成</b>成功感到自豪。'}
  ],
  command: [
    {en:'The captain gave a ______ to stop.', zh:'隊長下了停止的<b>命令</b>。'},
    {en:'The dog obeyed the ______ to sit quietly.', zh:'那隻狗服從了坐下的<b>命令</b>。'},
    {en:'All soldiers followed the general’s ______ without question.', zh:'所有士兵都毫無疑問地服從將軍的<b>命令</b>。'}
  ],
  cat: [
    {en:'The ______ is on the bed.', zh:'<b>貓</b>在床上。'},
    {en:'I see a black ______.', zh:'我看到一隻黑色的<b>貓</b>。'},
    {en:'The small ______ likes milk.', zh:'小<b>貓</b>喜歡牛奶。'}
  ],
  dog: [
    {en:'The ______ runs fast.', zh:'<b>狗</b>跑得很快。'},
    {en:'My ______ is friendly.', zh:'我的<b>狗</b>很友善。'},
    {en:'The brown ______ likes to play.', zh:'棕色的<b>狗</b>喜歡玩。'}
  ],
  run: [
    {en:'I can ______ to school.', zh:'我可以<b>跑步</b>去學校。'},
    {en:'We ______ in the park.', zh:'我們在公園<b>跑步</b>。'},
    {en:'They ______ every morning.', zh:'他們每天早上<b>跑步</b>。'}
  ],
  big: [
    {en:'This is a ______ cake.', zh:'這是一個<b>大的</b>蛋糕。'},
    {en:'The box is too ______ to carry alone.', zh:'這個箱子<b>太大</b>，一個人拿不動。'},
    {en:'We saw a ______ house at the end of the street.', zh:'我們在街尾看到一棟<b>很大</b>的房子。'}
  ],
  happy: [
    {en:'I feel ______ today.', zh:'我今天很<b>開心</b>。'},
    {en:'She looks ______ in class.', zh:'她在課堂上看起來很<b>開心</b>。'},
    {en:'We were ______ at the party.', zh:'我們在派對很<b>開心</b>。'}
  ]
};

// —— 確保全域可讀 —— 
window.PROFILES = PROFILES;
window.DUP = DUP;
window.LESSONS = LESSONS;
window.SIMPLE_TRANSLATE = SIMPLE_TRANSLATE;
window.POS = POS;
window.BANK = BANK;
