'use strict';
const {loadRuntime}=require('./runtime.cjs'),{cases}=require('../tests/fixtures/search-quality.cjs');
const c=loadRuntime(),m=c.PlannerData.real,rows=[];
for(const fixture of cases(c)){
 if(process.argv.includes('--late-order-only')&&fixture.id!=='late-order-2t')continue;
 if(process.argv.includes('--ordered-only')&&fixture.id!=='ordered-speed-1t')continue;
 if(process.argv.includes('--spell-only')&&fixture.id!=='spell-roles-2t')continue;
 const reference=c.PartyBattle.simulate(fixture.reference,m,fixture.profile,fixture.settings);
 if(!reference.resourceOK)throw Error(fixture.id+': reference fails resource conditions: '+reference.reason);
 const started=performance.now(),found=c.PartyPlanner.solve(m,fixture.profile,fixture.enemy,{...fixture.settings,...(process.argv.includes('--without-strategy-teams')?{strategyTeams:false}:{}),...(process.argv.includes('--without-complementary-macros')?{complementaryMacros:false}:{}),...(process.argv.includes('--without-temporal-plans')?{temporalPlans:false}:{}),...(process.argv.includes('--without-late-order-repair')?{lateOrderRepair:false}:{}),...(process.argv.includes('--without-atomic-speed-repair')?{atomicSpeedRepair:false}:{}),...(process.argv.includes('--without-long-plan-refinement')?{longPlanRefinement:false}:{})}),best=found.results?.[0];
 const replay=best&&c.PartyBattle.simulate(best.config,m,fixture.profile,fixture.settings);
 if(best&&(!replay.resourceOK||replay.damage!==best.damage))throw Error(fixture.id+': result cannot be replayed');
 rows.push({id:fixture.id,orderDamageSearch:found.orderDamageSearch,orderResilient:found.results?.filter(r=>r.orderResilient).map(r=>({damage:r.damage,range:r.orderDamageRange})),orderDamageRange:best?.orderDamageRange,shortPlanRefinement:found.shortPlanRefinement,strategyTeams:found.strategyTeams,orderRepair:found.orderRepair,kind:fixture.kind,referenceDamage:reference.damage,referenceOrderOK:reference.orderOK,searchDamage:best?.damage??null,referenceRatio:best?Number((best.damage/reference.damage).toFixed(4)):null,resourceOK:best?.resourceOK??false,orderOK:best?.orderOK??false,nodes:found.nodes,poolNodes:found.poolNodes,truncated:found.truncated,elapsedMs:Math.round(performance.now()-started)});
}
console.log(JSON.stringify({schemaVersion:1,scope:'Synthetic structural cases; not real measurement reproduction or optimality proof. Ratio below 1 identifies a missed known resource-valid plan; order must be checked separately. Time-limited runs may differ.',cases:rows},null,2));
