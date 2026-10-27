'use strict';
// The shared catalog files expose their globals through window; in a worker
// the same plain global object is self (no DOM is needed by the calculation).
self.window=self;
importScripts(
  '../domain/battle/heart-stats.js',
  '../data/contents.js',
  '../data/profiles.js',
  '../data/quick-catalog.js',
  '../domain/damage/combat-rules.js',
  '../data/rules.js',
  '../data/master.js',
  '../domain/damage/damage.js',
  '../domain/damage/physical-calculator.js',
  '../domain/damage/mana-rules.js',
  '../domain/damage/spell-calculator.js',
  '../data/catalog/base.js',
  '../data/catalog/skills.js',
  '../data/catalog/equipment.js',
  '../data/catalog/opening-costs.js',
  '../data/catalog/expansion.js',
  '../data/catalog/research.js',
  '../data/catalog/white-hearts.js',
  '../data/catalog/attribute-hearts.js',
  '../data/catalog/spell-expansion.js',
  '../data/catalog/procs.js',
  '../data/catalog/support-tools.js',
  '../data/catalog/mana-skills.js',
  '../data/catalog/mage-tools.js',
  '../data/catalog/physical-equipment.js',
  '../data/catalog/measurement-items.js',
  '../domain/battle/buff-state.js',
  '../domain/battle/proc-probability.js',
  '../domain/battle/resource-rules.js',
  '../domain/battle/sequence-engine.js',
  '../domain/optimization/gear-optimizer.js',
  '../data/catalog/job-weapons.js',
  '../domain/optimization/loadout-optimizer.js'
);

self.onmessage=e=>{try{const engine=e.data.options?.mode==='loadout'?LoadoutOptimizer:GearOptimizer;self.postMessage({result:engine.solve(e.data.config,e.data.master,e.data.profile,e.data.options,p=>self.postMessage({progress:p}))});}catch(error){self.postMessage({error:error.message});}};
