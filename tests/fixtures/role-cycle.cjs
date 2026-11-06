'use strict';
// Controlled base values expose a local optimum of two-person role exchange.
// No measured game damage is being reproduced.
module.exports=function(c){
 const master=c.PlannerData.real,profile=c.PlannerData.profile(master),jobs=['job-8','job-4','job-1','job-2'],weapons=['hero','perseria','gun','dharma-staff'],stats=[[588,806],[2010,1812],[1900,988]];
 profile.characters.forEach((ch,i)=>ch.levels={[jobs[i]]:80});profile.baseOverrides={};
 stats.forEach(([attack,magic],i)=>{const base=master.jobs.find(j=>j.id===jobs[i]).levels[80];profile.baseOverrides[i+':'+jobs[i]]={level:80,cost:base.cost,stats:{...base.stats,attack,magic,mp:2000}};});
 const actors=weapons.map((weapon,member)=>({member,job:jobs[member],weapon,limitBreak:0,initial:false,hearts:[],armors:[],favored:master.jobs.find(j=>j.id===jobs[member]).favoredTypes.includes(c.Catalog9.weapons.find(w=>w.id===weapon).type),...(member===3?{actualMagic:500}:{})}));
 const enemy={name:'役割循環の構造検証',race:'その他',count:1,defense:1000,typeResistance:0,enemyTension:0,elements:Object.fromEntries(c.AutoDamage.elements.map(e=>[e,0]))},config={actors,enemy,domain:'none',actions:[{actor:2,turn:1,skill:'dragonfang'},{actor:0,turn:1,skill:'fullslash'},{actor:1,turn:1,skill:'love-stream'},{actor:3,turn:1,skill:'wait'}]};
 const used=c.PartyBattle.inventory(config,master,profile).used;profile.inventory.forEach(row=>row.count=used[row.id]||0);
 return {master,profile,config,settings:c.PartyBattle.validate({turns:1,hp:1e8,objective:'damage'})};
};
