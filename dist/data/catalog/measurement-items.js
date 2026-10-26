'use strict';
(function(root){
const C=root.Catalog9,m=root.PlannerData.real;
// This S heart grants the ordinary charge skill independently of the weapon.
const armLion=C.hearts.find(h=>h.id==='arm-lion');if(armLion)armLion.skills=[...new Set([...(armLion.skills||[]),'normalcharge'])];
const blueDragon={id:'blue-dragonlord-awakened',name:'闇の覇者 蒼き竜王（覚醒）',family:'blue-dragonlord',color:'黄',rank:'S覚醒',cost:183,costBonus:4,stats:{hp:162,mp:87,attack:161,defense:93,magic:29,heal:58,speed:97,dex:39},bonuses:[{group:'general',type:'斬撃',value:.12},{group:'general',type:'体技',value:.12},{group:'element',element:'ドルマ',type:'斬撃',value:.12},{group:'element',element:'ドルマ',type:'体技',value:.12},{group:'element',value:.12},{group:'critical',value:.12}],skills:[],effects:['ターン開始時MP12回復','魅了耐性12%'],source:'https://gamewith.jp/dq-walk/article/show/537960',checked:'2026-10-26',unmodeled:['追い覚醒・覚醒+の個体追加値は含まない。','MP回復・魅了耐性の生存計算への接続は未確認。']};
if(!C.hearts.some(x=>x.id===blueDragon.id)){C.hearts.push(blueDragon);m.items.push({...blueDragon,slot:'heart',verifiedModel:true,ready:false,skillIds:[]});}
// Explicitly selected sub-effect, not an invented perfect random pearl.
const pearl={id:'dragonfang-pearl-critical-s',name:'7周年SP心珠S（天超えし竜牙10%・会心ダメージ5%）',slot:'pearl',rank:'S',stats:{},bonuses:[{group:'skillCorrection',skill:'dragonfang',value:.10},{group:'critical',value:.05}],verifiedModel:true,ready:false,skillIds:[],source:'https://gamewith.jp/dq-walk/article/show/576832',verified:['主効果10%と選択した下段会心ダメージ5%のみ。'],assumptions:['別の下段効果・S+・追加ちからを自動付与しない。'],checked:'2026-10-26'};
if(!m.items.some(x=>x.id===pearl.id))m.items.push(pearl);
// Preserve uncertainty in defensive stats rather than guessing a 0-conversion value.
const helmet={id:'yugunoa-helmet-0',name:'ユグノアのかぶと',slot:'head',limitBreak:0,stats:{speed:7},bonuses:[{group:'general',type:'斬撃',value:.09},{group:'element',value:.05},{group:'critical',value:.04}],conditional:[{when:'sunny',bonuses:[{group:'critical',value:.03}]}],verifiedModel:true,ready:false,skillIds:[],source:'https://gamewith.jp/dq-walk/article/show/561835',checked:'2026-10-26',verified:['最大強化での斬撃9%・全属性5%・会心4%・晴れ時会心3%・すばやさ7。'],assumptions:['0凸の守備力と耐性は未収録。火力比較用。','1凸攻撃力12など凸による能力値は加算しない。']};
if(!m.items.some(x=>x.name===helmet.name&&!(x.limitBreak||0)))m.items.push(helmet);
const legs={id:'world-tree-ruin-legs-0',name:'世界樹の鎧下【滅】',slot:'legs',limitBreak:0,stats:{hp:5,speed:7},bonuses:[{group:'general',type:'斬撃',value:.10},{group:'element',value:.04},{group:'race',race:'？？？？系',value:.02}],conditional:[{when:'sunny',bonuses:[{group:'element',value:.03}]}],verifiedModel:true,ready:false,skillIds:[],source:'https://game8.jp/dqwalk/720661',checked:'2026-10-26',verified:['斬撃10%・全属性4%・晴れ時全属性3%・？？？？系2%・HP5・すばやさ7。'],assumptions:['0凸守備力と耐性は未収録。火力比較用。','凸による攻撃力12・すばやさ12等を自動付与しない。']};
if(!m.items.some(x=>x.name===legs.name&&!(x.limitBreak||0)))m.items.push(legs);
// Inheritance metadata is independent of the main weapon's active mechanics.
C.weapons.push({id:'tougenkyo',name:'大太刀・桃源郷',type:'両手剣',stats0:{attack:187},stats4:{attack:244},twoHand0:93,twoHand4:122,favored:{attack:12},bonuses:[{group:'race',race:'ゾンビ系',value:.05},{group:'race',race:'物質系',value:.05}],twoHandBonuses:[{group:'general',type:'斬撃',value:.03},{group:'element',value:.03}],limitBonus:.28,skills:['tougen-strike'],initial:[],inherit:{skill:'tougen-strike',favoredAttack4:12,physical10:.07},source:'https://9db.jp/dqwalk/data/17980',unmodeled:['主武器としての陶酔・開幕属性補助・挑戦スキルは未対応。継承効果の検証用。']});
C.skills.push({id:'tougen-strike',name:'天上天下討鬼斬',kind:'unsupported',mp:61,source:'https://9db.jp/dqwalk/data/17980',note:'陶酔による倍率・属性耐性・延長の手順再現は未対応。継承の能力値・特殊効果のみ対応。'});
const originalProfile=root.PlannerData.profile;
root.PlannerData.profile=function(master){const p=originalProfile(master);if(master===m&&!p.inventory.some(x=>x.id===pearl.id))p.inventory.push({id:pearl.id,count:2});return p;};
})(typeof window==='undefined'?globalThis:window);
