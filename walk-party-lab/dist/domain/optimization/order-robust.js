'use strict';
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x)),permutations=a=>a.length?a.flatMap((x,i)=>permutations(a.filter((_,j)=>j!==i)).map(p=>[x,...p])):[[]],orders=permutations([0,1,2,3]);
// Independent continuous speed intervals conservatively include ties and both
// tie orders. Ratio is the user's model, not a measured game distribution.
function possible(order,speeds,ratio){let next=0;for(let i=order.length-1;i>=0;i--){const actor=order[i];next=Math.max(next,speeds[actor]);if(next>speeds[actor]*ratio)return false;}return true;}
function speeds(builds,states){return states.map((s,i)=>Math.floor(builds[i].stats.speed*(1+.2*s.speedStages+(s.worldSpeed||0)/100)));}
function verify(seed,master,profile,settings,evaluate,budget=576){
 const turns=settings.turns,parts=SupportLoadouts25.chunks(seed.config.actions),rows=Array.from({length:turns},(_,i)=>parts.filter(c=>c[0].turn===i+1));
 if(rows.some(r=>r.length!==4||new Set(r.map(c=>c[0].actor)).size!==4))return {complete:false,allKilled:false,checked:0,reason:'通常行動4人分を含む手順が必要です'};
 const firstSpeeds=speeds(seed.builds,seed.turnStarts[0].states),firstOrders=orders.filter(o=>possible(o,firstSpeeds,settings.ratio));let checked=0,total=0,failures=0,resourceFailures=0,maxKillTurn=0,maxKillAction=0,worst=null,best=null,complete=true;
 let allEnemyFirst=true,allSurvivalKnown=true,allSurvived=true,minHP=null,minMP=null,unknownCases=0;
 const minimum=(a,b)=>b?.length===4?b.map((v,i)=>a?Math.min(a[i],v):v):null;
 for(const first of firstOrders){
  let seconds=[null];if(turns>1){try{const preview=SequenceEngine.simulate({...seed.config,actions:[...first.map(i=>rows[0].find(c=>c[0].actor===i)),...rows[1]].flat()},master,profile),state=preview.turnStarts.find(t=>t.turn===2);if(!state)throw Error('ターン状態がありません');const secondSpeeds=speeds(preview.builds,state.states);seconds=orders.filter(o=>possible(o,secondSpeeds,settings.ratio));}catch{return {complete:false,allKilled:false,checked,reason:'速度状態の検証に失敗しました'};}}
  for(const second of seconds){total++;if(checked>=budget){complete=false;continue;}const config=clone(seed.config);config.actions=[...first.map(i=>rows[0].find(c=>c[0].actor===i)),...(second?second.map(i=>rows[1].find(c=>c[0].actor===i)):[])].flat();checked++;let r;try{r=evaluate(config);}catch{r=null;}
   if(!r){unknownCases++;allEnemyFirst=false;allSurvivalKnown=false;allSurvived=false;}
   else{allEnemyFirst=allEnemyFirst&&r.enemyFirst===true;allSurvivalKnown=allSurvivalKnown&&r.survivalKnown===true;allSurvived=allSurvived&&r.survivalKnown===true&&r.hp?.length===4&&r.hp.every(v=>v>0);minHP=minimum(minHP,r.hp);minMP=minimum(minMP,r.mp);}
   if(!r?.resourceOK){failures++;resourceFailures++;continue;}if(!r.killed)failures++;else{maxKillTurn=Math.max(maxKillTurn,r.killTurn||0);maxKillAction=Math.max(maxKillAction,r.killAction||0);}if(!worst||r.damage<worst.damage)worst=r;if(!best||r.damage>best.damage)best=r;
  }
 }
 const exhaustive=complete&&checked>0,allKilled=exhaustive&&failures===0;
 return {complete,allKilled,checked,total,failures,resourceFailures,maxKillTurn,maxKillAction,minDamage:resourceFailures?null:worst?.damage??null,maxDamage:best?.damage??null,worst,best,ratio:settings.ratio,allEnemyFirst:exhaustive&&allEnemyFirst,allSurvivalKnown:exhaustive&&allSurvivalKnown,allSurvived:exhaustive&&allSurvived,minHP:unknownCases?null:minHP,minMP:unknownCases?null:minMP,unknownCases,modelConditionsMet:allKilled&&allEnemyFirst&&allSurvived&&!seed.config.enemy.specialMechanics&&!seed.config.enemy.firepowerOnly};
}
function summary(report){const {worst,best,...info}=report;return info;}
function focus(result,dependencies,settings){const checks=dependencies.map(d=>{const state=result.turnStarts.find(t=>t.turn===d.turn),s=speeds(result.builds,state.states);return {...d,certain:s[d.first]>s[d.second]*settings.ratio};});return {...result,orderChecks:checks,orderOK:checks.every(x=>x.certain)};}
function variants(seed,pools,master,profile,settings){const out=[clone(seed.config)],seen=new Set([JSON.stringify(seed.config.actors)]),actors=seed.config.actors;
 const support=new Set(seed.config.actions.filter(a=>['attackBuff','rondo'].includes(Catalog9.skills.find(k=>k.id===a.skill)?.kind)).map(a=>a.actor));
 for(const supportActor of support)for(let attackActor=0;attackActor<4;attackActor++)if(attackActor!==supportActor&&!support.has(attackActor)){
  const originalSupport=actors[supportActor],originalAttack=actors[attackActor],supportRows=(pools[originalAttack.member]||[]).filter(r=>r.actor.weapon===originalSupport.weapon&&r.supportKind==='rondo');
  for(const supportRow of supportRows){const jobs=[];for(const job of master.jobs){const level=profile.characters[originalSupport.member]?.levels[job.id]||0;if(!level)continue;const a={...clone(originalAttack),member:originalSupport.member,job:job.id,actualAttack:null,actualMagic:null,pathUnlocked:!!settings.allowPaths&&level>=30,rootUnlocked:!!settings.allowPaths&&level>=30&&job.id==='job-8',encoreUnlocked:!!settings.allowPaths&&level>=30&&job.id==='job-2',majinCritical20:level>=20?settings.majinCriticalPaths[originalSupport.member].lv20:0,majinCritical40:level>=40?settings.majinCriticalPaths[originalSupport.member].lv40:0,majinPathCritical:false};a.favored=job.favoredTypes?.includes(Catalog9.weapons.find(w=>w.id===a.weapon)?.type)||false;try{const b=SequenceEngine.build(a,master,profile,settings);jobs.push({actor:a,score:b.stats.attack});}catch{}}
   for(const candidate of jobs.sort((a,b)=>b.score-a.score).slice(0,2)){const q=clone(seed.config);q.actors[supportActor]=clone(supportRow.actor);q.actors[attackActor]=candidate.actor;
    let usable=true;q.actions=q.actions.map(action=>{const available=SequenceEngine.available(q.actors[action.actor]);if(available.some(k=>k.id===action.skill))return action;const old=Catalog9.skills.find(k=>k.id===action.skill);if(old?.eradicate&&available.some(k=>k.id==='fullslash'))return {...action,skill:'fullslash'};usable=false;return action;});
    if(!usable||!SupportLoadouts25.fit(q,[supportActor,attackActor],master,profile))continue;const key=JSON.stringify(q.actors);if(!seen.has(key)){seen.add(key);out.push(q);}
   }
  }
 }
 return out.slice(0,16);
}
function search(seeds,pools,master,profile,settings,evaluate,budget=1536){let calls=0;const verified=[],reports=[];
 const run=config=>{if(calls>=budget)return null;calls++;try{return evaluate(config);}catch{return null;}};
 for(const seed of seeds)for(const config of variants(seed,pools,master,profile,settings)){
  if(calls>=budget)return {calls,verified,reports};let r=run(config);if(!r?.resourceOK)continue;
  const dependencies=config.actions.filter(a=>a.turn===1&&Catalog9.skills.find(k=>k.id===a.skill)?.kind==='attackBuff'&&Number.isInteger(a.target)&&a.actor!==a.target).map(a=>({turn:1,first:a.actor,second:a.target}));
  if(dependencies.length&&calls<budget){const focused=focus(r,dependencies,settings),tuned=SpeedTuner26.tune(focused,master,profile,settings,q=>{const rr=run(q);return rr?.resourceOK?focus(rr,dependencies,settings):rr;},Math.min(144,budget-calls));r=run(tuned.result.config)||r;}
  const report=verify(r,master,profile,settings,run,Math.min(576,budget-calls));const info=summary(report);reports.push(info);
  if(report.complete){r.orderRobust=info;if(report.worst){report.worst.orderRobust=info;if(report.allKilled){verified.push(report.worst);return {calls,verified,reports};}}}
 }
 return {calls,verified,reports};
}
root.OrderRobust27={possible,verify,orders,speeds,variants,focus,search,summary};
})(typeof window==='undefined'?globalThis:window);
