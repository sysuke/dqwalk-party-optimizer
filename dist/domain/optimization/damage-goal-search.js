'use strict';
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x)),skill=id=>Catalog9.skills.find(k=>k.id===id);
// A target is an attack-time state, never a free buff granted to an actor.
// Every probe includes its providers and is evaluated by the normal battle model.
function search(config,settings,evaluate,budget=192){
 let calls=0,probes=0,verified=0;const seen=new Map(),target=settings.objective==='damage'?null:settings.objective==='break'?PartyBattle.shieldThresholds(settings)[3]:settings.hp,deadline=settings._deadline||Infinity;
 const run=cfg=>{const key=JSON.stringify(cfg.actions);if(seen.has(key))return seen.get(key);if(calls>=budget||Date.now()>=deadline)return null;calls++;const r=evaluate(cfg);seen.set(key,r);return r;};
 const hit=(r,lead)=>Math.max(0,...(r?.steps||[]).filter(s=>s.actor===lead&&s.damage&&(settings.objective!=='break'||s.shieldHit&&s.shieldHit.totalBroken-s.shieldHit.broken===0)).map(s=>s.damage.min||0));
 const make=(lead,id,parts,order)=>{const actions=[];for(let turn=0;turn<settings.turns;turn++)for(const actor of order)actions.push(...parts[actor][turn]);return {...config,actions};};
 const baseline=(lead,id)=>config.actors.map((_,actor)=>Array.from({length:settings.turns},(_,t)=>[{actor,turn:t+1,skill:actor===lead?(t&&skill(id)?.eradicate?'fullslash':id):'wait',target:actor}]));
 // Compare resistance-adjusted damage, not raw attack/magic or skill percentage.
 const candidates=[],queues=config.actors.map(a=>SequenceEngine.available(a).filter(k=>k.kind==='attack'));
 for(let n=0;n<Math.max(...queues.map(q=>q.length));n++)for(let lead=0;lead<4;lead++){
  const k=queues[lead][n];if(!k||calls>=Math.min(24,Math.floor(budget/4)))continue;
  const parts=baseline(lead,k.id),r=run(make(lead,k.id,parts,[0,1,2,3]));probes++;if(r)candidates.push({lead,id:k.id,base:hit(r,lead),family:(k.type||'体技')+':'+(k.elements||[]).join('/'),parts});
 }
 candidates.sort((a,b)=>b.base-a.base);const selected=[],families=new Set();
 for(const row of candidates)if(!families.has(row.family)){families.add(row.family);selected.push(row);if(selected.length===2)break;}
 if(selected.length<2)for(const row of candidates)if(!selected.includes(row)){selected.push(row);if(selected.length===2)break;}
 for(let index=0;index<selected.length;index++){
  const candidate=selected[index],{lead,id}=candidate,limit=calls+Math.floor((budget-calls)/(selected.length-index));
  const attackByActor={[lead]:id},patterns=FocusSearch35.patterns(config,lead,{...settings,attackByActor}),order=[0,1,2,3].filter(i=>i!==lead).concat(lead),options=[];
  for(let actor=0;actor<4;actor++){
   const wait={parts:candidate.parts[actor],roles:[],ratio:1};if(actor===lead){options.push(patterns[actor].map(p=>({...p,ratio:1})));continue;}
   const rows=[wait];for(const p of patterns[actor].filter(p=>p.roles.length)){
    if(calls>=limit)break;const parts=clone(candidate.parts);parts[actor]=p.parts;const probeOrder=p.roles.includes('rondo')?order.filter(i=>i!==actor&&i!==lead).concat(actor,lead):order;
    const r=run(make(lead,id,parts,probeOrder));probes++;rows.push({...p,ratio:Math.max(1,hit(r,lead)/Math.max(1,candidate.base))});
   }options.push(rows);
  }
  let combinations=[{parts:[],roles:[],estimate:Math.max(1,candidate.base)}];for(const rows of options)combinations=combinations.flatMap(c=>rows.map(p=>({parts:[...c.parts,p.parts],roles:[...c.roles,...p.roles],estimate:c.estimate*p.ratio})));
  // Duplicate roles do not imply independently multiplying the same buff twice.
  combinations=combinations.filter(c=>c.roles.filter(r=>r==='preparation').length<=1).map(c=>({...c,estimate:c.estimate/Math.max(1,c.roles.length-new Set(c.roles).size+1)})).sort((a,b)=>{
   if(target!=null){const enoughA=a.estimate>=target,enoughB=b.estimate>=target;if(enoughA!==enoughB)return Number(enoughB)-Number(enoughA);if(enoughA&&a.roles.length!==b.roles.length)return a.roles.length-b.roles.length;}
   return b.estimate-a.estimate;
  });
  // Keep action-count diversity: a cheap sufficient state and a fully stacked
  // state must both reach verification under a bounded search.
  const buckets=[[],[],[],[]];for(const c of combinations)buckets[Math.min(3,new Set(c.roles.filter(r=>r!=='preparation')).size)].push(c);
  const queue=[],queued=new Set(),push=c=>{if(c&&!queued.has(c)){queued.add(c);queue.push(c);}};
  // Spend half of the shortlist on predicted sufficient states, while reserving
  // complementary roles whose value only appears when combined.
  for(let n=0;n<Math.max(...buckets.map(b=>b.length));n++){if(target!=null)push(combinations[n]);for(const b of [buckets[3],buckets[2],buckets[1],buckets[0]])push(b[n]);}
  for(const combination of queue){if(calls>=limit||Date.now()>=deadline)break;const orders=[order];for(let actor=0;actor<4;actor++)if(combination.parts[actor].flat().some(a=>skill(a.skill)?.kind==='rondo'))orders.push(order.filter(i=>i!==actor&&i!==lead).concat(actor,lead));
   for(const ord of orders){if(calls>=limit)break;const complete=make(lead,id,combination.parts,ord),variants=[];
    if(target!=null){const one=clone(complete),attacks=one.actions.filter(a=>a.actor===lead&&skill(a.skill)?.kind==='attack'),last=attacks.at(-1);one.actions=one.actions.map(a=>a.actor===lead&&skill(a.skill)?.kind==='attack'&&a!==last?{...a,skill:'wait'}:a===last&&skill(id)?.eradicate?{...a,skill:id}:a);variants.push(one);}
    variants.push(complete);for(const cfg of variants){if(calls>=limit)break;const r=run(cfg);if(!r||!r.resourceOK)continue;verified++;
    const attacks=r.steps.filter(s=>s.actor===lead&&s.damage),largest=attacks.filter(s=>settings.objective!=='break'||s.shieldHit&&s.shieldHit.totalBroken-s.shieldHit.broken===0).reduce((best,s)=>(s.damage.min||0)>(best?.damage.min||-1)?s:best,null),lower=largest?.damage.min||0;
    r.damageGoal={target,lead,skill:id,singleLower:lower,shortfall:target==null?null:Math.max(0,target-lower),mode:target==null?'maximum':lower>=target?'single':'multiple',attackCount:attacks.length,buffs:clone(largest?.before||{}),verified:true};
    }
   }
  }
 }
 return {calls,probes,verified,target,scope:'耐性別攻撃候補→攻撃時状態→実行可能な補助手順。単発と複数攻撃を同じ戦闘モデルで比較'};
}
// Repair a finalist as a complete role/gear/action combination. Changing a job
// while preserving 'wait' cannot discover its newly available support skill.
function repair(seed,master,profile,settings,evaluate,budget=192){
 let calls=0,valid=0;const seen=new Set(),config=seed.config,damage=config.actors.map((_,i)=>seed.steps.filter(s=>s.actor===i&&s.damage).reduce((n,s)=>n+s.damage.min,0)),lead=damage.indexOf(Math.max(...damage));
 const main=config.actors[lead],attack=seed.steps.find(s=>s.actor===lead&&skill(s.skill)?.eradicate)?.skill||seed.steps.filter(s=>s.actor===lead&&s.damage).at(-1)?.skill;if(!attack)return {calls,valid};
 const variants=[clone(config)],stock=new Map(profile.inventory.map(x=>[x.id,x.count]));
 if(main.actualAttack==null&&main.actualMagic==null)for(const h of Catalog9.hearts.filter(h=>(h.skills||[]).some(id=>skill(id)?.kind==='charge')&&(stock.get(master.items.find(i=>i.slot==='heart'&&(i.id===h.id||i.name===h.name))?.id)||0)>0))for(let slot=0;slot<4;slot++){const q=clone(config);q.actors[lead].hearts[slot]=h.id;variants.push(q);}
 for(const base of variants){const jobs=[base];for(let actor=0;actor<4;actor++)if(actor!==lead){const changed=RoleAssignment38.changeJob(base,actor,'job-5',master,profile,settings);if(changed&&SequenceEngine.available(changed.actors[actor]).some(k=>k.kind==='skillBuff')){jobs.push(changed);if(settings.objective==='break')for(let backup=0;backup<4;backup++)if(backup!==lead&&backup!==actor&&damage[backup]===0&&!SequenceEngine.available(base.actors[backup]).some(k=>k.kind==='rondo')){const paired=RoleAssignment38.changeJob(changed,backup,'job-2',master,profile,settings);if(paired)jobs.push(paired);}}}
  for(const q of jobs){const available=q.actors.map(a=>SequenceEngine.available(a)),prep=available[lead].find(k=>k.kind==='charge'||k.kind==='zoneCharge'),support=[0,1,2,3].filter(i=>i!==lead),rondo=support.find(i=>available[i].some(k=>k.kind==='rondo')),encore=support.filter(i=>available[i].some(k=>k.kind==='encore'));
   const orders=[support.concat(lead)];if(rondo!=null)orders.push(support.filter(i=>i!==rondo).concat(rondo,lead));for(const e of encore)orders.push([e,...support.filter(i=>i!==e&&i!==rondo),...(rondo==null?[]:[rondo]),lead]);
   for(const order of orders.map(order=>[...new Set(order)]))for(const charge of prep?[false,true]:[false])for(const timing of [1,settings.turns])for(const defer of settings.objective==='break'&&settings.turns===2?[false,true]:[false]){
    if(calls>=budget||Date.now()>=(settings._deadline||Infinity))return {calls,valid};const actions=[];
    for(let turn=1;turn<=settings.turns;turn++)for(const actor of defer&&turn===2?order.filter(i=>!encore.includes(i)).concat(order.filter(i=>encore.includes(i))):order){const row=available[actor],add=(id,target=lead)=>actions.push({actor,turn,skill:id,target});if(actor===lead){add(defer?(turn===1?prep?.id||'wait':attack):turn>1&&skill(attack)?.eradicate?'fullslash':attack);continue;}
     const e=row.find(k=>k.kind==='encore'),r=row.find(k=>k.kind==='rondo'),buff=row.find(k=>k.kind==='skillBuff');
     if(e){if(defer&&turn===1)add('wait');else{add(e.id);actions.push({actor:lead,turn,skill:!defer&&charge?prep.id:skill(attack)?.eradicate?'fullslash':attack,target:lead});}}
     else if(r)add(r.id);else if(buff&&turn===timing)add(buff.id);else {const original=config.actions.find(a=>a.actor===actor&&(a.turn||1)===turn);add(original&&row.some(k=>k.id===original.skill)?original.skill:'wait',original?.target??actor);}
    }
    const cfg={...q,actions},key=JSON.stringify([cfg.actors,actions]);if(seen.has(key))continue;seen.add(key);calls++;try{const r=evaluate(cfg);if(r?.resourceOK)valid++;}catch{/* Inventory, cost, unavailable skill and MP checks still apply. */}
   }
  }
 }
 return {calls,valid};
}
function complete(seeds,pools,master,profile,settings,evaluate,compare,budget=192){
 let calls=0,valid=0,improvements=0;const seen=new Set(),stock=new Map(profile.inventory.map(x=>[x.id,x.count])),external=new Set(['attackBuff','adaptiveBuff','skillBuff','jobPrayer','rondo','extendBuff','domain']),support=k=>external.has(k.kind)||k.nextBuff==='phoenix';
 let best=seeds[0];if(!best)return {calls,valid,improvements};const original=best;
 const attempt=cfg=>{if(calls>=budget||Date.now()>=(settings._deadline||Infinity))return null;const key=JSON.stringify([cfg.actors,cfg.actions]);if(seen.has(key))return null;seen.add(key);calls++;try{const r=evaluate(cfg);if(r?.resourceOK){valid++;if(compare(r,best)<0){best=r;improvements++;}return r;}}catch{}return null;};
 const waits=r=>r.steps.filter(s=>!s.enemy&&!s.extra&&s.skill==='wait'),leadOf=r=>{const d=r.config.actors.map((_,i)=>r.steps.filter(s=>s.actor===i&&s.damage).reduce((n,s)=>n+s.damage.min,0));return d.indexOf(Math.max(...d));};
 const replaceable=r=>{const lead=leadOf(r),main=r.steps.filter(s=>s.actor===lead&&s.damage).reduce((n,s)=>n+s.damage.min,0);return r.steps.filter(s=>!s.enemy&&!s.extra&&(s.skill==='wait'||s.actor!==lead&&skill(s.skill)?.kind==='attack'&&!skill(s.skill)?.nextBuff&&!skill(s.skill)?.eradicate&&!s.shieldHit?.broken&&(s.damage?.min||0)<main*.15));};
 const insert=(cfg,parts,from,to,after=false)=>{const moved=parts.splice(from,1)[0],anchor=parts.indexOf(to);parts.splice(anchor+(after?1:0),0,moved);return {...cfg,actions:parts.flat()};};
 // Move a one-use buff after an earlier preparation action. Keep neutral setup
 // variants so the newly freed later turn can be used in the next phase.
 const setup=[...seeds],setupLimit=Math.floor(budget*.2);
 for(const seed of seeds)for(const idle of waits(seed))for(const action of seed.config.actions.filter(a=>a.actor===idle.actor&&a.turn>idle.turn&&skill(a.skill)?.maxUses===1&&external.has(skill(a.skill)?.kind))){
  if(calls>=setupLimit)break;const parts=SupportLoadouts25.chunks(seed.config.actions),i=parts.findIndex(c=>c[0].actor===idle.actor&&c[0].turn===idle.turn),later=parts.find(c=>c[0].actor===action.actor&&c[0].turn===action.turn),lead=leadOf(seed),anchor=parts.find(c=>c[0].actor===lead&&c[0].turn===idle.turn);if(i<0||!later||!anchor||idle.actor===lead)continue;
  parts[i]=[{...action,turn:idle.turn}];later.splice(0,later.length,{actor:action.actor,turn:action.turn,skill:'wait',target:action.actor});const r=attempt(insert(seed.config,parts,i,anchor,true));if(r&&compare(r,seed)<=0)setup.unshift(r);
 }
 const ready=setup.sort(compare).slice(0,4),attackLimit=Math.floor(budget*.45);
 // A weak attack is only considered after the four-shield burst, never used to
 // chip a shield prematurely merely to replace a wait.
 for(const seed of ready)for(const idle of waits(seed)){
  if(calls>=attackLimit)break;const hit=seed.steps.find(s=>s.shieldHit?.broken===4);if(settings.objective==='break'&&(!hit||idle.turn!==hit.turn))continue;
  const available=SequenceEngine.available(seed.config.actors[idle.actor]).filter(k=>k.kind==='attack'&&!k.eradicate).sort((a,b)=>(b.multipliers?.[0]||0)*(b.hits||1)-(a.multipliers?.[0]||0)*(a.hits||1)).slice(0,3);
  for(const k of available){if(calls>=attackLimit)break;const parts=SupportLoadouts25.chunks(seed.config.actions),i=parts.findIndex(c=>c[0].actor===idle.actor&&c[0].turn===idle.turn);if(i<0)continue;parts[i]=[{actor:idle.actor,turn:idle.turn,skill:k.id,target:idle.actor}];const anchor=hit&&parts.find(c=>c.some(a=>a.actor===hit.actor&&a.turn===hit.turn&&a.skill===hit.skill));attempt(anchor?insert(seed.config,parts,i,anchor,true):{...seed.config,actions:parts.flat()});}
 }
 // Complete remaining waits using actual owned skill providers. Search hearts
 // and shields independently of their raw damage score; also preserve the
 // current opening equipment while moving a support heart between supports.
 const parents=[best,...ready].filter((r,i,a)=>a.findIndex(x=>JSON.stringify(x.config)===JSON.stringify(r.config))===i).slice(0,3);
 for(const seed of parents){const lead=leadOf(seed);for(const idle of replaceable(seed).sort((a,b)=>(b.skill==='wait')-(a.skill==='wait'))){
  if(calls>=budget)break;const old=seed.config.actors[idle.actor],providers=[clone(old)],add=a=>providers.push(a),owned=(id,slot)=>stock.get(master.items.find(i=>i.slot===slot&&(i.id===id||i.name===Catalog9.hearts.find(h=>h.id===id)?.name))?.id)||0;
  if(old.actualAttack==null&&old.actualMagic==null){
   for(const h of Catalog9.hearts.filter(h=>owned(h.id,'heart')&&(h.skills||[]).some(id=>support(skill(id)||{}))))for(let slot=0;slot<4;slot++){const a=clone(old);a.hearts=Array.from({length:4},(_,i)=>a.hearts?.[i]||'');a.hearts[slot]=h.id;add(a);}
   for(const row of pools[old.member]||[])if(SequenceEngine.available(row.actor).some(support))add(clone(row.actor));
   for(const w of Catalog9.weapons.filter(w=>w.skills.some(id=>support(skill(id)||{}))))for(const lb of [0,4])if(stock.get(master.items.find(i=>i.slot==='weapon'&&i.name===w.name&&(i.limitBreak||0)===lb)?.id)>0){const a={...clone(old),weapon:w.id,limitBreak:lb,left:'',inherit:'',inheritLevel:0,favored:!!master.jobs.find(j=>j.id===old.job)?.favoredTypes?.includes(w.type)};add(a);}
   for(const g of master.items.filter(g=>g.slot==='shield'&&(stock.get(g.id)||0)>0&&(g.skills||[]).some(id=>skill(id)?.kind==='overdrive'))){if(old.left)continue;const a=clone(old);const index=a.armors.findIndex(id=>master.items.find(g=>g.id===id)?.slot==='shield');if(index>=0)a.armors[index]=g.id;else a.armors.push(g.id);add(a);}
  }
  const unique=[...new Map(providers.map(a=>[JSON.stringify(a),a])).values()];
  for(const actor of unique){if(calls>=budget)break;const cfg=clone(seed.config);cfg.actors[idle.actor]=actor;const changed=[0,1,2,3].filter(i=>i!==lead&&i!==idle.actor&&cfg.actors[i].actualAttack==null&&cfg.actors[i].actualMagic==null).concat(idle.actor);try{if(!SupportLoadouts25.fit(cfg,changed,master,profile))continue;}catch{continue;}
   if(cfg.actors.some((a,i)=>cfg.actions.some(action=>action.actor===i&&!SequenceEngine.available(a).some(k=>k.id===action.skill))))continue;
   const targets=[...new Set([lead,...seed.steps.filter(s=>s.damage&&(s.turn>idle.turn||s.order>idle.order)).map(s=>s.actor)])],skills=SequenceEngine.available(actor).filter(k=>support(k)||k.kind==='overdrive');
   for(const k of skills)for(const target of external.has(k.kind)&&!['extendBuff','domain','rondo'].includes(k.kind)?targets:[lead]){
    if(calls>=budget)break;if(k.kind==='jobPrayer'&&cfg.actors[target].job!=='job-1')continue;
    const parts=SupportLoadouts25.chunks(cfg.actions),i=parts.findIndex(c=>c[0].actor===idle.actor&&c[0].turn===idle.turn);if(i<0)continue;
    if(k.maxUses===1)for(const c of parts)if(c[0].actor===idle.actor&&c[0].skill===k.id)c.splice(0,c.length,{actor:idle.actor,turn:c[0].turn,skill:'wait',target:idle.actor});
    const options=k.kind==='overdrive'?skills.filter(x=>support(x)&&x.kind!=='overdrive'):[k];
    for(const follow of options){const p=clone(parts);if(k.kind==='overdrive'&&follow.maxUses===1)for(const c of p)if(c[0].actor===idle.actor&&c[0].skill===follow.id)c.splice(0,c.length,{actor:idle.actor,turn:c[0].turn,skill:'wait',target:idle.actor});p[i]=[{actor:idle.actor,turn:idle.turn,skill:k.id,target}];if(k.kind==='overdrive')p[i].push({actor:idle.actor,turn:idle.turn,skill:follow.id,target});attempt({...cfg,actions:p.flat()});
     let anchor=p.find(c=>c[0].actor===target&&c[0].turn===idle.turn);if(anchor&&anchor!==p[i]){const nextBuff=k.kind==='rondo'||k.nextBuff==='phoenix'||follow.kind==='rondo'||follow.nextBuff==='phoenix';if(!nextBuff){let index=p.indexOf(anchor);while(index>0&&p[index-1][0].turn===idle.turn&&p[index-1]!==p[i]&&(skill(p[index-1].at(-1).skill)?.kind==='rondo'||skill(p[index-1].at(-1).skill)?.nextBuff==='phoenix')){anchor=p[index-1];index--;}}if(!nextBuff&&["charge","zoneCharge"].includes(skill(anchor[0].skill)?.kind)){const extra=clone(p);attempt(insert(cfg,extra,i,extra[p.indexOf(anchor)],true));}attempt(insert(cfg,p,i,anchor));}
     if(calls>=budget)break;
    }
   }
  }
 }}
 best.supportCompletion={calls,beforeWaits:waits(original).length,afterWaits:waits(best).length,beforeWeak:replaceable(original).length-waits(original).length,afterWeak:replaceable(best).length-waits(best).length};
 return {calls,valid,improvements,beforeDamage:original.damage,afterDamage:best.damage,beforeWaits:waits(original).length,afterWaits:waits(best).length};
}
root.DamageGoalSearch={search,repair,complete};
})(typeof window==='undefined'?globalThis:window);





