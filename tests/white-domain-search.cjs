'use strict';
const A = require('node:assert/strict');
const { loadRuntime } = require('../scripts/runtime.cjs');
const c = loadRuntime(), m = c.PlannerData.real, p = c.PlannerData.profile(m);
const jobs = ['job-5', 'job-0', 'job-1', 'job-2'], levels = [87, 89, 84, 87];
p.characters.forEach((ch, i) => ch.levels = { [jobs[i]]: levels[i] });
const weapons = ['gun', 'moon', 'keki', 'paradox-staff', 'dharma-staff'];
for (const row of p.inventory) {
  const item = m.items.find(i => i.id === row.id);
  if (item.slot === 'weapon') row.count = weapons.some(id => c.Catalog9.weapons.find(w => w.id === id).name === item.name) && !item.limitBreak ? 1 : 0;
}
// Weak synthetic stats make this a color-preservation regression, not an attack-ranking test.
for (const heart of c.Catalog9.hearts.filter(h => h.color === '白')) {
  heart.stats = Object.fromEntries(Object.keys(heart.stats).map(key => [key, 0]));
  heart.bonuses = [];
}
const content = m.contents.find(x => x.id === 'giga'), e = content.enemies[0];
const enemy = {
  name: e.name, race: e.race, count: 1, defense: e.defense, enemyTension: 0,
  typeResistance: 60, typeResistances: { 斬撃: 60, 体技: 60, 呪文: 30 },
  elements: Object.fromEntries(Object.entries(e.elements).map(([key, value]) => [key, Math.round((1 - value) * 100)]))
};
const settings = {
  hp: e.hp, turns: 2, objective: 'damage', allowPaths: true, allowInheritance: true,
  newWorldGoal: '白', allowAI: true, maxNodes: 240, maxPoolNodes: 6000, maxTimeMs: 30000
};
const result = c.PartyPlanner.solve(m, p, enemy, settings);
A.equal(result.status, 'ok');
A(result.results.every(row => row.worldColor === '白'));
for (const row of result.results) A.equal(c.PartyBattle.inventory(row.config, m, p).issues.length, 0);
A(result.nodes <= 240);
for (const row of p.inventory) if (m.items.some(item => item.id === row.id && item.slot === 'heart' && item.color === '白')) row.count = 0;
const unavailable = c.PartyPlanner.solve(m, p, enemy, { ...settings, maxNodes: 160, maxPoolNodes: 4000 });
A.equal(unavailable.status, 'infeasible');
A(unavailable.issues.some(issue => issue.includes('領域色')));
console.log('PASS 火力候補から落ちる白でも指定領域を比較し、未所持の白を補完しない');
