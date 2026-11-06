'use strict';
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x));
function factor(result,turn,actor){const st=result.turnStarts.find(t=>t.turn===turn)?.states[actor];if(!st)throw Error('速度状態がありません');const f=1+.2*st.speedStages+(st.worldSpeed||0)/100;if(!Number.isFinite(f)||f<=0)throw Error('速度倍率が不正です');return f;}
function constraints(result,settings){const edges=(result.orderChecks||[]).map(c=>({first:c.first,second:c.second,firstFactor:factor(result,c.turn,c.first),secondFactor:factor(result,c.turn,c.second),ratio:settings.ratio,turn:c.turn}));const floors=[];if(settings.enemySpeedMax!=null)for(const st of result.steps.filter(x=>!x.enemy&&!x.extra))floors.push({actor:st.actor,factor:factor(result,st.turn,st.actor),speed:settings.enemySpeedMax});return {edges,floors};}
function baseFor(effective,multiplier){let n=Math.max(1,Math.ceil(effective/multiplier));while(Math.floor(n*multiplier)<effective)n++;while(n>1&&Math.floor((n-1)*multiplier)>=effective)n--;return n;}
// Monotone integer propagation finds the least solution above the lower bounds.
// All comparisons use the same floors and strict inequality as PartyBattle.
function propagate(edges,floors,lower=[1,1,1,1],cap=100000){const speeds=[...lower];for(const c of floors)speeds[c.actor]=Math.max(speeds[c.actor],baseFor(Math.floor(c.speed)+1,c.factor));if(speeds.some(n=>n>cap))return null;
 for(let iteration=0;iteration<=cap*4;iteration++){let changed=false;for(const e of edges){const required=Math.floor(Math.floor(speeds[e.second]*e.secondFactor)*e.ratio)+1,n=baseFor(required,e.firstFactor);if(n>speeds[e.first]){speeds[e.first]=n;changed=true;if(n>cap)return null;}}if(!changed)return speeds;}return null;
}
function analyze(result,settings=result.settings,cap=100000){const {edges,floors}=constraints(result,settings),current=result.builds.map(b=>b.stats.speed),minimum=propagate(edges,floors,[1,1,1,1],cap);return {cap,feasible:!!minimum,raiseTargets:minimum?propagate(edges,floors,current,cap):null,edges,floors};}
function gap(result,settings){const c=constraints(result,settings),speeds=result.builds.map(b=>b.stats.speed);let count=0,total=0;for(const e of c.edges){const first=Math.floor(speeds[e.first]*e.firstFactor),need=Math.floor(Math.floor(speeds[e.second]*e.secondFactor)*e.ratio)+1;if(first<need){count++;total+=(need-first)/need;}}for(const e of c.floors){const first=Math.floor(speeds[e.actor]*e.factor),need=Math.floor(e.speed)+1;if(first<need){count++;total+=(need-first)/need;}}return {count,total};}

