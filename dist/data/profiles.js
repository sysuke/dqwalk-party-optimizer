'use strict';
(function(root){
const jobNames=['ゴッドハンド','大魔道士','大神官','ニンジャ','魔剣士','守り人','ドラゴン','天地雷鳴士','魔人','時渡りの剣士','魔弾の剣士'];
const real={schemaVersion:3,id:'real-2026-10-19',name:'ドラクエウォーク',checked:'2026-10-19',isDemo:false,
 jobs:jobNames.map((name,i)=>({id:'job-'+i,name,levels:{},slots:[],skillIds:[]})),skills:[],
 items:WalkCatalog.gear.flatMap((g,i)=>[0,4].map(limitBreak=>({id:'gear-'+i+'-'+limitBreak,name:g.name,slot:'weapon',limitBreak,ready:false,stats:{},skillIds:[],source:g.source,missing:['職業補正・継承・いきなりスキル等の性能が未対応です。']}))).concat(WalkCatalog.hearts.map((h,i)=>({id:'heart-'+i,name:h.name,rank:h.rank,slot:'heart',ready:false,cost:h.cost,costBonus:4,stats:{hp:h.hp,attack:h.attack,magic:h.magic,heal:h.heal,speed:h.speed},source:h.source,missing:['特殊効果と色枠補正の完全なデータが不足しています。']}))),
 contents:WalkCatalog.contents.map(c=>({...c,note:c.id==='chapter18'?'話数・敵の出現パターン別の戦闘データを整備中です。':c.note,modelReady:false,missing:c.id==='agiro'?['敵の守備力・行動速度の上下限が未収録です。','テンション、耐性上昇、効果ターン短縮などの敵行動モデルが未対応です。']:c.id==='mine'?['鉱脈の色・深度別の敵編成、コスト上限、連戦行動データが未収録です。']:['対象敵ごとの能力・行動パターンと戦闘モデルが未収録です。']}))};
// Explicitly fictional fixtures exercise the full pipeline; never used as real game data.
const skill=(id,name,type,element,formula,target='one',mp=10)=>({id,name,kind:'damage',type,element,formula,accuracy:1,target,mp,ready:true});
const physical=(multiplier)=>({kind:'physical',multiplier,randomMin:.95,randomMax:1.05});
const demo={schemaVersion:3,id:'demo-v3',name:'検証用データ',checked:'2026-10-19',isDemo:true,
 jobs:['補助役（検証用）','物理役A（検証用）','魔法役（検証用）','物理役B（検証用）'].map((name,i)=>({id:'demo-job-'+i,name,slots:['虹','赤+紫','黄','青'],levels:{50:{cost:400,stats:{hp:900,mp:240,attack:300,defense:200,magic:380,heal:120,speed:[2400,1800,1250,700][i]}}},skillIds:i===0?['boost','heal']:[]})),
 skills:[skill('slash','集中斬り（検証用）','斬撃','無',physical(8)),skill('sweep','全体斬り（検証用）','斬撃','無',physical(4),'all',18),skill('punch','炎の体技（検証用）','体技','メラ',physical(8)),skill('spell','氷の全体呪文（検証用）','呪文','ヒャド',{kind:'spell',slope:2,intercept:100,cap:1000,randomMin:.95,randomMax:1.05},'all',20),
 {id:'boost',name:'攻撃強化（検証用）',kind:'effect',target:'all',mp:12,ready:true,effect:{recipient:'ally',stat:'attack',group:'attack',value:1.4,duration:2,chance:1}},
 {id:'heal',name:'全体回復（検証用）',kind:'heal',target:'all',mp:20,ready:true,formula:{slope:1,intercept:200,cap:500}},
 {id:'weak',name:'守備低下（検証用）',kind:'effect',target:'one',mp:10,ready:true,effect:{recipient:'enemy',stat:'defense',group:'defense',value:.6,duration:2,chance:1}}],
 items:[{id:'wand',name:'補助杖（検証用）',slot:'weapon',jobs:['demo-job-0'],stats:{heal:100},skillIds:['weak'],ready:true},
 {id:'sword',name:'斬撃剣（検証用）',slot:'weapon',jobs:['demo-job-1','demo-job-3'],stats:{attack:150},skillIds:['slash','sweep'],ready:true},
 {id:'claw',name:'体技爪（検証用）',slot:'weapon',jobs:['demo-job-1','demo-job-3'],stats:{attack:140},skillIds:['punch'],ready:true},
 {id:'staff',name:'魔法杖（検証用）',slot:'weapon',jobs:['demo-job-2'],stats:{magic:140},skillIds:['spell'],ready:true},
 ...['head','body','legs','shield','accessory'].flatMap((slot,i)=>[{id:'armor-'+i,name:['すばやさの帽子','攻撃の服','耐久のズボン','守りの盾','魔力の指輪'][i]+'（検証用）',slot,stats:[{speed:30},{attack:30},{hp:100},{defense:50},{magic:30}][i],ready:true}]),
 ...Array.from({length:5},(_,i)=>({id:'demo-heart-'+i,name:'検証用こころ'+(i+1),monster:'fixture-'+i,rank:'S',slot:'heart',color:['赤','紫','黄','青','緑'][i],cost:70+i*10,costBonus:4,stats:{hp:40,mp:10,attack:i===0?60:15,magic:i===1?70:10,speed:i===3?40:5},bonuses:i===0?[{group:'general',type:'斬撃',value:.05}]:[],ready:true}))],
 contents:[{id:'demo-boss',name:'2ターン討伐の検証',category:'検証用ボス',modelReady:true,speedRatio:1.15,enemies:[{name:'検証用の敵',hp:13000,defense:200,race:'検証用',speedLow:280,speedHigh:300,elements:{無:1,メラ:1.3,ヒャド:1},types:{斬撃:1,体技:1,呪文:1},action:{name:'全体攻撃（検証用）',damage:180,target:'all'}}]},
 {id:'demo-farm',name:'複数敵を先制処理する検証',category:'検証用周回',modelReady:true,speedRatio:1.15,enemies:[0,1].map(i=>({name:'検証用の敵'+(i+1),hp:3000,defense:180,race:'検証用',speedLow:250-i*30,speedHigh:270-i*30,elements:{無:1,メラ:1,ヒャド:i===0?1.5:1},types:{斬撃:1,体技:1,呪文:1},action:{name:'全体攻撃（検証用）',damage:120,target:'all'}}))}]};
function profile(master){return {schemaVersion:3,masterId:master.id,characters:[0,1,2,3].map(i=>({name:'キャラ'+(i+1),levels:master.isDemo?{['demo-job-'+i]:50}:{}})),inventory:master.items.map(i=>({id:i.id,count:master.isDemo?(i.slot==='weapon'?1:4):i.limitBreak===4?0:i.slot==='heart'?4:1}))};}
root.PlannerData={real,demo,profile};
})(typeof window==='undefined'?globalThis:window);
