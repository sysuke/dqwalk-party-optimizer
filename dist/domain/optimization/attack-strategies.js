'use strict';
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x)),skill=id=>Catalog9.skills.find(k=>k.id===id);
function mainAttack(result){const totals=new Map();for(const step of result.steps||[])if(step.damage&&skill(step.skill)?.kind==='attack')totals.set(step.skill,(totals.get(step.skill)||0)+step.damage.min);const id=[...totals].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0]?.[0];return id==='eradicate-fullslash'?'fullslash':id||result.steps?.find(s=>s.damage)?.skill||'none';}
function diverse(results,compare,count=3){const ids=new Set(),out=[];for(const result of [...results].sort(compare)){const id=mainAttack(result);if(ids.has(id))continue;ids.add(id);out.push(result);if(out.length>=count)break;}return out;}
function survivalCompare(a,b){const tier=r=>r.survival?.known?(r.survival.modelMet?3:0):r.resourceOK?1:0;return tier(b)-tier(a)||Number(b.killed&&b.resourceOK)-Number(a.killed&&a.resourceOK)||(a.killed&&b.killed?(a.killTurn??99)-(b.killTurn??99)||a.killAction-b.killAction:0)||(a.survival?.known&&b.survival?.known&&!a.survival.modelMet&&!b.survival.modelMet?(b.survival.survivedThrough||0)-(a.survival.survivedThrough||0)||Number(!!b.survival.lower?.modelMet)-Number(!!a.survival.lower?.modelMet):0);}
function conditions(result){return result.builds.map((_,actor)=>{const own=result.steps.filter(s=>!s.enemy&&s.actor===actor);return {actor,zoneTurns:[...new Set(own.filter(s=>s.before?.zone).map(s=>s.turn))],tension100Turns:[...new Set(own.filter(s=>s.before?.tension>=50).map(s=>s.turn))]};});}
// Screening and support probes use the same simulator as final results. No buff
// multiplier is invented or granted without an available provider and action.

// Assemble complementary roles before the single-actor attack proxy trims teams.
// These are candidate generators; only the battle evaluator can rank a plan.
function roleTeams(pools,master,profile,settings,limit=8){
 const end=settings._deadline||Infinity,teams=[],seen=new Set(),roles=new Map();let checks=0;
 const kinds=row=>{const key=JSON.stringify(row.actor);if(!roles.has(key))roles.set(key,new Set(SequenceEngine.available(row.actor).map(k=>k.kind)));return roles.get(key);};
 const domainOK=row=>{if(!SequenceEngine.available(row.actor).some(k=>k.kind==='domain'&&k.domain==='newworld')||!row.actor.initial)return false;if(!settings.newWorldGoal||settings.newWorldGoal==='auto')return true;const job=master.jobs.find(j=>j.id===row.actor.job),slot=job.slots.map((s,i)=>s==='虹'?i:-1).filter(i=>i>=0).at(-1)??0;return Catalog9.hearts.find(h=>h.id===row.actor.hearts?.[slot])?.color?.split('+').at(-1)===settings.newWorldGoal;};
 const matches=(row,role)=>role.some(kind=>kind==='domain'?domainOK(row):kinds(row).has(kind));
 const leads=[],families=new Set(),ranked=pools.flatMap((rows,member)=>rows.map(row=>({row,member}))).filter(x=>skill(x.row.bestSkill)?.kind==='attack').sort((a,b)=>b.row.attackScore-a.row.attackScore);
 // Keep different attack families before filling with alternative trained owners.
 for(const unique of [true,false])for(const candidate of ranked){if(leads.length>=8)break;const family=candidate.row.bestSkill,key=candidate.member+':'+family;if(unique&&families.has(family)||leads.some(x=>x.key===key))continue;leads.push({...candidate,key});families.add(family);if(leads.length===8)break;}
 for(const lead of leads.slice(0,8)){
  const leadChecks=checks,leadLimit=Math.min(limit,teams.length+2),spell=skill(lead.row.bestSkill)?.type==='呪文',buff=spell?['skillBuff','jobPrayer','adaptiveBuff']:['skillBuff','adaptiveBuff','attackBuff'];
  const templates=spell?[[['domain'],['rondo'],buff],[['rondo'],buff,['encore']]]:[[buff,['rondo'],['encore']],[buff,['encore'],['attackBuff','encore']]];
  if(settings.objective==='survive')templates.unshift([['heal'],buff,['encore','rondo']]);
  for(const template of templates){const slots=[0,1,2,3].filter(i=>i!==lead.member),picked=new Map([[lead.member,lead.row]]),assigned=new Map();
   function visit(depth){if(teams.length>=leadLimit||checks-leadChecks>=16||checks>=128||Date.now()>=end)return;if(depth<3){const role=template[depth];for(const member of slots.filter(i=>!picked.has(i))){const options=pools[member].filter(r=>matches(r,role)).sort((a,b)=>b.supportScore-a.supportScore).slice(0,2);for(const row of options){picked.set(member,row);assigned.set(member,role);visit(depth+1);picked.delete(member);assigned.delete(member);}}return;}
    checks++;const order=[lead.member,...slots],original=order.map(i=>picked.get(i)),config={actors:original.map(r=>clone(r.actor))};
    try{const priority=i=>assigned.get(order[i])?.includes('domain')?2:assigned.get(order[i])?.includes('skillBuff')?1:0,release=[0,...[1,2,3].sort((a,b)=>priority(a)-priority(b))];if(!SupportLoadouts25.fit(config,release,master,profile))return;const fitted=original.map((row,i)=>{const b=SequenceEngine.build(config.actors[i],master,profile,settings);if(b.stats.hp<settings.minHP||b.stats.speed<settings.minSpeed||settings.costLimit!=null&&b.cost>settings.costLimit)throw Error('ability constraint');return {...row,actor:config.actors[i],stats:b.stats,cost:b.cost};});if(!SequenceEngine.available(fitted[0].actor).some(k=>k.id===lead.row.bestSkill))return;for(let i=1;i<4;i++)if(!matches(fitted[i],assigned.get(order[i])))return;if(settings.newWorldGoal&&settings.newWorldGoal!=='auto'&&!fitted.some(domainOK))return;
     const rows=Array(4);order.forEach((member,i)=>rows[member]=fitted[i]);const key=JSON.stringify(rows.map(r=>r.actor));if(seen.has(key))return;seen.add(key);teams.push({rows,used:PartyBattle.inventory(config,master,profile).used,proxy:0,strategy:{skill:lead.row.bestSkill,lead:lead.member,roles:[...assigned].map(([member,kinds])=>({member,kinds}))}});
    }catch{/* A role without its owned equipment or required ability is not a candidate. */}
   }visit(0);
  }
 }
 return {teams,checks,attemptedSkills:[...new Set(leads.map(x=>x.row.bestSkill))]};
}

