'use strict';
// Structural benchmarks, not measured game damage or a claim of optimal play.
function cases(c){
 const m=c.PlannerData.real,copy=x=>JSON.parse(JSON.stringify(x));
 const physical=[2,5,9].map(turns=>{
  const profile=c.PlannerData.profile(m),job=m.jobs.find(j=>j.id==='job-8'),base=job.levels[80];
  profile.characters.forEach(ch=>ch.levels={'job-8':80});
  profile.baseOverrides=Object.fromEntries([0,1,2,3].map(i=>[i+':job-8',{level:80,cost:base.cost,stats:{...base.stats,attack:2000,mp:300}}]));
  for(const row of profile.inventory){const item=m.items.find(i=>i.id===row.id);row.count=(item.slot==='weapon'&&item.name==='勇者のつるぎ'&&!item.limitBreak)||item.id==='blair-awakened'?4:0;}
  const enemy={name:'構造検証用の敵',race:'その他',count:1,defense:1000,typeResistance:0,enemyTension:0,elements:Object.fromEntries(c.AutoDamage.elements.map(e=>[e,0]))},settings={objective:'damage',turns,hp:1e8,allowPaths:false,allowInheritance:false,allowDual:false,zoneScenario:'none',maxNodes:1000,maxPoolNodes:4000,maxTimeMs:30000};
  const actors=[0,1,2,3].map(member=>({member,job:'job-8',weapon:'hero',limitBreak:0,initial:false,hearts:['blair-awakened'],armors:[]}));
  const config={actors,enemy:copy(enemy),domain:'none',actions:Array.from({length:turns},(_,i)=>actors.map((_,actor)=>({actor,turn:i+1,skill:i<Math.min(turns,3)?'fullslash':'wait',target:actor}))).flat()};
  return {id:'physical-mp-'+turns+'t',kind:'synthetic',description:'MP内で強い技を使い、残りを待機する固定手順',profile,enemy,settings,reference:config};
 });
 const profile=c.PlannerData.profile(m),jobs=['job-5','job-0','job-1','job-2'],levels=[87,89,84,87],weapons=['gun','moon','paradox-staff','dharma-staff'];
 profile.characters.forEach((ch,i)=>ch.levels={[jobs[i]]:levels[i]});
 const actors=weapons.map((weapon,member)=>({member,job:jobs[member],weapon,limitBreak:0,left:'',inherit:member===1?'keki':'',inheritLevel:member===1?1:0,inheritLimitBreak:0,initial:true,pathUnlocked:true,cheerUnlocked:member===0,encoreUnlocked:member===3,hearts:[],armors:[]}));
 const slot=m.jobs.find(j=>j.id===jobs[0]).slots.map((s,i)=>s==='虹'?i:-1).filter(i=>i>=0).at(-1)??0;actors[0].hearts[slot]='phantom-dragon-awakened';actors[0].hearts[slot===0?1:0]='donburi-king';actors[2].armors=['adjust-shield'];actors[2].zone=true;actors[2].confirmedSpellCritical=true;
 const content=m.contents.find(x=>x.id==='giga'),e=content.enemies[0],enemy={name:e.name,count:1,race:e.race,defense:e.defense,enemyTension:0,typeResistance:60,typeResistances:{斬撃:60,体技:60,呪文:30},elements:Object.fromEntries(Object.entries(e.elements).map(([k,v])=>[k,Math.round((1-v)*100)])),specialMechanics:true};
 const reference={actors,enemy,domain:'auto',aiPolicy:'assume-selected',strictDurations:true,actions:[{actor:1,turn:1,skill:'rondo'},{actor:2,turn:1,skill:'overdrive'},{actor:2,turn:1,skill:'true-magic-release'},{actor:0,turn:1,skill:'tokumori',target:2},{actor:3,turn:1,skill:'dharma-prayer',target:2},{actor:1,turn:2,skill:'rondo'},{actor:2,turn:2,skill:'forbidden-burst'},{actor:0,turn:2,skill:'cheer',target:2},{actor:3,turn:2,skill:'encore',target:2},{actor:2,turn:2,skill:'forbidden-burst'}]};
 const used=c.PartyBattle.inventory(reference,m,profile).used;profile.inventory.forEach(row=>row.count=used[row.id]||0);
 return [...physical,orderedSpeed(c),require('./late-order.cjs')(c),{id:'spell-roles-2t',kind:'structural-reference',description:'参考記事の白領域・ロンド・真魔解放・祈り・おうえん・アンコール。実測火力の再現ではない',profile,enemy,reference,settings:{objective:'damage',turns:2,hp:e.hp,shieldRates:content.breakChallenge.rates,shieldMaxHP:content.breakChallenge.maxHP,newWorldGoal:'白',allowPaths:true,allowCheer:true,allowInheritance:true,allowAI:true,zoneScenario:'main',spellProcScenario:'triggered',maxNodes:1000,maxPoolNodes:6000,maxTimeMs:30000}}];
}
function orderedSpeed(c){
 const m=c.PlannerData.real,profile=c.PlannerData.profile(m),job=m.jobs.find(j=>j.id==='job-8'),base=job.levels[80];
 profile.characters.forEach(ch=>ch.levels={'job-8':80});profile.baseOverrides=Object.fromEntries([0,1,2,3].map(i=>[i+':job-8',{level:80,cost:base.cost,stats:{...base.stats,attack:2000,mp:300,speed:100}}]));
 for(const row of profile.inventory){const item=m.items.find(i=>i.id===row.id);row.count=item.slot==='weapon'&&item.name==='勇者のつるぎ'&&!item.limitBreak||item.id==='blair-awakened'?4:0;}
 for(const speed of [500,250,100]){const id='fixture-speed-'+speed;if(!m.items.some(i=>i.id===id))m.items.push({id,name:'構造検証用速度帽'+speed,slot:'head',verifiedModel:true,stats:{speed},bonuses:[]});const owned=profile.inventory.find(row=>row.id===id);if(owned)owned.count=1;else profile.inventory.push({id,count:1});}
 const enemy={name:'速度装備競合の構造検証',race:'その他',defense:1000,count:1,typeResistance:0,enemyTension:0,elements:Object.fromEntries(c.AutoDamage.elements.map(e=>[e,0]))},settings={objective:'damage',turns:1,hp:1e8,requireOrder:true,enemySpeedMax:50,ratio:1.2,allowPaths:false,allowDual:false,zoneScenario:'none',maxNodes:1000,maxPoolNodes:4000,maxTimeMs:30000},actors=[0,1,2,3].map(member=>({member,job:'job-8',weapon:'hero',limitBreak:0,initial:false,hearts:['blair-awakened'],armors:['',member<3?'fixture-speed-'+[500,250,100][member]:'']})),reference={actors,enemy,domain:'none',strictDurations:true,actions:actors.map((_,actor)=>({actor,turn:1,skill:'fullslash',target:actor}))};
 return {id:'ordered-speed-1t',kind:'synthetic',description:'架空の所持1個ずつの速度帽。速度比1.2と敵速度50のモデル内成立を検証',profile,enemy,settings,reference};
}
module.exports={cases,orderedSpeed};
