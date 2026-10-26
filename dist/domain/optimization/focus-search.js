'use strict';
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x)),skill=id=>Catalog9.skills.find(k=>k.id===id),supportKinds=new Set(['adaptiveBuff','attackBuff','skillBuff','rondo','jobPrayer','encore','extendBuff','domain']);
function patterns(config,lead,settings){
 const turns=settings.turns,attackFor=i=>SequenceEngine.available(config.actors[i]).find(k=>k.eradicate)?.id||config.actions.find(a=>a.actor===i&&skill(a.skill)?.kind==='attack')?.skill||SequenceEngine.available(config.actors[i]).find(k=>k.kind==='attack')?.id||'wait',attack=attackFor(lead);
 return config.actors.map((a,i)=>{
  const available=SequenceEngine.available(a),action=(id,turn,target=i)=>({actor:i,skill:id,turn,target}),allTurns=id=>Array.from({length:turns},(_,n)=>[action(n>0&&skill(id)?.eradicate?'fullslash':id,n+1)]),rows=[{parts:allTurns(attackFor(i)),roles:[],weight:0}];
  if(i===lead){if(settings.allowAI&&skill(attack)?.type==='呪文')for(const k of available.filter(k=>k.kind==='mageChant'))rows.push({parts:[[action(k.id,1),action(attack,1)],...(turns===2?[[action(attack,2)]]:[])],roles:['mage-chant'],weight:3});if(turns===2)for(const k of available.filter(k=>['critBuff','charge','zoneCharge','absolutecrit','spellCharge','autoRelease'].includes(k.kind)&&(k.kind!=='autoRelease'||settings.allowAI))){rows.push({parts:[[action(k.id,1)],[action(attack,2)]],roles:['self-'+k.kind],weight:2});if(available.some(k=>k.kind==='overdrive'))rows.push({parts:[[action('overdrive',1),action(k.id,1)],[action(attack,2)]],roles:['self-'+k.kind,'extension'],weight:3});}return rows;}
  for(const k of available.filter(k=>supportKinds.has(k.kind))){if(k.kind==='jobPrayer'&&config.actors[lead].job!=='job-1')continue;if(k.kind==='domain'&&k.domain!=='newworld')continue;
   const parts=allTurns('wait'),buffTurn=k.kind==='skillBuff'?turns:1;parts[buffTurn-1]=[action(k.id,buffTurn,lead)];
   if(k.kind==='encore'){for(let t=1;t<=turns;t++)parts[t-1]=[action(k.id,t,lead),{actor:lead,turn:t,skill:skill(attack)?.eradicate?'fullslash':attack,target:lead}];for(const prep of SequenceEngine.available(config.actors[lead]).filter(x=>['charge','zoneCharge','spellCharge','absolutecrit','critBuff'].includes(x.kind))){const prepared=clone(parts);prepared[0]=[action(k.id,1,lead),{actor:lead,turn:1,skill:prep.id,target:lead}];rows.push({parts:prepared,roles:['encore','preparation'],weight:7});}}
   else if(k.kind==='rondo'||k.kind==='attackBuff')for(let t=1;t<=turns;t++)parts[t-1]=[action(k.id,t,lead)];
   const weight={skillBuff:5,adaptiveBuff:5,rondo:4,jobPrayer:5,encore:3,attackBuff:3,extendBuff:1,domain:1}[k.kind]||0;
   rows.push({parts,roles:[k.kind],weight});
   if(turns===2&&k.kind==='adaptiveBuff')for(const after of available.filter(x=>['rondo','skillBuff'].includes(x.kind)))rows.push({parts:[[action(k.id,1,lead)],[action(after.id,2,lead)]],roles:[k.kind,after.kind],weight:weight+2});
  }
  // Restrict each actor's options by role diversity, never by the weak setup hit.
  return rows.sort((a,b)=>b.weight-a.weight).slice(0,7);
 });
}
function refine(config,settings,evaluate,budget=128){
 let calls=0;const seen=new Set(),damage=config.actors.map((a,i)=>{try{const b=SequenceEngine.build(a,settings.master,settings.profile,settings);return Math.max(b.stats.attack,b.stats.magic);}catch{return 0;}}),leads=[0,1,2,3].filter(i=>SequenceEngine.available(config.actors[i]).some(k=>k.kind==='attack')).sort((a,b)=>damage[b]-damage[a]).slice(0,2);
 for(const lead of leads){const rows=patterns(config,lead,settings);let combinations=[{parts:[],roles:[],weight:0}];for(const options of rows)combinations=combinations.flatMap(c=>options.map(p=>({parts:[...c.parts,p.parts],roles:[...c.roles,...p.roles],weight:c.weight+p.weight})));
  combinations.sort((a,b)=>{const score=c=>c.weight+new Set(c.roles).size*4-(c.roles.length-new Set(c.roles).size)*4;return score(b)-score(a);});
  const naturalOrder=config.actions.filter(a=>(a.turn||1)===1).map(a=>a.actor).filter((a,i,arr)=>arr.indexOf(a)===i),orders=[naturalOrder,[...naturalOrder.filter(i=>i!==lead),lead]];for(let i=0;i<4;i++)if(i!==lead&&SequenceEngine.available(config.actors[i]).some(k=>k.kind==='rondo'||k.nextBuff==='phoenix'))orders.push([...naturalOrder.filter(j=>j!==lead&&j!==i),i,lead]);for(let i=0;i<4;i++)if(i!==lead&&SequenceEngine.available(config.actors[i]).some(k=>k.kind==='encore'))for(const order of [...orders])orders.push([i,...order.filter(j=>j!==i)]);
  for(const combination of combinations)for(const order of orders){if(calls>=budget)return {calls};const actions=[];for(let t=0;t<settings.turns;t++)for(const actor of order)actions.push(...combination.parts[actor][t]);const key=JSON.stringify(actions);if(seen.has(key))continue;seen.add(key);calls++;evaluate({...config,actions});}
 }
 return {calls};
}
root.FocusSearch35={refine,patterns,supportKinds};
})(typeof window==='undefined'?globalThis:window);
