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
 const base=PartyBattle.simulate(clear(config),master,profile,settings);if(settings.zoneScenario!=='main'&&!(settings.conditionalTension>0))return base;
 const damage=base.builds.map((_,actor)=>base.steps.filter(s=>s.actor===actor&&s.damage).reduce((n,s)=>n+s.damage.min,0)),lead=damage.indexOf(Math.max(...damage)),q=clear(config),a=q.actors[lead];
 if(settings.zoneScenario==='main'&&!a.zone){a.zone=true;a.assumedZone=true;}
 if(settings.conditionalTension>0&&(base.turnStarts[0].states[lead].tension||0)<[0,10,20,30,50][settings.conditionalTension]){a.tensionBeforeAssumption=a.tensionLevel??'auto';a.tensionLevel=settings.conditionalTension;a.assumedTension=true;}
 const r=PartyBattle.simulate(q,master,profile,settings);r.conditionsMet=false;r.scenarioComparison={lead,without:{damage:base.damage,damageMax:base.damageMax,maxSimultaneous:base.breakChallenge?.maxSimultaneous,killed:base.killed,resourceOK:base.resourceOK},with:{damage:r.damage,damageMax:r.damageMax,maxSimultaneous:r.breakChallenge?.maxSimultaneous,killed:r.killed,resourceOK:r.resourceOK},scope:'装備・手順を固定。指定した確率ゾーン・テンションの成立前提だけを比較。他の指定した確率効果は維持。'};return r;
}
root.ProcProbability35={summarize,clear,scenario};
})(typeof window==='undefined'?globalThis:window);


