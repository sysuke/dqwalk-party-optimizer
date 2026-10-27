'use strict';
(function(root){
const C=root.Catalog9,m=root.PlannerData.real;
const ruinGolem={id:'ruin-golem',name:'はめつのゴーレム',color:'黄',rank:'S',cost:171,costBonus:4,stats:{hp:200,mp:62,attack:117,defense:140,magic:33,heal:46,speed:58,dex:37},bonuses:[...['斬撃','体技'].map(type=>({group:'general',type,value:.10})),...['斬撃','体技'].map(type=>({group:'element',type,element:'ドルマ',value:.12})),{group:'critical',value:.07}],skills:['normalcharge'],source:'https://gamewith.jp/dq-walk/article/show/469937',checked:'2026-10-26',unmodeled:['斬撃・体技耐性3%と呪文耐性3%は生存計算へ未反映。']};
ruinGolem.effects=['きあいため','最大コスト+4','斬撃・体技耐性3%','じゅもん耐性3%'];
if(!C.hearts.some(x=>x.id===ruinGolem.id)){C.hearts.push(ruinGolem);m.items.push({...ruinGolem,slot:'heart',ready:false,verifiedModel:true,skillIds:[]});}
// This S heart grants the ordinary charge skill independently of the weapon.
const armLion=C.hearts.find(h=>h.id==='arm-lion');if(armLion)armLion.skills=[...new Set([...(armLion.skills||[]),'normalcharge'])];
const blueDragon={id:'blue-dragonlord-awakened',name:'闇の覇者 蒼き竜王（覚醒）',family:'blue-dragonlord',color:'黄',rank:'S覚醒',cost:183,costBonus:4,stats:{hp:162,mp:87,attack:161,defense:93,magic:29,heal:58,speed:97,dex:39},bonuses:[{group:'general',type:'斬撃',value:.12},{group:'general',type:'体技',value:.12},{group:'element',element:'ドルマ',type:'斬撃',value:.12},{group:'element',element:'ドルマ',type:'体技',value:.12},{group:'element',value:.12},{group:'critical',value:.12}],skills:[],effects:['ターン開始時MP12回復','魅了耐性12%'],source:'https://gamewith.jp/dq-walk/article/show/537960',checked:'2026-10-26',unmodeled:['追い覚醒・覚醒+の個体追加値は含まない。','MP回復・魅了耐性の生存計算への接続は未確認。']};
if(!C.hearts.some(x=>x.id===blueDragon.id)){C.hearts.push(blueDragon);m.items.push({...blueDragon,slot:'heart',verifiedModel:true,ready:false,skillIds:[]});}
// Explicitly selected sub-effect, not an invented perfect random pearl.
const pearl={id:'dragonfang-pearl-critical-s',name:'7周年SP心珠S（天超えし竜牙10%・会心ダメージ5%）',slot:'pearl',rank:'S',stats:{},bonuses:[{group:'skillCorrection',skill:'dragonfang',value:.10},{group:'critical',value:.05}],verifiedModel:true,ready:false,skillIds:[],source:'https://gamewith.jp/dq-walk/article/show/576832',verified:['主効果10%と選択した下段会心ダメージ5%のみ。'],assumptions:['別の下段効果・S+・追加ちからを自動付与しない。'],checked:'2026-10-26'};
if(!m.items.some(x=>x.id===pearl.id))m.items.push(pearl);
// Inheritance metadata is independent of the main weapon's active mechanics.
C.weapons.push({id:'tougenkyo',name:'大太刀・桃源郷',type:'両手剣',stats0:{attack:187},stats4:{attack:244},twoHand0:93,twoHand4:122,favored:{attack:12},bonuses:[{group:'race',race:'ゾンビ系',value:.05},{group:'race',race:'物質系',value:.05}],twoHandBonuses:[{group:'general',type:'斬撃',value:.03},{group:'element',value:.03}],limitBonus:.28,skills:['tougen-strike'],initial:[],inherit:{skill:'tougen-strike',favoredAttack4:12,physical10:.07},source:'https://9db.jp/dqwalk/data/17980',unmodeled:['主武器としての陶酔・開幕属性補助・挑戦スキルは未対応。継承効果の検証用。']});
C.skills.push({id:'tougen-strike',name:'天上天下討鬼斬',kind:'unsupported',mp:61,source:'https://9db.jp/dqwalk/data/17980',note:'陶酔による倍率・属性耐性・延長の手順再現は未対応。継承の能力値・特殊効果のみ対応。'});
// 2026-10-27: replace the bootstrap green placeholder with the published S heart.
const sandy={id:'sandy',name:'サンディとアギロ',family:'sandy',color:'黄+紫',rank:'S',cost:171,costBonus:4,stats:{hp:158,mp:72,attack:36,defense:117,magic:131,heal:52,speed:50,dex:50},bonuses:[...['斬撃','体技','呪文'].map(type=>({group:'general',type,value:.07})),...['バギ','デイン'].map(element=>({group:'element',element,value:.07}))],skills:[],effects:['最大コスト+4','プチおうえん（未対応）','スキルHP回復効果+7%（未対応）'],source:'https://game8.jp/dqwalk/815712',sources:['https://game8.jp/dqwalk/815712','https://gamewith.jp/dq-walk/article/show/576835'],checked:'2026-10-27',unmodeled:['プチおうえんの対象・持続・重複関係は未接続。通常のおうえんとして代用しない。','回復効果7%は回復計算へ未接続。']};
C.hearts.push(sandy);
Object.assign(m.items.find(x=>x.id==='sandy'),sandy,{verifiedModel:true,verified:['S全8能力・黄紫・コスト171・常時の斬体呪文/属性補正を再照合。'],assumptions:sandy.unmodeled});
const measuredAccessories=[
 {id:'meteor-bracelet',name:'ほしふるうでわ',stats:{speed:60},bonuses:[],source:'https://9db.jp/dqwalk/data/13260',assumptions:['掲載性能はすばやさ60。直接のダメージ補正はない。']},
 {id:'hagumeta-charm',name:'はぐメタのお守り',stats:{mp:8,speed:16},bonuses:[],source:'https://game8.jp/dqwalk/366728',assumptions:['イオ属性耐性5%は被ダメージ計算へ未接続。火力ボーナスはない。']},
 {id:'slalike-medal-plus',name:'スラいいね！の勲章＋',stats:{speed:25},bonuses:[{group:'general',type:'体技',value:.05},{group:'general',type:'呪文',value:.03}],source:'https://gamewith.jp/dq-walk/article/show/396459',assumptions:['眠り耐性10%は生存計算へ未接続。斬撃に体技5%を加算しない。']},
 {id:'battlemaster-book',name:'バトルマスターの極意書',stats:{},bonuses:[],source:'https://game8.jp/dqwalk/638541',assumptions:['バトマス専用会心率4%。特級職への適用対応の確認待ち。全職への常時4%を仮定せず、確定超会心の威力には加算しない。']}
];
for(const accessory of measuredAccessories)m.items.push({...accessory,slot:'accessory',verifiedModel:true,ready:false,skillIds:[],checked:'2026-10-27',verified:['掲載された能力・特殊効果を照合。未接続分は注記。']});
const originalProfile=root.PlannerData.profile;
root.PlannerData.profile=function(master){const p=originalProfile(master);if(master===m&&!p.inventory.some(x=>x.id===pearl.id))p.inventory.push({id:pearl.id,count:2});return p;};
})(typeof window==='undefined'?globalThis:window);
