'use strict';
const A=require('node:assert/strict'),{trace,template}=require('../scripts/trace-measurement.cjs'),{loadRuntime}=require('../scripts/runtime.cjs');
function test(name,run){run();console.log('PASS '+name);}
// Synthetic inputs test mechanics only; these are not any of the four game measurements.
const c=loadRuntime(),params={...c.PhysicalCalculator.defaults(),attack:1514,multiplier:1700,criticalType:'super',criticalBonus:31,skillCorrection:20};
const snapshot={params,sources:Object.fromEntries(Object.keys(params).map(key=>[key,'synthetic test input'])),criticalGuard:{active:true,reduction:50,source:'synthetic test input'}};
test('missing values or their provenance cannot silently become zero-valued defaults',()=>{
 A(Object.values(template().params).every(value=>value===null));A.equal(trace(template()).status,'unresolved');
 A.equal(trace().status,'unresolved');
 for(const value of [undefined,null]){const input=structuredClone(snapshot);input.params.defense=value;const r=trace(input);A.equal(r.status,'unresolved');A(r.missing.includes('params.defense'));A(!('afterGuard' in r));}
 const input=structuredClone(snapshot);delete input.sources.enemyTension;A(trace(input).missing.includes('sources.enemyTension'));
});
test('trace reuses physical calculation and records guard as a separate final rounding stage',()=>{
 const expected=c.PhysicalCalculator.calculate({...params,includeTrace:true}),r=trace(snapshot);
 A.equal(r.status,'conditional-model-trace');A.equal(r.beforeGuard.min,expected.min);A.equal(r.beforeGuard.max,expected.max);
 A.equal(r.stages.min.third,expected.min);A.equal(r.stages.max.third,expected.max);
 A.equal(r.afterGuard.min,Math.floor(expected.min*.5));A.equal(r.afterGuard.max,Math.floor(expected.max*.5));
});
test('unknown guard stays unresolved and normal damage is not reduced by critical guard',()=>{
 const input=structuredClone(snapshot);delete input.criticalGuard.reduction;A.equal(trace(input).status,'unresolved');
 input.criticalGuard.reduction=50;input.params.criticalType='normal';const r=trace(input);A.equal(r.guard.applied,false);A.deepEqual(r.afterGuard,r.beforeGuard);
});
test('observations cannot affect trace and multi-hit or unknown parameter fields are rejected',()=>{
 A.deepEqual(trace({...snapshot,observed:551}),trace({...snapshot,observed:999999}));
 A.throws(()=>trace({...snapshot,params:{...params,hits:2}}),/hits:1/);
 A.throws(()=>trace({...snapshot,params:{...params,observation:551}}),/未対応/);
});
