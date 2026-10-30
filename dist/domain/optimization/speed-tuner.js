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
function tune(seed,master,profile,settings,evaluate,budget=128){
 const analysis=analyze(seed,settings);if(!analysis.feasible||budget<1)return {result:seed,calls:0,analysis};let current=seed,calls=0;const stock=new Map(profile.inventory.map(x=>[x.id,x.count])),slots=GearOptimizer.slots,hearts=Catalog9.hearts.filter(h=>master.items.some(i=>i.slot==='heart'&&(i.id===h.id||i.name===h.name)&&(stock.get(i.id)||0)>0)),gear=master.items.filter(i=>i.verifiedModel&&(stock.get(i.id)||0)>0),seen=new Set();
 const better=(a,b)=>{const ga=gap(a,settings),gb=gap(b,settings);return ga.count-gb.count||ga.total-gb.total||b.damage-a.damage;};
 for(let round=0;round<6&&calls<budget;round++){
  const before=current,candidates=[],actors=new Set(current.orderChecks.filter(x=>!x.certain).flatMap(x=>[x.first,x.second]));if(!actors.size&&settings.enemySpeedMax!=null)current.builds.forEach((_,i)=>actors.add(i));
  // Transfer scarce equipment atomically: removing it first can lose a kill,
  // while equipping the recipient first can exceed shared inventory.
  const consider=(config,changed,family)=>{
   const key=JSON.stringify(config.actors);if(seen.has(key))return;seen.add(key);
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
  for(const row of diverse.slice(0,24)){if(calls>=budget)break;calls++;let r;try{r=evaluate(row.config);}catch{continue;}if(r?.resourceOK&&(!seed.killed||r.killed)&&better(r,current)<0)current=r;}
  if(current===before||current.orderOK&&(settings.enemySpeedMax==null||current.enemyFirst))break;
 }
 return {result:current,calls,analysis:analyze(current,settings)};
}
root.SpeedTuner26={analyze,propagate,baseFor,gap,tune};
})(typeof window==='undefined'?globalThis:window);