// Reassign one armour or heart slot across the party in one candidate. Partial
// assignments may be worse; only complete plans are compared and simulated.
function coordinatedCandidates(seed,master,profile,settings,maxChecks=2048,maxCandidates=8){
 const end=settings._deadline||Infinity,stock=new Map(profile.inventory.map(row=>[row.id,row.count])),rules=constraints(seed,settings),out=[],seen=new Set(),heartItems=new Map(Catalog9.hearts.map(h=>[h.id,master.items.find(i=>i.slot==='heart'&&(i.id===h.id||i.name===h.name))?.id]));let checks=0;
 const stockId=(id,field)=>field==='hearts'?heartItems.get(id):id;
 const positions=[...GearOptimizer.slots.map((_,slot)=>({field:'armors',slot,length:8})),...Array.from({length:4},(_,slot)=>({field:'hearts',slot,length:4}))];
 const compare=(a,b)=>{const ga=gap(a.proxy,settings),gb=gap(b.proxy,settings);return ga.count-gb.count||ga.total-gb.total;};
 for(const [position,{field,slot,length}] of positions.entries()){
  if(checks>=maxChecks||Date.now()>=end)break;
  const positionEnd=checks+Math.ceil((maxChecks-checks)/(positions.length-position));
  const owned=field==='hearts'?Catalog9.hearts.filter(h=>(stock.get(stockId(h.id,field))||0)>0):master.items.filter(i=>i.verifiedModel&&i.slot===GearOptimizer.slots[slot]&&(stock.get(i.id)||0)>0);if(!owned.some(i=>(i.stats?.speed||0)>0))continue;
  const original=seed.config.actors.map(a=>a[field]?.[slot]||''),ids=[...new Set(['',...original,...owned.sort((a,b)=>(b.stats?.speed||0)-(a.stats?.speed||0)).slice(0,4).map(i=>i.id)])],base=clone(seed.config);base.actors.forEach(a=>{a[field]=Array.from({length},(_,i)=>i===slot?'':a[field]?.[i]||'');});
  const used=PartyBattle.inventory(base,master,profile).used,remaining=new Map([...stock].map(([id,count])=>[id,count-(used[id]||0)]));if([...remaining.values()].some(count=>count<0))continue;
  const options=base.actors.map((a,actor)=>ids.flatMap(id=>{if(Date.now()>=end||id&&(remaining.get(stockId(id,field))||0)<1)return [];try{const candidate=clone(a);candidate[field][slot]=id;const build=SequenceEngine.build(candidate,master,profile,settings);if(build.stats.hp<settings.minHP||build.stats.speed<settings.minSpeed||settings.costLimit!=null&&build.cost>settings.costLimit)return [];return [{id,actor:candidate,build}];}catch{return [];}}).sort((a,b)=>Number(b.id===original[actor])-Number(a.id===original[actor])||b.build.stats.speed-a.build.stats.speed));
  if(options.some(rows=>!rows.length))continue;const chosen=[];
  const possible=()=>{const ranges=options.map((rows,actor)=>chosen[actor]?[chosen[actor].build.stats.speed,chosen[actor].build.stats.speed]:(()=>{const speeds=rows.filter(row=>!row.id||(remaining.get(stockId(row.id,field))||0)>0).map(row=>row.build.stats.speed);return speeds.length?[Math.min(...speeds),Math.max(...speeds)]:null;})());if(ranges.some(range=>!range))return false;return rules.edges.every(e=>Math.floor(ranges[e.first][1]*e.firstFactor)>Math.floor(Math.floor(ranges[e.second][0]*e.secondFactor)*e.ratio))&&rules.floors.every(e=>Math.floor(ranges[e.actor][1]*e.factor)>e.speed);};
  function visit(actor){if(checks>=positionEnd||Date.now()>=end)return;checks++;if(!possible())return;if(actor===options.length){if(chosen.filter((row,i)=>row.id!==original[i]).length<2)return;const proxy={...seed,builds:chosen.map(row=>row.build)},before=gap(seed,settings),after=gap(proxy,settings);if(after.count>before.count||after.count===before.count&&after.total>=before.total)return;const config={...clone(seed.config),actors:chosen.map(row=>clone(row.actor))},key=JSON.stringify(config.actors);if(seen.has(key)||PartyBattle.inventory(config,master,profile).issues.length)return;seen.add(key);out.push({config,proxy,slot,field});out.sort(compare);if(out.length>maxCandidates)out.pop();return;}
   for(const row of options[actor]){if(row.id&&(remaining.get(stockId(row.id,field))||0)<1)continue;chosen[actor]=row;if(row.id)remaining.set(stockId(row.id,field),remaining.get(stockId(row.id,field))-1);visit(actor+1);if(row.id)remaining.set(stockId(row.id,field),remaining.get(stockId(row.id,field))+1);chosen.length=actor;if(checks>=positionEnd||Date.now()>=end)break;}
  }visit(0);
 }
 return {candidates:out,checks};
}

