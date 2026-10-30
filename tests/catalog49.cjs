'use strict';
const assert=require('node:assert/strict');
const {audit}=require('../scripts/catalog-audit.cjs');
const report=audit();
assert.deepEqual(report.issues,[]);
console.log('PASS final catalogue has unique IDs, finite heart stats and valid skill references');
assert(report.jobs.some(row=>row.placeholderNotes.length));
assert(report.contents.some(row=>row.placeholderNotes.length));
console.log('PASS audit retains unresolved job and enemy assumptions');
const sandy=report.hearts.find(row=>row.id==='sandy');
assert.equal(sandy.color,'黄+紫');assert.equal(sandy.cost,171);
assert.equal(sandy.stats.dex,50);assert.equal(sandy.stats.magic,131);
assert(sandy.bonuses.some(b=>b.type==='呪文'&&b.value===.07));
assert(sandy.bonuses.some(b=>b.element==='バギ'&&b.value===.07));
assert.deepEqual(report.items.find(row=>row.id==='sandy').stats,sandy.stats);
console.log('PASS researched Sandy heart is shared by inventory and detailed calculation');
const legs=report.items.find(row=>row.id==='perseria-spell-2');
assert.equal(legs.stats.defense,70);assert.equal(legs.placeholderNotes.length,0);
console.log('PASS directly confirmed Perseria defense no longer carries inferred-value warning');
const robe=report.items.find(row=>row.id==='camyu-physical-0');
assert(robe.missingDataNotes.some(note=>note.includes('0凸守備力は未収録')));
assert(!Object.hasOwn(robe.stats,'defense'));
assert(report.items.find(row=>row.id==='camyu-physical-1').stats.defense===79);
console.log('PASS audit distinguishes missing defense from a confirmed zero or a researched value');
for(const [id,attack]of [['ocean-0',187],['ocean-4',244]]){
 const row=report.items.find(item=>item.id===id);
 assert.equal(row.stats.attack,attack);assert.equal(row.checked,'2026-10-29');
 assert.equal(row.source,'https://game8.jp/dqwalk/769134');
 assert(!row.placeholderNotes.some(note=>note.includes('能力値は仮')));
 assert(row.needsReview.some(note=>note.includes('未再現')));
}
console.log('PASS Ocean attack uses independently published zero and four limit-break values while retaining mechanic limits');
for(const [id,attack,magic,heal]of [['crystal-0',61,17,105],['crystal-4',80,20,120]]){
 const row=report.items.find(item=>item.id===id);
 assert.deepEqual({...row.stats},{attack,magic,heal});assert.equal(row.source,'https://game8.jp/dqwalk/595626');
 assert.equal(row.bonuses.length,0);assert(row.needsReview.some(note=>note.includes('回復式は仮')));
}
const master=require('../scripts/runtime.cjs').loadRuntime().PlannerData.real;
assert.equal(master.items.find(row=>row.id==='crystal-0').baseStats.heal,85);
assert.equal(master.items.find(row=>row.id==='crystal-4').baseStats.heal,100);
assert.equal(master.items.find(row=>row.id==='crystal-0').levelStatBonuses.heal,20);
const healSkill=master.skills.find(row=>row.id==='crystal-heal');assert.equal(healSkill.mp,63);
assert(healSkill.assumptions.some(note=>note.includes('仮')));
console.log('PASS Crystal separates weapon stats and learned healing magic without a fictitious limit-break damage bonus');
for(const job of master.jobs){
 for(const [level,cost]of [[1,259],[49,526],[50,532],[57,554],[58,558],[80,643],[94,724],[95,730]])assert.equal(job.levels[level].cost,cost);
 assert.equal(job.costSource,'https://9db.jp/dqwalk/data/1426');assert.equal(job.costChecked,'2026-10-29');
 assert(job.assumptions.some(note=>note.includes('基礎能力')&&note.includes('仮')));
 for(let level=2;level<=95;level++)assert(job.levels[level].cost>=job.levels[level-1].cost);
}
console.log('PASS published job costs replace low-level estimates and intermediate interpolation without certifying base stats');
