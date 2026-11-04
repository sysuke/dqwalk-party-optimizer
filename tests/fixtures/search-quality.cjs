'use strict';
// Structural benchmarks, not measured game damage or a claim of optimal play.
function cases(c){
 const m=c.PlannerData.real,copy=x=>JSON.parse(JSON.stringify(x));
 return [2,5,9].map(turns=>{
  const profile=c.PlannerData.profile(m),job=m.jobs.find(j=>j.id==='job-8'),base=job.levels[80];
  profile.characters.forEach(ch=>ch.levels={'job-8':80});
  profile.baseOverrides=Object.fromEntries([0,1,2,3].map(i=>[i+':job-8',{level:80,cost:base.cost,stats:{...base.stats,attack:2000,mp:300}}]));
  for(const row of profile.inventory){const item=m.items.find(i=>i.id===row.id);row.count=(item.slot==='weapon'&&item.name==='勇者のつるぎ'&&!item.limitBreak)||item.id==='blair-awakened'?4:0;}
  const enemy={name:'構造検証用の敵',race:'その他',count:1,defense:1000,typeResistance:0,enemyTension:0,elements:Object.fromEntries(c.AutoDamage.elements.map(e=>[e,0]))},settings={objective:'damage',turns,hp:1e8,allowPaths:false,allowInheritance:false,allowDual:false,zoneScenario:'none',maxNodes:1000,maxPoolNodes:4000,maxTimeMs:30000};
  const actors=[0,1,2,3].map(member=>({member,job:'job-8',weapon:'hero',limitBreak:0,initial:false,hearts:['blair-awakened'],armors:[]}));
  const config={actors,enemy:copy(enemy),domain:'none',actions:Array.from({length:turns},(_,i)=>actors.map((_,actor)=>({actor,turn:i+1,skill:i<Math.min(turns,3)?'fullslash':'wait',target:actor}))).flat()};
  return {id:'physical-mp-'+turns+'t',kind:'synthetic',description:'MP内で強い技を使い、残りを待機する固定手順',profile,enemy,settings,reference:config};
 });
}
module.exports={cases};
