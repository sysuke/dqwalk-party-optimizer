'use strict';
const fixture=require('./complementary-plan.cjs');
function physical(c){const f=fixture(c);f.settings={...f.settings,turns:1,allowAI:false,newWorldGoal:'auto',objective:'break',hp:40000,shieldMaxHP:40000,shieldRates:[.1,.2,.3,.5]};f.profile.characters.forEach((ch,i)=>ch.levels={[i===3?'job-2':'job-0']:80});const base=f.master.jobs.find(j=>j.id==='job-0').levels[80];f.profile.baseOverrides={'0:job-0':{level:80,cost:base.cost,stats:{...base.stats,attack:2000,mp:100}}};f.config.actors=[0,1,2,3].map(member=>({member,job:member===3?'job-2':'job-0',weapon:'hero',limitBreak:0,initial:false,hearts:member===0?['arm-lion']:[],armors:[],pathUnlocked:true,encoreUnlocked:member===3}));f.config.domain='none';f.config.aiPolicy='manual';return f;}
function long(c){const f=fixture(c);f.settings={...f.settings,turns:9};f.profile.baseOverrides['0:job-1'].stats.mp=600;return f;}
module.exports={physical,long};