function search(layouts,master,profile,settings,evaluate,budget=192){
 let probes=0,calls=0,verified=0;const candidates=[],end=settings._deadline||Infinity,selectedLayouts=layouts.slice(0,6),hasIncoming=settings.incoming!=null||settings.aoeDamageHigh!=null,attackTarget=settings.objective==='break'?PartyBattle.shieldThresholds(settings)[3]:settings.hp;
 const queues=selectedLayouts.map(layout=>layout.config.actors.map(a=>SequenceEngine.available(a).filter(k=>k.kind==='attack'))),max=Math.max(0,...queues.flat().map(q=>q.length));
 for(let n=0;n<max&&probes<48&&Date.now()<end;n++)for(let li=0;li<selectedLayouts.length;li++)for(let lead=0;lead<4;lead++){
  const k=queues[li][lead][n];if(!k||probes>=48||Date.now()>=end)continue;const q=clone(selectedLayouts[li].config);q.actions=[lead,...[0,1,2,3].filter(i=>i!==lead)].map(actor=>({actor,turn:1,skill:actor===lead?k.id:'wait',target:actor}));probes++;
  try{const r=ProcProbability35.scenario(q,master,profile,{...settings,turns:1,incoming:null,aoeDamageHigh:null,requireSurvival:false,requireOrder:false}),hit=r.steps.find(s=>s.actor===lead&&s.skill===k.id&&s.damage);if(hit)candidates.push({config:q,lead,id:k.id,base:hit.damage.min,mp:hit.mpCost.max,build:r.builds[lead]});}catch{/* Unavailable and illegal input is never a viable strategy. */}
 }
 const families=new Set(),selected=[],ranked=candidates.sort((a,b)=>b.base-a.base),add=row=>{const family=row?.id==='eradicate-fullslash'?'fullslash':row?.id;if(row&&!families.has(family)&&selected.length<4){families.add(family);selected.push(row);}};add(ranked[0]);if(settings.objective==='survive')add(ranked.find(row=>skill(row.id)?.healing));for(const row of ranked)add(row);
 const run=(q,meta)=>{if(calls>=budget||Date.now()>=end)return null;calls++;const r=evaluate(q);if(r?.resourceOK){verified++;const hits=r.steps.filter(s=>s.actor===meta.lead&&s.skill===meta.skill&&s.damage),largest=hits.reduce((a,b)=>(a?.damage.min||0)>=b.damage.min?a:b,null);r.attackStrategy={...meta,target:attackTarget,largest:largest?.damage.min||0,buffs:clone(largest?.before||{}),verified:true};}return r;};
 for(let index=0;index<selected.length;index++){
  const c=selected[index],{lead,id}=c,limit=calls+Math.ceil((budget-calls)/(selected.length-index)),turns=settings.turns,available=c.config.actors.map(a=>SequenceEngine.available(a)),action=(actor,turn,id,target=actor)=>({actor,turn,skill:id,target}),waits=actor=>Array.from({length:turns},(_,t)=>[action(actor,t+1,'wait')]),parts=available.map((ks,actor)=>{const rows=waits(actor),heal=ks.find(k=>k.kind==='heal');if((settings.objective==='survive'||hasIncoming)&&heal)for(let t=0;t<turns;t++)rows[t]=[action(actor,t+1,heal.id)];return rows;});
  const maxHits=Math.max(1,Math.floor(c.build.stats.mp/Math.max(1,c.mp))),attack=skill(id);let used=0;for(let t=0;t<turns;t++){const fires=Math.floor((t+1)*Math.min(turns,maxHits)/turns)>Math.floor(t*Math.min(turns,maxHits)/turns);parts[lead][t]=[action(lead,t+1,fires?(used++&&attack.eradicate?'fullslash':id):'wait')];}
  const make=(rows,order)=>({...clone(c.config),actions:Array.from({length:turns},(_,t)=>order.flatMap(actor=>rows[actor][t])).flat()}),support=[0,1,2,3].filter(i=>i!==lead),order=[...support,lead];
  const options=available.map((ks,actor)=>{const rows=[{parts:parts[actor],roles:[]}];if(actor===lead){for(const k of ks.filter(k=>['charge','zoneCharge','spellCharge','autoRelease','mageChant','critBuff'].includes(k.kind)&&(turns>1||['autoRelease','mageChant'].includes(k.kind))&&(!['autoRelease','mageChant'].includes(k.kind)||settings.allowAI&&attack.type==='呪文'))){const prepared=clone(parts[actor]);prepared[0]=k.kind==='mageChant'?[action(actor,1,k.id),action(actor,1,id)]:[{...action(actor,1,k.id),...(k.kind==='autoRelease'?{aiSkill:id}:{})}];rows.push({parts:prepared,roles:[k.kind]});}return rows;}
   for(const k of ks.filter(k=>['adaptiveBuff','attackBuff','skillBuff','rondo','jobPrayer','encore'].includes(k.kind))){if(k.kind==='jobPrayer'&&c.config.actors[lead].job!=='job-1')continue;const p=clone(parts[actor]);for(let t=0;t<turns;t++){
    if(k.maxUses&&t>=k.maxUses)continue;if(['skillBuff','adaptiveBuff','jobPrayer'].includes(k.kind)&&t>0&&!((t%3===0)&&!k.maxUses))continue;
    p[t]=[action(actor,t+1,k.id,lead)];if(k.kind==='encore')p[t].push(action(lead,t+1,t&&attack.eradicate?'fullslash':id));
   }rows.push({parts:p,roles:[k.kind]});}return rows;});
  const combinations=[];for(const own of options[lead]){const base=clone(parts);base[lead]=own.parts;combinations.push({parts:base,roles:own.roles});for(const actor of support)for(const opt of options[actor].slice(1)){const rows=clone(base);rows[actor]=opt.parts;combinations.push({parts:rows,roles:[...own.roles,...opt.roles]});}}
  // Also verify complementary buffs together; their effects are never estimated
  // by multiplying independent ratios from probes.
  for(const actor of support)for(const opt of options[actor].slice(1))for(const other of support.filter(i=>i>actor))for(const next of options[other].slice(1)){const rows=clone(parts);rows[actor]=opt.parts;rows[other]=next.parts;combinations.push({parts:rows,roles:[...opt.roles,...next.roles]});}
  for(const combination of combinations){if(calls>=limit||Date.now()>=end)break;const orders=[order];const rondo=support.find(i=>combination.parts[i].flat().some(a=>skill(a.skill)?.kind==='rondo'));if(rondo!=null)orders.unshift(support.filter(i=>i!==rondo).concat(rondo,lead));for(const ord of orders){if(calls>=limit)break;run(make(combination.parts,ord),{lead,skill:id,screenedDamage:c.base,roles:combination.roles,stage:'耐性別候補→実在バフ→全手順の再計算'});}}
 }
 return {probes,calls,verified,skills:selected.map(c=>c.id),scope:'耐性・種類耐性・SHTガード込みの攻撃比較→バフと回復の実行手順→同じ戦闘計算でMP/生存/シールドを再検証。最適性は未保証。'};
}
root.AttackStrategies={mainAttack,diverse,survivalCompare,conditions,roleTeams,search};
})(typeof window==='undefined'?globalThis:window);
