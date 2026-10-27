'use strict';
const A=require('node:assert/strict'),{report}=require('../scripts/measured-corrections.cjs');
function test(name,run){run();console.log('PASS '+name);}
const rows=report();
test('reported sunny Majin loadouts share the same independently computed raw corrections',()=>{
 A.equal(rows.length,3);for(const row of rows){A.equal(row.usedInputs.displayAttack,1796);A.deepEqual(row.rawPercentPoints,{slash:85,io:27,critical:36,criticalPathAddition:50,dragonRace:0,machineRace:0,skillSpecific:20});A.equal(row.skill.singleEnemyMultiplierPercent,1700);A.equal(row.skill.criticalType,'super');}
 A.equal(rows.find(row=>row.observed===67674).confirmed.displayAttack,null);A(rows.find(row=>row.observed===67674).assumptions.some(s=>s.includes('仮引継ぎ')));
});
test('confirmed awakened Estark is used but no final damage is fabricated with enemy inputs missing',()=>{
 for(const row of rows){A(row.usedInputs.hearts.some(h=>h.id==='estark'&&h.name.includes('覚醒')));A(!row.assumptions.some(s=>s.includes('エスターク')&&s.includes('未確認')));A(row.unresolved.length>0);A.equal(row.status,'conditional-attacker-corrections-only');A(!('min' in row));A(!('max' in row));}
});
test('repeated diagnosis is deterministic and preserves the reported observations',()=>{
 A.deepEqual(report(),rows);A.deepEqual(rows.map(row=>row.observed),[6055,43197,67674]);
});
