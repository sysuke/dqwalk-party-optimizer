'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),A=require('node:assert/strict');
const c=vm.createContext({console});c.window=c;
for(const f of require('../scripts/entrypoints.cjs').browser.filter(f=>f!=='ui/app.js'))vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../dist',f),'utf8'),c,{filename:f});
function test(name,run){run();console.log('PASS '+name);}
const M=c.Measurement36;
test('unknown critical guard cannot become a successful match through a zero lower bound',()=>{
 const result={complete:false,logs:[{order:0,damage:{min:0,max:100000,guardUnknown:true}}]};
 const p=M.prediction(result,0),r=M.compare(p,[6055]);A.equal(r.outside,0);A.equal(r.status,'unresolved');A(r.unresolved.some(s=>s.includes('会心ガード')));
});
test('reference and incomplete formula comparisons remain pending, even inside the displayed range',()=>{
 for(const d of [{referenceOnly:true},{}]){const p=M.prediction({complete:false,logs:[{order:0,damage:{min:100,max:120,...d}}]},0);A.equal(M.compare(p,[110]).status,'unresolved');}
 A.equal(M.compare({min:100,max:120},[110]).status,'unresolved');
});
test('fully specified comparisons distinguish model range from correctness and detect outliers',()=>{
 const p=M.prediction({complete:true,logs:[{order:0,damage:{min:100,max:120}}]},0);
 A.equal(M.compare(p,[100,120]).status,'within-modeled-range');A.equal(M.compare(p,[99]).status,'outside-modeled-range');
});
test('measured accessories add speed and spell/taijutsu bonuses without inventing slash damage',()=>{
 const m=c.PlannerData.real,p=c.PlannerData.profile(m),actor=c.SequenceUI.defaults().actors[3];actor.hearts=[];
 const base=c.SequenceEngine.build({...actor,armors:[]},m,p),gear=c.SequenceEngine.build({...actor,armors:['hagumeta-charm','slalike-medal-plus']},m,p);
 A.equal(gear.stats.speed-base.stats.speed,41);A.equal(gear.stats.mp-base.stats.mp,8);
 const sum=(b,type)=>c.AutoDamage.sum(b,'general',type,'イオ','マシン系');
 A.equal(sum(gear,'斬撃'),sum(base,'斬撃'));A(Math.abs(sum(gear,'体技')-sum(base,'体技')-.05)<1e-9);A(Math.abs(sum(gear,'呪文')-sum(base,'呪文')-.03)<1e-9);
 A.equal(m.items.find(i=>i.id==='battlemaster-book').bonuses.length,0);
});
