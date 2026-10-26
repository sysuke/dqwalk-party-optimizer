'use strict';
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x));
// Search whole, legal turn plans. A setup action must be evaluated together with
// its follow-up attack; scoring an unfinished prefix discards useful setups.
function refine(config,chunks,evaluate,compare,budget=160,options={}){
 let calls=0,best={chunks:clone(chunks),result:evaluate({...config,actions:chunks.flat()})};const turns=Math.max(...chunks.flat().map(a=>a.turn||1)),patterns=[];
 const attackIds=config.actors.map(a=>SequenceEngine.available(a).filter(k=>k.kind==='attack').map(k=>k.id));
 for(let actor=0;actor<4;actor++){
  const available=SequenceEngine.available(config.actors[actor]),own=chunks.filter(c=>c[0].actor===actor),first=own[0]?.[0]?.skill||attackIds[actor][0]||'wait',second=own[1]?.[0]?.skill||first,action=(skill,turn=1,target=actor)=>({actor,turn,skill,target}),rows=[];
  if(config.aiPolicy==='assume-selected')for(const k of available.filter(k=>k.kind==='mageChant'))for(const skill of attackIds[actor].filter(id=>SequenceEngine.available(config.actors[actor]).find(x=>x.id===id)?.type==='呪文'))rows.push([[action(k.id),action(skill)],...(turns>1?[[action(second,2)]]:[])]);for(const skill of attackIds[actor])rows.push([[action(skill)],...(turns>1?[[action(second,2)]]:[])]);
  if(turns>1)for(const prep of available.filter(k=>['critBuff','charge','zoneCharge','absolutecrit','spellCharge','autoRelease'].includes(k.kind)))for(const skill of attackIds[actor])rows.push([[action(prep.id)],[action(skill,2)]]);
  if(available.some(k=>k.kind==='rainbow'))for(const skill of attackIds[actor]){rows.push([[action('rainbow'),action(skill)],...(turns>1?[[action(second,2)]]:[])]);if(turns>1)for(const prep of available.filter(k=>['critBuff','charge','zoneCharge'].includes(k.kind)))rows.push([[action('rainbow'),action(prep.id)],[action(skill,2)]]);}
  for(const k of available.filter(k=>['jobPrayer','attackBuff','skillBuff','encore'].includes(k.kind)))for(let target=0;target<4;target++){if(k.kind==='encore'&&target===actor)continue;const targetSkills=k.kind==='encore'?SequenceEngine.available(config.actors[target]).filter(x=>['attack','critBuff','charge','zoneCharge','spellCharge'].includes(x.kind)).slice(0,5).map(x=>x.id):[null];for(const skill of targetSkills){const extra=turn=>k.kind==='encore'?[{actor:target,turn,skill,target}]:[];rows.push([[action(k.id,1,target),...extra(1)],...(turns>1?[[action(second,2)]]:[])]);if(turns>1)rows.push([[action(first)],[action(k.id,2,target),...extra(2)]]);}}
  if(options.supportPairs)for(const k of available.filter(k=>k.kind==='rondo')){
   rows.unshift([[action(k.id)],...(turns>1?[[action(k.id,2)]]:[])]);
   if(turns>1)for(const buff of available.filter(k=>['attackBuff','skillBuff'].includes(k.kind)))for(let target=0;target<4;target++)rows.unshift([[action(buff.id,1,target)],[action(k.id,2)]]);
  }
  patterns.push(rows);
 }
 function attempt(current,actor,pattern){if(calls>=budget)return null;const next=clone(current);for(let turn=1;turn<=turns;turn++){const i=next.findIndex(c=>c[0].actor===actor&&(c[0].turn||1)===turn);if(i>=0)next[i]=clone(pattern[turn-1]);}calls++;const result=evaluate({...config,actions:next.flat()});if(!result)return null;const row={chunks:next,result};if(!best.result||compare(result,best.result)<0)best=row;return row;}
 // Preserve different setup families even when they lose initially. Their best
 // paired follow-up may win; a single greedy beam would never visit that pair.
 if(options.supportPairs){
  const supports=patterns.map(rows=>rows.filter(p=>p.some(chunk=>chunk.some(a=>['jobPrayer','rondo','attackBuff','skillBuff','encore'].includes(SequenceEngine.available(config.actors[a.actor]).find(k=>k.id===a.skill)?.kind)))).slice(0,8));
  for(let a=0;a<4&&calls<budget;a++)for(let b=a+1;b<4&&calls<budget;b++)for(const pa of supports[a])for(const pb of supports[b]){
   if(calls>=budget)break;
   const next=clone(chunks);for(const [actor,pattern]of [[a,pa],[b,pb]])for(let turn=1;turn<=turns;turn++){const i=next.findIndex(c=>c[0].actor===actor&&(c[0].turn||1)===turn);if(i>=0)next[i]=clone(pattern[turn-1]);}
   calls++;const result=evaluate({...config,actions:next.flat()});if(result&&(!best.result||compare(result,best.result)<0))best={chunks:next,result};
  }
  return {...best,calls};
 }
 const alternatives=[];const seed=clone(chunks);for(let actor=0;actor<4;actor++)for(const pattern of patterns[actor]){const row=attempt(seed,actor,pattern);if(row)alternatives.push({...row,actor});if(calls>=Math.floor(budget*.45))break;}
 for(let round=0;round<2&&calls<budget;round++){const previous=JSON.stringify(best.chunks);for(let actor=0;actor<4&&calls<budget;actor++)for(const pattern of patterns[actor]){attempt(best.chunks,actor,pattern);if(calls>=budget)break;}if(JSON.stringify(best.chunks)===previous)break;}
 for(const row of alternatives.sort((a,b)=>compare(a.result,b.result)).slice(0,6)){for(let actor=0;actor<4&&calls<budget;actor++)if(actor!==row.actor)for(const pattern of patterns[actor]){attempt(row.chunks,actor,pattern);if(calls>=budget)break;}}
 return {...best,calls};
}
root.PlanSearch19={refine,checked:'2026-10-22',sources:['https://walk.dragonquest.jp/web/news/show/2026091215','https://9db.jp/dqwalk/data/17135']};
})(typeof window==='undefined'?globalThis:window);
