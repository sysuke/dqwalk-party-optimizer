'use strict';
(function(root){
const C=root.Catalog9,m=root.PlannerData.real,checked='2026-10-23',src=n=>'https://9db.jp/dqwalk/data/'+n;
const stats=a=>Object.fromEntries(['hp','mp','attack','defense','magic','heal','speed','dex'].map((k,i)=>[k,a[i]])),g=value=>({group:'general',type:'呪文',value}),el=(element,value)=>({group:'element',type:'呪文',element,value}),race=(race,value)=>({group:'race',race,value});
const weapons=[
 {id:'perseria',name:'女神ペルセリアのつえ',type:'杖',stats0:{attack:71,magic:124,heal:23},stats4:{attack:93,magic:146,heal:27},favored:{mp:12,magic:12},bonuses:[g(.08),race('ドラゴン系',.05),race('ドッペル系',.05)],skills:['love-stream','spell-chant'],source:src(20440),opening:{flat:13,components:['四季の恵み2%','神格13']},unmodeled:['四季の恵みの確率テンション・ゾーン、女神の悲憤の死亡時再行動、幸運、回復は未算入。']},
 {id:'eternal-staff',name:'とこしえの杖',type:'杖',stats0:{attack:70,magic:124,heal:23},stats4:{attack:92,magic:145,heal:27},favored:{mp:12,magic:12},bonuses:[{group:'spellCritical',value:.1},race('虫系',.05),race('悪魔系',.05)],skills:['meragaia','genius-ionazun'],initialSpellStages:2,source:src(18410),opening:{flat:37,components:['いきなり魔力かくせい25','賢者の資質12']},unmodeled:['大まどうしこうりん・職業特性・暴走後の挑戦スキルは未算入。']},
 {id:'paradox-staff',name:'パラドクスの杖',type:'杖',stats0:{attack:70,magic:124,heal:23},stats4:{attack:92,magic:145,heal:27},favored:{mp:12,magic:12},bonuses:[race('物質系',.05),race('悪魔系',.05)],skills:['forbidden-burst'],initialTension:10,source:src(17540),opening:{flat:17,components:['いきなりテンションアップ17']},unmodeled:['真魔解放・マナ・超暴走・マジャスティス・確率テンション低下・挑戦スキルは未算入。開幕テンションは下限1段階。']},
 {id:'stellar-orb',name:'星海の天球儀',type:'EX',stats0:{attack:70,magic:144,heal:23},stats4:{attack:92,magic:165,heal:27},favored:{},bonuses:[g(.1),el('ドルマ',.1),race('スライム系',.05),race('悪魔系',.05)],skills:['fatal-stellar'],source:src(16779),opening:{flat:0,components:['ステラーウォール2%','彗星の祝福と天幻の加護2%']},unmodeled:['常時こうげき魔力+20は能力へ加算済み。ステラーウォール・全体MP回復・刻印・星辰のひらめき・確率限界突破は未算入。']},
 {id:'raincloud-staff',name:'あまぐもの杖',type:'杖',stats0:{attack:66,magic:119,heal:18},stats4:{attack:87,magic:140,heal:22},favored:{mp:12},bonuses:[el('ザバ',.1),race('けもの系',.05),race('悪魔系',.05)],skills:['zazanami'],source:src(13412),opening:{flat:7,components:['追撃レインボー3','慈雨4']},unmodeled:['追撃レインボーの威力・追撃MP30・慈雨・全体MP回復・雲竜の印は未算入。開幕ONは追加MP未判定として扱う。'],openingIncomplete:true},
 {id:'ouroboros',name:'ウロボロスのつえ',type:'杖',stats0:{attack:61,magic:112,heal:12},stats4:{attack:61,magic:112,heal:12},favored:{mp:12,magic:12},bonuses:[el('メラ',.05),el('ヒャド',.05),race('マシン系',.05),race('スライム系',.05)],skills:['medroa','medroa-metsu'],source:src(8339),opening:{flat:8,components:['炎氷の融合8']},unmodeled:['炎氷の融合の暴走率・確率耐性低下・消滅・メタル固定ダメージは未算入。']}
];
const formula=(minMagic,minBase,cap,maxBase,extra={})=>({minMagic,minBase,cap,maxBase,...extra});
const skills=[
 {id:'love-stream',name:'ラブ・ストリーム',elements:['ザバ','バギ','デイン'],mp:80,attackTarget:'all',spellFormula:formula(15,211,1950,4315,{singleTargetRate:3}),source:src(20440)},
 {id:'meragaia',name:'メラガイアー',elements:['メラ'],mp:78,attackTarget:'single',spellFormula:formula(10,600,2400,11000),forcedResistance:-50,source:src(18410)},
 {id:'genius-ionazun',name:'天才魔法使いのイオナズン',elements:['イオ'],mp:59,attackTarget:'all',spellFormula:formula(15,165,1800,2420),source:src(18410)},
 {id:'forbidden-burst',name:'フォビドゥンバースト',elements:['イオ'],mp:74,attackTarget:'single',spellFormula:formula(10,100,2200,8000),source:src(17540)},
 {id:'fatal-stellar',name:'フェイタル・ステラー',elements:['ドルマ'],mp:78,attackTarget:'single',spellFormula:formula(15,620,2450,10411),afterSpellStages:1,source:src(16779)},
 {id:'zazanami',name:'ざざん波',elements:['ザバ'],mp:80,attackTarget:'all',spellFormula:formula(15,300,1950,3600),source:src(13412)},
 {id:'medroa',name:'メドローア',elements:['無'],mp:64,attackTarget:'single',spellFormula:formula(15,800,1800,6700),source:src(8339)},
 {id:'medroa-metsu',name:'メドローア・滅',elements:['無'],mp:78,attackTarget:'all',spellFormula:formula(15,281,1800,2340),source:src(8339)}
].map(k=>({...k,kind:'attack',type:'呪文',hits:1,note:'基礎式は公開検証値。暴走・超暴走は発動条件指定時の代表値。マナ・連続呪文・やまびこは詠唱ごとに計算。その他の追撃と未指定の確率効果は不算入。乱数と丸めは実機照合待ち。'}));
skills.push({id:'spell-chant',name:'破戒詠唱・刻',kind:'spellCharge',self:true,value:2.2,mpRate:.1,maxUses:2,source:src(20440),note:'次の攻撃呪文を2.2倍。敵バフ3ターン短縮は一般探索では未再現。'});
const hearts=[
 ['leeslet','リーズレット',126,[70,93,9,34,146,54,97,87],[g(.07),el('メラ',.15),el('ヒャド',.15)],18402,'leeslet'],
 ['wight','ワイトキング（覚醒）',170,[146,145,27,93,143,57,98,115],[g(.1),el('バギ',.1),el('メラ',.07),race('ゾンビ系',.05)],16211,'wight'],
 ['wight-base','ワイトキング',122,[115,127,22,73,112,45,81,96],[g(.1),el('バギ',.1)],226036,'wight'],
 ['ergios','堕天使エルギオス',146,[86,130,51,42,140,67,96,105],[g(.1),race('？？？？系',.03)],10573,'ergios'],
 ['beast-nergel','冥獣王ネルゲル',129,[135,136,23,58,100,68,26,99],[g(.1),el('バギ',.07),el('ギラ',.07)],7429,'beast-nergel'],
 ['jewel-awakened','おどるほうせき（覚醒）',129,[90,139,24,60,117,47,110,99],[g(.1),el('イオ',.12),race('物質系',.05),race('悪魔系',.05)],7831,'jewel'],
 ['jewel-base','おどるほうせき',84,[87,110,24,54,84,34,66,77],[g(.1),el('イオ',.1)],1541,'jewel'],
 ['rainbow-peacock','にじくじゃく',117,[67,90,8,42,125,51,100,84],[g(.03),el('デイン',.07),el('ドルマ',.07)],5753,'rainbow-peacock'],
 ['rainbow-peacock-awakened','にじくじゃく（覚醒）',146,[85,121,10,46,135,61,120,95],[g(.03),el('デイン',.07),el('ドルマ',.07),el('ギラ',.07)],10991,'rainbow-peacock'],
 ['veronica-serena','ベロニカとセーニャ',167,[92,95,16,49,137,125,77,77],[g(.07),el('メラ',.1)],18431,'veronica-serena']
].map(([id,name,cost,values,bonuses,page,family])=>({id,name,color:'紫',rank:name.includes('覚醒')?'S覚醒':'S',cost,costBonus:4,stats:stats(values),bonuses,source:page===226036?'https://gamewith.jp/dq-walk/article/show/226036':src(page),family,skills:[],effects:['最大コスト+4'],unmodeled:['防御耐性・状態異常・確率開幕効果・回復呪文・習得補助呪文は未算入。'],checked}));
hearts.find(h=>h.id==='beast-nergel').recovery={hp:20,mp:0};
const gear=[];
for(const [family,names,pages,defs,spell,element,value,mp]of [
 ['perseria',['女神ペルセリアの冠','女神ペルセリアの衣上','女神ペルセリアの衣下'],[20443,20444,20445],[70,76,70],.09,null,.06,0],
 ['veronica',['ベロニカの帽子','ベロニカのドレス上','ベロニカのドレス下'],[18411,18412,18413],[69,75,69],.08,'メラ',.08,5],
 ['crimson',['深紅の魔角','深紅のローブ上','深紅のローブ下'],[17541,17542,17543],[68,75,68],.07,'イオ',.05,5]
])for(let i=0;i<3;i++)gear.push({id:family+'-spell-'+i,name:names[i],slot:['head','body','legs'][i],limitBreak:0,stats:{defense:defs[i],magic:34,heal:10,...(mp?{mp}:{}),...(family==='perseria'?{speed:10}:{})},bonuses:[g(spell),element?el(element,value):{group:'element',value},...(family==='perseria'&&i===0?[{group:'name',name:'いびつ世界の幻竜',value:.1}]:[])],conditional:family==='perseria'?[{when:'sunny',bonuses:[{group:'element',value:.03}]}]:[],source:src(pages[i]),assumptions:['最大Lv0凸。耐性・暴走率・暴走ダメージ・MP回復は未算入。'],checked});
for(const w of weapons){w.jobStats=w.id==='ouroboros'?{'job-1':{mp:5}}:w.id==='raincloud-staff'?{'job-7':{magic:5}}:w.type==='杖'?{'job-1':{magic:5}}:{};Object.assign(w,{limitBonus:.28,limitBonusType:'呪文',dualBonus:0,initial:[w.opening.components.join('／')],introducedRevision:33});C.weapons.push(w);for(const lb of [0,4]){const old=m.items.find(x=>x.slot==='weapon'&&x.name===w.name&&(x.limitBreak||0)===lb);const row={...w,id:old?.id||w.id+'-'+lb,slot:'weapon',weaponType:w.type,limitBreak:lb,stats:lb?w.stats4:w.stats0,verifiedModel:true,ready:false,skillIds:[],verified:['0.33：最大Lv0/4凸、常時補正、主要呪文・MPを出典照合'],assumptions:w.unmodeled};if(old)Object.assign(old,row);else m.items.push(row);}root.BattleCatalog13.initialMP.push({id:w.id,...w.opening,source:w.source,incomplete:!!w.openingIncomplete});}
for(const k of skills)C.skills.push(k);
for(const h of hearts){const old=C.hearts.find(x=>x.id===h.id);if(old)Object.assign(old,h);else C.hearts.push(h);const item=m.items.find(x=>x.slot==='heart'&&(x.id===h.id||x.name===h.name));const row={...h,id:item?.id||h.id,slot:'heart',ready:false,verifiedModel:true,skillIds:[],verified:['0.33：S全8能力・コスト・呪文/属性/系統補正を照合'],assumptions:h.unmodeled};if(item)Object.assign(item,row);else m.items.push(row);}
for(const row of gear){row.verifiedModel=true;row.ready=false;row.skillIds=[];row.verified=['0.33：最大Lv0凸の素の能力とパッシブを分離'];if(row.id==='perseria-spell-2')row.assumptions.push('衣下の0凸守備力70は、掲載4凸92と同シリーズ頭の比較からの仮値。火力に使う攻魔・呪文/属性補正とは分離。');m.items.push(row);}
// This weapon predates opening skills; “opening ON” must still cost zero.
root.BattleCatalog13.initialMP.push({id:'roto-kai3',flat:0,components:[],source:src(601)});
const giga=m.contents.find(c=>c.id==='giga');if(giga){giga.firepowerOnly=true;giga.source=src(20134);giga.enemies[0].types['ブレス']=.4;giga.assumptions.push('2ターンの与ダメージ比較。シールド上限・ミラージュフォーム・2Tいてつくはどう・他プレイヤー・ギガアタックは未再現。');}
const oldProfile=root.PlannerData.profile;root.PlannerData.profile=function(master){const p=oldProfile(master);if(master===m){const ids=new Set([...weapons.map(w=>m.items.find(x=>x.name===w.name&&(x.limitBreak||0)===0)?.id),...hearts.map(h=>m.items.find(x=>x.slot==='heart'&&x.name===h.name)?.id),...gear.map(g=>g.id)]);for(const row of p.inventory)if(ids.has(row.id))row.count=1;}return p;};
C.scope='代表'+C.weapons.length+'武器・'+C.hearts.length+'こころ。呪文の通常詠唱・詠唱強化に対応。';
root.Data33={checked,weapons,skills,hearts,gear,summaryHTML:()=>'<details class="panel"><summary>0.33 呪文データ：武器6・こころ10・防具9</summary><p>女神ペルセリア・とこしえ・パラドクス・星海・あまぐも・ウロボロスを追加。破戒詠唱・刻、開幕魔力かくせい、攻撃後の呪文威力上昇を計算します。各新規品は比較用の初期所持1個。保存済みの0個は保持します。</p><p>暴走・超暴走は代表倍率、連続呪文・やまびこは発動条件で比較できます。真魔解放・マナはAI選択を仮定する参考比較です。未指定の確率効果・ギガモンのシールドや解除は加算しません。</p>'+[...weapons,...hearts,...gear].map(x=>'<p><a href="'+x.source+'" target="_blank" rel="noreferrer">'+x.name+'</a></p>').join('')+'</details>'};
})(typeof window==='undefined'?globalThis:window);
