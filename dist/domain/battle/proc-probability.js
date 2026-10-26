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
 const unknown=events.filter(e=>e.rate==null),independent=settings.independentProcs===true,probability=events.length===0?1:!unknown.length&&independent?events.reduce((n,e)=>n*e.rate,1):null;
 if(events.length&&independent)assumptions.push('各発動判定を独立と仮定。入力した1判定あたりの発動率を乗算。相関・判定回数が実機と異なる場合は一致しません。');
 return {probability,events,unknown:unknown.length,independent,assumptions,scope:'表示ダメージに必要な指定効果の同時発動のみ。行動順・命中・敵行動・特殊ギミック・討伐確率を含みません。'};
}
root.ProcProbability35={summarize};
})(typeof window==='undefined'?globalThis:window);
