'use strict';
(function(root){
const C=root.Catalog9,m=root.PlannerData.real,src=n=>'https://9db.jp/dqwalk/data/'+n;
const stats=a=>Object.fromEntries(['hp','mp','attack','defense','magic','heal','speed','dex'].map((k,i)=>[k,a[i]]));
const hearts=[{id:'donburi-slime',name:'どんぶりスライム',stats:stats([61,32,85,29,14,13,98,106]),bonuses:['斬撃','体技'].map(type=>({group:'general',type,value:.05})),skills:[],rank:'S'},
 {id:'donburi-king',name:'どんぶりキング（覚醒）',stats:stats([77,40,106,36,18,16,123,133]),bonuses:['斬撃','体技'].map(type=>({group:'general',type,value:.1})),skills:['tokumori'],rank:'S覚醒'}].map(h=>({...h,color:'青',cost:90,costBonus:4,family:'donburi',effects:['最大コスト+4'],source:src(18437),checked:'2026-10-23'}));
for(const h of hearts){C.hearts.push(h);const old=m.items.find(x=>x.slot==='heart'&&x.name===h.name),row={...h,id:old?.id||h.id,slot:'heart',ready:false,verifiedModel:true,skillIds:[],verified:['8能力・コスト・斬体補正・覚醒スキル'],assumptions:[]};if(old)Object.assign(old,row);else m.items.push(row);}
C.skills.push({id:'tokumori',name:'特盛一丁！',kind:'adaptiveBuff',stages:2,duration:4,mpRate:.05,maxUses:1,source:src(18437),note:'攻撃力と攻撃魔力を比較し、高い側の攻撃力または呪文威力を2段階上昇。同値時は攻撃力を採用する比較モデル。'},
 {id:'time-interference',name:'時空干渉',kind:'extendBuff',mpRate:.15,maxUses:2,self:true,value:1,source:src(15584)},
 {id:'overdrive',name:'オーバードライブ',kind:'overdrive',mpRate:.1,maxUses:1,self:true,duration:3,source:'https://gamewith.jp/dq-walk/article/show/576110'},
 {id:'new-world',name:'新世界',kind:'domain',domain:'newworld',mpRate:.02,maxUses:1,self:true,source:src(20065)},
 {id:'holy-rush',name:'ホーリーラッシュ',kind:'attack',type:'斬撃',elements:['イオ','デイン'],multipliers:[500],randomHits:[270,270,270],hits:1,mp:58,attackTarget:'all',source:src(15584),note:'追撃のテンション低下・挑戦スキルは未算入。'});
const cheer=C.skills.find(k=>k.id==='cheer');Object.assign(cheer,{maxUses:1,extendable:false,source:src(10517),note:'じぶんの守り人・守護天使の記憶が必要。斬体・呪文威力に80%加算。延長不可。'});
const w={id:'god-bird-axe',name:'神鳥の翼斧',type:'オノ',stats0:{attack:180},stats4:{attack:235},favored:{attack:12},bonuses:[{group:'race',race:'けもの系',value:.05},{group:'race',race:'？？？？系',value:.05}],limitBonus:.28,skills:['holy-rush','time-interference'],initial:['ゆるがぬこころ10MP／時超えし神鳥の秘術：自身と左隣の行動終了時延長2ターン'],unmodeled:['いてつくはどう・挑戦スキル・確率テンション低下は未算入。'],source:src(15584),introducedRevision:35};C.weapons.push(w);
for(const lb of [0,4]){const old=m.items.find(x=>x.slot==='weapon'&&x.name===w.name&&(x.limitBreak||0)===lb),row={...w,id:old?.id||w.id+'-'+lb,slot:'weapon',weaponType:w.type,limitBreak:lb,stats:lb?w.stats4:w.stats0,verifiedModel:true,ready:false,skillIds:[],verified:['最大Lv0/4凸・延長の対象と発動時点'],assumptions:w.unmodeled};if(old)Object.assign(old,row);else m.items.push(row);}
root.BattleCatalog13.initialMP.push({id:w.id,flat:10,components:['ゆるがぬこころ10','時超えし神鳥の秘術12%'],source:w.source});
const shield={id:'adjust-shield',name:'調停者の盾',slot:'shield',limitBreak:0,stats:{defense:62,attack:10,mp:10,heal:10},bonuses:[{group:'criticalRate',value:.06},{group:'spellCriticalRate',value:.06}],skills:['overdrive'],source:'https://gamewith.jp/dq-walk/article/show/576110',verifiedModel:true,ready:false,skillIds:[],verified:['オーバードライブ10%・3ターン・再行動・1回制限'],assumptions:['0凸の守備力62は7周年紹介表に基づく。ガード・耐性は被ダメージへ未算入。']};const oldShield=m.items.find(x=>x.slot==='shield'&&x.name===shield.name);if(oldShield)Object.assign(oldShield,{...shield,id:oldShield.id});else m.items.push(shield);
const dharma=C.weapons.find(x=>x.id==='dharma-staff');if(dharma){dharma.initial=['幼き聖賢・まもりのたて：合計23MP'];dharma.unmodeled=['祈り以外の未収録技能・回復・他職の行動開始時特性。'];}
const gun=C.weapons.find(x=>x.id==='gun');if(gun&&!gun.skills.includes('new-world'))gun.skills.push('new-world');
root.SupportData35={hearts,weapon:w,shield};
const profile=root.PlannerData.profile;root.PlannerData.profile=function(master){const p=profile(master);if(master===m){const king=m.items.find(x=>x.slot==='heart'&&x.name==='どんぶりキング（覚醒）');const row=p.inventory.find(x=>x.id===king?.id);if(row)row.count=1;}return p;};
C.checked='2026-10-23';C.scope='代表'+C.weapons.length+'武器・'+C.hearts.length+'こころ。補助の集中・行動終了時延長・呪文の条件付き比較に対応。';
})(typeof window==='undefined'?globalThis:window);
