'use strict';
(function(root){
const source='https://9db.jp/dqwalk/data/7822?p=2',official='https://walk.dragonquest.jp/web/news/show/2026022630';
root.Catalog9.skills.push({id:'mage-chant',name:'魔響の詠唱',kind:'mageChant',job:'job-1',magePath:'chant',self:true,mpRate:.2,duration:5,source,note:'2026/2/26調整後：攻撃呪文威力1.2倍、攻撃呪文MP1.5倍、やまびこ発動率1.6倍。使用直後はAI攻撃、翌ターンは命令可。こころ道Lv30の詠唱側を個別指定。'});
function validate(a,level){if(a.magePath!=null&&!['none','chant','circle'].includes(a.magePath))throw Error('大魔道士のこころ道分岐を確認してください');if(a.job==='job-1'&&a.magePath&&a.magePath!=='none'&&level<30)throw Error('大魔道士の補助こころ道にはLv30が必要です');}
const active=s=>(s.mageChantRemaining||0)>0;
root.MageTools37={source,official,validate,active,costMultiplier:(k,s)=>k.type==='呪文'&&active(s)?1.5:1,echoRate:(rate,s)=>Math.min(1,rate*(active(s)?1.6:1))};
})(typeof window==='undefined'?globalThis:window);
