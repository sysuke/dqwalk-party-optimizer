'use strict';
(function(){
const m=PlannerData.real;
for(const i of m.items)i.verifiedModel=false;
function update(id,changes){const i=m.items.find(x=>x.id===id);Object.assign(i,changes,{verifiedModel:true});}
const general=(v,types=['斬撃','体技'])=>types.map(type=>({group:'general',type,value:v}));
const element=(value,element,types=['斬撃','体技'])=>types.map(type=>({group:'element',element,type,value}));
update('estark',{cost:167,color:'赤',bonuses:[...general(.1),...element(.15,'ギラ'),...element(.09,'メラ')],source:'https://9db.jp/dqwalk/data/14017?p=4',assumptions:['回避・ガード・会心率は保証火力に加算しない。追い覚醒/覚醒+なし。']});
update('lamp',{cost:141,color:'青',bonuses:[...general(.1),...element(.1,'デイン'),...element(.07,'ドルマ'),{group:'race',race:'悪魔系',value:.05}],source:'https://9db.jp/dqwalk/data/11263',assumptions:['防御系特殊効果は耐久未検証。']});
update('god',{cost:152,color:'青',bonuses:[...general(.07,['斬撃','体技','ブレス']),{group:'element',value:.17},{group:'race',race:'？？？？系',value:.05}],source:'https://9db.jp/dqwalk/data/17895',assumptions:['HP回復は戦闘中ターン開始のみ。']});
update('zoma',{cost:149,color:'紫',bonuses:[...general(.1,['呪文']),...element(.05,'ヒャド',['呪文'])],source:'https://gamewith.jp/dq-walk/article/show/192806',assumptions:['確率暴走は最低ダメージで不発。防御系耐性は別途検証。']});
for(const id of ['heart-0','corpse','mikazuchi-awakened','tentsuku'])m.items.find(x=>x.id===id).verifiedModel=true;
m.items.find(x=>x.id==='heart-0').bonuses.push(...element(.14,'イオ'),...element(.13,'ドルマ'));
for(const id of ['hero-0','hero-4','moon-0','moon-4','roto-0','roto-4','lucky-0','keki-0','keki-4','gaia-s']){const i=m.items.find(x=>x.id===id);if(i)i.verifiedModel=true;}
for(const i of m.items.filter(x=>['勇者のつるぎ','はてんの月輪','ロトの竜剣'].includes(x.name))){i.stats={attack:(i.limitBreak===4?245:188)+12};i.assumptions=['Lv45効果の攻撃12を含む。得意武器・永続・熟練度の個人補正は基礎能力設定で追加。'];}
for(const i of m.items.filter(x=>x.name==='ケキちゃん')){i.stats={attack:158};i.assumptions=['本体の攻魔複合火力は参考値。継承時は本体ステータスを加算しない。'];}
update('roto-kai3',{stats:{attack:142},bonuses:[{group:'race',race:'ドラゴン系',value:.2}],source:'https://9db.jp/dqwalk/data/18320?p=2',assumptions:['0凸Lv50改3。得意武器の攻撃12/MP12は基礎設定で追加。凸違いは別登録が必要。']});
for(const [id,defense,url]of [['adjust-head',80,'20071'],['adjust-body',103,'20072'],['adjust-legs',80,'20073']])update(id,{stats:{defense,speed:7},bonuses:[{group:'general',type:'斬撃',value:.1},{group:'critical',value:.07},{group:'race',race:'ドッペル系',value:.02}],source:'https://9db.jp/dqwalk/data/'+url,assumptions:['0凸。会心率は最低側で不発。防具耐性の生存計算は未対応。']});
update('adjust-shield',{stats:{defense:62,mp:10,attack:10,heal:10},bonuses:[],source:'https://game8.jp/dqwalk/815299',assumptions:['0凸。オーバードライブ・耐久系効果は今回の2T手順で使用しない。']});
m.jobs.find(j=>j.id==='job-8').slots=['虹','赤+白','赤+黒','赤+黄'];
m.revision=6;m.checked='2026-10-21';
})();
