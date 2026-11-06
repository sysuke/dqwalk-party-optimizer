'use strict';
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x)),gearKeys=['weapon','limitBreak','left','leftLimitBreak','inherit','inheritLevel','proficiency','hearts','armors','initial'];
function calibrated(a){return a.actualAttack!=null||a.actualMagic!=null;}
function favored(a,master){const type=root.Catalog9.weapons.find(w=>w.id===a.weapon)?.type;return !!master.jobs.find(j=>j.id===a.job)?.favoredTypes?.includes(type);}
function favoredCount(config,master){return config?.actors.reduce((n,a)=>n+Number(favored(a,master)),0)||0;}
// Move the complete equipment/skill role while preserving each person's job,
// levels, unlocks and job-specific conditions. Never carry calibrated display
// stats over to different equipment.
function permute(config,sources,master){
 const count=config.actors.length;if(!Array.isArray(sources)||sources.length!==count||new Set(sources).size!==count||sources.some(i=>!Number.isInteger(i)||i<0||i>=count))return null;
 if(sources.some((source,destination)=>source!==destination&&(calibrated(config.actors[source])||calibrated(config.actors[destination]))))return null;
 const q=clone(config),destinations=[];sources.forEach((source,destination)=>{destinations[source]=destination;const role=config.actors[source],actor=q.actors[destination];for(const key of gearKeys){if(role[key]===undefined)delete actor[key];else actor[key]=clone(role[key]);}actor.favored=favored(actor,master);});
 q.actions=q.actions.map(action=>({...action,actor:destinations[action.actor],...(action.target==null?{}:{target:destinations[action.target]})}));return q;
}
function exchange(config,i,j,master){const sources=config.actors.map((_,n)=>n);sources[i]=j;sources[j]=i;return permute(config,sources,master);}
function permutations(ids){return ids.length?ids.flatMap((id,i)=>permutations(ids.filter((_,j)=>i!==j)).map(rest=>[id,...rest])):[[]];}

function changeJob(config,index,job,master,profile,settings){const old=config.actors[index],level=profile.characters[old.member]?.levels[job]||0;if(!level||job===old.job||calibrated(old))return null;const q=clone(config),a=q.actors[index];a.job=job;a.pathUnlocked=!!settings.allowPaths&&level>=30;a.encoreUnlocked=a.pathUnlocked&&job==='job-2';a.rootUnlocked=a.pathUnlocked&&job==='job-8';a.cheerUnlocked=old.member===0&&settings.allowCheer!==false;a.magePath=a.pathUnlocked&&job==='job-1'?(settings.magePaths?.[old.member]||'none'):'none';a.majinCritical20=level>=20?(settings.majinCriticalPaths?.[old.member]?.lv20||0):0;a.majinCritical40=level>=40?(settings.majinCriticalPaths?.[old.member]?.lv40||0):0;a.majinPathCritical=false;a.favored=favored(a,master);return q;}
function search(seeds,master,profile,settings,evaluate,compare,budget=96){
 let calls=0,improvements=0,permutationCalls=0,best=null;const seen=new Set(),end=settings._deadline||Infinity;
 for(const seed of seeds){seen.add(JSON.stringify(seed.config));if(!best||compare(seed,best)<0)best=seed;}
 if(!best)return {calls,improvements,permutationCalls,best:null};const before=best.damage;
 for(let round=0;round<2&&calls<budget&&Date.now()<end;round++){
  const parents=round===0?seeds.slice(0,3):[best],start=JSON.stringify(best.config);
  for(const parent of parents){
   if(calls>=budget||Date.now()>=end)break;
   const candidates=[],add=(config,permutation=false)=>{if(config)candidates.push({config,permutation});};
   for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)add(exchange(parent.config,i,j,master));
   if(settings.rolePermutations!==false)for(const sources of permutations([0,1,2,3]))if(sources.filter((source,i)=>source!==i).length>2)add(permute(parent.config,sources,master),true);
   for(let i=0;i<4;i++)for(const job of master.jobs)add(changeJob(parent.config,i,job.id,master,profile,settings));
   // Prefer compatible transfers, but keep non-favoured support weapons legal.
   candidates.sort((a,b)=>favoredCount(b.config,master)-favoredCount(a.config,master));
   for(const {config,permutation} of candidates){
    if(calls>=budget||Date.now()>=end)break;
    const key=JSON.stringify(config);if(seen.has(key))continue;seen.add(key);calls++;if(permutation)permutationCalls++;
    let result;try{result=evaluate(config);}catch{continue;}
    if(result?.resourceOK&&compare(result,best)<0){best=result;improvements++;}
   }
  }
  if(JSON.stringify(best.config)===start)break;
 }
 return {calls,improvements,permutationCalls,beforeDamage:before,afterDamage:best.damage,best,scope:'育成済み職業を保った最大4人の装備・手順の役割配分と、単独の職業変更を再計算。職業固定の武器制限は加えない。'};
}

root.RoleAssignment38={exchange,permute,changeJob,search,favoredCount};
})(typeof window==='undefined'?globalThis:window);
