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
test('all four reported loadouts resolve except the unconfirmed Estark variant',()=>{
 A.equal(report.cases.length,4);for(const row of report.cases){A.deepEqual(row.unresolvedCatalogue,[{name:'地獄の帝王エスターク',status:'variant-unconfirmed'}]);A(row.status.startsWith('not-comparable'));A(row.missingIndependentInputs.length>0);}
 A.equal(report.cases[0].coverage.equipment.find(x=>x.name==='ほしふるうでわ').matches[0].id,'meteor-bracelet');
});
test('likely transcendent domain remains a qualified followup instead of a confirmed replacement',()=>{
 const row=report.cases.find(x=>x.observed===67674);A(row.domain.followup.includes('超越'));A.equal(row.domain.certainty,'probable-not-confirmed');A(!row.domain.reported.includes('超越'));
});