function tune(seed,master,profile,settings,evaluate,budget=128){
 const analysis=analyze(seed,settings);if(!analysis.feasible||budget<1)return {result:seed,calls:0,analysis};let current=seed,calls=0,coordinatedChecks=0,coordinatedCalls=0;const end=settings._deadline||Infinity;const stock=new Map(profile.inventory.map(x=>[x.id,x.count])),slots=GearOptimizer.slots,hearts=Catalog9.hearts.filter(h=>master.items.some(i=>i.slot==='heart'&&(i.id===h.id||i.name===h.name)&&(stock.get(i.id)||0)>0)),gear=master.items.filter(i=>i.verifiedModel&&(stock.get(i.id)||0)>0),seen=new Set();
 const better=(a,b)=>{const ga=gap(a,settings),gb=gap(b,settings);return ga.count-gb.count||ga.total-gb.total||b.damage-a.damage;};
 for(let round=0;round<6&&calls<budget&&Date.now()<end;round++){
  const before=current,candidates=[],actors=new Set(current.orderChecks.filter(x=>!x.certain).flatMap(x=>[x.first,x.second]));if(!actors.size&&settings.enemySpeedMax!=null)current.builds.forEach((_,i)=>actors.add(i));
  // Transfer scarce equipment atomically: removing it first can lose a kill,
  // while equipping the recipient first can exceed shared inventory.
  const consider=(config,changed,family)=>{
   if(Date.now()>=end)return;const key=JSON.stringify(config.actors);if(seen.has(key))return;seen.add(key);
   try{if(PartyBattle.inventory(config,master,profile).issues.length)return;
    const builds=[...current.builds];for(const actor of changed){const b=SequenceEngine.build(config.actors[actor],master,profile,settings);if(b.stats.hp<settings.minHP||b.stats.speed<settings.minSpeed||settings.costLimit!=null&&b.cost>settings.costLimit)return;builds[actor]=b;}
    const proxy={...current,builds};if(better(proxy,current)<0)candidates.push({config,proxy,family});
   }catch{}
  };
  for(const actor of actors)for(const field of ['hearts','armors'])for(let slot=0;slot<(field==='hearts'?4:8);slot++){
   const ids=['',...(field==='hearts'?hearts.map(h=>h.id):gear.filter(g=>g.slot===slots[slot]).map(g=>g.id))];
   for(const id of ids){if((current.config.actors[actor][field]?.[slot]||'')===id)continue;const config=clone(current.config);config.actors[actor][field]=Array.from({length:field==='hearts'?4:8},(_,i)=>config.actors[actor][field]?.[i]||'');config.actors[actor][field][slot]=id;consider(config,[actor],actor+':'+field+':'+slot);
   }
  }
  for(const actor of actors)for(let other=0;other<current.config.actors.length;other++)if(other!==actor)for(const field of ['hearts','armors'])for(let slot=0;slot<(field==='hearts'?4:8);slot++){
   const first=current.config.actors[actor][field]?.[slot]||'',second=current.config.actors[other][field]?.[slot]||'';if(first===second)continue;
   const config=clone(current.config);for(const index of [actor,other])config.actors[index][field]=Array.from({length:field==='hearts'?4:8},(_,i)=>config.actors[index][field]?.[i]||'');
   config.actors[actor][field][slot]=second;config.actors[other][field][slot]=first;
   consider(config,[actor,other],'swap:'+actor+':'+other+':'+field+':'+slot);
  }
  const sorted=candidates.sort((a,b)=>better(a.proxy,b.proxy)),families=new Set(),diverse=[];for(const row of sorted)if(!families.has(row.family)){families.add(row.family);diverse.push(row);}for(const row of sorted)if(!diverse.includes(row))diverse.push(row);
  for(const row of diverse.slice(0,24)){if(calls>=budget||Date.now()>=end)break;calls++;let r;try{r=evaluate(row.config);}catch{continue;}if(r?.resourceOK&&(!seed.killed||r.killed)&&better(r,current)<0)current=r;}
  if(current===before&&gap(current,settings).count>0&&settings.atomicSpeedRepair!==false&&calls<budget&&coordinatedChecks<2048&&Date.now()<end){const coordinated=coordinatedCandidates(current,master,profile,settings,2048-coordinatedChecks);coordinatedChecks+=coordinated.checks;for(const row of coordinated.candidates){if(calls>=budget||Date.now()>=end)break;const key=JSON.stringify(row.config.actors);if(seen.has(key))continue;seen.add(key);calls++;coordinatedCalls++;let r;try{r=evaluate(row.config);}catch{continue;}if(r?.resourceOK&&(!seed.killed||r.killed)&&better(r,current)<0)current=r;}}
  if(current===before||current.orderOK&&(settings.enemySpeedMax==null||current.enemyFirst))break;
 }
 return {result:current,calls,coordinatedChecks,coordinatedCalls,analysis:analyze(current,settings)};
}

// Full plans, not only actor equipment, determine whether speed is repairable.
function repair(seeds,master,profile,settings,evaluate,compare,budget=128,tried=new Set(),preferred=new Set()){
 const end=settings._deadline||Infinity,selected=[],seen=new Set(),results=[],verifiedKeys=[];let calls=0,attempted=0,impossible=0,coordinatedCalls=0;
 for(const seed of seeds){if(Date.now()>=end||budget<1)break;if(!seed.resourceOK||seed.orderOK&&(settings.enemySpeedMax==null||seed.enemyFirst))continue;const key=JSON.stringify(seed.config);if(tried.has(key)||seen.has(key))continue;seen.add(key);let analysis;try{analysis=analyze(seed,settings);}catch{continue;}if(!analysis.feasible){impossible++;tried.add(key);continue;}selected.push({seed,key});}
 selected.sort((a,b)=>{const preferredOrder=Number(preferred.has(b.key))-Number(preferred.has(a.key));if(preferredOrder)return preferredOrder;const ga=gap(a.seed,settings),gb=gap(b.seed,settings);return ga.count-gb.count||ga.total-gb.total||compare(a.seed,b.seed);});
 const parents=selected.slice(0,3);for(let i=0;i<parents.length&&Date.now()<end;i++){const allowance=Math.floor((budget-calls)/(parents.length-i));if(allowance<1)break;const {seed,key}=parents[i];tried.add(key);attempted++;const checked=tune(seed,master,profile,settings,evaluate,allowance);calls+=checked.calls;coordinatedCalls+=checked.coordinatedCalls||0;if(checked.result.resourceOK&&checked.result.orderOK&&(settings.enemySpeedMax==null||checked.result.enemyFirst)){results.push(checked.result);verifiedKeys.push(key);}}
 return {calls,attempted,impossible,coordinatedCalls,results,verifiedKeys};
}

root.SpeedTuner26={analyze,propagate,baseFor,gap,tune,repair,coordinatedCandidates};
})(typeof window==='undefined'?globalThis:window);
