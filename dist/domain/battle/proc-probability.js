'use strict';
(function(root){
function summarize(result,settings={}){
 const rates=settings.procRates||{},events=[],assumptions=[];
 for(const l of result.steps||result.logs||[]){if(!l.damage)continue;if(l.aiControlled)events.push({id:'ai-'+l.order,kind:'ai',label:'AIが指定した攻撃を選ぶ',rate:null});const a=result.builds[l.actor].actor,d=l.damage,paid=d.paidCasts||1;
  const event=(kind,count,label)=>{for(let n=0;n<count;n++)events.push({id:[l.order,l.actor,kind,n].join(':'),actor:l.actor,turn:l.turn,kind,label:kind==='echo'&&root.MageTools37?.active(l.before)?label+'（魔響の発動率1.6倍を適用）':label,rate:rates[kind]==null?null:kind==='echo'&&root.MageTools37?root.MageTools37.echoRate(rates[kind]/100,l.before):rates[kind]/100});};
  if(a.confirmedSpellCritical&&d.spell&&!d.guaranteedByRate)event('critical',d.casts?.length||paid,'呪文暴走');
  if(a.confirmedContinuous&&a.job==='job-1'&&!l.before.continuous&&paid===2)event('continuous',1,'確率の連続呪文');
  if(a.confirmedEcho&&a.job==='job-1'&&d.spell&&!l.before.zone)event('echo',paid,'やまびこ');
 }
 const zones=new Set((result.builds||[]).filter(b=>b.actor.zone).map(b=>b.actor.member));for(const member of zones)events.push({id:'zone-'+member,kind:'zone',label:'発動済み指定のゾーン',rate:rates.zone==null?null:rates.zone/100});
 for(const b of result.builds||[])if(b.actor.assumedTension)events.push({id:'tension-'+b.actor.member,kind:'tension',label:'指定テンションが必要な攻撃まで成立',rate:rates.tension==null?null:rates.tension/100});
 const unknown=events.filter(e=>e.rate==null),independent=settings.independentProcs===true,probability=events.length===0?1:!unknown.length&&(events.length===1||independent)?events.reduce((n,e)=>n*e.rate,1):null;
 if(events.length&&independent)assumptions.push('各発動判定を独立と仮定。入力した1判定あたりの発動率を乗算。相関・判定回数が実機と異なる場合は一致しません。');
 return {probability,events,unknown:unknown.length,independent,assumptions,scope:'表示ダメージに必要な指定効果の同時発動のみ。行動順・命中・敵行動・特殊ギミック・討伐確率を含みません。'};
}
function clear(config){const q=JSON.parse(JSON.stringify(config));for(const a of q.actors){if(a.assumedZone){a.zone=false;delete a.assumedZone;}if(a.assumedTension){a.tensionLevel=a.tensionBeforeAssumption??'auto';delete a.assumedTension;delete a.tensionBeforeAssumption;}}return q;}
function scenario(config,master,profile,settings){
 const base=PartyBattle.simulate(clear(config),master,profile,settings);if(!['main','all'].includes(settings.zoneScenario)&&!(settings.conditionalTension>0))return base;
 const damage=base.builds.map((_,actor)=>base.steps.filter(s=>s.actor===actor&&s.damage).reduce((n,s)=>n+s.damage.min,0)),lead=damage.indexOf(Math.max(...damage)),q=clear(config);
 for(const index of settings.zoneScenario==='all'?[0,1,2,3]:[lead]){const a=q.actors[index];if(['main','all'].includes(settings.zoneScenario)&&!a.zone){a.zone=true;a.assumedZone=true;}if(settings.conditionalTension>0&&(base.turnStarts[0].states[index].tension||0)<[0,10,20,30,50][settings.conditionalTension]){a.tensionBeforeAssumption=a.tensionLevel??'auto';a.tensionLevel=settings.conditionalTension;a.assumedTension=true;}}
 const r=PartyBattle.simulate(q,master,profile,settings);r.conditionsMet=false;r.scenarioComparison={lead,without:{damage:base.damage,damageMax:base.damageMax,maxSimultaneous:base.breakChallenge?.maxSimultaneous,killed:base.killed,resourceOK:base.resourceOK},with:{damage:r.damage,damageMax:r.damageMax,maxSimultaneous:r.breakChallenge?.maxSimultaneous,killed:r.killed,resourceOK:r.resourceOK},scope:'装備・手順を固定。指定した確率ゾーン・テンションの成立前提だけを比較。他の指定した確率効果は維持。'};return r;
}
// Re-evaluate legal plans with fewer assumption kinds; never infer missing rates.
function reduceRequirements(seed,master,profile,settings,evaluate,budget=8){
 const clone=x=>JSON.parse(JSON.stringify(x)),before=seed.realization||summarize(seed,settings),kinds=new Set(before.events.map(e=>e.kind)),end=settings._deadline||Infinity,variants=[],seen=new Set();let calls=0,result=null;
 if(!kinds.size||budget<1||Date.now()>=end)return {result,calls};
 const remove=(config,kind)=>{for(const a of config.actors){if(kind==='critical')a.confirmedSpellCritical=false;if(kind==='echo')a.confirmedEcho=false;if(kind==='continuous')a.confirmedContinuous=false;if(kind==='zone'&&a.assumedZone){a.zone=false;a.confirmedEcho=false;delete a.assumedZone;}if(kind==='tension'&&a.assumedTension){a.tensionLevel=a.tensionBeforeAssumption??'auto';delete a.assumedTension;delete a.tensionBeforeAssumption;}}return config;};
 const manual=config=>{const parts=SupportLoadouts25.chunks(config.actions);for(let i=0;i<parts.length;i++){const index=parts[i].findIndex(a=>['autoRelease','mageChant'].includes(Catalog9.skills.find(k=>k.id===a.skill)?.kind));if(index<0)continue;const prep=parts[i][index],available=SequenceEngine.available(config.actors[prep.actor]).filter(k=>k.kind==='attack'&&k.type==='呪文'),ids=[prep.aiSkill,...parts[i].slice(index+1).map(a=>a.skill),...seed.steps.filter(st=>st.actor===prep.actor&&st.damage?.spell).map(st=>st.skill)],id=ids.find(id=>available.some(k=>k.id===id));if(!id)return null;const follow=parts[i].slice(index+1).find(a=>a.actor===prep.actor&&a.skill===id),enemyTarget=follow?.enemyTarget??prep.enemyTarget;parts[i]=parts[i].slice(0,index).concat({actor:prep.actor,turn:prep.turn,skill:id,target:prep.actor,...(enemyTarget==null?{}:{enemyTarget})});}config.actions=parts.flat();config.aiPolicy='manual';return config;};
 for(const kind of ['critical','echo','continuous','zone','tension','ai'])if(kinds.has(kind)){const q=clone(seed.config),next=kind==='ai'?manual(q):remove(q,kind);if(next)variants.push(next);}
 let all=clone(seed.config);for(const kind of ['critical','echo','continuous','zone','tension'])all=remove(all,kind);all=manual(all);if(all)variants.push(all);
 for(const config of variants){if(calls>=budget||Date.now()>=end)break;const key=JSON.stringify([config.actors,config.actions,config.aiPolicy]);if(seen.has(key))continue;seen.add(key);calls++;let r;try{r=evaluate(config);}catch{continue;}if(!r?.resourceOK||r.mpKnown===false||seed.orderOK&&!r.orderOK||seed.enemyFirst&&!r.enemyFirst)continue;const realization=r.realization||summarize(r,settings);if(realization.events.some(e=>e.rate===0))continue;const remaining=new Set(realization.events.map(e=>e.kind));if(remaining.size>=kinds.size||[...remaining].some(kind=>!kinds.has(kind)))continue;
  if(result&&(r.damage<result.damage||r.damage===result.damage&&remaining.size>=result.conditionReduction.remainingKinds.length))continue;const removed=[...kinds].filter(kind=>!remaining.has(kind));result={...r,conditionReduced:true,conditionReduction:{baselineDamage:seed.damage,removedKinds:removed,removedLabels:[...new Set(before.events.filter(e=>removed.includes(e.kind)).map(e=>e.label))],remainingKinds:[...remaining]}};
 }
 return {result,calls};
}
function preset(id){if(id==='giga-zone-spell')return {spellBurst:false,zoneSpellBurst:true,allowAI:true,allowPaths:true,allowInheritance:true,newWorldGoal:'紫',zoneScenario:'main',conditionalTension:0,spellProcScenario:'triggered',continuousProcScenario:'guaranteed',minProcProbability:null};return id==='giga-spell'?{spellBurst:true,zoneSpellBurst:false,allowAI:true,allowPaths:true,allowInheritance:true,newWorldGoal:'紫',zoneScenario:'all',conditionalTension:4,spellProcScenario:'triggered',continuousProcScenario:'triggered',minProcProbability:null}:{spellBurst:false,zoneSpellBurst:false,newWorldGoal:'auto',zoneScenario:'none',conditionalTension:0,spellProcScenario:'guaranteed',continuousProcScenario:'guaranteed',allowAI:false,minProcProbability:null};}
root.ProcProbability35={summarize,clear,scenario,preset,reduceRequirements};
})(typeof window==='undefined'?globalThis:window);


