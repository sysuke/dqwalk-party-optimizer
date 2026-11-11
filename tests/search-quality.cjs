'use strict';
const A=require('node:assert/strict'),{loadRuntime}=require('../scripts/runtime.cjs'),{cases}=require('./fixtures/search-quality.cjs'),c=loadRuntime(),m=c.PlannerData.real;
for(const fixture of cases(c)){
 const before=JSON.stringify(fixture),r=c.PartyBattle.simulate(fixture.reference,m,fixture.profile,fixture.settings);
 A(r.resourceOK,r.reason);A(r.damage>0);if(fixture.settings.requireOrder){A(r.orderOK);A(r.enemyFirst);}A(r.mp.every(x=>x>=0));A.equal(r.turnStarts.length,fixture.settings.turns);A.equal(c.PartyBattle.inventory(fixture.reference,m,fixture.profile).issues.length,0);A.equal(JSON.stringify(fixture),before);
 const repeated=c.PartyBattle.simulate(fixture.reference,m,fixture.profile,fixture.settings);A.equal(repeated.damage,r.damage);
 if(fixture.id==='spell-roles-2t'){
  const found=c.PartyPlanner.solve(m,fixture.profile,fixture.enemy,fixture.settings),best=found.results[0];
  A(best.orderDamageRange.complete);A.equal(best.orderDamageRange.resourceFailures,0);const range=c.OrderRobust27.verify(best,m,fixture.profile,c.PartyBattle.validate(fixture.settings),q=>c.PartyBattle.simulate(q,m,fixture.profile,fixture.settings),64);A.equal(best.orderDamageRange.minDamage,range.minDamage);A.equal(best.orderDamageRange.maxDamage,range.maxDamage);A.equal(best.orderDamageRange.checked,range.checked);A(best.orderDamageRange.maxDamage<best.damage);A(best.resourceOK);A(best.damage>=r.damage,'既知の呪文・兼任補助手順を同じ評価上限で下回る');A(found.nodes<=fixture.settings.maxNodes);A(found.shortPlanRefinement.calls<=32);for(const skill of ['tokumori','cheer'])A(best.config.actions.some(a=>a.skill===skill),skill);const without=c.PartyPlanner.solve(m,fixture.profile,fixture.enemy,{...fixture.settings,shortPlanRefinement:false});A(best.damage>without.results[0].damage);A.equal(c.PartyBattle.simulate(best.config,m,fixture.profile,fixture.settings).damage,best.damage);A.equal(JSON.stringify(fixture),before);
 }
 console.log('PASS 品質基準 '+fixture.id+' の所持品・MP・全ターンと再計算を検証');
}
