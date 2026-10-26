'use strict';
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x)),skill=id=>Catalog9.skills.find(k=>k.id===id);
// A target is an attack-time state, never a free buff granted to an actor.
// Every probe includes its providers and is evaluated by the normal battle model.
function search(config,settings,evaluate,budget=192){
 let calls=0,probes=0,verified=0;const seen=new Map(),target=settings.objective==='damage'?null:settings.objective==='break'?Math.round((settings.shieldMaxHP??2400000)*.5):settings.hp,deadline=settings._deadline||Infinity;
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
 for(const base of variants){const jobs=[base];for(let actor=0;actor<4;actor++)if(actor!==lead){const changed=RoleAssignment38.changeJob(base,actor,'job-5',master,profile,settings);if(changed&&SequenceEngine.available(changed.actors[actor]).some(k=>k.kind==='skillBuff'))jobs.push(changed);}
  for(const q of jobs){const available=q.actors.map(a=>SequenceEngine.available(a)),prep=available[lead].find(k=>k.kind==='charge'||k.kind==='zoneCharge'),support=[0,1,2,3].filter(i=>i!==lead),rondo=support.find(i=>available[i].some(k=>k.kind==='rondo')),encore=support.filter(i=>available[i].some(k=>k.kind==='encore'));
   const orders=[support.concat(lead)];if(rondo!=null)orders.push(support.filter(i=>i!==rondo).concat(rondo,lead));for(const e of encore)orders.push([e,...support.filter(i=>i!==e&&i!==rondo),...(rondo==null?[]:[rondo]),lead]);
   for(const order of orders.map(order=>[...new Set(order)]))for(const charge of prep?[false,true]:[false])for(const timing of [1,settings.turns]){
    if(calls>=budget||Date.now()>=(settings._deadline||Infinity))return {calls,valid};const actions=[];
    for(let turn=1;turn<=settings.turns;turn++)for(const actor of order){const row=available[actor],add=(id,target=lead)=>actions.push({actor,turn,skill:id,target});if(actor===lead){add(turn>1&&skill(attack)?.eradicate?'fullslash':attack);continue;}
     const e=row.find(k=>k.kind==='encore'),r=row.find(k=>k.kind==='rondo'),buff=row.find(k=>k.kind==='skillBuff');
     if(e){add(e.id);actions.push({actor:lead,turn,skill:charge?prep.id:skill(attack)?.eradicate?'fullslash':attack,target:lead});}
     else if(r)add(r.id);else if(buff&&turn===timing)add(buff.id);else {const original=config.actions.find(a=>a.actor===actor&&(a.turn||1)===turn);add(original&&row.some(k=>k.id===original.skill)?original.skill:'wait',original?.target??actor);}
    }
    const cfg={...q,actions},key=JSON.stringify([cfg.actors,actions]);if(seen.has(key))continue;seen.add(key);calls++;try{const r=evaluate(cfg);if(r?.resourceOK)valid++;}catch{/* Inventory, cost, unavailable skill and MP checks still apply. */}
   }
  }
 }
 return {calls,valid};
}
root.DamageGoalSearch={search,repair};
})(typeof window==='undefined'?globalThis:window);



