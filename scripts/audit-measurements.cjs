'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
// Ignore orthographic differences, but retain rank/awakening markers.
const normalize=s=>s.normalize('NFKC').replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/[\s【】（）()・!！]/g,'');
function load(){const c=vm.createContext({console});c.window=c;
 for(const f of require('./entrypoints.cjs').browser.filter(f=>f!=='ui/app.js'))vm.runInContext(fs.readFileSync(path.join(root,'dist',f),'utf8'),c,{filename:f});
 return c;
}
function resolve(rows,name){
 const summarize=r=>({id:r.id,name:r.name,bonuses:r.bonuses,unmodeled:r.unmodeled,assumptions:r.assumptions});
 const matches=rows.filter(r=>normalize(r.name)===normalize(name));
 if(matches.length)return {name,status:matches.length===1?'matched':'ambiguous',matches:matches.map(summarize)};
 const family=s=>normalize(s).replace(/S覚醒|覚醒|通常/g,'');
 const alternatives=rows.filter(r=>family(r.name)===family(name));
 return {name,status:alternatives.length?'variant-unconfirmed':'missing',matches:[],alternatives:alternatives.map(summarize)};
}
function audit(){const c=load(),catalog=c.Catalog9,items=c.PlannerData.real.items;
 const cases=fs.readdirSync(path.join(root,'tests/fixtures/measured')).filter(n=>n.endsWith('.json')).map(n=>JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/measured',n),'utf8')));
 const report=cases.map(x=>{const coverage={weapon:resolve(catalog.weapons,x.actor.weapon),inheritance:resolve(catalog.weapons,x.actor.inheritance.weapon),hearts:x.actor.hearts.map(name=>resolve(catalog.hearts,name)),equipment:x.actor.equipment.map(name=>resolve(items,name))};
  const all=[coverage.weapon,coverage.inheritance,...coverage.hearts,...coverage.equipment];
  return {id:x.id,observed:x.observation.damagePerHit,status:'not-comparable-until-independent-inputs-complete',missingIndependentInputs:x.unknowns,
   domain:{reported:x.domain,followup:x.followup?.domainLikely||null,certainty:x.followup?.status||'as-reported'},
   unresolvedCatalogue:all.filter(r=>r.status!=='matched').map(r=>({name:r.name,status:r.status})),coverage};});
 return {cases:report,warning:'Coverage does not validate ranks, heart slots, buffs, resistances or the damage formula. No observation is fitted into a coefficient.'};
}
if(require.main===module)console.log(JSON.stringify(audit(),null,2));
module.exports={audit,resolve,normalize};
