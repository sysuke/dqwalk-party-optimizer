'use strict';
(function(root){
const m=PlannerData.real;
m.revision=4;m.quickStart=true;m.name='ドラクエウォーク・概算';
m.assumptions=['職業の基礎能力はLv80の仮値を基準に線形補間。永続効果・こころ道・熟練度・心珠は未反映。','通常・会心・超会心・暴走・超暴走・領域・テンション・継承・追撃等を完全再現していない。','攻撃・回復・補助の式や上限、敵の行動と速度には仮値がある。仮定条件での参考計算で、確定討伐や実際の先制を保証しない。'];
const weaponSource='https://game8.jp/dqwalk/292422',heartSource='https://game8.jp/dqwalk/500917';
const stats=(hp,mp,attack,defense,magic,heal,speed)=>({hp,mp,attack,defense,magic,heal,speed});
// Published special-job base cost for every level; no interpolation.
const costMap={"1":259,"2":264,"3":270,"4":275,"5":280,"6":284,"7":292,"8":296,"9":304,"10":308,"11":314,"12":318,"13":324,"14":328,"15":334,"16":338,"17":344,"18":348,"19":354,"20":358,"21":364,"22":368,"23":374,"24":378,"25":384,"26":390,"27":395,"28":401,"29":406,"30":412,"31":418,"32":423,"33":429,"34":434,"35":440,"36":446,"37":452,"38":458,"39":464,"40":470,"41":476,"42":482,"43":488,"44":494,"45":500,"46":506,"47":513,"48":519,"49":526,"50":532,"51":535,"52":538,"53":541,"54":544,"55":546,"56":550,"57":554,"58":558,"59":562,"60":565,"61":569,"62":572,"63":575,"64":578,"65":581,"66":583,"67":585,"68":588,"69":590,"70":592,"71":598,"72":603,"73":609,"74":614,"75":620,"76":625,"77":629,"78":634,"79":638,"80":643,"81":649,"82":655,"83":661,"84":667,"85":673,"86":678,"87":683,"88":689,"89":694,"90":700,"91":706,"92":712,"93":718,"94":724,"95":730};
function cost(lv){return costMap[lv];}
const base=[stats(720,300,430,420,100,100,480),stats(520,550,170,280,650,220,580),stats(580,530,200,340,350,620,460),stats(650,350,380,340,160,160,760),stats(650,400,430,320,480,150,500),stats(850,350,340,540,160,220,400),stats(780,330,460,390,180,130,520),stats(610,480,260,330,500,480,510),stats(760,330,480,400,180,140,540),stats(680,430,420,370,300,200,610),stats(640,450,400,350,520,200,620)];
const slots=[['虹','赤+黄','赤','黄'],['虹','紫','紫','黄+紫'],['虹','緑','緑','青+緑'],['虹','赤+青','青','青'],['虹','赤+紫','赤','紫'],['虹','黄','黄','緑'],['虹','赤+黄','青','黄'],['虹','紫+緑','紫','緑'],['虹','赤','黄','青'],['虹','赤+青','紫','青'],['虹','赤+紫','紫','青']];
m.jobs=m.jobs.map((j,i)=>({...j,slots:slots[i],levels:Object.fromEntries(Array.from({length:95},(_,n)=>{const lv=n+1;return [lv,{cost:cost(lv),stats:Object.fromEntries(Object.entries(base[i]).map(([k,v])=>[k,Math.max(1,Math.round(v*(.35+.65*lv/80)))]))}];})),skillIds:i===5?['ouen']:[],costSource:'https://9db.jp/dqwalk/data/1426',costChecked:'2026-10-29',assumptions:['基礎能力・一部の枠色・職業補正は仮。こころ基本コストはLv1〜95の掲載値。'],source:'https://9db.jp/dqwalk/data/1426'}));
m.skills=[];
const physical=(id,name,type,elements,multiplier,target,mp,source,extra={})=>{const ids=[];for(const element of elements){const key=id+'-'+element;ids.push(key);m.skills.push({id:key,name:name+(elements.length>1?'（'+element+'）':''),kind:'damage',type,element,target,mp,accuracy:1,ready:true,formula:{kind:'physical',multiplier,randomMin:.95,randomMax:1.05,...extra},source,assumptions:['0凸・通常時の簡略式。会心/超会心・追撃・特殊効果は別途未反映。命中は暫定100%。']});}return ids;};
const spell=(id,name,elements,mp,source)=>{const ids=[];for(const element of elements){const key=id+'-'+element;ids.push(key);m.skills.push({id:key,name:name+(elements.length>1?'（'+element+'）':''),kind:'damage',type:'呪文',element,target:'all',mp,accuracy:1,ready:true,formula:{kind:'spell',slope:3.4,intercept:1500,cap:1950,randomMin:.95,randomMax:1.05},source,assumptions:['呪文係数3.4・切片1500・魔力上限1950・消費MPは仮値（個別検証前）。敵数変化・暴走・超暴走は未反映。']});}return ids;};
const effect=(id,name,stat,value,target='self',mp=30,source=weaponSource)=>{m.skills.push({id,name,kind:'effect',target,mp,ready:true,effect:{recipient:'ally',stat,group:stat==='damage'?'charge':stat,value,duration:2,chance:1},source,assumptions:['補助は2ターンの単一効果に簡略化。実際の持続・追加効果・消費MPは未検証。']});return id;};
effect('ouen','おうえん（簡略）','damage',1.5,'one',20);m.skills.at(-1).memberOnly=0;
effect('baiki','バイキルト','attack',1.4,'one',30,'https://game8.jp/dqwalk/687405');
effect('charge','極限集中（簡略）','damage',2.25,'self',40,'https://game8.jp/dqwalk/815288');
effect('spellboost','破戒詠唱・刻（簡略）','damage',1.6,'self',45,'https://game8.jp/dqwalk/831539');
// Deliberately does not relabel ダーマの祈り as an unrelated damage buff.
const heal=(id,name,mp,source)=>{m.skills.push({id,name,kind:'heal',target:'all',mp,ready:true,formula:{slope:.35,intercept:180,cap:1600},source,assumptions:['回復係数0.35・固定値180・上限1600は仮。追加効果と心珠等の回復補正は未反映。']});return id;};
const physJobs=['job-0','job-3','job-4','job-5','job-6','job-8','job-9','job-10'],mageJobs=['job-1','job-4','job-7','job-10'],healJobs=['job-2','job-7','job-5'];
const weapons=[];
function weapon(id,name,source,jobs,ability,skills,extra={}){for(const limitBreak of [0,4])weapons.push({id:id+'-'+limitBreak,name,slot:'weapon',limitBreak,ready:true,stats:ability,jobs,skillIds:skills,source,assumptions:['武器の能力値は仮。凸4はダメージ+28%として簡略化。いきなり・挑戦・継承など未再現の効果あり。'],verified:['名称とスキルの種類を攻略記事で確認'],bonuses:limitBreak?[{group:'general',value:.28}]:[],...extra});}
weapon('gear-0','女神ペルセリアのつえ','https://game8.jp/dqwalk/831539',mageJobs,{magic:150},[...spell('love','ラブ・ストリーム',['ザバ','バギ','デイン'],65,'https://game8.jp/dqwalk/831539'),'spellboost']);
weapon('gear-1','祖竜【理】の銃剣','https://game8.jp/dqwalk/815288',physJobs,{attack:250},[...physical('dragon','天超えし竜牙','斬撃',['イオ'],17,'all',64,'https://game8.jp/dqwalk/815288'),'charge'],{twoHanded:true});
weapon('gear-2','堕天の翼爪','https://game8.jp/dqwalk/818884',physJobs,{attack:189},physical('wing','神を封じたチカラ','体技',['イオ','ドルマ'],17,'one',62,'https://game8.jp/dqwalk/818884'));
weapon('hero','勇者のつるぎ','https://game8.jp/dqwalk/785465',physJobs,{attack:245},[...physical('hero-single','全身全霊斬り','斬撃',['無'],11,'one',58,'https://game8.jp/dqwalk/785465',{ignoreDefense:true}),...physical('hero-all','ギガクラッシュ','斬撃',['デイン'],8,'all',62,'https://game8.jp/dqwalk/785465')]);
weapon('ocean','真竜槍・オチェアーノ','https://game8.jp/dqwalk/769134',physJobs,{attack:187},physical('vortex','グランヴォルテクス','斬撃',['ヒャド','バギ','ザバ'],7.3,'all',61,'https://game8.jp/dqwalk/769134'));
// Published maximum-level attack, independently confirmed for each limit break.
for(const row of weapons.filter(row=>['ocean-0','ocean-4'].includes(row.id))){row.stats={attack:row.limitBreak===4?244:187};row.checked='2026-10-29';row.verified=['最大レベル攻撃力：0凸187・4凸244を直接照合。'];row.assumptions=['凸4の斬体+28%は簡略モデル。いきなり・挑戦・継承・ずぶ濡れ等は未再現。攻撃力の確認は全効果の完成を意味しない。'];}
weapon('cloud','あまぐもの杖','https://game8.jp/dqwalk/640479',mageJobs,{magic:140},spell('rain','ざざん波',['ザバ'],60,'https://game8.jp/dqwalk/640479'));
weapon('paradox','パラドクスの杖','https://game8.jp/dqwalk/763997',mageJobs,{magic:160},spell('forbidden','フォビドゥンバースト',['イオ'],74,'https://game8.jp/dqwalk/763997'));m.skills.filter(s=>s.id.startsWith('forbidden')).forEach(s=>s.target='one');
weapon('dharma','ダーマの神杖','https://game8.jp/dqwalk/778125',healJobs,{heal:180,mp:30},[heal('light','道示す光',70,'https://game8.jp/dqwalk/778125'),...spell('holy','聖なるマヒャド',['ヒャド'],50,'https://game8.jp/dqwalk/778125')]);
weapon('keki','ケキちゃん','https://game8.jp/dqwalk/687405',[...new Set([...physJobs,...mageJobs,...healJobs])],{attack:160,speed:30},['baiki']);
weapon('moon','はてんの月輪','https://game8.jp/dqwalk/788128',physJobs,{attack:230,speed:30},physical('breaker','デュアルブレイカー','体技',['無'],12,'all',61,'https://game8.jp/dqwalk/788128'));
const crystalSource='https://game8.jp/dqwalk/595626';
weapon('crystal','しんぴの水晶',crystalSource,healJobs,{attack:61,magic:17,heal:105},[heal('crystal-heal','いやしの占術（回復式は仮）',63,crystalSource)]);
for(const row of weapons.filter(row=>['crystal-0','crystal-4'].includes(row.id))){
 const baseStats=row.limitBreak===4?{attack:80,magic:20,heal:100}:{attack:61,magic:17,heal:85};
 row.baseStats={...baseStats};row.levelStatBonuses={heal:20};row.stats={...baseStats,heal:baseStats.heal+20};
 row.bonuses=[];row.checked='2026-10-29';row.verified=['最大レベルの0凸/4凸能力値とLv1回復魔力20を分離して照合。'];
 row.assumptions=['回復魔力は武器本体85/100とLv1効果20の合計105/120。','スキルHP回復10%・凸のとくぎHP回復10%・MP回復・開幕効果・確率バフは未接続。回復式は仮のまま。'];
}
weapon('chrono','クロノスソード',weaponSource,physJobs,{attack:245},physical('chrono-hit','主要攻撃（1500%を使う仮モデル）','斬撃',['無'],15,'one',60,weaponSource));
m.items=weapons;
const heart=(id,name,color,costValue,values,source,bonuses=[],extra={})=>({id,name,monster:name.replace(/（.*?）|\(.*?\)/g,''),rank:'S',slot:'heart',color,cost:costValue,costBonus:4,stats:stats(...values),bonuses,ready:true,source,assumptions:['会心率・各種耐性・職業特有効果・未収録の特殊効果を省略。'],...extra});
const physicalBonus=v=>[{group:'general',type:'斬撃',value:v},{group:'general',type:'体技',value:v}];
m.items.push(
heart('heart-0','アギロゴス','赤',179,[211,86,139,132,57,57,6],'https://game8.jp/dqwalk/822830',physicalBonus(.1),{verified:['S基礎値・コスト'],assumptions:['属性別物理ボーナスと耐性は未反映。']}),
heart('heart-1','いびつ世界の幻竜','紫',167,[133,131,25,84,131,53,89],'https://game8.jp/dqwalk/832739',[],{verified:['未覚醒S基礎値・コスト'],assumptions:['色を紫と仮置き。特殊効果と覚醒版は未反映。']}),
heart('estark','地獄の帝王エスターク','赤',109,[152,66,166,87,22,22,115],'https://game8.jp/dqwalk/662497',physicalBonus(.1),{rank:'S覚醒',regen:{hp:30,mp:15},verified:['覚醒後の基礎値とターン開始回復'],assumptions:['覚醒後コストは109を仮置き。属性ボーナス・会心・耐性は未反映。']}),
heart('zoma','闇の大魔王ゾーマ','紫',84,[87,110,11,43,182,68,117],'https://game8.jp/dqwalk/333298',[{group:'general',type:'呪文',value:.1}],{rank:'S覚醒',verified:['覚醒後基礎値'],assumptions:['覚醒後コストは84を仮置き。暴走率・耐性は未反映。']}),
heart('lamp','ランプのまじん（覚醒）','青',107,[105,54,146,50,24,21,156],'https://game8.jp/dqwalk/370553',physicalBonus(.1),{rank:'S覚醒',verified:['覚醒後基礎値'],assumptions:['コストは107を仮置き。属性・種族ボーナスは未反映。']}),
heart('god','かみさま（覚醒）','青',152,[111,57,153,53,25,22,162],'https://game8.jp/dqwalk/780137',physicalBonus(.07),{rank:'S覚醒',regen:{hp:77},verified:['覚醒後基礎値とHP回復'],assumptions:['覚醒後コストは152を仮置き。全属性・種族ボーナスは未反映。']}),
heart('corpse','ドラゴンコープス','赤',150,[141,61,133,80,21,21,105],'https://gamewith.jp/dq-walk/article/show/580669',physicalBonus(.1),{verified:['S基礎値'],assumptions:['コスト150・枠色を仮置き。対ドラゴン開幕バフ・特効は未反映。']}),
heart('sandy','サンディとアギロ','緑',150,[145,100,70,80,100,120,110],'https://game8.jp/dqwalk/815712',[],{assumptions:['名称のみ確認。色・コスト・全能力値を仮置き。イベント限定の実所持数は確認が必要。']}),
heart('tentsuku','スーパーテンツク','緑',144,[100,85,35,70,45,120,80],'https://game8.jp/dqwalk/510696',[],{assumptions:['回復向けであることを確認。コスト144・全能力値は仮置き。回復効果+10%は未反映。']}),
heart('leeslet','リーズレット','紫',145,[100,110,20,60,150,55,100],heartSource,[{group:'general',type:'呪文',value:.1}],{assumptions:['ランキング掲載を確認。コスト・色・全能力値・効果は仮置き。']}),
heart('wight','ワイトキング（覚醒）','紫',160,[130,120,25,80,150,70,105],heartSource,[{group:'general',type:'呪文',value:.1}],{rank:'S覚醒',assumptions:['ランキング掲載を確認。コスト・色・全能力値・効果は仮置き。']}),
heart('donburi','どんぶりキング（覚醒）','黄',120,[180,80,80,130,40,70,60],'https://9db.jp/dqwalk/data/4427?party_id=3712',[],{rank:'S覚醒',assumptions:['参照パーティ掲載を確認。色・コスト・全能力値は仮置き。特盛スキルは未計算。']})
);
const armorSource='https://game8.jp/dqwalk/815288';
for(const [id,name,slot,ability]of [['adjust-shield','調停者の盾','shield',{defense:80}],['adjust-head','調停者のかぶと','head',{defense:65,attack:10}],['adjust-body','調停者のよろい上','body',{defense:90,attack:10}],['adjust-legs','調停者のよろい下','legs',{defense:65,attack:10}]])m.items.push({id,name,slot,stats:ability,ready:true,source:armorSource,assumptions:['シリーズ名を確認。能力値・職業条件は仮置き。固有効果は未反映。']});
const attr={無:1,メラ:1,ヒャド:1,ギラ:1,バギ:1,イオ:1,ドルマ:1,デイン:1,ジバリア:1,ザバ:1};
const types={斬撃:1,体技:1,呪文:1,ブレス:1};
const enemy=(name,hp,defense,speedHigh,elements,actionDamage,race='？？？？系',typeChanges={})=>({name,hp,defense,speedLow:Math.floor(speedHigh/1.2),speedHigh,elements:{...attr,...elements},types:{...types,...typeChanges},race,action:{name:'想定攻撃（1ターン合計・仮）',damage:actionDamage,target:'all'}});
function boss(c,enemies,verified,assumptions){return {...c,modelReady:true,approximate:true,speedRatio:c.category==='メガモン'?1.2:1.15,enemies,verified,assumptions,missing:[],note:'確認値と仮値で概算計算できます。詳細を開いて調整可能です。'};}
m.contents=[
boss(m.contents.find(c=>c.id==='agiro'),[enemy('アギロゴス',1200000,1000,1100,{メラ:.8,ヒャド:.4,ギラ:.2,バギ:.2,イオ:.6,ドルマ:.6,デイン:.4,ジバリア:.6,ザバ:1},400,'ドラゴン系',{斬撃:.6,呪文:.6,ブレス:.6})],['おたすけ有りHP約120万・属性倍率・種類耐性'],['守備力1000・速度上限1100・ターン合計400の全体攻撃は仮。','テンション・会心ガード・耐性上昇・効果ターン短縮・ふきとばし等は未再現。']),
boss({...m.contents.find(c=>c.id==='orgo'),name:'Dオルゴデミーラ（強）'},[enemy('Dオルゴデミーラ（強）',480000,850,1100,{メラ:.4,ヒャド:.6,ギラ:.4,バギ:1,イオ:.6,ドルマ:1.5},350,'ドッペル系')],['強のHP約48万・掲載されている属性倍率'],['守備力850・速度上限1100・合計350の全体攻撃・未確認属性倍率は仮。固有行動は省略。']),
boss({id:'orgo-normal',name:'Dオルゴデミーラ（通常）',category:'ほこら',source:'https://game8.jp/dqwalk/822599'},[enemy('Dオルゴデミーラ',165000,700,950,{ドルマ:1.5,バギ:1},250,'ドッペル系')],['通常のHP約16.5万'],['守備力700・速度上限950・全体250・バギ/ドルマ以外等倍は仮。通常の耐性は強の掲載値から一部仮転用。']),
boss(m.contents.find(c=>c.id==='chapter18'),[enemy('18章・高HP枠（仮の代表敵）',18000,1100,1600,{ヒャド:1.3,バギ:1.3,ザバ:1.3},250),enemy('18章・通常枠（仮）',14000,900,1450,{ヒャド:1.3,バギ:1.3,ザバ:1.3},200)],['18章向けの推奨武器を参照'],['話数未指定の代表敵2体。敵名・HP・守備力・速度・耐性・攻撃はすべて仮。実際の全出現パターンは保証しない。']),
boss({...m.contents.find(c=>c.id==='mine'),name:'鉱脈・赤／コスト300（仮）'},[enemy('赤の鉱脈・代表敵（仮）',30000,1000,1500,{メラ:2},300)],['赤の鉱脈はメラ強化'],['深度を限定しない代表敵。能力・メラ倍率2・敵の数は仮。コスト上限300は利用者が変更する初期条件。']),
boss(m.contents.find(c=>c.id==='perfume'),[enemy('うみうしひめ',250000,1000,1599,{メラ:1.8,ヒャド:.3,ギラ:.2,バギ:.5,イオ:.5,ドルマ:.2,デイン:0,ジバリア:2.8,ザバ:.3},450,'悪魔系')],['HP約25万・掲載属性倍率・すばやさ1600程度の攻略目安'],['守備力1000・敵速度上限1599・全体450は仮。1600目安を確定先制値として扱わない。休み・魅了等は未再現。'])];
m.contents.find(c=>c.id==='mine').costLimit=300;
m.contents.push(boss({id:'d-hargon',name:'Dハーゴン（おたすけ有り）',category:'メガモン',source:'https://game8.jp/dqwalk/818894'},[enemy('Dハーゴン',1200000,950,1050,{ドルマ:1.4,バギ:1.2,ジバリア:.8,ギラ:.6,イオ:.5,デイン:.4,ザバ:.4,ヒャド:.2},400,'ドッペル系')],['おたすけ有りHP約120万・掲載属性倍率'],['守備力950・速度上限1050・全体400・未確認属性と種類耐性は仮。祈り・シールド等は未再現。']));
m.contents.push(boss({id:'giga',name:'いびつ世界の幻竜（特ギガ）',category:'ギガモン',source:'https://game8.jp/dqwalk/831636'},[enemy('いびつ世界の幻竜',50000000,1100,1150,{メラ:.4,ヒャド:.2,ギラ:.4,バギ:1.2,イオ:.6,ドルマ:.8,デイン:.2,ジバリア:.4,ザバ:.4},450,'？？？？系',{斬撃:.4,体技:.4,呪文:.7})],['特ギガHP約5000万・テンション無し属性倍率・斬撃/体技0.4・呪文0.7'],['守備力1100・速度上限1150・全体450・ブレス耐性は仮。味方他パーティの与ダメージ・ギガアタック・シールド・テンション等は未計算。自分の4人のみのダメージ比較。']));
m.contents.find(c=>c.id==='giga').speedRatio=1.2;
const tentsuku=m.items.find(i=>i.id==='tentsuku');tentsuku.cost=137;tentsuku.stats=stats(122,115,47,89,72,122,80);tentsuku.verified=['S基礎値・コスト137'];tentsuku.assumptions=['回復効果+10%・耐性等の特殊効果は未反映。'];
const sandy=m.items.find(i=>i.id==='sandy');sandy.cost=171;sandy.stats=stats(158,72,36,117,131,52,50);sandy.verified=['S基礎値・コスト171'];sandy.assumptions=['色を緑と仮置き。プチおうえん・回復効果等は未反映。イベント限定の実所持数は要確認。'];
for(const c of m.contents){c.checked=m.checked;c.assumptions.push('HP表記は参考値。ボスの強化・弱体化・複数人参加や外部支援は設定した条件以外は含まない。');}
const originalProfile=PlannerData.profile;
PlannerData.profile=function(master){const p=originalProfile(master);if(master.quickStart){const defaults=[{'job-5':80,'job-0':80},{'job-3':80,'job-4':80,'job-8':80},{'job-1':80,'job-10':80},{'job-2':80,'job-7':80}];p.characters.forEach((c,i)=>c.levels=defaults[i]);p.inventory.forEach(x=>{const item=master.items.find(i=>i.id===x.id);x.count=item.limitBreak===4?0:item.slot==='weapon'?1:4;});p.presetRevision=4;}return p;};
PlannerData.mergeDefaults=function(raw){const defaults=PlannerData.profile(m),result=JSON.parse(JSON.stringify(raw));const ids=new Set((result.inventory||[]).map(x=>x.id));for(const entry of defaults.inventory)if(!ids.has(entry.id))result.inventory.push(entry);if(result.presetRevision!==4)result.characters.forEach((c,i)=>{if(!Object.values(c.levels||{}).some(v=>v>0))c.levels=defaults.characters[i].levels;});result.presetRevision=4;return result;};
})(typeof window==='undefined'?globalThis:window);
