// —— 孩子設定（頁籤）——
const PROFILES = {
  lulu:   { title: "Lulu（小一 6歲）",  group: "g1" },
  sherry: { title: "Sherry（小四 9歲）", group: "g4" }
};

// 固定重複單字（每課都有）
const DUP = ["encourage","defeat","distinguish","achieve","command"];

// —— 課次清單 ——（group 控制顯示給哪位孩子）
const LESSONS = {
  "g4-0": { title: "四上期中考前固定單字", group: "g4",
    words: ["encourage","defeat","distinguish","achieve","command"]			
  },
  "g4-1": { title: "第一課", group: "g4",
    words: ["enormous","interfered","stationary","abandon","appeared",]
  },
  "g4-2": { title: "第二課", group: "g4",
    words: ["figured","complain","patience","temper","remember",]
  },
  "g4-3": { title: "第三課", group: "g4",
    words: ["horribly","furious","insisted","terribly","disturbed",]		
  },
  "g1-1": { title: "第一課", group: "g1",
    words: ["check","quiet","listen","mutters",
            "a","I","is","his","see"]
  },
  "g1-2": { title: "第二課", group: "g1",
    words: ["sand","block","street","corner",
            "we","do","the","one","like"]
  },
  "g1-3": { title: "第三課", group: "g1",
    words: ["left","right","guard","crosswalk",
            "by","are","was","you","look"]
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
  distinguish: "<b>分辨</b>；區分",
  achieve: "<b>達成</b>；實現",
  command: "<b>命令</b>；指揮",
  check: "檢查", 
  quiet: "安靜的",
  listen: "傾聽", 
  mutters: "小聲嘀咕；咕噥", 
  a: "一個（用於子音開頭單字前）",
  I: "我",
  is: "是（第三人稱單數用）",
  his: "他的",
  see: "看見",
  sand: "沙子",
  block: "街區；一段街",
  street: "街道",
  corner: "轉角；角落",
  we: "我們",
  do: "做",
  the: "這／那（特指某個東西）",
  one: "一；一個",
  like: "喜歡",
  left: "左邊的；向左",
  right: "右邊的；向右",
  guard: "警衛；保全",
  crosswalk: "斑馬線；行人穿越道",
  by: "在旁邊；經過",
  are: "是；在",
  was: "是；在（過去）",
  you: "你；你們",
  look: "看；看起來",
  horribly: "可怕地；非常糟糕地",
  insisted: "堅持；堅決要求",
  furious: "非常生氣的；暴怒的",
  terribly: "非常；糟糕地",
  disturbed: "不安的；受到干擾的"
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
  check: "v.", 
  quiet: "adj.",
  listen: "v.", 
  mutters: "v.", 
  a: "art.",
  I: "pron.",
  is: "v.",
  his: "pron./adj.",
  see: "v.",
  sand: "n.",
  block: "n.",
  street: "n.",
  corner: "n.",
  we: "pron.",
  do: "v.",
  the: "art.",
  one: "n./adj.",
  like: "v.",
  left: "adj./adv.",
  right: "adj./adv.",
  guard: "n.",
  crosswalk: "n.",
  by: "prep.",
  are: "v.",
  was: "v.",
  you: "pron.",
  look: "v.",
  horribly: "adv.",
  insisted: "v., 過去式",
  furious: "adj.",
  terribly: "adv.",
  disturbed: "adj. / v. 過去式"
};

// —— 題庫 —— 
const BANK = {
  "enormous": [
    {"en": "The dog is ______.","zh": "那隻狗很巨大。"},
    {"en": "The ______ tree gave shade to the whole playground.","zh": "這棵<b>巨大的</b>樹讓整個操場都有樹蔭。"},
    {"en": "The storm caused ______ damage to the small town.","zh": "這場風暴造成小鎮<b>巨大的</b>破壞。"},
    {"en": "Despite the ______ workload, the team managed to complete the project on time.","zh": "儘管工作量<b>龐大</b>，這個團隊仍設法準時完成計畫。"},
    {"en": "The whale was so ______ that it barely fit in the aquarium tank.","zh": "那頭鯨魚太<b>巨大</b>了，水族箱幾乎裝不下。"},
    {"en": "The statue in the park was so ______ that we could see it from far away.","zh": "公園裡的雕像非常<b>巨大</b>，我們在很遠的地方就能看到。"}
  ],
  "interfered": [
    {"en": "The noise ______ with my sleep.","zh": "噪音<b>干擾</b>了我的睡眠。"},
    {"en": "He ______ in the game and made the players angry.","zh": "他<b>介入</b>比賽，惹怒了選手們。"},
    {"en": "The loud construction ______ with our online class, so the teacher rescheduled.","zh": "吵雜的施工<b>干擾</b>了我們的線上課，所以老師只好改期。"},
    {"en": "I asked him not to ______ when I’m studying; I need quiet.","zh": "我請他不要在我讀書時<b>打擾</b>；我需要安靜。"},
    {"en": "My little sister ______ with my homework by scribbling on my paper.","zh": "我妹妹在我的作業紙上亂畫，<b>干擾</b>我的功課。"},
    {"en": "Please do not ______ while others are taking their test.","zh": "別在別人考試時<b>干擾</b>。"}
  ],
  "stationary": [
    {"en": "The car is ______ at the red light.","zh": "那輛車在紅燈時保持<b>靜止</b>。"},
    {"en": "The bike stayed ______ even though the wind was strong.","zh": "雖然風很大，腳踏車仍然<b>靜止不動</b>。"},
    {"en": "The soldiers remained ______ until they received the command to move.","zh": "士兵們一直保持<b>靜止</b>，直到收到移動的<b>命令</b>。"},
    {"en": "The project is still ______ — we haven’t started it yet.","zh": "這個計畫還<b>停滯不動</b>，我們還沒開始。"},
    {"en": "The security guard told everyone to remain ______ during the fire drill.","zh": "消防演習時，警衛要大家保持<b>靜止</b>。"},
    {"en": "The car remained ______ at the red light.","zh": "車子在紅燈時保持<b>靜止</b>。"},
    {"en": "The bicycle stayed ______ even though the wind was blowing.","zh": "儘管風在吹，自行車依然<b>靜止不動</b>。"}
  ],
  "abandon": [
    {"en": "Do not ______ your pet.","zh": "不要<b>拋棄</b>你的寵物。"},
    {"en": "The team had to ______ the game because of heavy rain.","zh": "因為大雨，球隊不得不<b>放棄</b>比賽。"},
    {"en": "She felt sad when her best friend decided to ______ their plan without explanation.","zh": "當最好的朋友毫無解釋地<b>放棄</b>他們的計畫時，她感到很難過。"},
    {"en": "They had to ______ plans for the picnic when it started to rain.","zh": "開始下雨時，他們只好<b>放棄</b>野餐的計畫。"},
    {"en": "We must not ______ our pets, because they depend on us for care.","zh": "我們不能<b>拋棄</b>寵物，因為牠們依賴我們照顧。"}
  ],
  "appeared": [
    {"en": "The moon ______ in the sky.","zh": "月亮<b>出現</b>在天空中。"},
    {"en": "A rainbow suddenly ______ after the rain stopped.","zh": "雨停後突然<b>出現</b>一道彩虹。"},
    {"en": "He ______ calm, but inside he was very nervous about the test.","zh": "他<b>看起來</b>很冷靜，但內心對考試其實很緊張。"},
    {"en": "A shadow ______ on the wall after I lit the candle.","zh": "我點燃蠟燭後，牆上<b>出現</b>了一個影子。"},
    {"en": "The magician made a rabbit ______ from his empty hat.","zh": "魔術師讓一隻兔子從他的空帽子裡<b>出現</b>。"},
    {"en": "The magician suddenly ______ from the stage in a cloud of smoke.","zh": "魔術師突然在煙霧中<b>出現</b>在舞台上。"}
  ],
  "figured": [
    {"en": "I ______ the answer was 10.","zh": "我<b>認為</b>答案是10。"},
    {"en": "She ______ out how to fix the broken toy.","zh": "她<b>想出</b>如何修好壞掉的玩具。"},
    {"en": "He ______ it was better to stay quiet than to argue with his teacher.","zh": "他<b>認為</b>保持沉默比和老師爭論更好。"},
    {"en": "The new student finally ______ out how to use the library’s online system.","zh": "新同學最後<b>想出</b>如何使用圖書館的線上系統。"},
    {"en": "I finally ______ out the answer to the puzzle.","zh": "我終於<b>想出</b>這個謎題的答案。"},
    {"en": "After working on the math problem for twenty minutes, she finally ______ out the solution.","zh": "花了二十分鐘解數學題後，她終於<b>想出</b>了答案。"}
  ],
  "complain": [
    {"en": "He likes to ______ about homework.","zh": "他喜歡<b>抱怨</b>作業。"},
    {"en": "The children ______ that the food was too cold.","zh": "孩子們<b>抱怨</b>食物太冷了。"},
    {"en": "Instead of ______, we should think of ways to solve the problem.","zh": "與其<b>抱怨</b>，不如想辦法解決問題。"},
    {"en": "The angry customer started to ______ loudly about the long wait.","zh": "生氣的顧客開始大聲 <b>抱怨</b> 漫長的等待。"},
    {"en": "Students should not ______ about every little problem.","zh": "學生不應該對每個小問題都 <b>抱怨</b>。"},
    {"en": "Instead of choosing to ______ about the weather, we should enjoy the day as it is.","zh": "與其選擇 <b>抱怨</b>天氣，不如享受當下的一天。"}
  ],
  "patience": [
    {"en": "Mom has ______ with the baby.","zh": "媽媽對嬰兒很有<b>耐心</b>。"},
    {"en": "You need ______ when you learn a new skill.","zh": "學習新技能需要<b>耐心</b>。"},
    {"en": "His ______ finally ran out after waiting for the bus for an hour.","zh": "等公車一小時後，他的<b>耐心</b>終於用盡了。"},
    {"en": "It takes great ______ to wait in a long line without getting upset.","zh": "要在長隊伍裡等候而不生氣，需要很大的 <b>耐心</b>。"},
    {"en": "Growing plants takes time and ______ because they don’t grow overnight.","zh": "種植植物需要時間和 <b>耐心</b>，因為它們不會一夜長成。"},
    {"en": "Raising a puppy requires great ______ because it takes time to train it properly.","zh": "養小狗需要很大的 <b>耐心</b>，因為訓練需要時間。"}
  ],
  "temper": [
    {"en": "He has a bad ______.","zh": "他<b>脾氣</b>不好。"},
    {"en": "She lost her ______ when her brother broke her toy.","zh": "弟弟弄壞她的玩具時，她發了<b>脾氣</b>。"},
    {"en": "It takes practice to control one’s ______ during stressful times.","zh": "在壓力大的時候，控制<b>脾氣</b>需要練習。"},
    {"en": "He has a very short ______ and gets angry easily.","zh": "他的 <b>脾氣</b>很差，很容易生氣。"},
    {"en": "It is important to stay calm and control your ______ when you are upset.","zh": "當你生氣時，保持冷靜並控制你的<b>脾氣</b>很重要。"},
    {"en": "Even though he lost his ______ for a moment, he quickly calmed down and apologized.","zh": "雖然他一時發了<b>脾氣</b>，但很快冷靜下來並道歉了。"    }
  ],
  "remember": [
    {"en": "I ______ my teacher’s name.","zh": "我<b>記得</b>老師的名字。"},
    {"en": "Please ______ to bring your homework tomorrow.","zh": "請<b>記得</b>明天帶作業。"},
    {"en": "He couldn’t ______ where he had placed his keys after the party.","zh": "派對結束後，他<b>記</b>不起把鑰匙放在哪裡。"},
    {"en": "I’ll always ______ the day we first met.","zh": "我會永遠 <b>記得</b> 我們第一次見面的那一天。"},
    {"en": "Please ______ to bring your homework tomorrow.","zh": "請 <b>記得</b> 明天帶作業來。"},
    {"en": "Please ______ to turn off the lights before leaving the classroom.","zh": "請 <b>記得</b> 離開教室前要關燈。"}
  ],
  "encourage": [
    {"en": "Teachers ______ students to read.","zh": "老師<b>鼓勵</b>學生閱讀。"},
    {"en": "My coach always ______ me before a big game.","zh": "大比賽前，教練總是<b>鼓勵</b>我。"},
    {"en": "Parents should ______ children to try new things even if they might fail.","zh": "父母應該<b>鼓勵</b>孩子嘗試新事物，即使可能會失敗。"},
    {"en": "The kind teacher always tries to ______ her students to do their best.","zh": "善良的老師總是試著<b>鼓勵</b>學生盡力而為。"},
    {"en": "The teacher tried to ______ the students to ask more questions in class.","zh": "老師試著<b>鼓勵</b>學生在課堂上多發問。"},
    {"en": "Teachers always try to ______ students to do their best.","zh": "老師總是努力<b>鼓勵</b>學生盡力而為。"},
    {"en": "The teacher tried to ______ us to do our best on the science project.","zh": "老師試著<b>鼓勵</b>我們在科學專題上盡最大努力。"},
    {"en": "Good friends always ______ each other to try new things and never give up.","zh": "好朋友總是<b>鼓勵</b>彼此嘗試新事物，永不放棄。"}
  ],
  "defeat": [
    {"en": "Our team will ______ theirs.","zh": "我們隊會<b>打敗</b>他們。"},
    {"en": "The hero finally ______ the dragon.","zh": "英雄終於<b>打敗</b>了惡龍。"},
    {"en": "They worked together to ______ their fear of speaking in public.","zh": "他們齊心協力<b>戰勝</b>上台說話的恐懼。"},
    {"en": "The team was disappointed after their unexpected ______ in the final game.","zh": "這支隊伍在決賽中的意外<b>失敗</b>之後很失望。"},
    {"en": "The team suffered a ______ in yesterday’s game.","zh": "這支隊伍在昨天的比賽中被<b>打敗</b>。"},
    {"en": "The soccer team tried their best not to face ______ in the final game.","zh": "足球隊盡力比賽，希望不要在決賽中<b>失敗</b>。"},
    {"en": "The soccer team worked very hard to ______ their biggest rival.","zh": "足球隊非常努力去<b>打敗</b>他們最大的對手。"},
    {"en": "The team felt sad after their unexpected ______ in the championship game.","zh": "球隊在冠軍賽中的意外<b>失敗</b>之後感到難過。"}
  ],
  "distinguish": [
    {"en": "Can you ______ red from pink?","zh": "你能<b>分辨</b>紅色和粉紅色嗎？"},
    {"en": "It’s hard to ______ twins because they look alike.","zh": "雙胞胎長得很像，很難<b>分辨</b>。"},
    {"en": "Good readers can ______ between facts and opinions in a story.","zh": "好的讀者能<b>分辨</b>故事中的事實與意見。"},
    {"en": "I can’t ______ between the two identical twins.","zh": "我無法<b>分辨</b>那兩個長得一模一樣的雙胞胎。"},
    {"en": "You must ______ between fact and opinion when reading news sources.","zh": "閱讀新聞時，你必須<b>分辨</b>事實與意見。"},
    {"en": "Can you ______ between the twins, or do they look the same to you?","zh": "你能<b>分辨</b>這對雙胞胎嗎？還是他們在你眼裡長得一模一樣？"},
    {"en": "It is sometimes difficult to ______ between twins because they look so much alike.","zh": "有時候很難<b>分辨</b>雙胞胎，因為他們長得太像了。"},
    {"en": "The twins look almost the same, but I can still ______ one from the other by their voices.","zh": "這對雙胞胎看起來幾乎一樣，但我仍能藉由聲音<b>分辨</b>他們。"    }
  ],
  "achieve": [
    {"en": "She wants to ______ her goal.","zh": "她想<b>達成</b>目標。"},
    {"en": "He ______ high grades by studying hard.","zh": "他努力學習，<b>取得</b>好成績。"},
    {"en": "The team felt proud to ______ success after months of hard work.","zh": "經過數月努力後，團隊對<b>達成</b>成功感到自豪。"},
    {"en": "She was very proud to finally ______ her goal of getting into a good university.","zh": "她非常驕傲，因為她終於<b>達成</b>進入好大學的目標。"},
    {"en": "Though the difficulty was great, she hoped to ______ her goal through hard work.","zh": "雖然困難很大，但她希望透過努力<b>達成</b>她的目標。"},
    {"en": "With hard work, you can ______ your goals.","zh": "只要努力，你就能<b>達成</b>目標。"},
    {"en": "If you practice every day, you will ______ your goal of learning to play the piano.","zh": "如果你每天練習，你就能<b>達成</b>學會彈鋼琴的目標。"},
    {"en": "If you practice every day, you can ______ great success in learning English.","zh": "如果你每天練習，你可以<b>達成</b>學英文的巨大成功。"}
  ],
  "command": [
    {"en": "The captain gave a ______ to stop.","zh": "隊長下了停止的<b>命令</b>。"},
    {"en": "The dog obeyed the ______ to sit quietly.","zh": "那隻狗服從了坐下的<b>命令</b>。"},
    {"en": "All soldiers followed the general’s ______ without question.","zh": "所有士兵都毫無疑問地服從將軍的<b>命令</b>。"},
    {"en": "The soldier’s salute showed respect for the officer in ______.","zh": "士兵的敬禮表現出對軍官的<b>指揮權</b>的尊敬。"},
    {"en": "The general will ______ the troops to hold the line until reinforcements arrive.","zh": "將軍將會<b>指揮</b>軍隊堅守陣線直到援軍抵達。"},
    {"en": "The general gave a clear ______ to his soldiers.","zh": "將軍向士兵下達了明確的<b>命令</b>。"},
    {"en": "The general gave a clear ______ to his soldiers before the battle began.","zh": "將軍在戰鬥開始前，向士兵下達了明確的<b>命令</b>。"},
    {"en": "The captain shouted a ______, and all the sailors immediately followed his orders.","zh": "船長大聲下達<b>命令</b>，所有水手立刻服從。"    }
  ],
  "sand": [
    {"en": "We played with a bucket of ______ at the beach.","zh": "我們在海邊用一桶<b>沙子</b>玩耍。"},
    {"en": "The castle made of ______ fell down when the waves came.","zh": "那個<b>沙子</b>做的城堡被海浪沖垮了。"},
    {"en": "My shoes were full of ______ after walking on the beach.","zh": "我在沙灘走路後，鞋子裡全是<b>沙子</b>。"},
    {"en": "We use ______ to build castles on the beach.","zh": "我們用<b>沙子</b>在沙灘上蓋城堡。"}
  ],
  "block": [
    {"en": "The school is just one ______ away from my house.","zh": "學校離我家只有一個<b>街區</b>。"},
    {"en": "Our friend lives on the next ______.","zh": "我們的朋友住在下一個<b>街區</b>。"},
    {"en": "Dad parked the car two ______ from the park.","zh": "爸爸把車停在離公園兩個<b>街區</b>遠的地方。"},
    {"en": "There are many houses on the ______.","zh": "這個<b>街區</b>有很多房子。"}
  ],
  "street": [
    {"en": "Cars are driving fast on the ______.","zh": "車子在<b>街道</b>上快速行駛。"},
    {"en": "Don’t cross the ______ without looking.","zh": "過馬路前要小心看，不要隨便穿越<b>街道</b>。"},
    {"en": "There are trees planted along the ______.","zh": "<b>街道</b>兩旁種滿了樹。"},
    {"en": "My house is at the end of the ______.","zh": "我的房子在這條<b>街</b>的盡頭。"}
  ],
  "corner": [
    {"en": "We turned the ______ and saw the park.","zh": "我們轉過<b>轉角</b>，看到了公園。"},
    {"en": "There is a bakery at the ______ of the street.","zh": "街道的<b>轉角</b>有一家麵包店。"},
    {"en": "The cat is hiding in the ______ of the room.","zh": "那隻貓藏在房間的<b>角落</b>。"},
    {"en": "My school is on the ______ of the street.","zh": "我的學校在街道的<b>轉角</b>。"    }
  ],
  "left": [
    {"en": "My bookshelf is on the ______ of the desk.","zh": "我的書櫃在書桌的<b>左邊</b>。"},
    {"en": "Dad wears his watch on his ______ hand.","zh": "爸爸把手錶戴在<b>左</b>手上。"},
    {"en": "I cannot write if I use my ______ hand.","zh": "我用<b>左</b>手就不會寫字了。"}
  ],
  "right": [
    {"en": "My sister sleeps on Mom’s ______ at night.","zh": "姊姊晚上睡在媽媽的<b>右</b>手邊。"},
    {"en": "She writes with her ______ hand.","zh": "她用<b>右</b>手寫字。"},
    {"en": "In the morning, I like to sit on the ______ side of the back seat in the car.","zh": "早上我習慣坐在汽車後座的<b>右</b>側。"}
  ],
  "guard": [
    {"en": "The ______ stood at the gate of the school.","zh": "<b>警衛</b>站在學校的大門口。"},
    {"en": "The museum has a ______ to stop thieves.","zh": "博物館有<b>警衛</b>保護，防止竊盜。"},
    {"en": "The ______ waved and said hello to me.","zh": "<b>警衛</b>揮手跟我打招呼。"}
  ],
  "crosswalk": [
    {"en": "We must walk on the ______ to cross the street safely.","zh": "我們要走在<b>斑馬線</b>上才能安全過馬路。"},
    {"en": "Cars stopped at the ______ for the children.","zh": "車子在<b>斑馬線</b>前停下來讓小朋友過。"},
    {"en": "The ______ has white stripes on the road.","zh": "<b>斑馬線</b>是畫在馬路上的白條紋。"}
  ],
  "by": [
    {"en": "I sit ______ the window.","zh": "我坐<b>在</b>窗戶旁邊。"},
    {"en": "She walks ______ the river.","zh": "她走<b>在</b>河邊。"},
    {"en": "The book is ______ my bed.","zh": "書<b>在</b>我的床邊。"}
  ],
  "are": [
    {"en": "We ______ happy today.","zh": "我們今天很開心。"},
    {"en": "The cats ______ in the box.","zh": "貓咪們<b>在</b>箱子裡。"},
    {"en": "You ______ my best friend.","zh": "你<b>是</b>我最好的朋友。"}
  ],
  "was": [
    {"en": "It ______ sunny yesterday.","zh": "昨天<b>是</b>晴天。"},
    {"en": "He ______ at the park last night.","zh": "他昨晚<b>在</b>公園。"},
    {"en": "She ______ my teacher last year.","zh": "她去年<b>是</b>我的老師。"}
  ],
  "you": [
    {"en": "Do ______ want some juice?","zh": "<b>你</b>要喝果汁嗎？"},
    {"en": "I like ______ very much.","zh": "我很喜歡<b>你</b>。"},
    {"en": "Can ______ help me, please?","zh": "<b>你</b>可以幫我嗎？"}
  ],
  "look": [
    {"en": "______ at the stars in the sky!","zh": "<b>看</b>天上的星星！"},
    {"en": "______, the dog is running.","zh": "<b>看</b>，那隻狗在跑。"},
    {"en": "______ at this picture of a cat.","zh": "<b>看</b>這張貓的照片。"}
  ],
  "we": [
    {"en": "______ are in the same class.","zh": "<b>我們</b>在同一班。"},
    {"en": "______ have a big family.","zh": "<b>我們</b>有一個大家庭。"},
    {"en": "______ like to play soccer together.","zh": "<b>我們</b>喜歡一起踢足球。"},
    {"en": "______ clean the classroom together.","zh": "<b>我們</b>一起打掃教室。"}
  ],
  "do": [
    {"en": "What can you ______ with this toy?","zh": "你能用這個玩具<b>做</b>什麼？"},
    {"en": "I can ______ my homework.","zh": "我可以<b>做</b>我的功課。"},
    {"en": "What do you want to ______?","zh": "你想<b>做</b>什麼？"}
  ],
  "the": [
    {"en": "I see ______ moon in the sky.","zh": "我看到天上的月亮。"},
    { "en": "Please open ______ door.","zh": "請打開門。"},
    {"en": "______ cat is sleeping on the chair.","zh": "貓正在椅子上睡覺。"},
    {"en": "I want ______ orange balloon.","zh": "我想要那個橘色氣球。"}
  ],
  "one": [
    {"en": "I have ______ apple.","zh": "我有<b>一顆</b>蘋果。"},
    {"en": "He has ______ toy car.","zh": "他有<b>一台</b>玩具車。"},
    {"en": "She saw ______ bird in the tree.","zh": "她在樹上看到<b>一隻</b>鳥。"},
    {"en": "I only have ______ sticker.","zh": "我只有<b>一張</b>貼紙。"}
  ],
  "like": [
    {"en": "I ______ ice cream.","zh": "我<b>喜歡</b>冰淇淋。"},
    {"en": "Do you ______ this book?","zh": "你<b>喜歡</b>這本書嗎？"},
    {"en": "We ______ to play outside.","zh": "我們<b>喜歡</b>在外面玩。"},
    {"en": "I ______ to play outside.","zh": "我<b>喜歡</b>在外面玩。"}
  ],
  "check": [
    {"en": "Did you ______ your homework?","zh": "你有<b>檢查</b>你的功課嗎？"},
    {"en": "Mom will ______ if the door is locked.","zh": "媽媽會<b>檢查</b>門有沒有鎖好。"},
    {"en": "Let’s ______ the answers together.","zh": "我們一起<b>檢查</b>答案吧。"}
  ],
  "quiet": [
    {"en": "The library is very ______.","zh": "圖書館很<b>安靜</b>。"},
    {"en": "The baby is sleeping, so we must stay ______.","zh": "寶寶在睡覺，我們要保持<b>安靜</b>。"},
    {"en": "We sat ______ to listen to the story.","zh": "我們<b>安靜地</b>坐著聽故事。"},
    {"en": "Shh! Be ______!","zh": "噓！安靜！"}
  ],
  "listen": [
    {"en": "We ______ to music in the car.","zh": "我們在車裡<b>聽</b>音樂。"},
    {"en": "Did you ______ to your mom?","zh": "你有<b>聽</b>媽媽的話嗎？"},
    {"en": "He will not ______ if you talk too soft.","zh": "如果你講得太小聲，他<b>聽</b>不到。"},
    {"en": "We must ______ to the teachers.","zh": "我們必須<b>聽</b>老師的話。"}
  ],
  "mutters": [
    {"en": "She ______ something I cannot hear.","zh": "她<b>小聲咕噥</b>，我聽不清楚。"},
    {"en": "He ______ to himself in the corner.","zh": "他在角落<b>小聲自言自語</b>。"},
    {"en": "He ______ to learn the words for the test.","zh": "他<b>小聲嘀咕</b>著背單字，準備考試。"},
    {"en": "The boy always ______.","zh": "那個男孩總是<b>小聲嘀咕</b>。"}
  ],
  "a": [
    {"en": "She has ______ dog.","zh": "她有<b>一隻</b>狗。"},
    {"en": "I want ______ ball to play.","zh": "我想要<b>一顆</b>球來玩。"},
    {"en": "There is ______ bird in the tree.","zh": "樹上有<b>一隻</b>鳥。"},
    {"en": "I see ______ pink pig in the mud. He is alone.","zh": "我看到<b>一隻</b>粉紅色的小豬在泥巴裡。他是孤單的。"}
  ],
  "I": [
    {"en": "______ am six years old.","zh": "<b>我</b>六歲了。"},
    {"en": "______ like to play with my friends.","zh": "<b>我</b>喜歡和朋友一起玩。"},
    {"en": "______ am happy today.","zh": "<b>我</b>今天很開心。"},
    {"en": "______ am in first grade!","zh": "<b>我</b>上一年級了！"}
  ],
  "is": [
    {"en": "He ______ my brother.","zh": "他<b>是</b>我的弟弟。"},
    {"en": "The dog ______ big and brown.","zh": "那隻狗又大又<b>是</b>棕色的。"},
    {"en": "This ______ my favorite toy.","zh": "這<b>是</b>我最喜歡的玩具。"},
    {"en": "She ______ a nice girl.","zh": "她<b>是</b>一個好女孩。"
    }
  ],
  "his": [
    {"en": "That is ______ pencil on the desk.","zh": "那是他桌上的鉛筆。"},
    {"en": "I know ______ name","zh": "我知道<b>他的</b>名字。"},
    {"en": "______ shoes are very new.","zh": "<b>他的</b>鞋子很新。"},
    {"en": "______ name is Bob.","zh": "<b>他的</b>名字是 Bob。"}
  ],
  "see": [
    {"en": "I can ______ the stars.","zh": "我可以<b>看到</b>星星。"},
    {"en": "Do you ______ the cat under the table?","zh": "你<b>看到</b>桌子底下的貓嗎？"},
    {"en": "We can ______ the moon at night.","zh": "我們晚上可以<b>看</b>到月亮。"},
    {"en": "I can ______ with my eyes.","zh": "我可以用眼睛<b>看見</b>。"}
  ],
  "horribly": [
    {"en": "The soup tasted ______, so I didn’t want to eat it.","zh": "這碗湯喝起來<b>很</b>難喝，所以我不想喝。"},
    {"en": "He sang so ______ that everyone covered their ears.","zh": "他唱得<b>很</b>糟糕，大家都捂起耳朵。"},
    {"en": "The room was ______ messy after the party.","zh": "派對之後，房間<b>亂得可怕</b>。"}
  ],
  "furious": [
    {"en": "Dad was ______ when I broke the window.","zh": "當我打破窗戶時，爸爸<b>非常生氣</b>。"},
    {"en": "She looked ______ because her brother took her toy.","zh": "她看起來<b>很氣憤</b>，因為弟弟拿走了她的玩具。"},
    {"en": "The teacher was ______ after the students shouted in class.","zh": "學生們在課堂大喊後，老師<b>非常憤怒</b>。"}
  ],
  "insisted": [
    {"en": "He ______ on playing outside even though it was raining.","zh": "雖然下雨，他還是<b>堅持</b>要出去玩。"},
    {"en": "Mom ______ that I wear a jacket before going out.","zh": "媽媽<b>堅持</b>要我穿外套再出門。"},
    {"en": "She ______ that the story was true.","zh": "她<b>堅持</b>那個故事是真的。"}
  ],
  "terribly": [
    {"en": "I felt ______ sick after eating too much candy.","zh": "我吃了太多糖，感到<b>非常不舒服</b>。"},
    {"en": "He was ______ late for school today.","zh": "他今天上學<b>大遲到</b>。"},
    {"en": "The movie was ______ boring, so I fell asleep.","zh": "這部電影<b>非常無聊</b>，所以我睡著了。"}
  ],
  "disturbed": [
    {"en": "The baby was ______ by the loud noise.","zh": "嬰兒因為噪音而<b>受到驚嚇</b>。"},
    {"en": "I felt ______ when I saw the hurt puppy.","zh": "看到受傷的小狗時，我感到<b>不安</b>。"},
    {"en": "She was ______ because someone kept knocking on the door.","zh": "有人一直敲門，她覺得很<b>煩擾</b>。"}
  ]
};

// —— 確保全域可讀 —— 
window.PROFILES = PROFILES;
window.DUP = DUP;
window.LESSONS = LESSONS;
window.SIMPLE_TRANSLATE = SIMPLE_TRANSLATE;
window.POS = POS;
window.BANK = BANK;
