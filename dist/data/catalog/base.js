'use strict';
(function(root){
const stats=a=>Object.fromEntries(['hp','mp','attack','defense','magic','heal','speed','dex'].map((k,i)=>[k,a[i]||0]));
const g=v=>[{group:'general',type:'斬撃',value:v},{group:'general',type:'体技',value:v}],e=(v,element)=>g(v).map(x=>({...x,group:'element',element})),race=(r,v)=>({group:'race',race:r,value:v});
const weapons=[
 {id:'hero',name:'勇者のつるぎ',type:'片手剣',stats0:{attack:188},stats4:{attack:245},favored:{attack:12},bonuses:[race('虫系',.05),race('？？？？系',.05)],skills:['fullslash','gigacrash','rainbow'],initial:['会心必中：自身1行動、斬体+50%・確定会心・必中','ブレイブゾーン：敵スキル耐性20ポイント低下'],source:'https://9db.jp/dqwalk/data/18200',unmodeled:['メタル固定ダメージ','勇者の軌跡のMP資料不一致：最大MP10%／固定66']},
 {id:'keki',name:'ケキちゃん',type:'ブーメラン',stats0:{attack:167,magic:35},stats4:{attack:218,magic:41},favored:{attack:12},bonuses:[race('マシン系',.05),race('悪魔系',.05)],skills:['baiki','rondo'],initial:['いきなりピオリム：全員の速度+20%・2ターン','まもりのたて：自身3ターン'],source:'https://9db.jp/dqwalk/data/15208',unmodeled:['攻魔複合の攻撃ダメージ','賢者限定攻撃+5','継承錬度に応じた特殊効果']},
 {id:'moon',name:'はてんの月輪',type:'ブーメラン',stats0:{attack:188},stats4:{attack:245},favored:{attack:12},bonuses:[race('悪魔系',.05),race('虫系',.05)],skills:['dualbreaker','bunshin'],initial:['相棒：自身と右隣（右端なら左端）・5ターン','端配置なら全員の速度1段階・2ターン'],source:'https://9db.jp/dqwalk/data/18350',unmodeled:['ぶんしんによる70%追加攻撃2回','相棒の会心率・限界突破上限の影響']},
 {id:'roto',name:'ロトの竜剣',type:'片手剣',stats0:{attack:188},stats4:{attack:245},favored:{attack:12},bonuses:[race('ドラゴン系',.05),race('？？？？系',.05)],skills:['legend','herocharge'],initial:['ロトの伝説：デイン耐性50ポイント低下・99ターン','敵にドラゴン／？？？？系なら自身SHT'],source:'https://9db.jp/dqwalk/data/17135',unmodeled:['竜王名特効5%','領域による会心・暴走率20ポイント']},
 {id:'lucky',name:'ラッキーフォーチュン',type:'こん',stats0:{attack:69,heal:103},stats4:{attack:91,heal:121},favored:{heal:12},bonuses:[],skills:['seabreeze'],initial:['左隣の行動開始時に良い効果を1ターン延長・3ターン','左隣に幸運1'],source:'https://9db.jp/dqwalk/data/19790',unmodeled:['攻回複合・回復・幸運・HP条件の強化','職業限定の守備・速度+5']},
 {id:'gun',name:'祖竜【理】の銃剣',type:'両手剣',stats0:{attack:192},stats4:{attack:250},twoHand0:96,twoHand4:125,favored:{attack:17},bonuses:[{group:'general',type:'斬撃',value:.03},{group:'element',value:.03}],skills:['dragonfang','concentrate'],initial:['新世界・変異イオ・ゾーンに関係する効果あり'],source:'https://9db.jp/dqwalk/data/20065',unmodeled:['新世界・変異イオ・職業別ゾーンを未収録のため攻撃計算対象外']},
 {id:'wing',name:'堕天の翼爪',type:'ツメ',stats0:{attack:189},stats4:{attack:247},favored:{attack:12},bonuses:[race('ドラゴン系',.05),race('ドッペル系',.05)],skills:['godpower','memento'],initial:['右側3・4番目の配置なら固有攻撃2種が確定会心・3ターン'],source:'https://9db.jp/dqwalk/data/20350',unmodeled:['確率封殺','メメントモリのレベル・HP・死亡・再行動','職業限定攻撃+5・会心率+1%']}
];
const hearts=[
 {id:'corpse',name:'ドラゴンコープス',color:'赤',cost:170,stats:stats([141,61,133,80,21,21,105,92]),bonuses:[...g(.1),race('ドラゴン系',.1),race('鳥系',.1)],effects:['最大コスト+4','即死耐性10%','ドラゴン系が敵にいると開幕攻撃・守備2段階'],source:'https://9db.jp/dqwalk/data/19883'},
 {id:'estark',name:'地獄の帝王エスターク（覚醒）',color:'赤',cost:167,stats:stats([152,66,166,87,22,22,115,101]),bonuses:[...g(.1),...e(.15,'ギラ'),...e(.09,'メラ')],effects:['最大コスト+4','会心率6%・二刀時さらに1%','みかわし7%・ガード7%','ターン開始HP30・MP15回復'],source:'https://9db.jp/dqwalk/data/14017'},
 {id:'lamp',name:'ランプのまじん（覚醒）',color:'青',cost:141,stats:stats([105,54,146,50,24,21,156,168]),bonuses:[...g(.1),...e(.1,'デイン'),...e(.07,'ドルマ'),race('悪魔系',.05)],effects:['最大コスト+4','ジバリア耐性10%・攻撃減耐性10%'],source:'https://9db.jp/dqwalk/data/11263'},
 {id:'god',name:'かみさま（覚醒）',color:'青',cost:152,stats:stats([111,57,153,53,25,22,162,175]),bonuses:[...g(.07),{group:'general',type:'ブレス',value:.07},{group:'element',value:.17},race('？？？？系',.05)],effects:['最大コスト+4','休み耐性10%','ターン開始HP77回復'],source:'https://9db.jp/dqwalk/data/17895'},
 {id:'heart-0',name:'アギロゴス',color:'赤',cost:179,stats:stats([211,86,139,132,57,57,6,76]),bonuses:[...g(.1),...e(.14,'イオ'),...e(.13,'ドルマ')],effects:['最大コスト+4','イオ・ドルマ耐性各3%','ガード5%'],source:'https://9db.jp/dqwalk/data/20411'},
 {id:'mikazuchi-awakened',name:'是空天ミカヅチ（覚醒）',color:'紫',cost:167,stats:stats([149,147,28,94,146,59,100,117]),bonuses:[{group:'general',type:'呪文',value:.12}],skills:['timewave'],effects:['最大コスト+4','デイン耐性10%','晴れ：呪文さらに3%／曇雨雪：暴走率4%','ターン開始MP5回復'],source:'https://9db.jp/dqwalk/data/16649'}
].map(h=>({...h,rank:h.name.includes('覚醒')?'S覚醒':'S',costBonus:4}));
const skills=[
 {id:'wait',name:'ぼうぎょ／待機',kind:'wait',mp:0,source:'https://walk.dragonquest.jp/web/help/'},
 {id:'baishion',name:'バイシオン',kind:'attackBuff',stages:1,duration:4,mp:14,job:'job-1',source:'https://9db.jp/dqwalk/data/4715'},
 {id:'baiki',name:'バイキルト',kind:'attackBuff',stages:2,duration:4,mp:30,source:'https://9db.jp/dqwalk/data/15208',note:'通常攻撃力アップの4行動モデル。同アイコンの再付与では最初の持続を参照。出典：https://9db.jp/dqwalk/data/12222'},
 {id:'cheer',name:'おうえん',kind:'skillBuff',value:80,duration:1,mpRate:.2,job:'job-5',protagonist:true,source:'https://9db.jp/dqwalk/data/10251?p=3'},
 {id:'insight',name:'会心のひらめき',kind:'critBuff',stages:1,duration:4,mpRate:.1,job:'job-8',self:true,source:'https://9db.jp/dqwalk/data/8888'},
 {id:'herocharge',name:'勇者のきあいため',kind:'charge',value:2.3,duration:1,mp:20,self:true,source:'https://9db.jp/dqwalk/data/17135'},
 {id:'rondo',name:'風斬りのロンド',kind:'rondo',type:'体技',element:'バギ',multiplier:260,mp:58,duration:1,source:'https://9db.jp/dqwalk/data/15208',note:'攻魔複合のダメージは未算定。次の味方への補助のみ計算。'},
 {id:'fullslash',name:'全身全霊斬り',kind:'attack',type:'斬撃',elements:['無'],multipliers:[1100],hits:1,direct:true,mp:58,source:'https://9db.jp/dqwalk/data/18200'},
 {id:'gigacrash',name:'ギガクラッシュ',kind:'attack',type:'斬撃',elements:['デイン'],multipliers:[800],hits:1,mp:62,source:'https://9db.jp/dqwalk/data/18200'},
 {id:'legend',name:'ギガスラッシュ・レジェンド',kind:'attack',type:'斬撃',elements:['デイン'],multipliers:[1200,950,800,700],hits:1,crit:'super',mp:61,source:'https://9db.jp/dqwalk/data/17135'},
 {id:'dualbreaker',name:'デュアルブレイカー',kind:'attack',type:'体技',elements:['無'],multipliers:[1000,850,725,600],hits:2,crit:'super',mp:61,source:'https://9db.jp/dqwalk/data/18350'},
 {id:'godpower',name:'神を封じたチカラ',kind:'attack',type:'体技',elements:['イオ','ドルマ'],multipliers:[1700],hits:1,mp:62,source:'https://9db.jp/dqwalk/data/20350'},
 {id:'rainbow',name:'勇者の軌跡',kind:'unsupported',source:'https://9db.jp/dqwalk/data/18200',note:'再行動・レインボーフォース6ターン。MP資料不一致。今回の4行動検証には未対応。'},
 {id:'bunshin',name:'ぶんしん',kind:'unsupported',mpRate:.15,source:'https://9db.jp/dqwalk/data/18350',note:'次の斬体・ブレスに70%の追加攻撃2回。今回の計算には未対応。'},
 {id:'seabreeze',name:'ひと夏のシーブリーズ',kind:'unsupported',mp:63,source:'https://9db.jp/dqwalk/data/19790',note:'全体無属性の攻回複合体技550%・回復・幸運。未対応。'},
 {id:'dragonfang',name:'天超えし竜牙',kind:'unsupported',mp:62,source:'https://9db.jp/dqwalk/data/20065',note:'敵1/2/3/4体1700/1300/1100/1000%。固有ゾーン未収録のため計算対象外。'},
 {id:'concentrate',name:'極限集中',kind:'unsupported',mpRate:.1,source:'https://9db.jp/dqwalk/data/20065',note:'次の斬体2.25倍・確定ゾーン。固有ゾーン未収録。'},
 {id:'memento',name:'メメントモリ・天地',kind:'unsupported',mp:58,source:'https://9db.jp/dqwalk/data/20350',note:'全体無属性700%＋ランダム70%×7。分配・確率直撃未対応。'},
 {id:'timewave',name:'ざざん波・時荒らし',kind:'unsupported',mp:100,maxUses:2,source:'https://9db.jp/dqwalk/data/16649',note:'ミカヅチ覚醒由来。ザバ呪文・効果2ターン短縮。呪文式の検証待ち。'}
];
const gun=weapons.find(w=>w.id==='gun');gun.favoredBonuses=gun.bonuses;gun.bonuses=[];
const corrections=[];const m=root.PlannerData?.real;
if(m){for(const h of hearts){const old=m.items.find(i=>i.id===h.id);if(old)Object.assign(old,{stats:{...h.stats},cost:h.cost,color:h.color,bonuses:h.bonuses,source:h.source,verified:['0.8で'+h.rank+'の8能力値・コスト・常時ダメージ効果を照合']});}for(const w of weapons)for(const lb of [0,4]){const old=m.items.find(i=>i.id===w.id+'-'+lb);if(old){const corrected={...(lb?w.stats4:w.stats0)};for(const [k,v]of Object.entries(w.favored))corrected[k]=(corrected[k]||0)+v;Object.assign(old,{stats:corrected,source:w.source,verified:['0.8で最大強化の0凸・4凸能力値を分離確認。従来画面の値は得意パッシブ込み。'],assumptions:[...w.unmodeled,'得意武器の適用条件は従来の概算画面では省略。新しい行動順画面で個別に指定。']});corrections.push(old.id);}}m.revision=8;}
root.Catalog8={checked:'2026-10-21',weapons,hearts,skills,corrections,scope:'ランキング掲載と参考編成から選んだ代表7武器・6こころ。使用率の実測や全装備の網羅ではありません。',selectionSource:'https://gamewith.jp/dq-walk/article/show/167383'};
})(typeof window==='undefined'?globalThis:window);
