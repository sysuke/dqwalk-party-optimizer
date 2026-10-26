'use strict';
importScripts(
  '../domain/damage/combat-rules.js',
  '../domain/damage/damage.js',
  '../domain/damage/physical-calculator.js',
  '../data/catalog/job-passives.js',
  '../domain/optimization/auto-optimizer.js'
);
self.onmessage=e=>{try{self.postMessage({result:AutoOptimizer.solve(e.data.master,e.data.profile,e.data.settings)});}catch(error){self.postMessage({error:error.message});}};
