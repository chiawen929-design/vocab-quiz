// —— 孩子設定（頁籤）——
const PROFILES = {
  lulu:   { title: "Lulu（小一 6歲）",  group: "g1", defaultLevel: "easy", defaultNumQ: 10 },
  sherry: { title: "Sherry（小四 9歲）", group: "g4", defaultLevel: "hard", defaultNumQ: 10 }
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

// —— 單字中文主要翻譯（展開清單用）——
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

// —— 詞性（展開清單第2行）——
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

// —— 句庫（升級版，三種難度）——
const BANK = {
  // g4 第一課
  enormous: {
    easy:{en:'The elephant was so ______that it blocked the entire road.', zh:'那頭大象非常<b>巨大</b>，把整條路都擋住了。'},
    medium:{en:'She received an ______ amount of homework before the holiday.', zh:'她在假期前收到了<b>大量的</b>作業。'},
    hard:{en:'Winning the prize gave him ______ confidence to keep going.', zh:'獲得獎項給了他<b>巨大的</b>信心繼續前進。'}
  },
  interfered: {
    easy:{en:'The loud music ______ with my ability to concentrate on studying.', zh:'吵雜的音樂<b>干擾</b>了我專心讀書。'},
    medium:{en:'He shouldn’t have ______ in their private conversation.', zh:'他不該<b>干涉</b>他們的私人談話。'},
    hard:{en:'The storm ______ with the airplane’s flight schedule.', zh:'暴風雨<b>干擾</b>了飛機的航班安排。'}
  },
  stationary: {
    easy:{en:'The bus remained ______ at the stop because of the traffic jam.', zh:'公車因為塞車而<b>停</b>在站牌不動。'},
    medium:{en:'Please keep the camera ______ while taking the photo.', zh:'拍照時請保持相機<b>靜止</b>。'},
    hard:{en:'Although the machine looked ______, it was actually running quietly inside.', zh:'雖然機器看起來<b>靜止</b>，其實裡面正在悄悄運轉。'}
  },
  abandon: {
    easy:{en:'The soldiers had to ______ the burning building quickly.', zh:'士兵們必須迅速<b>撤離</b>燃燒的建築物。'},
    medium:{en:'He decided to ______ his old car on the highway.', zh:'他決定把舊車<b>丟棄</b>在高速公路上。'},
    hard:{en:'We should never ______ our dreams, no matter how hard it gets.', zh:'無論多困難，我們都不應該<b>放棄</b>夢想。'}
  },
  appeared: {
    easy:{en:'A rainbow suddenly ______ in the sky after the rain.', zh:'雨後天空突然<b>出現</b>了一道彩虹。'},
    medium:{en:'She ______ on stage wearing a beautiful red dress.', zh:'她身穿漂亮的紅裙子<b>出現</b>在舞台上。'},
    hard:{en:'The missing child ______ safe and sound at the police station.', zh:'失蹤的孩子在警察局安然<b>出現</b>。'}
  },

  // g4 第二課
  figured: {
    easy:{en:'After hours of searching, she finally ______ out how to unlock the secret door.', zh:'她花了好幾個小時搜尋，終於弄清楚如何打開那扇秘密的門。'},
    medium:{en:'I never ______ he would surprise me with a birthday cake at midnight.', zh:'我從沒想到他會在半夜給我一個生日蛋糕驚喜。'},
    hard:{en:'He ______ that the train would be late, so he left home earlier.', zh:'他猜測火車會晚點，所以提早出門。'}
  },
  complain: {
    easy:{en:'The students began to ______ about the heavy homework load.', zh:'學生們開始抱怨功課太多。'},
    medium:{en:'She always ______ when the coffee is not hot enough.', zh:'她總是抱怨咖啡不夠熱。'},
    hard:{en:'Instead of ______, he tried to find a way to solve the problem.', zh:'他沒有抱怨，而是嘗試找到解決問題的方法。'}
  },
  patience: {
    easy:{en:'Teachers need a lot of ______ when working with young children.', zh:'老師在教小孩時需要很多耐心。'},
    medium:{en:'Please have ______, the doctor will see you soon.', zh:'請耐心等待，醫生很快就會見你了。'},
    hard:{en:'Raising twins requires not only love but also endless ______.', zh:'養雙胞胎不只需要愛，還需要無盡的耐心。'}
  },
  temper: {
    easy:{en:'He lost his ______ when he found out someone broke his phone.', zh:'當他發現有人弄壞他的手機時，他發了脾氣。'},
    medium:{en:'Keeping your ______ under pressure is not easy.', zh:'在壓力下保持冷靜並不容易。'},
    hard:{en:'Her quick ______ often causes arguments with friends.', zh:'她急躁的脾氣經常引起與朋友的爭吵。'}
  },
  remember: {
    easy:{en:'Please ______ to lock the door before you leave the house.', zh:'出門前請記得鎖門。'},
    medium:{en:'Do you ______ the first time we met at the library?', zh:'你還記得我們第一次在圖書館見面嗎？'},
    hard:{en:'He couldn’t ______ the answer during the test, even though he studied it last night.', zh:'雖然昨晚讀過，他考試時卻想不起答案。'}
  },

  // 重複字
   encourage: {
    easy:{en:'Parents should ______ their children to try new things.', zh:'父母應該鼓勵孩子嘗試新事物。'},
    medium:{en:'She sent me a message to ______ me before the big presentation.', zh:'在重要簡報前，她傳訊息來鼓勵我。'},
    hard:{en:'Good teachers ______ students to ask questions in class.', zh:'好的老師會鼓勵學生在課堂上提問。'}
  },
  defeat: {
    easy:{en:'The team worked hard to ______ their strongest rival.', zh:'這支隊伍努力打敗他們最強的對手。'},
    medium:{en:'He finally managed to ______ his fear of swimming.', zh:'他終於克服了對游泳的恐懼。'},
    hard:{en:'The general promised to ______ the enemy before winter.', zh:'將軍承諾要在冬天前擊敗敵人。'}
  },
  distinguish: {
    easy:{en:'Can you ______ red wine from grape juice just by looking?', zh:'你能僅憑外觀分辨紅酒和葡萄汁嗎？'},
    medium:{en:'It’s hard to ______ fact from opinion on social media.', zh:'在社群媒體上很難分辨事實與意見。'},
    hard:{en:'Babies can quickly ______ their mother’s voice from others.', zh:'嬰兒能很快辨認出媽媽的聲音。'}
  },
  achieve: {
    easy:{en:'She worked day and night to ______ her dream of becoming a doctor.', zh:'她日以繼夜努力，實現了當醫生的夢想。'},
    medium:{en:'The company managed to ______ record sales this year.', zh:'公司今年成功創下銷售紀錄。'},
    hard:{en:'To ______ success, you need both talent and persistence.', zh:'要取得成功，你需要天賦和堅持。'}
  },
  command: {
    easy:{en:'The officer gave a ______ to his soldiers to move forward.', zh:'軍官下令士兵前進。'},
    medium:{en:'She spoke with such ______ that everyone followed her instructions.', zh:'她說話帶著權威，因此大家都聽從她的指示。'},
    hard:{en:'The general’s ______ was clear: protect the city at all costs.', zh:'將軍的命令很明確：不惜一切代價保護城市。'}
  },

  // g1 Lulu（示範）
  cat:   { easy:{en:'The ______ is on the bed.', zh:'<b>貓</b>在床上。'},
           medium:{en:'I see a black ______.', zh:'我看到一隻黑色的<b>貓</b>。'},
           hard:{en:'The small ______ likes milk.', zh:'小<b>貓</b>喜歡牛奶。'} },
  dog:   { easy:{en:'The ______ runs fast.', zh:'<b>狗</b>跑得很快。'},
           medium:{en:'My ______ is friendly.', zh:'我的<b>狗</b>很友善。'},
           hard:{en:'The brown ______ likes to play.', zh:'棕色的<b>狗</b>喜歡玩。'} },
  run:   { easy:{en:'I can ______ to school.', zh:'我可以<b>跑步</b>去學校。'},
           medium:{en:'We ______ in the park.', zh:'我們在公園<b>跑步</b>。'},
           hard:{en:'They ______ every morning.', zh:'他們每天早上<b>跑步</b>。'} },
  big:   { easy:{en:'This is a ______ cake.', zh:'這是一個<b>大的</b>蛋糕。'},
           medium:{en:'The box is too ______.', zh:'這箱子太<b>大</b>了。'},
           hard:{en:'We saw a ______ house.', zh:'我們看到一棟<b>很大</b>的房子。'} },
  happy: { easy:{en:'I feel ______ today.', zh:'我今天很<b>開心</b>。'},
           medium:{en:'She looks ______ in class.', zh:'她在課堂上看起來很<b>開心</b>。'},
           hard:{en:'We were ______ at the party.', zh:'我們在派對很<b>開心</b>。'} }
};

// —— 確保全域可讀 ——（避免未使用 module 時讀不到）
window.PROFILES = PROFILES;
window.DUP = DUP;
window.LESSONS = LESSONS;
window.SIMPLE_TRANSLATE = SIMPLE_TRANSLATE;
window.POS = POS;
window.BANK = BANK;
