'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),A=require('node:assert/strict'),c=vm.createContext({console});c.window=c;
for(const f of require('../scripts/entrypoints.cjs').browser.filter(f=>f!=='ui/app.js'))vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../dist',f),'utf8'),c,{filename:f});
const m=c.PlannerData.real,p=c.PlannerData.profile(m),M=c.Measurement36,clone=x=>JSON.parse(JSON.stringify(x));
function setup(){const q=c.SequenceUI.defaults();q.actions=q.actors.map((_,i)=>({actor:i,skill:i===3?'dragonfang':'wait',target:i}));Object.assign(q.actors[3],{weapon:'gun',inherit:'',hearts:[],armors:['dragonfang-pearl-critical-s','dragonfang-pearl-critical-s'],actualAttack:1796,confirmedCritical:true});return q;}
function test(name,run){run();console.log('PASS '+name);}
test('single physical hit trace uses the same formula and reproduces the unguarded result',()=>{
 const result=c.SequenceEngine.simulate(setup(),m,p),pred=M.prediction(result,4),before=JSON.stringify(pred),trace=M.explain(pred);
 A.equal(trace.first.min,pred.min);A.equal(trace.first.max,pred.max);A.equal(trace.first.stages.min.third,pred.min);A.equal(trace.first.stages.max.third,pred.max);A.equal(JSON.stringify(pred),before);
 A.equal(trace.factors.criticalBoost,1);A.equal(pred.bonuses.filter(b=>b.group==='skillCorrection').length,2);
});
test('trace is explicitly before critical guard and never silently replaces the final damage',()=>{
 const q=setup();q.enemy.critGuard=true;q.enemy.critGuardReduction=90;
 const r=c.SequenceEngine.simulate(q,m,p),pred=M.prediction(r,4),trace=M.explain(pred);
 A.equal(Math.floor(trace.first.min*.1),pred.min);A.equal(Math.floor(trace.first.max*.1),pred.max);A(trace.scope.includes('適用前'));
});
test('charge is consumed only on the first hit of a physical explanation',()=>{
 const pred={params:{attack:1796,defense:1000,multiplier:1700,criticalType:'super',charge:2,hits:2}};
 const r=M.explain(pred);A.equal(r.first.min,r.subsequent.min*2);A(r.first.max>r.subsequent.max);A.equal(M.explain({params:{magic:1950}}),null);
});
test('measurement snapshot preserves equipment and hearts even if the live build changes',()=>{
 const q=setup(),r=c.SequenceEngine.simulate(q,m,p),record=M.create({result:r,configuration:q,profile:p,order:4,observations:[r.logs[3].damage.min],kind:'measured'}),saved=clone(record.predicted.equipment);
 r.builds[3].parts.length=0;A.deepEqual(JSON.parse(JSON.stringify(record.predicted.equipment)),saved);A(record.predicted.equipment.some(x=>x.label.includes('祖竜')));
});
test('measurement UI displays the combined damage-taken factor without multiplying its components again',()=>{
 const q=setup(),r=c.SequenceEngine.simulate(q,m,p);
 const record=M.create({result:r,configuration:q,profile:p,order:4,observations:[r.logs[3].damage.min],kind:'measured'});
 record.predicted.params.freezeLevel=1;record.predicted.params.typeDebuff=20;
 c.localStorage={getItem:()=>JSON.stringify([record])};
 const nodes={},node=s=>nodes[s]||(nodes[s]={innerHTML:'',querySelector:node,querySelectorAll:()=>[]});
 c.MeasurementUI36.mount({target:node('target'),result:r,configuration:q,profile:p,master:m});
 const html=node('#measure-records').innerHTML;
 A(html.includes('凍結＋斬体被ダメージ補正（合成） ×1.3'));
 A(!html.includes('凍結 ×1.1'));A(!html.includes('被ダメージ増加 ×1.2'));A(!html.includes('damageTakenGroup'));
});
