'use strict';
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x));
function chunks(actions){const out=[];let pending=null;for(const a of actions){if(pending!==null){if(a.actor!==pending)throw Error('追加行動の対象と手順が一致しません');out.at(-1).push(clone(a));}else out.push([clone(a)]);const kind=Catalog9.skills.find(k=>k.id===a.skill)?.kind;pending=kind==='encore'?a.target:['rainbow','overdrive','mageChant'].includes(kind)?a.actor:null;}return out;}
// Free only oversubscribed gear on the replacement supports. Never borrow
// equipment from the retained attackers or invent another owned copy.
function fit(config,changed,master,profile,protectedItems={}){
 const stock=new Map(profile.inventory.map(x=>[x.id,x.count])),used=PartyBattle.inventory(config,master,profile).used;
 for(const actor of changed)for(const field of ['hearts','armors'])for(let i=0;i<(config.actors[actor][field]||[]).length;i++){
  const id=config.actors[actor][field][i];if(!id||protectedItems[actor]?.includes(id))continue;
  const heart=field==='hearts'&&Catalog9.hearts.find(h=>h.id===id),item=field==='hearts'?master.items.find(x=>x.slot==='heart'&&(x.id===id||x.name===heart?.name)):{id};
  if(item&&used[item.id]>(stock.get(item.id)||0)){config.actors[actor][field][i]='';used[item.id]--;}
 }
 return !PartyBattle.inventory(config,master,profile).issues.length;
}
// Rebuild a small inventory-feasible beam only when the original beam is empty.
// The score is a pruning estimate; every surviving layout is simulated normally.
function feasibleTeams(pools,master,profile,settings){
 let teams=[{rows:[],used:{},proxy:0}],checks=0;
 for(const pool of pools){const next=[];
  for(const team of teams)for(const row of pool.slice(0,64)){
   checks++;const actors=[...team.rows.map(r=>clone(r.actor)),clone(row.actor)],index=actors.length-1,config={actors};
   try{if(!fit(config,[index],master,profile))continue;const b=SequenceEngine.build(actors[index],master,profile,settings);
    if(b.stats.hp<settings.minHP||b.stats.speed<settings.minSpeed||settings.costLimit!=null&&b.cost>settings.costLimit)continue;
    const repaired={...row,actor:actors[index],stats:b.stats,cost:b.cost,attackScore:row.attackScore*Math.pow(b.stats.attack/Math.max(1,row.stats.attack),2)},rows=[...team.rows,repaired],best=Math.max(...rows.map(x=>x.attackScore)),proxy=rows.reduce((n,x)=>n+x.attackScore,0)+best*Math.min(2,rows.reduce((n,x)=>n+x.supportPower,0))*.65;
    next.push({rows,used:PartyBattle.inventory(config,master,profile).used,proxy});
   }catch{/* Unusable weapon or remaining ability constraints. */}
  }
  teams=next.sort((a,b)=>b.proxy-a.proxy).slice(0,4);if(!teams.length)break;
 }
 return {teams,checks};
}
function search(seeds,pools,master,profile,settings,evaluate,budget=768){
 let calls=0,valid=0;const seen=new Set();
 for(const seed of seeds){
  const damage=seed.config.actors.map((_,i)=>seed.steps.filter(x=>x.actor===i).reduce((n,x)=>n+(x.damage?.min||0),0));
  const leads=[0,1,2,3].sort((a,b)=>damage[b]-damage[a]).slice(0,2);
  for(const lead of leads){
   const attack=seed.steps.filter(x=>x.actor===lead&&x.damage).at(-1)?.skill;
   if(!attack)continue;
   const mainHits=seed.steps.filter(s=>s.actor===lead&&s.damage),peakTurn=[...mainHits].sort((a,b)=>b.damage.min-a.damage.min)[0]?.turn||1,firstHitTurn=mainHits[0]?.turn||1;const extraAttack=Catalog9.skills.find(k=>k.id===attack)?.eradicate?'fullslash':attack;
   const candidates=[];
   for(let actor=0;actor<4;actor++)if(actor!==lead)for(const row of pools[seed.config.actors[actor].member]||[]){
    // Fortune benefits the party member immediately to its left.
    if(row.supportKind==='fortune'&&(lead+1)%4!==actor)continue;
    candidates.push({actor,row});
   }
   const sets=candidates.map(x=>[x]);
   for(let a=0;a<candidates.length;a++)for(let b=a+1;b<candidates.length;b++)if(candidates[a].actor!==candidates[b].actor&&candidates[a].row.supportKind!==candidates[b].row.supportKind)sets.push([candidates[a],candidates[b]]);
   // Reserve complete three-support setups before single swaps consume the
   // budget. Keep one loadout per actor/role here; ordinary swaps retain both.
   const roles=[...new Map(candidates.map(x=>[x.actor+':'+x.row.supportKind,x])).values()],triples=[];
   for(let a=0;a<roles.length;a++)for(let b=a+1;b<roles.length;b++)for(let c=b+1;c<roles.length;c++){
    const set=[roles[a],roles[b],roles[c]],kinds=new Set(set.map(x=>x.row.supportKind));
    if(new Set(set.map(x=>x.actor)).size===3&&kinds.size===3)triples.push(set);
   }
   const priority=set=>set.reduce((n,x)=>n+Number(['encore','adaptiveBuff','rondo'].includes(x.row.supportKind)),0);triples.sort((a,b)=>priority(b)-priority(a));
   const singles=sets.filter(x=>x.length===1),pairs=sets.filter(x=>x.length===2);sets.length=0;
   for(let i=0;i<Math.max(triples.length,pairs.length,singles.length);i++)for(const bucket of [triples,pairs,singles])if(bucket[i])sets.push(bucket[i]);
   for(const set of sets){
    if(calls>=budget)return {calls,valid};
    const base=clone(seed.config),changed=set.map(x=>x.actor);for(const {actor,row}of set)base.actors[actor]=clone(row.actor);
    try{
     if(!fit(base,changed,master,profile))continue;
     const initial=SequenceEngine.simulate({...base,actions:base.actors.map((_,actor)=>({actor,turn:1,skill:'wait'}))},master,profile);
     const order=states=>[0,1,2,3].sort((a,b)=>{const speed=i=>initial.builds[i].stats.speed*(1+.2*states[i].speedStages+(states[i].worldSpeed||0)/100);return speed(b)-speed(a)||a-b;});
     const prepares=SequenceEngine.available(base.actors[lead]).filter(k=>['charge','zoneCharge','spellCharge','absolutecrit','critBuff'].includes(k.kind));for(const preparation of [null,...(set.some(x=>x.row.supportKind==='encore')?prepares:[])])for(const encoreMode of settings.turns>2?['remaining','provider']:['provider'])for(const buffFirst of [false,true])for(const extensionTurns of set.some(x=>x.row.supportKind==='extendBuff')?[...new Map([[2,3],[3],[2],[settings.turns]].map(turns=>turns.filter(t=>t<=settings.turns)).filter(turns=>turns.length).map(turns=>[turns.join(','),turns])).values()]:[[]]){
      if(calls>=budget)return {calls,valid};
      let plan=chunks(seed.config.actions);
      for(const {actor,row}of set){const available=SequenceEngine.available(base.actors[actor]),buff=available.find(k=>k.kind==='attackBuff'),own=initial.builds[actor],opening=root.ResourceRules36?.opening(own,initial.turnStarts[0].states[actor]).max||0,encore=available.find(k=>k.kind==='encore'),providerLimit=encore?Math.floor(Math.max(0,own.stats.mp-opening)/PartyBattle.mpCost(encore.id,own.stats.mp).max):0,extraCost=seed.steps.filter(s=>s.actor===lead&&s.damage).at(-1)?.mpCost?.max||PartyBattle.mpCost(extraAttack,initial.builds[lead].stats.mp).max,prepCost=preparation?PartyBattle.mpCost(preparation.id,initial.builds[lead].stats.mp).max:0,margin=seed.mp?.[lead]??initial.builds[lead].stats.mp,encoreLimit=encoreMode==='remaining'?Math.min(providerLimit,(preparation&&margin>=prepCost?1:0)+Math.floor(Math.max(0,margin-prepCost)/Math.max(1,extraCost))):providerLimit;for(let turn=1;turn<=settings.turns;turn++){
       let part;if(row.supportKind==='encore'&&turn>encoreLimit)part=[{actor,turn,skill:'wait',target:actor}];else if(row.supportKind==='encore')part=[{actor,turn,skill:available.find(k=>k.kind==='encore').id,target:lead},{actor:lead,turn,skill:preparation&&turn===1?preparation.id:extraAttack,target:lead}];
       else if(row.supportKind==='skillBuff'||row.supportKind==='adaptiveBuff'){const k=available.find(k=>k.kind===row.supportKind);part=[{actor,turn,skill:turn===(row.supportKind==='skillBuff'?(buffFirst?firstHitTurn:peakTurn):1)?k.id:'wait',target:lead}];}
       else if(row.supportKind==='jobPrayer'){if(base.actors[lead].job!=='job-1')continue;part=[{actor,turn,skill:turn===1?'dharma-prayer':'wait',target:lead}];}
       else if(row.supportKind==='domain')part=[{actor,turn,skill:turn===1?'new-world':'wait',target:actor}];
       else if(row.supportKind==='extendBuff')part=[{actor,turn,skill:extensionTurns.includes(turn)?available.find(k=>k.kind==='extendBuff').id:'wait',target:actor}];
       else if(row.supportKind==='heal')part=[{actor,turn,skill:available.find(k=>k.kind==='heal').id,target:actor}];
       else if(row.supportKind==='nextBuff')part=[{actor,turn,skill:available.find(k=>k.nextBuff==='phoenix').id,target:lead}];
       else if(row.supportKind==='rondo')part=[{actor,turn,skill:buffFirst&&turn===1&&buff?buff.id:available.find(k=>k.kind==='rondo').id,target:lead}];
       else part=[{actor,turn,skill:row.bestSkill||'wait',target:actor}];
       const i=plan.findIndex(c=>c[0].actor===actor&&c[0].turn===turn);if(i>=0)plan[i]=part;
      }}
      let order1=order(initial.turnStarts[0].states);plan.sort((a,b)=>a[0].turn-b[0].turn||order1.indexOf(a[0].actor)-order1.indexOf(b[0].actor));
      const config={...base,actions:plan.flat()},preview=SequenceEngine.simulate(config,master,profile),second=preview.turnStarts.find(t=>t.turn===2);
      if(second){const order2=order(second.states);plan.sort((a,b)=>a[0].turn-b[0].turn||(a[0].turn===2?order2:order1).indexOf(a[0].actor)-(a[0].turn===2?order2:order1).indexOf(b[0].actor));config.actions=plan.flat();}
      const key=JSON.stringify(config);if(seen.has(key))continue;seen.add(key);calls++;const result=evaluate(config);if(result?.resourceOK)valid++;
      if(calls<budget){const rondoActors=set.filter(x=>['rondo','nextBuff'].includes(x.row.supportKind)).map(x=>x.actor),encoreActors=set.filter(x=>x.row.supportKind==='encore').map(x=>x.actor),rolePlan=[];for(let t=1;t<=settings.turns;t++){const own=plan.filter(c=>c[0].turn===t),early=own.filter(c=>c[0].actor!==lead&&!rondoActors.includes(c[0].actor)&&!encoreActors.includes(c[0].actor)),rondo=own.filter(c=>rondoActors.includes(c[0].actor)),main=own.filter(c=>c[0].actor===lead),extra=own.filter(c=>encoreActors.includes(c[0].actor));rolePlan.push(...(preparation&&t===1?[...extra,...early,...rondo,...main]:[...early,...rondo,...main,...extra]));}const cfg={...base,actions:rolePlan.flat()},roleKey=JSON.stringify(cfg);if(!seen.has(roleKey)){seen.add(roleKey);calls++;const r=evaluate(cfg);if(r?.resourceOK)valid++;}}
      // Rondo buffs the next actor, not its target field. Compare its complete
      // setup-and-hit sequence even when the natural order inserts a third actor.
      for(const {actor,row}of set.filter(x=>['rondo','nextBuff'].includes(x.row.supportKind))){if(calls>=budget)break;const adjacent=[];for(let t=1;t<=settings.turns;t++){const turnPlan=plan.filter(c=>c[0].turn===t),support=turnPlan.find(c=>c[0].actor===actor);for(const chunk of turnPlan){if(chunk===support)continue;if(chunk[0].actor===lead&&support)adjacent.push(support);adjacent.push(chunk);}}const cfg={...base,actions:adjacent.flat()},key2=JSON.stringify(cfg);if(seen.has(key2))continue;seen.add(key2);calls++;const improved=evaluate(cfg);if(improved?.resourceOK)valid++;}
     }
    }catch{/* Invalid loadouts and unsupported follow-ups are not candidates. */}
   }
  }
 }
 return {calls,valid};
}
root.SupportLoadouts25={search,fit,chunks,feasibleTeams};
})(typeof window==='undefined'?globalThis:window);

