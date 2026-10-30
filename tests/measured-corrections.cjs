'use strict';
const A=require('node:assert/strict'),{report}=require('../scripts/measured-corrections.cjs');
function test(name,run){run();console.log('PASS '+name);}
const rows=report();
test('Tokiwatari measurement keeps its shield, level and corrections separate from Majin',()=>{
 const row=rows.find(row=>row.observed===551);
 A.equal(row.usedInputs.job,'job-9');A.equal(row.usedInputs.level,86);A.equal(row.usedInputs.displayAttack,1514);
 A.equal(row.usedInputs.twoHanded,false);A.equal(row.usedInputs.inheritance.proficiency,1);
 A.equal(row.confirmed.path,null);A.equal(row.confirmed.weather,null);
 A.deepEqual(row.rawPercentPoints,{slash:71,io:40,critical:31,criticalPathAddition:0,dragonRace:0,machineRace:0,skillSpecific:20});
 A(row.unresolved.some(s=>s.includes('巡行道')));
});
test('observed damage never changes computed attacker corrections and unresolved variants fail closed',()=>{
 const fixture=JSON.parse(JSON.stringify(require('./fixtures/measured/greynarl-rift-551.json')));
 const before=report([fixture])[0];fixture.observation.damagePerHit=999999;
 const after=report([fixture])[0];A.equal(after.observed,999999);
 A.deepEqual(after.rawPercentPoints,before.rawPercentPoints);A.deepEqual(after.appliedBonuses,before.appliedBonuses);
 fixture.actor.hearts[0]='かみさま';A.throws(()=>report([fixture]),/候補を一意に選べません/);
});
test('reported sunny Majin loadouts share the same independently computed raw corrections',()=>{
 A.equal(rows.length,4);for(const row of rows.filter(row=>row.usedInputs.job==='job-8')){A.equal(row.usedInputs.displayAttack,1796);A.deepEqual(row.rawPercentPoints,{slash:85,io:27,critical:36,criticalPathAddition:50,dragonRace:0,machineRace:0,skillSpecific:20});A.equal(row.skill.singleEnemyMultiplierPercent,1700);A.equal(row.skill.criticalType,'super');}
 A.equal(rows.find(row=>row.observed===67674).confirmed.displayAttack,null);A(rows.find(row=>row.observed===67674).assumptions.some(s=>s.includes('仮引継ぎ')));
 const zoneFixture=require('./fixtures/measured/killer-machine2-ruins-zone-67674.json');
 A.equal(zoneFixture.actor.limitBreak,0);A(!('limitBreak' in zoneFixture.normalization.inheritedUnconfirmed));
 const zoneRow=rows.find(row=>row.observed===67674);A(!zoneRow.assumptions.some(s=>s.includes('0凸')));
 A.equal(zoneFixture.actor.displayAttackBeforeBuffs,null);A.equal(zoneFixture.followup.status,'probable-not-confirmed');
});
test('confirmed awakened Estark is used but no final damage is fabricated with enemy inputs missing',()=>{
 for(const row of rows){A(row.usedInputs.hearts.some(h=>h.id==='estark'&&h.name.includes('覚醒')));A(!row.assumptions.some(s=>s.includes('エスターク')&&s.includes('未確認')));A(row.unresolved.length>0);A.equal(row.status,'conditional-attacker-corrections-only');A(!('min' in row));A(!('max' in row));}
});
test('repeated diagnosis is deterministic and preserves the reported observations',()=>{
 A.deepEqual(report(),rows);A.deepEqual(rows.map(row=>row.observed),[551,6055,43197,67674]);
});
test('ruins reduction evidence stays separate from raw corrections and Greynarl guard',()=>{
 const audit=require('../scripts/audit-measurements.cjs').audit();
 for(const row of rows){
  const isRuins=[43197,67674].includes(row.observed);
  A.equal(row.researchEvidence.length,isRuins?1:0);
  if(isRuins){const evidence=row.researchEvidence[0];A.equal(evidence.reportedDamageTakenReductionPercent,80);A.equal(evidence.status,'secondary-source-reported-not-integrated');A.equal(evidence.source,'https://9db.jp/dqwalk/data/8573');A.deepEqual(audit.cases.find(x=>x.id===row.id).researchEvidence,row.researchEvidence);}
  A(!('critGuardReduction' in row));A(!('min' in row));A(!('max' in row));
 }
});
test('dragonfang strong force keeps raw element bonuses and mutation separate from ruins reduction',()=>{
 const c=require('../scripts/runtime.cjs').loadRuntime();
 for(const row of rows){A.deepEqual(row.attributeHandling.originalElements,['無']);A.equal(row.attributeHandling.forceStrong,true);}
 // Synthetic enemy resistance: checks current model semantics, not a measured enemy input.
 const sample=c.PhysicalCalculator.calculate({elementBonus:27,elementResistance:90,forcedResistance:-50,force:false});
 A.equal(sample.corrections.element,27);A.equal(sample.corrections.elementResistance,40);A.equal(sample.factors.elementResistance,.6);
 const normalForce=c.PhysicalCalculator.calculate({elementBonus:27,elementResistance:90,forcedResistance:-50,force:true});
 A.equal(normalForce.corrections.element,13);
});
