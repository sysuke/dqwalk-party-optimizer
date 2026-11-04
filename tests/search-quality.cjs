'use strict';
const A=require('node:assert/strict'),{loadRuntime}=require('../scripts/runtime.cjs'),{cases}=require('./fixtures/search-quality.cjs'),c=loadRuntime(),m=c.PlannerData.real;
for(const fixture of cases(c)){
 const before=JSON.stringify(fixture),r=c.PartyBattle.simulate(fixture.reference,m,fixture.profile,fixture.settings);
 A(r.resourceOK,r.reason);A(r.damage>0);A(r.mp.every(x=>x>=0));A.equal(r.turnStarts.length,fixture.settings.turns);A.equal(c.PartyBattle.inventory(fixture.reference,m,fixture.profile).issues.length,0);A.equal(JSON.stringify(fixture),before);
 const repeated=c.PartyBattle.simulate(fixture.reference,m,fixture.profile,fixture.settings);A.equal(repeated.damage,r.damage);
 console.log('PASS 品質基準 '+fixture.id+' の所持品・MP・全ターンと再計算を検証');
}
