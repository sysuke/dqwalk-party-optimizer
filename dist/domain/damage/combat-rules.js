'use strict';
// Source-backed availability and event rules. Unknown damage never becomes zero or a kill.
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x));
const sources={official:'https://walk.dragonquest.jp/web/help/',example:'https://ameblo.jp/kuroisannchi/entry-12981021456.html',agiro:'https://9db.jp/dqwalk/data/20410',time:'https://9db.jp/dqwalk/data/16750',hero:'https://game8.jp/dqwalk/785465',slash:'https://game8.jp/dqwalk/785489',root:'https://game8.jp/dqwalk/662798',encore:'https://game8.jp/dqwalk/354792',moon:'https://game8.jp/dqwalk/788128',keki:'https://game8.jp/dqwalk/687407',roto:'https://game8.jp/dqwalk/753773',corpse:'https://game8.jp/dqwalk/804537',gaia:'https://game8.jp/dqwalk/346348'};
const skills=[
 {id:'defend',name:'ぼうぎょ',kind:'defend',mp:0,source:sources.official},
 {id:'cover',name:'におうだち',kind:'cover',job:'job-5',unlock:'まもり道4',maxUses:3,mp:0,source:'https://game8.jp/dqwalk/557959'},
 {id:'encore',name:'アンコール',kind:'encore',job:'job-2',unlock:'舞道4',mpRate:.25,source:sources.encore},
 {id:'eradicate',name:'根絶やし → 全身全霊斬り',kind:'damage',job:'job-8',unlock:'超魔道4',weapon:'勇者のつるぎ',mp:58,mpRate:.1,maxUses:1,source:sources.root,note:'根絶やしで選択する攻撃を内包。通常行動をもう1回追加するスキルとして扱わない。'},
 {id:'insight',name:'会心のひらめき',kind:'insight',job:'job-8',unlock:'超人道4',mpRate:.1,source:'https://game8.jp/dqwalk/662797'},
 {id:'fullslash',name:'全身全霊斬り',kind:'damage',weapon:'勇者のつるぎ',mp:58,multiplier:11,ignoreDefense:true,accuracy:1,source:sources.slash},
 {id:'rainbow',name:'勇者の軌跡',kind:'rainbow',weapon:'勇者のつるぎ',mp:66,maxUses:1,source:'https://game8.jp/dqwalk/785491'},
 {id:'timewave',name:'ざざん波・時荒らし',kind:'damage',heart:'mikazuchi-awakened',mp:100,maxUses:2,advance:2,type:'呪文',element:'ザバ',source:sources.time},
 {id:'rondo',name:'風斬りのロンド',kind:'damage',weapon:'ケキちゃん',mp:58,type:'体技',element:'バギ',source:sources.keki,note:'次に行動する味方への補助。相棒の位置とは別条件。'},
 {id:'support',name:'補助（未指定）',kind:'unknown',mp:0,source:sources.example}
];
skills.push({id:'cheer',name:'おうえん',kind:'cheer',job:'job-5',mpRate:.2,maxUses:1,source:'https://gamewith.jp/dq-walk/article/show/423149',note:'主人公の守り人のみ。斬撃・体技・呪文・ブレス威力+80%。'},{id:'baishion',name:'バイシオン',kind:'baishion',job:'job-1',mp:14,source:'https://game8.jp/dqwalk/293470'});
Object.assign(skills.find(s=>s.id==='cover'),{mpRate:.1,source:'https://walk.dragonquest.jp/web/news/show/2023102630?return=1&v=1'});
for(const s of skills.filter(s=>['cover','encore','eradicate','insight'].includes(s.id)))s.minLevel=30;
function skill(id){return skills.find(s=>s.id===id);}
function resolve(master,loadout){
 const issues=[],items=loadout.items||[],main=items.find(i=>i.slot==='weapon'),inherit=loadout.inherit,left=loadout.left;
 if(inherit&&left)issues.push('ぶき継承と二刀流は併用できません。');
 if(inherit&&(!main?.weaponType||main.weaponType!==inherit.weaponType))issues.push('継承元と装備武器の武器種が一致しません。');
 if(inherit&&!loadout.proficiency)issues.push('ぶき継承には武器種の錬度1以上が必要です。');
 const validInherit=inherit&&!left&&main?.weaponType&&main.weaponType===inherit.weaponType&&loadout.proficiency;
 const validLeft=left&&!inherit&&loadout.job==='job-8'&&main?.weaponType==='片手剣'&&left.weaponType==='片手剣';
 if(left&&!validLeft)issues.push('この構成の二刀流条件は未対応、または併用不可です。');
 const ids=new Set([...(master.jobs.find(j=>j.id===loadout.job)?.skillIds||[]),...items.flatMap(i=>i.skillIds||[]),...(loadout.hearts||[]).flatMap(i=>i.skillIds||[]),...(validInherit?inherit.inheritSkillIds||[]:[])]);
 const available=skills.filter(s=>(s.id==='defend'||s.id==='support'||s.job===loadout.job&&(!s.unlock||(loadout.unlocks||[]).includes(s.unlock))||s.weapon===main?.name||validLeft&&s.weapon===left?.name||validInherit&&(inherit.inheritCombatIds||[]).includes(s.id)||s.heart&&(loadout.hearts||[]).some(h=>h.id===s.heart))&&(!s.job||s.job===loadout.job)&&(!s.unlock||(loadout.unlocks||[]).includes(s.unlock))&&(!s.weapon||s.weapon===main?.name||validLeft&&s.weapon===left?.name||validInherit&&(inherit.inheritCombatIds||[]).includes(s.id)));
 return {skills:available.filter(s=>(s.id!=='cheer'||loadout.isProtagonist)&&(!s.minLevel||loadout.level>=s.minLevel)),ids:[...ids],issues,inheritedStats:{},inheritedBonuses:validInherit?clone(inherit.inheritBonuses||[]):[]};
}
function assignments(profile,roles){const out=[];function walk(a,used){if(a.length===roles.length){out.push(a);return;}profile.characters.forEach((c,i)=>{if(!used.includes(i)&&c.levels[roles[a.length].job]>0)walk([...a,i],[...used,i]);});}walk([],[]);return out;}
const roles=[{name:'守り人',job:'job-5',weapon:'はてんの月輪',inherit:'ケキちゃん',speed:1450,unlocks:['まもり道4']},{name:'大魔道士',job:'job-1',weapon:'ロトの竜剣',heart:'mikazuchi-awakened',speed:1433,unlocks:[]},{name:'大神官',job:'job-2',speed:1184,unlocks:['舞道4']},{name:'魔人',job:'job-8',weapon:'勇者のつるぎ',speed:985,unlocks:['超魔道4']}];
const articleRoles=roles.map((r,i)=>({...r,weapon:i===0?'ラッキーフォーチュン':i===2?'はてんの月輪':r.weapon,inherit:i===2?'ケキちゃん':undefined,left:i===3?'ロトのつるぎ（改3）':undefined}));
function template(master,profile,preset='user'){const chosen=preset==='reference'?articleRoles:roles;const maps=assignments(profile,chosen).filter(a=>preset!=='reference'||a[0]===0);const stock=new Map(profile.inventory.map(i=>[i.id,i.count]));const used={},issues=[],loadouts=[];function take(name,slot){const found=master.items.filter(i=>i.name===name&&(!slot||i.slot===slot)).sort((a,b)=>(a.limitBreak||0)-(b.limitBreak||0)).find(i=>(stock.get(i.id)||0)>(used[i.id]||0));if(!found){issues.push(name+' の所持数が不足しています。');return null;}used[found.id]=(used[found.id]||0)+1;return found;}
 if(!maps.length)issues.push('4人の職業レベルでは実戦例の役割を割り当てられません。');
 for(const [index,r]of chosen.entries()){const main=r.weapon?take(r.weapon,'weapon'):null,inherit=r.inherit?take(r.inherit,'weapon'):null,heart=r.heart?take('是空天ミカヅチ（覚醒）','heart'):null,left=r.left?take(r.left,'weapon'):null;loadouts.push({job:r.job,level:profile.characters[maps[0]?.[index]]?.levels[r.job]||0,items:main?[main]:[],inherit,left,hearts:heart?[heart]:[],unlocks:r.unlocks,proficiency:true,isProtagonist:maps[0]?.[index]===0});}
 const optional=[];
 const corpse=master.items.find(i=>i.id==='corpse');if(corpse&&(stock.get(corpse.id)||0)>(used[corpse.id]||0)){loadouts[3].hearts.push(corpse);used[corpse.id]=(used[corpse.id]||0)+1;}else optional.push('ドラゴンコープスSは所持不足。代替こころは未選定。');
 loadouts[3].pearls=[];const gaia=master.items.find(i=>i.id==='gaia-s');if(gaia)for(let i=0;i<2;i++)if((stock.get(gaia.id)||0)>(used[gaia.id]||0)){loadouts[3].pearls.push(gaia);used[gaia.id]=(used[gaia.id]||0)+1;}
 return {assignments:maps,assignment:maps[0]||null,loadouts,used,issues,optional,roles:chosen,positions:preset==='reference'?[2,3,0,1]:[0,3,1,2]};
}
function speedCheck(speeds,ratio=1.2,pairs=[[0,1],[1,2],[2,3]]){return pairs.map(([i,j])=>({first:i,second:j,nominal:speeds[i]>speeds[j],certain:speeds[i]>speeds[j]*ratio,required:Math.floor(speeds[j]*ratio)+1}));}
function shieldHit(enemy,raw,thresholds){const before=enemy.broken||0;let after=before;for(let i=before;i<thresholds.length;i++)if(raw>=thresholds[i])after=i+1;const applied=Math.min(raw,before<thresholds.length?thresholds[before]:Infinity);enemy.broken=after;enemy.hp=Math.max(0,enemy.hp-applied);return {raw,applied,broken:after-before,totalBroken:after};}
function advance(effects,amount){return effects.map(e=>({...e,remaining:e.remaining-(e.shortenable===false?0:amount)})).filter(e=>e.remaining>0);}
function cost(s,maxMP){return (s.mp||0)+Math.ceil((s.mpRate||0)*maxMP);}
// Each script entry is an action slot. Encore pushes an immediate slot without consuming the natural one.
function simulate(config){
 const actors=config.actors.map(a=>({mp:a.mp,maxMP:a.mp,uses:{},personalTurns:0,criticalActions:a.criticalActions??0,unlocks:a.unlocks||[],job:a.job,available:a.available||[],buffs:{},...a}));
 const enemy={hp:config.hp,broken:0,effects:clone(config.effects||[])};
 const steps=[],issues=[],unknown=[],thresholds=config.thresholds||[240000,480000,720000,1200000];
 let turn=0,pending=null,natural=new Set(),actual=0;
 function log(s,detail,hit){steps.push({...s,detail,hit,hp:enemy.hp,broken:enemy.broken,effects:clone(enemy.effects),mp:actors.map(a=>a.mp)});}
 for(const s of config.script){
  if(enemy.hp<=0)break;
  if(s.turn!==turn){if(pending!==null)issues.push('追加行動が未実行です。');if(turn)enemy.effects=advance(enemy.effects,1);turn=s.turn;natural=new Set();pending=null;}
  if(s.actor==='enemy'){
   if(pending!==null){issues.push('アンコール直後に敵行動は挟めません。');break;}
   if(s.effects)enemy.effects.push(...clone(s.effects));log(s,'敵の行動。被ダメージ・生存は別途検証');continue;
  }
  const a=actors[s.actor],k=skill(s.skill);if(!a||!k){issues.push('未登録のキャラまたはスキルです。');break;}
  if(pending!==null){if(s.actor!==pending){issues.push('追加行動の対象と次の行動者が一致しません。');break;}pending=null;}else if(natural.has(s.actor)){issues.push('追加行動なしで同じキャラが再行動しています。');break;}else natural.add(s.actor);
  if(!a.available.includes(k.id)){issues.push(roles[s.actor]?.name+' は '+k.name+' を習得していません。');break;}
  if(k.unlock&&!a.unlocks.includes(k.unlock)){issues.push(k.name+' のこころ道が未解放です。');break;}
  if(k.id==='cheer'&&!a.isProtagonist){issues.push('おうえんは主人公の守り人のみ使用できます。');break;}
  if(k.maxUses&&(a.uses[k.id]||0)>=k.maxUses){issues.push(k.name+' の使用回数上限です。');break;}
  const mp=cost(k,a.maxMP);if(a.mp<mp){issues.push(roles[s.actor]?.name+' のMPが不足しています。');break;}a.mp-=mp;a.uses[k.id]=(a.uses[k.id]||0)+1;a.personalTurns++;actual++;
  if(a.extensionUntil>=turn&&a.criticalActions>0)a.criticalActions++;
  let detail='',hit;
  if(k.kind==='encore'){if(!Number.isInteger(s.target)||s.target===s.actor||!actors[s.target]){issues.push('アンコールの対象が不正です。');break;}pending=s.target;detail=roles[s.target].name+'が直後に追加行動。通常行動は残る';}
  else if(k.kind==='rainbow'){a.rainbow=true;pending=s.actor;detail='レインボーフォースを付与して再行動';}
  else if(k.kind==='damage'){
   const casts=k.id==='timewave'?(config.echo?2:1):1;
   let raw=0,known=true;for(let cast=0;cast<casts;cast++){
    const v=config.damage?.(s,a,enemy,cast);if(!Number.isFinite(v)||v<0){known=false;unknown.push(k.name+' の解除前後・補助・会心状態を含むダメージが未確定');}
    else raw+=Math.floor(v);
    // Damage is evaluated before the corresponding time shortening.
    if(k.advance)enemy.effects=advance(enemy.effects,k.advance);
   }
   if(known)hit=shieldHit(enemy,raw,thresholds);
   detail=(casts>1?'確定やまびこ込み2発。':'')+(k.advance?'各着弾の後に残り効果ターンを2短縮。':'')+(k.id==='eradicate'?'根絶やしの1回制限とMPを消費。':'')+(known?'':'ダメージ未確定。HP・シールドの判定は保留');
   if(k.id==='fullslash'||k.id==='eradicate')detail+=(a.criticalActions>0?' / 確定会心効果あり':' / 確定会心効果なし');
   if(k.id==='rondo'){const next=config.script.slice(config.script.indexOf(s)+1).find(x=>x.actor!=='enemy'&&x.actor!==s.actor);if(next){actors[next.actor].buffs.rondo=true;detail+=' / 次の行動者 '+roles[next.actor].name+'に会心・暴走補助';}if(Number.isInteger(a.partner)){actors[a.partner].buffs.partner=true;detail+=' / 相棒 '+roles[a.partner].name+'に攻撃・会心・限界突破';}}
  }else if(k.kind==='cheer'){actors[s.target].buffs.cheer=.8;detail=roles[s.target].name+'へのスキル威力+80%';}
  else if(k.kind==='baishion'){actors[s.target].buffs.baishion=true;detail=roles[s.target].name+'への攻撃力1段階アップ（同一群の上限に従う）';}
  else if(k.kind==='insight')detail='会心率・会心ダメージを強化。確定会心の付与ではない';
  else if(k.kind==='unknown'){unknown.push('守り人の補助スキルと効果が未指定');detail='補助内容を指定するまで火力効果を加算しない';}
  else detail=k.kind==='cover'?'味方をかばう。実際の耐久は未検証':'防御';
  // One personal action expires the one-action starting critical guarantee, including Encore actions.
  a.criticalActions=Math.max(0,a.criticalActions-1);
  log(s,detail,hit);
 }
 if(pending!==null)issues.push('追加行動の操作が不足しています。');
 const unresolved=[...new Set(unknown)];return {steps,actors,enemy,issues,unknown:unresolved,actions:actual,damage:config.hp-enemy.hp,killed:enemy.hp<=0&&!issues.length&&!unresolved.length,known:!unresolved.length&&!issues.length};
}
function script(variant='user',preparation='eradicate',support='support'){
 if(variant==='reference')return [{turn:1,actor:0,skill:'cover'},{turn:1,actor:1,skill:'baishion',target:3},{turn:1,actor:2,skill:'rondo'},{turn:1,actor:3,skill:'rainbow'},{turn:1,actor:3,skill:'eradicate'},
 {turn:1,actor:'enemy',skill:'聖なる防壁',effects:[{id:'critGuard',name:'会心ガード',remaining:4},{id:'physicalResist',name:'斬撃・体技耐性アップ',remaining:4},{id:'dispelGuard',name:'いてつくはどうガード',remaining:4}]},
 {turn:2,actor:0,skill:'cheer',target:3},{turn:2,actor:1,skill:'timewave'},{turn:2,actor:2,skill:'encore',target:1},{turn:2,actor:1,skill:'timewave'},{turn:2,actor:3,skill:'fullslash'}];
 const out=[{turn:1,actor:0,skill:'cover'},{turn:1,actor:1,skill:'defend'},{turn:1,actor:2,skill:'encore',target:3},{turn:1,actor:3,skill:preparation},{turn:1,actor:3,skill:'fullslash'},
 {turn:1,actor:'enemy',skill:'聖なる防壁',effects:[{id:'critGuard',name:'会心ガード',remaining:4},{id:'physicalResist',name:'斬撃・体技耐性アップ',remaining:4},{id:'dispelGuard',name:'いてつくはどうガード',remaining:4}]},
 {turn:2,actor:0,skill:support},{turn:2,actor:1,skill:'timewave'},{turn:2,actor:2,skill:'encore',target:variant==='article'?1:3}];
 if(variant==='article')out.push({turn:2,actor:1,skill:'timewave'});else out.push({turn:2,actor:3,skill:'fullslash'});
 out.push({turn:2,actor:3,skill:'fullslash'});return out;
}
 function breakPriority(a,b){const score=r=>{const x=r.breakChallenge||{},full=x.maxSimultaneous===4;return [Number(!!r.resourceOK),Number(full),x.maxSimultaneous||0,full?Number(!!r.killed):0,full?-(x.breakTurn||99):0,full?-(r.killTurn||99):0,full?-(x.breakAction||99):0,full?-(r.remaining||0):x.largestUnbroken||0,x.totalBroken||0,full?-(r.spent||[]).reduce((n,v)=>n+v,0):0,full?x.largestUnbroken||0:-(r.remaining||0)];};const x=score(a),y=score(b);for(let i=0;i<x.length;i++)if(x[i]!==y[i])return y[i]-x[i];return 0;}
 root.CombatRules={sources,skills,skill,resolve,roles,articleRoles,template,assignments,speedCheck,shieldHit,breakPriority,advance,cost,simulate,script};
if(typeof module!=='undefined')module.exports=root.CombatRules;
})(typeof window==='undefined'?globalThis:window);

