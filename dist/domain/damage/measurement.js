'use strict';
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x));
// Explain a single physical hit using the same calculator, never a second formula.
function explain(predicted){
 const p=predicted.params;
 if(!p||!Number.isFinite(p.attack)||!Number.isFinite(p.multiplier)||!root.PhysicalCalculator)return null;
 const first=root.PhysicalCalculator.calculate({...p,hits:1,includeTrace:true});
 const subsequent=root.PhysicalCalculator.calculate({...p,hits:1,charge:1,includeTrace:true});
 return {scope:'最初の物理1発と2発目以降。追撃・複数敵・シールド・会心ガード適用前。',
  effectiveAttack:first.effectiveAttack,effectiveDefense:first.effectiveDefense,
  corrections:clone(first.corrections),factors:clone(first.factors),
  first:{min:first.min,max:first.max,stages:clone(first.hit.stages)},
  subsequent:{min:subsequent.min,max:subsequent.max,stages:clone(subsequent.hit.stages)}};
}
function prediction(result,order,cast=null){const log=result.logs.find(l=>l.order===order);if(!log?.damage)throw Error('照合する攻撃を選んでください');const d=cast==null?log.damage:log.damage.casts?.[cast];if(!d)throw Error('照合する詠唱がありません');const unresolved=[];if(log.damage.guardUnknown||log.damage.perTarget?.some(t=>t.guardUnknown))unresolved.push('会心ガードの軽減率が不明。下限0を含む幅を実測一致と扱わない。');if(log.damage.referenceOnly)unresolved.push('代表倍率を使う参考計算で、実測乱数の範囲ではない。');if(result.complete===false&&!unresolved.length)unresolved.push('計算に未検証・未対応の条件があるため、一致判定を保留。');return {order,cast,actor:log.actor,skill:log.skill,name:log.name,turn:log.turn,min:d.min,max:d.max,params:clone(d.params||{}),factors:clone(d.factors||{}),buffs:clone(log.buffsBefore||[]),equipment:clone(result.builds?.[log.actor]?.parts||[]),hearts:clone(result.builds?.[log.actor]?.heartParts||[]),bonuses:clone(result.builds?.[log.actor]?.bonuses||[]),referenceOnly:!!log.damage.referenceOnly,conditional:!!(log.damage.conditional||log.aiControlled),unresolved};}
function compare(predicted,observations){if(!Array.isArray(observations)||!observations.length||observations.length>100||observations.some(n=>!Number.isSafeInteger(n)||n<0||n>1e10))throw Error('観測値は0以上の整数を1〜100件で指定してください');const midpoint=(predicted.min+predicted.max)/2,mean=observations.reduce((a,b)=>a+b,0)/observations.length;const unresolved=[...(predicted.unresolved||[])];if(predicted.referenceOnly&&!unresolved.length)unresolved.push("代表倍率による参考範囲");const assessable=Array.isArray(predicted.unresolved)&&!unresolved.length;return {status:assessable?(observations.some(n=>n<predicted.min||n>predicted.max)?"outside-modeled-range":"within-modeled-range"):"unresolved",unresolved,mean,count:observations.length,midpoint,difference:mean-midpoint,differencePercent:midpoint?(mean/midpoint-1)*100:null,outside:observations.filter(n=>n<predicted.min||n>predicted.max).length,minObserved:Math.min(...observations),maxObserved:Math.max(...observations)};}
function create({result,configuration,profile,order,cast=null,observations,kind,note=''}){if(!['measured','expectation'].includes(kind))throw Error('実測か期待値かを指定してください');if(String(note).length>500)throw Error('メモは500文字以内です');const predicted=prediction(result,order,cast);return {schema:1,created:new Date().toISOString(),model:'0.52',kind,note:String(note),observations:[...observations],comparison:compare(predicted,observations),predicted,configuration:clone(configuration),profile:clone(profile)};}
function recompute(record,master){if(record.schema!==1)throw Error('照合記録の形式が未対応です');const result=root.SequenceEngine.simulate(record.configuration,master,record.profile),predicted=prediction(result,record.predicted.order,record.predicted.cast);return {predicted,comparison:compare(predicted,record.observations)};}
root.Measurement36={prediction,compare,create,recompute,explain};
})(typeof window==='undefined'?globalThis:window);
