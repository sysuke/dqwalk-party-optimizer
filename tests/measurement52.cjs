'use strict';
const A=require('node:assert/strict'),{audit,resolve}=require('../scripts/audit-measurements.cjs');
function test(name,run){run();console.log('PASS '+name);}
test('orthographic differences resolve without dropping plus or awakening variants',()=>{
 A.equal(resolve([{id:'charm',name:'はぐメタのお守り'}],'はぐめたのお守り').status,'matched');
 A.equal(resolve([{id:'medal',name:'スラいいね！の勲章＋'}],'スラいいねの勲章+').status,'matched');
 A.equal(resolve([{id:'medal',name:'スラいいね！の勲章＋'}],'スラいいねの勲章').status,'missing');
 const variant=resolve([{id:'estark',name:'地獄の帝王エスターク（覚醒）'}],'地獄の帝王エスターク');A.equal(variant.status,'variant-unconfirmed');A.equal(variant.matches.length,0);A.equal(variant.alternatives[0].id,'estark');
});
test('a normalized collision stays ambiguous rather than taking the first row',()=>{
 A.equal(resolve([{id:'a',name:'はぐメタ'},{id:'b',name:'はぐめた'}],'はぐめた').status,'ambiguous');
});
const report=audit();
test('all four reported loadouts resolve after the user confirms awakened Estark',()=>{
 A.equal(report.cases.length,4);for(const row of report.cases){A.deepEqual(row.unresolvedCatalogue,[]);A(row.coverage.hearts.some(h=>h.matches.some(m=>m.id==='estark')));A(row.status.startsWith('not-comparable'));A(row.missingIndependentInputs.length>0);}
 A.equal(report.cases[0].coverage.equipment.find(x=>x.name==='ほしふるうでわ').matches[0].id,'meteor-bracelet');
});
test('likely transcendent domain remains a qualified followup instead of a confirmed replacement',()=>{
 const row=report.cases.find(x=>x.observed===67674);A(row.domain.followup.includes('超越'));A.equal(row.domain.certainty,'probable-not-confirmed');A(!row.domain.reported.includes('超越'));
});
test('confirmed paths and sunny weather apply only to the three Majin measurements',()=>{
 const majin=report.cases.filter(x=>x.observed!==551);A.equal(majin.length,3);
 for(const row of majin)A.deepEqual(row.confirmedCalculatorInputs,{weather:'sunny',majinCritical20:25,majinCritical40:25});
 A.deepEqual(report.cases.find(x=>x.observed===551).confirmedCalculatorInputs,{weather:null,majinCritical20:null,majinCritical40:null});
});
test('confirmed path and weather bonuses enter the existing build without adding attack twice',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),c=vm.createContext({console});c.window=c;
 for(const f of require('../scripts/entrypoints.cjs').browser.filter(f=>f!=='ui/app.js'))vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../dist',f),'utf8'),c,{filename:f});
 const m=c.PlannerData.real,p=c.PlannerData.profile(m);p.characters[0].levels['job-8']=94;
 const a={member:0,job:'job-8',weapon:'gun',limitBreak:0,favored:true,hearts:[],armors:['yugunoa-helmet-0','world-tree-ruin-legs-0'],actualAttack:1796};
 const base=c.SequenceEngine.build(a,m,p,{weather:'unknown'}),confirmed=c.SequenceEngine.build({...a,majinCritical20:25,majinCritical40:25},m,p,{weather:'sunny'});
 const sum=(b,g)=>c.AutoDamage.sum(b,g,'斬撃','イオ','マシン系');
 A.equal(confirmed.majinPath.critical,50);A(Math.abs(sum(confirmed,'general')-sum(base,'general')-.02)<1e-9);
 A(Math.abs(sum(confirmed,'critical')-sum(base,'critical')-.03)<1e-9);A(Math.abs(sum(confirmed,'element')-sum(base,'element')-.03)<1e-9);
 A.equal(base.stats.attack,1796);A.equal(confirmed.stats.attack,1796);
});
