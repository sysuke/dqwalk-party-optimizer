'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),A=require('node:assert/strict'),c=vm.createContext({console});c.window=c;
for(const f of require('../scripts/entrypoints.cjs').browser.filter(f=>f!=='ui/app.js'))vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../dist',f),'utf8'),c,{filename:f});
const m=c.PlannerData.real,p=c.PlannerData.profile(m),clone=x=>JSON.parse(JSON.stringify(x));for(const ch of p.characters)for(const j of m.jobs)ch.levels[j.id]=94;
for(const row of p.inventory)if(m.items.find(i=>i.id===row.id)?.name==='勇者のつるぎ')row.count=4;
const q=clone(c.SequenceUI.defaults());q.domain='none';q.strictDurations=true;q.actors=q.actors.map((a,i)=>({...a,member:i,job:i===0?'job-2':'job-8',weapon:'hero',inherit:'',left:'',hearts:[],armors:[],actualAttack:i===3?1800:100,actualMagic:50,initial:true,encoreUnlocked:i===0,rootUnlocked:i===3,pathUnlocked:true}));
q.enemy={name:'補助探索回帰',race:'ドラゴン系',defense:1000,count:1,typeResistance:0,enemyTension:0,elements:Object.fromEntries(c.AutoDamage.elements.map(e=>[e,0]))};q.actions=q.actors.map((_,actor)=>({actor,turn:1,skill:actor===3?'eradicate-fullslash':'fullslash'}));
const settings=c.PartyBattle.validate({turns:1,hp:1e7,objective:'damage',minHP:0,minSpeed:0,requireOrder:false,requireSurvival:false}),seed=c.PartyBattle.simulate(q,m,p,settings),pools=[[],[],[],[]];
pools[0]=[{actor:clone(q.actors[0]),supportKind:'encore'}];pools[1]=[{actor:{...clone(q.actors[1]),hearts:['donburi-king']},supportKind:'adaptiveBuff'}];pools[2]=[{actor:{...clone(q.actors[2]),weapon:'moon',inherit:'keki',inheritLevel:1},supportKind:'rondo'}];
// The attacker needs a real source of charge. Both the baseline and alternatives
// keep it; support replacements must not conjure a charge skill.
q.actors[3].hearts=['arm-lion'];seed.config.actors[3].hearts=['arm-lion'];
const results=[];const stats=c.SupportLoadouts25.search([seed],pools,m,p,settings,config=>{const r=c.PartyBattle.simulate(config,m,p,settings);results.push(r);return r;},64);
const complete=results.filter(r=>r.steps.some(s=>s.skill==='encore')&&r.steps.some(s=>s.skill==='tokumori')&&r.steps.some(s=>s.skill==='rondo')&&r.steps.some(s=>s.skill==='normalcharge'));
A(complete.length,'Three simultaneous support replacements and charge must reach the real evaluator within 64 calls');A(stats.calls<=64);
const best=complete.sort((a,b)=>b.damage-a.damage)[0],stripped=clone(best.config);stripped.actions=stripped.actions.map(a=>['tokumori','rondo','normalcharge'].includes(a.skill)?{...a,skill:'wait'}:a);
A(best.damage>c.PartyBattle.simulate(stripped,m,p,settings).damage,'Complete setup must be compared using simulated damage');
console.log('PASS 3人の補助装備とアンコール準備を64候補以内で実計算する');
A(c.FocusSearch35.patterns({...q,actors:best.config.actors},3,{turns:2})[1].length>0);
console.log('PASS 補助探索の評価はダメージ計算の結果を利用する');

