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
// Compare speed-item distribution and spare owned gear; retain roles and actions.
function gearCandidates(seed,master,profile,settings,limit=256){
 const end=settings._deadline||Infinity,out=[],seen=new Set(),required=seed.config.actors.map((_,actor)=>new Set(seed.config.actions.filter(a=>a.actor===actor).flatMap(a=>[a.skill,a.aiSkill].filter(Boolean)))),lead=seed.builds.map((_,actor)=>seed.steps.filter(s=>!s.enemy&&s.actor===actor).reduce((n,s)=>n+(s.damage?.min||0),0)).reduce((best,n,i,all)=>n>all[best]?i:best,0),providers=[...new Set(seed.config.actions.filter(a=>Catalog9.skills.find(k=>k.id===a.skill)?.kind==='rondo').map(a=>a.actor))];let checks=0;
 if(seed.config.actors.some(a=>a.actualAttack!=null||a.actualMagic!=null))return {candidates:out,checks};
 let spare=[];if(settings.orderRangeUnused!==false){try{const used=PartyBattle.inventory(seed.config,master,profile).used,stock=new Map(profile.inventory.map(r=>[r.id,r.count]));
  const hearts=Catalog9.hearts.filter(h=>h.stats?.speed>0).map(h=>({id:h.id,field:'hearts',speed:h.stats.speed,item:master.items.find(i=>i.slot==='heart'&&(i.id===h.id||i.name===h.name))}));
  const armors=master.items.filter(i=>i.verifiedModel&&i.stats?.speed>0&&GearOptimizer.slots.includes(i.slot)).map(i=>({id:i.id,field:'armors',speed:i.stats.speed,item:i}));
  spare=[...hearts,...armors].filter(row=>row.item&&(stock.get(row.item.id)||0)>(used[row.item.id]||0)).sort((a,b)=>b.speed-a.speed||a.id.localeCompare(b.id));
 }catch{return {candidates:out,checks};}}
 const spareReserve=spare.length?Math.min(64,Math.floor(limit/4)):0,transferLimit=limit-spareReserve;

 const consider=config=>{if(checks>=limit||Date.now()>=end)return;checks++;const key=JSON.stringify(config.actors);if(seen.has(key))return;seen.add(key);
  try{if(PartyBattle.inventory(config,master,profile).issues.length)return;for(let actor=0;actor<4;actor++){const available=new Set(SequenceEngine.available(config.actors[actor]).map(k=>k.id));if([...required[actor]].some(id=>!available.has(id)))return;const b=SequenceEngine.build(config.actors[actor],master,profile,settings);if(b.stats.hp<settings.minHP||b.stats.speed<settings.minSpeed||settings.costLimit!=null&&b.cost>settings.costLimit)return;}
   const preview=SequenceEngine.simulate({...config,captureBuffs:false,actions:config.actors.map((_,actor)=>({actor,turn:1,skill:'wait'}))},master,profile);if(preview.domain.id!==seed.domain.id||(preview.worldColor??null)!==(seed.worldColor??null))return;const velocity=speeds(preview.builds,preview.turnStarts[0].states),possibleOrders=orders.filter(order=>possible(order,velocity,settings.ratio)),bad=possibleOrders.reduce((n,order)=>n+providers.filter(actor=>order[order.indexOf(actor)+1]!==lead).length,0);out.push({config,preview:{builds:preview.builds,turnStarts:preview.turnStarts},score:bad/Math.max(1,possibleOrders.length),orders:possibleOrders.length});
  }catch{/* Invalid cost, duplicate hearts or lost support effects are not candidates. */}
 };
 const donors=[lead,...[0,1,2,3].filter(i=>i!==lead)];for(const field of ['hearts','armors'])for(const donor of donors)for(let slot=0;slot<(field==='hearts'?4:8);slot++){
  if(checks>=transferLimit||Date.now()>=end)break;const id=seed.config.actors[donor][field]?.[slot],item=field==='hearts'?Catalog9.hearts.find(h=>h.id===id):master.items.find(i=>i.id===id);if(!id||!(item?.stats?.speed>0))continue;
  for(let receiver=0;receiver<4;receiver++)if(receiver!==donor)for(const target of field==='hearts'?[0,1,2,3]:[slot]){if(checks>=transferLimit||Date.now()>=end)break;const config=clone(seed.config);for(const actor of [donor,receiver])config.actors[actor][field]=Array.from({length:field==='hearts'?4:8},(_,i)=>config.actors[actor][field]?.[i]||'');const other=config.actors[receiver][field][target];if(other===id)continue;config.actors[donor][field][slot]=other;config.actors[receiver][field][target]=id;consider(config);}
 }

 const spareLimit=Math.min(limit,checks+spareReserve);for(const row of spare){if(checks>=spareLimit||Date.now()>=end)break;
  for(const actor of [0,1,2,3].filter(i=>i!==lead).concat(lead))for(const slot of row.field==='hearts'?[0,1,2,3]:GearOptimizer.slots.map((type,i)=>type===row.item.slot?i:-1).filter(i=>i>=0)){if(checks>=spareLimit||Date.now()>=end)break;if(seed.config.actors[actor][row.field]?.[slot]===row.id)continue;const config=clone(seed.config);config.actors[actor][row.field]=Array.from({length:row.field==='hearts'?4:8},(_,i)=>config.actors[actor][row.field]?.[i]||'');config.actors[actor][row.field][slot]=row.id;consider(config);}
 }
 return {candidates:out.sort((a,b)=>a.score-b.score||a.orders-b.orders),checks};
}
// Compare complete modeled order ranges, not one favorable action ordering.
function refineDamage(seed,baseline,master,profile,settings,evaluate,budget=32){
 const known=r=>r?.complete&&r.checked>0&&!r.resourceFailures&&!r.unknownCases&&Number.isFinite(r.minDamage)&&Number.isFinite(r.maxDamage),end=settings._deadline||Infinity;
 let calls=0,attempted=0,best=baseline,result=null;const seen=new Set();
 if(!known(baseline)||budget<1||Date.now()>=end)return {result,calls,attempted};
 const damage=seed.builds.map((_,actor)=>seed.steps.filter(st=>!st.enemy&&st.actor===actor).reduce((sum,st)=>sum+(st.damage?.min||0),0)),actors=[0,1,2,3].sort((a,b)=>damage[b]-damage[a]);
 for(const actor of actors){const available=SequenceEngine.available(seed.config.actors[actor]),extension=available.find(k=>k.kind==='overdrive');if(!extension||seed.config.actions.some(a=>a.actor===actor&&a.skill===extension.id))continue;
  const parts=SupportLoadouts25.chunks(seed.config.actions);
  for(let index=0;index<parts.length;index++){if(calls>=budget||Date.now()>=end)break;const first=parts[index][0],kind=Catalog9.skills.find(k=>k.id===first.skill)?.kind;if(first.actor!==actor||!['autoRelease','mageChant'].includes(kind))continue;
   const config=clone(seed.config),next=clone(parts);next[index].unshift({actor,turn:first.turn,skill:extension.id,target:actor});config.actions=next.flat();const key=JSON.stringify(config.actions);if(seen.has(key))continue;seen.add(key);attempted++;
   const count=verify({...seed,config},master,profile,settings,()=>null,0).total;if(!Number.isInteger(count)||count<1||count>budget-calls)continue;
   const report=verify({...seed,config},master,profile,settings,q=>{const r=evaluate(q);return r?.mpKnown===false?null:r;},budget-calls);calls+=report.checked;
   if(!known(report)||!report.worst||report.minDamage<best.minDamage||report.minDamage===best.minDamage&&report.maxDamage<=best.maxDamage)continue;
   best=report;result={...report.worst,orderResilient:true,orderDamageRange:summary(report)};
  }
 }
 let gearChecks=0,gearCalls=0;
 if(settings.orderRangeGear!==false&&calls<budget&&Date.now()<end){const parent=result||seed,candidates=gearCandidates(parent,master,profile,settings,128);gearChecks=candidates.checks;const pool=[...candidates.candidates];
  if(settings.orderRangePairedGear!==false)for(const row of candidates.candidates.slice(0,2)){if(gearChecks>=256||Date.now()>=end)break;const paired=gearCandidates({...parent,config:row.config,...row.preview},master,profile,settings,256-gearChecks);gearChecks+=paired.checks;pool.push(...paired.candidates);}
  const seenGear=new Set();for(const row of pool.sort((a,b)=>a.score-b.score||a.orders-b.orders)){if(calls>=budget||Date.now()>=end)break;const {config}=row,key=JSON.stringify(config.actors);if(seenGear.has(key))continue;seenGear.add(key);
   const count=verify({...parent,config,...row.preview},master,profile,settings,()=>null,0).total;if(!Number.isInteger(count)||count<1||count+1>budget-calls)continue;
   calls++;gearCalls++;let preview;try{preview=evaluate(config);}catch{continue;}if(!preview?.resourceOK||preview.mpKnown===false)continue;
   const report=verify(preview,master,profile,settings,q=>{const r=evaluate(q);return r?.mpKnown===false?null:r;},budget-calls);calls+=report.checked;gearCalls+=report.checked;
   if(!known(report)||!report.worst||report.minDamage<best.minDamage||report.minDamage===best.minDamage&&report.maxDamage<=best.maxDamage)continue;best=report;result={...report.worst,orderResilient:true,orderGearAdjusted:true,orderDamageRange:summary(report)};
  }
 }
 return {result,calls,attempted,gearChecks,gearCalls};
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
root.OrderRobust27={possible,verify,orders,speeds,variants,focus,search,summary,refineDamage,gearCandidates};
})(typeof window==='undefined'?globalThis:window);
