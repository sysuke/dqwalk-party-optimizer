'use strict';
(function(){
const m=PlannerData.real;
const plain={hp:0,mp:0,attack:0,defense:0,magic:0,heal:0,speed:0};
m.items.push({id:'lucky-0',name:'ラッキーフォーチュン',slot:'weapon',weaponType:'こん',limitBreak:0,ready:true,stats:{...plain,attack:91,heal:121},skillIds:[],source:'https://gamewith.jp/dq-walk/article/show/569146',verified:['こん・攻撃91・回魔121','左隣の味方に行動開始時の良い効果1ターン延長（3ターン）'],assumptions:['回復・お守りスキルと耐久は未再現。実戦検証で延長先を判定。']});
m.items.push({id:'roto-kai3',name:'ロトのつるぎ（改3）',slot:'weapon',weaponType:'片手剣',ready:true,stats:plain,skillIds:[],source:CombatRules.sources.example,verified:['記事本文と編成画像で魔人の左手に採用'],assumptions:['凸数と強化値・系統補正の数値は画像のみでは確定できない。左手ダメージは未計算。']});
for(const i of m.items){if(i.name==='はてんの月輪'||i.name==='ケキちゃん')i.weaponType='ブーメラン';if(i.name==='勇者のつるぎ')i.weaponType='片手剣';}
for(const i of m.items.filter(i=>i.name==='勇者のつるぎ'||i.name==='はてんの月輪')){i.stats.attack=i.limitBreak===4?245:188;i.verified.push('0凸攻撃188・4凸245');}
for(const i of m.items.filter(i=>i.name==='ケキちゃん')){i.inheritCombatIds=['rondo'];i.inheritSkillIds=[];i.inheritBonuses=[{group:'race',race:'悪魔系',value:.05},{group:'general',type:'斬撃',value:.07},{group:'general',type:'体技',value:.07}];i.assumptions.push('継承は風斬りのロンドと対象特殊効果のみ。能力値・いきなり/挑戦は継承しない。');}
// Remove the previous unrelated Baikiruto stand-in. The real combo is in CombatRules.
for(const i of m.items.filter(i=>i.name==='ケキちゃん'))i.skillIds=[];
for(const lb of [0,4])m.items.push({id:'roto-'+lb,name:'ロトの竜剣',slot:'weapon',weaponType:'片手剣',limitBreak:lb,ready:true,stats:{...plain,attack:lb?245:188},skillIds:[],source:CombatRules.sources.roto,verified:['武器種・0凸攻撃188・4凸245・対ドラゴン開幕SHT'],assumptions:['通常探索では攻撃スキル未選択。アギロゴス実戦検証でこころ由来スキルと併用。','領域の競合と開幕MPは未検証。'],bonuses:[]});
m.items.push({id:'mikazuchi-awakened',name:'是空天ミカヅチ（覚醒）',monster:'迅雷天ミカヅチ',rank:'S覚醒',slot:'heart',color:'紫',cost:167,costBonus:4,ready:true,stats:{hp:149,mp:147,attack:28,defense:94,magic:146,heal:59,speed:100},skillIds:[],combatSkillIds:['timewave'],regen:{mp:5},source:'https://game8.jp/dqwalk/666740',verified:['覚醒S基礎値・じゅもん+12%・ざざん波・時荒らし・開始MP回復5'],assumptions:['通常探索では時荒らし未選択。実戦検証のスキル取得元。天候効果・耐性は未反映。'],bonuses:[{group:'general',type:'呪文',value:.12}]});
m.items.push({id:'gaia-s',name:'ガイアの心珠',slot:'pearl',rank:'S',ready:true,stats:plain,source:CombatRules.sources.gaia,verified:['ドラゴン系へのダメージ+15%'],assumptions:['怯え耐性は戦闘計算未反映。S+と区別。'],bonuses:[{group:'race',race:'ドラゴン系',value:.15}]});
const corpse=m.items.find(i=>i.id==='corpse');Object.assign(corpse,{cost:170,source:CombatRules.sources.corpse,stats:{hp:141,mp:61,attack:133,defense:80,magic:21,heal:21,speed:105},bonuses:[{group:'general',type:'斬撃',value:.1},{group:'general',type:'体技',value:.1},{group:'race',race:'ドラゴン系',value:.1},{group:'race',race:'鳥系',value:.1}],startEffects:[{stat:'attack',group:'attack',value:1.4,duration:4,chance:1,enemyRace:'ドラゴン系'},{stat:'defense',group:'defense',value:1.4,duration:4,chance:1,enemyRace:'ドラゴン系'}],verified:['S基礎値・コスト170・斬体10%・ドラゴン/鳥10%・対ドラゴン開幕攻守2段階'],assumptions:['開幕効果の持続4を仮置き。耐性は未計算。']});
const agiro=m.contents.find(c=>c.id==='agiro');agiro.requiresDetailedRules=true;agiro.hp=1300000;agiro.note='シールド・追加行動・時荒らしを実戦検証で確認';
agiro.verified=['最大HP約240万・おたすけ後のHP約130万（参照元に差あり）','シールド基準約24万/48万/72万/120万。残HPではなく最大HPに依存。'];
agiro.assumptions=['0.4の一律攻撃モデルでは実戦判定をしない。実戦検証ではスキル取得条件・時荒らし・シールド・追加行動を個別に計算。','聖なる防壁などの残りターン・攻撃ダメージ・生存条件は実測で確認が必要。'];
const old=PlannerData.profile;PlannerData.profile=function(master){const p=old(master);if(master===m){p.inventory.forEach(x=>{if(x.id==='gaia-s')x.count=2;});}return p;};
// Preserve prior values; new records are added by existing mergeDefaults.
m.jobs.forEach(j=>j.slotBonus=1.3);
m.assumptions[0]='職業の基礎能力は仮値。永続効果・こころ道・熟練度は通常探索では未反映。ガイアSの特効は反映。';
m.assumptions[1]='アギロゴスの継承・追加行動・時荒らし・シールドは専用検証で処理。通常探索の会心・領域・継承等は未再現。';
m.revision=5;
})();
