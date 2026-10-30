'use strict';
const fs=require('node:fs');
const {loadRuntime}=require('./runtime.cjs');
function template(){const keys=Object.keys(loadRuntime().PhysicalCalculator.defaults());return {
 params:Object.fromEntries(keys.map(key=>[key,null])),sources:Object.fromEntries(keys.map(key=>[key,''])),
 criticalGuard:{active:null,reduction:null,source:''}};}

// Explicit inputs only: never infer battle state or fit a measured damage value.
function trace(snapshot={}){
 const c=loadRuntime(),defaults=c.PhysicalCalculator.defaults(),params=snapshot.params||{},sources=snapshot.sources||{};
 const missing=[];
 for(const [key,value]of Object.entries(defaults)){
  if(!Object.hasOwn(params,key)||params[key]===null||typeof params[key]!==typeof value)missing.push('params.'+key);
  if(typeof sources[key]!=='string'||!sources[key].trim())missing.push('sources.'+key);
 }
 const guard=snapshot.criticalGuard||{};
 if(typeof guard.active!=='boolean')missing.push('criticalGuard.active');
 if(typeof guard.source!=='string'||!guard.source.trim())missing.push('criticalGuard.source');
 if(guard.active&&(!Number.isFinite(guard.reduction)||guard.reduction<0||guard.reduction>100))missing.push('criticalGuard.reduction');
 if(missing.length)return {status:'unresolved',missing};
 for(const key of Object.keys(params))if(!Object.hasOwn(defaults,key))throw Error('未対応の入力：'+key);
 if(params.hits!==1)throw Error('実測1発の照合にはhits:1を指定してください');
 const result=c.PhysicalCalculator.calculate({...params,includeTrace:true});
 const applies=guard.active&&params.criticalType!=='normal',rate=applies?1-guard.reduction/100:1;
 return {status:'conditional-model-trace',warning:'入力の出典は未検証。実機一致・公式内部式の認証ではない。観測値は計算に使用しない。',
  inputs:{params:{...params},sources:{...sources},criticalGuard:{...guard}},
  effectiveAttack:result.effectiveAttack,effectiveDefense:result.effectiveDefense,
  base:result.hit.base,spread:Math.floor(result.hit.base/16),
  corrections:JSON.parse(JSON.stringify(result.corrections)),factors:JSON.parse(JSON.stringify(result.factors)),
  stages:JSON.parse(JSON.stringify(result.hit.stages)),
  beforeGuard:{min:result.min,max:result.max},
  guard:{applied:applies,rate},afterGuard:{min:Math.floor(result.min*rate),max:Math.floor(result.max*rate)}};
}
if(require.main===module){
 try{if(process.argv.length!==3)throw Error('Usage: node scripts/trace-measurement.cjs <snapshot.json>');
  const result=process.argv[2]==='--template'?template():trace(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));
  if(result.status==='unresolved')process.exitCode=2;
 }catch(error){console.error(error.message);process.exitCode=1;}
}
module.exports={trace,template};
