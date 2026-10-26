'use strict';
(function(root){
const C=Catalog8,st=a=>Object.fromEntries(['hp','mp','attack','defense','magic','heal','speed','dex'].map((k,i)=>[k,a[i]])),g=(v,type)=>type?[{group:'general',type,value:v}]:['斬撃','体技'].map(type=>({group:'general',type,value:v})),el=(v,e,types=['斬撃','体技'])=>types.map(type=>({group:'element',element:e,type,value:v})),race=(r,v)=>({group:'race',race:r,value:v});
const records=[
 ['blair','灼爍天ブレア','赤',137,[125,56,117,75,19,19,112,89],g(.1),'367053','blair'],
 ['blair-awakened','紅霞天ブレア（覚醒）','赤',137,[130,58,122,77,20,20,115,92],g(.12),'367053','blair'],
 ['duran','デュラン','赤',143,[134,58,126,77,20,20,104,91],[...g(.1,'斬撃'),...g(.05,'体技'),...el(.07,'イオ'),...el(.07,'バギ')],'405291','duran'],
 ['maou-awakened','まおうのつかい（覚醒）','青',156,[161,98,112,107,51,46,138,138],[...g(.1,'斬撃'),...g(.05,'体技'),...el(.1,'イオ'),race('ゾンビ系',.2)],'168227','maou'],
 ['cyclops','サイクロプス','青',144,[117,55,128,51,24,22,157,140],[...g(.1),...el(.1,'バギ')],'414397','cyclops'],
 ['muscle','マッスルガード','青',131,[118,78,92,89,41,37,113,113],[...g(.05),...['ジバリア','ヒャド','ドルマ'].map(element=>({group:'element',element,value:.07}))],'364147','muscle'],
 ['muscle-awakened','マッスルガード（覚醒）','青',146,[140,85,97,94,44,40,120,120],[...g(.07),...['ジバリア','ヒャド','ドルマ'].map(element=>({group:'element',element,value:.09}))],'364147','muscle'],
 ['griz-awakened','蒼茫天グリザード（覚醒1）','青',122,[140,85,98,93,44,40,124,124],[...g(.13,'斬撃'),...g(.06,'体技')],'317341','griz'],
 ['griz-awakened2','氷魔の戦士グリザード（覚醒2）','青',122,[146,89,102,97,46,42,128,128],[...g(.07,'ブレス'),{group:'element',element:'ヒャド',value:.05},{group:'element',element:'ザバ',value:.05}],'317341','griz'],
 ['killer','キラーマジンガ','黒',165,[148,78,206,75,25,35,162,143],g(.1),'444054','killer'],
 ['rap-black','暗黒の巨神ラプソーン（分岐覚醒2）','黒',165,[181,87,175,103,28,45,125,82],[{group:'element',element:'ドルマ',value:.2},race('ドラゴン系',.1)],'347737','rap'],
 ['ryu-awakened','闇の覇者りゅうおう（覚醒）','紫',125,[110,129,27,53,107,35,101,99],[...g(.1,'呪文'),...el(.15,'ドルマ',['呪文'])],'168103','ryu'],
 ['zoma-awakened','闇の大魔王ゾーマ（覚醒）','紫',149,[87,110,11,43,182,68,117,107],[...g(.1,'呪文'),...el(.05,'ヒャド',['呪文'])],'192806','zoma']
];
for(const [id,name,color,cost,values,bonuses,page,family]of records)C.hearts.push({id,name,color,cost,stats:st(values),bonuses,source:'https://gamewith.jp/dq-walk/article/show/'+page,family,rank:name.includes('覚醒')?'S覚醒':'S',costBonus:color==='黒'?0:4,noColorBonus:color==='黒',effects:[color==='黒'?'黒：色一致補正なし・コスト加算なし':'最大コスト+4']});
const h=id=>C.hearts.find(h=>h.id===id);
h('blair').conditional=[{when:'day',bonuses:g(.02)}];h('blair-awakened').conditional=[{when:'day',bonuses:g(.03)}];h('griz-awakened').conditional=[{when:'badWeather',bonuses:g(.03)}];h('griz-awakened2').conditional=[{when:'badWeather',bonuses:g(.03,'ブレス')}];
for(const id of ['blair','blair-awakened'])h(id).effects.push('朝・昼・夕は斬体さらに'+(id==='blair'?2:3)+'%（夜はなし）');
h('griz-awakened').effects.push('曇雨雪：斬体さらに3%');h('griz-awakened2').effects.push('曇雨雪：ブレスさらに3%');
h('blair-awakened').skills=['yaegasumi'];h('maou-awakened').skills=['rukani'];h('griz-awakened').skills=['cocytus'];h('ryu-awakened').skills=['mahotone'];h('ryu-awakened').effects.push('ターン開始MP10回復');h('zoma-awakened').effects.push('暴走率7%');
for(const id of ['blair','blair-awakened'])h(id).effects.push('みかわし5%・ガード5%・メラ耐性10%');
h('duran').effects.push('デイン耐性7%・幻惑耐性10%');h('maou-awakened').effects.push('呪い・守備減耐性各15%');h('cyclops').effects.push('メラ・攻撃減耐性各10%');h('muscle-awakened').effects.push('怯え耐性10%・眠り耐性7%');for(const id of ['griz-awakened','griz-awakened2'])h(id).effects.push('ヒャド耐性10%・被ブレス5%反射');h('killer').effects.push('デイン・眠り・麻痺耐性各10%');h('rap-black').effects.push('斬撃・体技・呪文・ブレス耐性各10%');h('ryu-awakened').effects.push('ドルマ・混乱・魅了耐性各10%');
h('mikazuchi-awakened').conditional=[{when:'sunny',bonuses:g(.03,'呪文')}];
const newWeapons=[
 {id:'estark-blade',name:'エスタークの魔刃',type:'片手剣',stats0:{attack:184},stats4:{attack:240},favored:{attack:12},bonuses:[race('ドラゴン系',.05)],dualBonus:.05,skills:['execution','absolutecrit'],initial:['いきなりインフェルノ：メラ・ギラの通常フォース・5ターン','まどろむ災厄：火力バフなし'],source:'14033',force:['メラ','ギラ'],unmodeled:['確率会心率2%','バトマス攻撃+5','まどろむ災厄の被ダメージ軽減']},
 {id:'eightdragon',name:'八竜神の剣',type:'片手剣',stats0:{attack:184},stats4:{attack:240},favored:{attack:12},bonuses:[race('ドラゴン系',.05),race('けもの系',.05)],dualBonus:.05,skills:['dragonsoul'],initial:['いきなりテンションアップ：1〜2段階（結果を選択）'],source:'15276',unmodeled:['攻撃後の挑戦スキル発動','バトマス攻撃+5・パラディン守備+5']},
 {id:'chronos',name:'クロノスソード',type:'片手剣',stats0:{attack:188},stats4:{attack:245},favored:{attack:12},bonuses:[race('悪魔系',.05),race('マシン系',.05)],dualBonus:.05,skills:['timeblade','chronostance'],initial:['いきなりクロノフォース：メラ・ヒャド・デイン・4ターン','いきなり時間停止：ダメージ倍率なし'],force:['メラ','ヒャド','デイン'],source:'17787',unmodeled:['確率レベルダウンは自動成功にしない','バトマス攻撃+5・スーパースター速度+10']},
 {id:'lamia',name:'ラーミアのムチ',type:'ムチ',stats0:{attack:174},stats4:{attack:227},favored:{attack:12},bonuses:[race('けもの系',.05),race('ドラゴン系',.05)],skills:['phoenix'],initial:['いきなりピオリム：全員の速度1段階','まばゆき翼：確率で敵に衰弱Lv1（標準では不発）'],source:'12461',unmodeled:['確率衰弱','ニンジャ速度+10・大神官攻撃+5']},
 {id:'light-greatsword',name:'闇はらう光の大剣',type:'両手剣',stats0:{attack:178},stats4:{attack:233},twoHand0:89,twoHand4:116,favored:{attack:17},bonuses:[race('？？？？系',.1)],twoHandBonuses:[...g(.03,'斬撃'),...el(.03,'デイン')],skills:['gigablade','normalcharge'],initial:['勇者の覚悟：系統ボーナス値1.4倍・3ターン','伝説のはじまり：攻撃1段階（まれに2段階）・3ターン'],source:'12235',unmodeled:['攻撃後の確率会心率上昇','開幕のまれな攻撃2段階は選択条件で指定']},
 {id:'metal-greatsword',name:'メタルキングの大剣',type:'両手剣',stats0:{attack:183},stats4:{attack:240},twoHand0:91,twoHand4:120,favored:{attack:12},bonuses:[race('けもの系',.05),race('悪魔系',.05)],twoHandBonuses:[...g(.03,'斬撃'),{group:'element',value:.03}],skills:['nebula'],domain:'blackhole',initial:['ブラックホール：領域・残HP15%以下で消滅（一部敵除く）','キングタイム：先制、メタル不在時は確率'],source:'13223',unmodeled:['消滅はHP・敵適性の未登録のため判定しない','固定メタルダメージ80','ドラゴン・守り人攻撃+5']}
];
newWeapons.forEach(w=>{w.source='https://9db.jp/dqwalk/data/'+w.source;C.weapons.push(w);});
const add=s=>C.skills.push(s),src=id=>'https://9db.jp/dqwalk/data/'+id;
add({id:'execution',name:'天上天下断獄斬',kind:'attack',type:'斬撃',elements:['無'],multipliers:[555],hits:2,crit:'super',afterAttack:1,mp:55,source:src(14033)});
add({id:'absolutecrit',name:'会心必中・絶',kind:'absolutecrit',self:true,mpRate:.15,source:src(14033)});
add({id:'dragonsoul',name:'ドラゴンソウル∞',kind:'attack',type:'斬撃',elements:['イオ','メラ'],multipliers:[200],hits:4,direct:true,tensionSkill:true,mp:58,source:src(15276)});
add({id:'timeblade',name:'時もどしの刃',kind:'attack',type:'斬撃',elements:['無'],multipliers:[700],hits:1,randomHits:[200,200,200,200],forceStrong:true,mp:61,source:src(17787)});
add({id:'chronostance',name:'会心必中のかまえ・刻',kind:'unsupported',mpRate:.1,source:src(17787),note:'確定会心は次のターン。現在の1ターン検証では攻撃へ即適用しない。'});
add({id:'phoenix',name:'不死鳥のほむら',kind:'attack',type:'体技',elements:['イオ','メラ'],multipliers:[440],hits:1,nextBuff:'phoenix',mp:57,source:src(12461)});
add({id:'gigablade',name:'ギガブレード',kind:'attack',type:'斬撃',elements:['デイン'],multipliers:[730],hits:1,direct:true,mp:51,source:src(12235)});
add({id:'normalcharge',name:'きあいため',kind:'charge',value:2,self:true,mp:15,source:src(12235)});
add({id:'nebula',name:'グランドネビュラ',kind:'attack',type:'斬撃',elements:['ヒャド','ドルマ'],multipliers:[530],hits:1,mp:58,source:src(13223)});
add({id:'yaegasumi',name:'八重霞',kind:'attack',type:'斬撃',elements:['メラ'],multipliers:[390],hits:1,mp:31,source:h('blair-awakened').source,note:'火種の確率付与と撃破時450%追撃は不算入。'});
add({id:'rukani',name:'ルカニ',kind:'defenseBuff',stages:-2,mp:10,source:h('maou-awakened').source,note:'成功時のみ適用。成否を行動欄で指定。'});
add({id:'cocytus',name:'コキュートス',kind:'unsupported',mpRate:.5,source:h('griz-awakened').source,note:'攻魔複合350%・反射不可ヒャド。検証式未確定。'});
add({id:'mahotone',name:'マホトーン',kind:'unsupported',source:h('ryu-awakened').source,note:'消費MP・成功率の照合待ち。'});
for(const w of C.weapons){w.limitBonus=w.id!=='lucky'?.28:0;w.dualBonus=w.dualBonus??(['hero','roto','wing'].includes(w.id)?.05:0);}
const w=id=>C.weapons.find(w=>w.id===id);w('hero').domain='brave';w('roto').domain='roto';w('gun').domain='newworld';
C.domains={none:{name:'領域なし'},brave:{name:'ブレイブゾーン',typeResistance:-20},roto:{name:'ロトの伝説',element:'デイン',elementResistance:-50},blackhole:{name:'ブラックホール',note:'消滅は未判定。ダメージ倍率は変えない。'},newworld:{name:'新世界',note:'虹こころの色特性・まもりのたて。確率ゾーンは発動済み条件で指定。'}};
C.domainSources=['https://walk.dragonquest.jp/web/help/show/234','https://9db.jp/dqwalk/data/16476','https://walk.dragonquest.jp/web/news/show/2026091215'];
C.newWorldEffects={赤:'会心率20%／超越ゾーン時40%。被斬体を回復へ変換：確率／確定',青:'速度20%（ピオリムと加算）。被ブレスを回復へ変換：確率／確定',紫:'暴走率20%／超越ゾーン時40%。被呪文を回復へ変換：確率／確定',緑:'受けるスキル回復20%／超越ゾーン時40%。死亡時復活：まれ／たまに',黄:'呪文・ブレスガード解禁。対応する悪い状態反転：確率／確定',黒:'攻撃スキル使用時、対象のバフ1個解除：確率／確定（今回未判定）',白:'領域・味方の良い効果の解除を防ぐ。別領域の上書きは防げない'};
Object.assign(C.skills.find(s=>s.id==='dragonfang'),{kind:'attack',type:'斬撃',elements:['無'],multipliers:[1700,1300,1100,1000],hits:1,crit:'super',forceStrong:true,note:'変異イオは装備者自身のみ。ゾーン未確認時は加算しない。'});
Object.assign(C.skills.find(s=>s.id==='concentrate'),{kind:'zoneCharge',self:true,value:2.25,note:'確定ゾーン・次の斬体2.25倍。同一ターンの再行動は未対応。'});
w('gun').unmodeled=['ランダムゾーンは発動済みを明示選択','バースト・レインボウ','新世界の耐久・解除・被弾時効果'];
Object.assign(C.skills.find(s=>s.id==='rondo'),{note:'攻魔複合の基礎式と後続補助を適用。固有の丸め・乱数は実測照合待ち。'});
w('keki').unmodeled=['ロンド固有の丸め・乱数の実測照合','賢者限定攻撃+5'];
// Inventory can record the new data; the older approximate solver must not treat
// these skills as if they used its legacy, placeholder formulas.
const master=root.PlannerData?.real;if(master){
 for(const item of newWeapons)for(const limitBreak of [0,4]){let old=master.items.find(x=>x.name===item.name&&x.limitBreak===limitBreak);const record={name:item.name,limitBreak,slot:'weapon',weaponType:item.type,stats:{...(limitBreak?item.stats4:item.stats0)},bonuses:item.bonuses,source:item.source,ready:false,verifiedModel:true,skillIds:[],verified:['0.9：最大強化時の生ステータスを出典照合。得意・両手持ち加算は別。'],assumptions:['詳細なスキル・開幕効果の計算は「04 装備とスキル順」で対応。旧概算探索への接続は未完了。']};if(old)Object.assign(old,record);else master.items.push({id:item.id+'-'+limitBreak,...record});}
 for(const item of C.hearts.slice(6)){let old=master.items.find(x=>x.id===item.id||(item.id==='zoma-awakened'&&x.id==='zoma'));const record={name:item.name,slot:'heart',rank:item.rank,color:item.color,cost:item.cost,costBonus:item.costBonus,stats:item.stats,bonuses:item.bonuses,source:item.source,skillIds:[],verifiedModel:true,verified:['0.9：Sの8能力値・色・コストを照合。'],assumptions:['天候・時間帯・黒の色補正は「04 装備とスキル順」で個別計算。'],ready:false};if(old)Object.assign(old,{...record,ready:old.ready});else master.items.push({id:item.id,...record});}master.revision=9;
}
Object.assign(C.skills.find(s=>s.id==='rainbow'),{kind:'rainbow',self:true,mpRate:.1,duration:6,note:'無属性に有利な属性を付与し、直後に自身が再行動。通常フォースの属性補正半減を適用。'});
C.skills.push({...C.skills.find(s=>s.id==='fullslash'),id:'eradicate-fullslash',name:'根絶やし → 全身全霊斬り',job:'job-8',eradicate:true,source:'https://9db.jp/dqwalk/data/8888',note:'根絶やし解放済みの魔人専用。戦闘中1回。系統特効の効果値に300%増幅を加算。MPは根絶やし最大MP10%＋攻撃スキル分。'});
C.checked='2026-10-21';C.revision=10;C.scope='代表'+C.weapons.length+'武器・'+C.hearts.length+'こころ。覚醒・分岐・条件付き性能を分離。使用率の実測や全装備の網羅ではありません。';for(const k of C.skills)if(k.kind==='attack'||k.kind==='rondo')k.attackTarget=['gigacrash','legend','dualbreaker','dragonfang','timeblade','phoenix','nebula','memento','rondo'].includes(k.id)?'all':'single';
for(const id of ['herocharge','concentrate'])C.skills.find(k=>k.id===id).maxUses=1;
C.skills.find(k=>k.id==='absolutecrit').maxUses=2;
for(const [id,hp,mp]of [['estark',30,15],['god',77,0],['mikazuchi-awakened',0,5]])C.hearts.find(h=>h.id===id).recovery={hp,mp};
root.Catalog9=C;
})(typeof window==='undefined'?globalThis:window);
