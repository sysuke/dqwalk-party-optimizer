'use strict';
(function(root){
const elements=['無','メラ','ヒャド','ギラ','バギ','イオ','ドルマ','デイン','ジバリア','ザバ'];
const floor3=x=>Math.floor(x*1000+1e-8)/1000;
// Stabilize decimal game percentages at integer rounding boundaries.
const stableFloor=x=>Math.floor(x+1e-8),stableCeil=x=>Math.ceil(x-1e-8);
function sum(b,group,type,element,race){if(group==='element'&&element==='無')return 0;return (b.bonuses||[]).filter(x=>x.group===group&&(!x.type||x.type===type)&&(!x.element||x.element===element)&&(!x.race||x.race===race)).reduce((v,x)=>v+x.value,0);}
function tension(level){return [1,1.1,1.2,1.3,1.5][level]??1;}
function typeRate(base,enemyT=0,domain='none'){return Math.max(0,1-(1-base)*tension(enemyT)+(domain==='brave'?.2:0));}
function physical(p){
 for(const k of ['attack','defense','multiplier'])if(!Number.isFinite(p[k])||p[k]<0)throw Error('物理式の入力が不正です：'+k);
 const base=Math.max(0,stableFloor(p.attack*(1+.2*(p.attackStages||0))/2-(p.direct?0:p.defense/4))),spread=Math.floor(base/16);
 for(const [key,value] of Object.entries(p))if(typeof value==='number'&&!Number.isFinite(value))throw Error('有限の数値を入力してください：'+key);
 const shared=(p.multiplier)*floor3(1+(p.slash||0)+(p.skillBuff||0))*floor3(1+(p.elementBonus||0))*floor3(1+(p.raceBonus||0))*Math.max(0,p.resistance??1)*(p.critical?(p.criticalBoost||1):1)*(p.nameRate??1)*(p.causalityRate??1)*(p.resistChangeRate??1)*(p.typeDebuffRate??1);
 const critical=p.critical?1.6+(p.criticalExtra||0)+(p.criticalBonus||0):1;
 const stage=(v,c)=>{const first=stableFloor(v*shared*c),second=stableFloor(first*(p.skillCorrection??1)*(p.charge??1)),third=Math.max(0,stableCeil(second*(p.dualRate??1)));if(![first,second,third].every(Number.isSafeInteger))throw Error('計算結果が安全な整数範囲を超えています。入力値を確認してください。');return {base:v,first,second,third};};const finish=(v,c)=>stage(v,c).third;
 const min=finish(Math.max(0,base-spread-1),p.criticalMin??critical);
 const max=Math.max(min,finish(base+spread+1,p.criticalMax??critical));
 return {min,max,base,critical,shared,...(p.includeTrace?{stages:{min:stage(Math.max(0,base-spread-1),p.criticalMin??critical),max:stage(base+spread+1,p.criticalMax??critical)}}:{}),formula:'物理：基礎値×倍率×斬体/補助×属性×系統×耐性×会心×二刀流'};
}
function spell(p){const magic=Math.min(1950,Math.max(15,p.magic)),base=Math.floor(300+(magic-15)*3300/1935),factor=(1+(p.general||0)+(p.skillBuff||0))*(1+(p.elementBonus||0))*(1+(p.raceBonus||0))*(p.resistance??1)*(p.echoRate??1);return {min:Math.max(0,Math.floor(base*.95*factor)),max:Math.max(0,Math.floor(base*1.05*factor)),base,formula:'時荒らし：魔力15→300、1950→3600の検証式×各補正（乱数±5%を仮定）'};}
function attack(build,s,actor,enemy,options={}){
 const type=s.skill==='timewave'?'呪文':s.skill==='rondo'?'体技':'斬撃',t=tension(build.tension||0),active=enemy.effects||[],has=id=>active.some(e=>e.id===id),enemyT=has('tension')?3:0;
 const domain=options.domain||'roto',race='ドラゴン系',buff=actor.buffs||{};
 const forced=actor.rainbow&&type==='斬撃',choices=forced?elements.slice(1):[type==='呪文'?'ザバ':s.skill==='rondo'?'バギ':'無'];
 const rows=choices.map(element=>{
 let er=(options.elements||{無:1,メラ:.8,ヒャド:.4,ギラ:.2,バギ:.2,イオ:.6,ドルマ:.6,デイン:.4,ジバリア:.6,ザバ:1})[element]??1;
 er=Math.max(0,1-(1-er)*tension(enemyT));if(domain==='roto'&&element==='デイン')er+=.5;
 const tr=typeRate(type==='体技'?1:.6,enemyT,domain)*(has('physicalResist')&&type!=='呪文'?.8:1);
 const general=sum(build,'general',type,element,race)*t,elementBonus=sum(build,'element',type,element,race)*t*(forced?.5:1),raceRaw=sum(build,'race',type,element,race);
 const raceBonus=raceRaw*(t+(s.skill==='eradicate'?3:0)+(options.mindExtra||0));
 const isCritical=actor.criticalActions>0&&!has('critGuard');
 const stages=Math.min(buff.partner?3:2,(build.dragonStart?2:0)+(buff.baishion?1:0)+(buff.partner?1:0));
 let row;
 if(type==='呪文')row=spell({magic:build.stats.magic,general,elementBonus,raceBonus,skillBuff:0,resistance:er*tr,echoRate:options.cast?options.echoRate??.5:1});
 else if(s.skill==='rondo'){
  // Attack/magic hybrid's exact base varies by formula; deliberately isolated and marked estimated.
  row=physical({attack:build.stats.attack+build.stats.magic,defense:options.defense??1000,multiplier:2.6,slash:general,elementBonus,raceBonus,resistance:er*tr,critical:false});row.formula+=' / ロンド攻魔複合の基礎を近似';
 }else{
  const skillBuff=(actor.criticalActions>0?.5:0)+(buff.cheer||0),criticalBonus=sum(build,'critical',null,null,null)*t;
  const params={attack:build.stats.attack,defense:options.defense??1000,multiplier:11,direct:true,attackStages:stages,slash:general,skillBuff,elementBonus,raceBonus,resistance:er*tr,critical:isCritical,criticalExtra:build.job==='job-8'?.5+(options.majinPathCritical||0):0,criticalBonus,criticalBoost:buff.rondo||buff.insight?1.4:1};
  if(root.PhysicalCalculator){const d=PhysicalCalculator.calculate({attack:build.stats.attack,defense:options.defense??1000,multiplier:1100,hits:build.left?2:1,direct:true,attackStages:stages,slash:general*100,skillBuff:skillBuff*100,elementBonus:elementBonus*100,raceBonus:raceBonus*100,criticalType:isCritical?'single':'normal',criticalExtra:params.criticalExtra*100,criticalBonus:criticalBonus*100,criticalBoost:params.criticalBoost,dualRate:build.left?.4+(build.dualBonus||0):1,typeResistance:(1-tr)*100,elementResistance:(1-er)*100});row={...d,base:d.hit.base,formula:d.hit.formula};}else{row=physical({...params,dualRate:build.left?.4+(build.dualBonus||0):1});if(build.left){const left=physical({...params,dualRate:.4+(build.dualBonus||0)});row.min+=left.min;row.max+=left.max;row.hits=2;}}

 }
 return {...row,element,type,typeRate:tr,elementRate:er,raceBonus,stages,forced,criticalGuaranteed:isCritical};
 });
 return rows.sort((a,b)=>b.min-a.min||b.max-a.max)[0];
}
root.AutoDamage={physical,spell,attack,sum,tension,typeRate,elements};
})(typeof window==='undefined'?globalThis:window);
