'use strict';
const A=require('node:assert/strict'),{loadRuntime}=require('../scripts/runtime.cjs');
function test(name,run){run();console.log('PASS '+name);}
test('audit runtime loads final data without UI and isolates mutations across runs',()=>{
 const first=loadRuntime(),count=first.Catalog9.hearts.length;A.equal(first.document,undefined);A.equal(first.SequenceUI,undefined);A.equal(typeof first.SequenceEngine.build,'function');
 first.Catalog9.hearts.pop();A.equal(loadRuntime().Catalog9.hearts.length,count);
});
test('researched armor separates base defense and passives without double counting',()=>{
 const c=loadRuntime(),m=c.PlannerData.real,p=c.PlannerData.profile(m),helmet=m.items.find(i=>i.id==='yugunoa-helmet-0'),legs=m.items.find(i=>i.id==='world-tree-ruin-legs-0');
 A.equal(helmet.baseStats.defense,79);A.equal(helmet.passiveStats.defense,5);A.equal(helmet.stats.defense,84);A.equal(legs.stats.defense,78);
 const actor={member:0,job:'job-5',weapon:'moon',hearts:[],armors:[]},bare=c.SequenceEngine.build(actor,m,p),geared=c.SequenceEngine.build({...actor,armors:[helmet.id,legs.id]},m,p);
 A.equal(geared.stats.defense-bare.stats.defense,162);A.equal(geared.stats.attack,bare.stats.attack);
});
test('known trousers defense is filled while unknown robe defense stays unknown',()=>{
 const m=loadRuntime().PlannerData.real,legs=m.items.find(i=>i.id==='camyu-physical-1'),body=m.items.find(i=>i.id==='camyu-physical-0');
 A.equal(legs.stats.defense,79);A.equal(body.stats.defense,undefined);A(body.assumptions.some(s=>s.includes('逆算しない')));
});
