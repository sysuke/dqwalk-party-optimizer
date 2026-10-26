'use strict';
(function(root){
const defaults=()=>({attack:1000,defense:1000,multiplier:1100,hits:1,attackStages:0,defenseStages:0,levelUp:0,levelDown:0,sword:0,slash:0,elementBonus:0,elementBuff:0,forceCharge:0,raceBonus:0,nameBonus:0,skillBuff:0,skillCorrection:0,criticalBonus:0,criticalExtra:0,criticalType:'normal',criticalBoost:1,charge:1,dualRate:1,allyTension:0,enemyTension:0,typeResistance:0,elementResistance:0,forcedResistance:0,forcedTypeResistance:0,resistChange:0,typeDebuff:0,causality:0,eradicate:0,direct:false,force:false});
function calculate(raw){
 const p={...defaults(),...raw};
 for(const k of Object.keys(defaults()))if(typeof defaults()[k]==='number'&&(!Number.isFinite(p[k])||Math.abs(p[k])>1e7))throw Error('数値を確認してください：'+k);
 for(const k of ['attack','defense','multiplier','sword','slash','raceBonus','nameBonus','skillBuff','skillCorrection','criticalBonus','criticalExtra','allyTension','enemyTension','eradicate','causality'])if(p[k]<0)throw Error('0以上で入力してください：'+k);
 if(p.elementBonus < -100)throw Error('属性ダメージ補正は-100%以上で入力してください');
 for(const [k,lo,hi]of [['hits',1,100],['attackStages',-3,3],['defenseStages',-3,3],['levelUp',0,20],['levelDown',0,10]])if(!Number.isInteger(p[k])||p[k]<lo||p[k]>hi)throw Error('段数・回数を確認してください：'+k);
 if(!['normal','single','multi','super'].includes(p.criticalType)||p.dualRate<0||p.dualRate>1||p.charge<1||p.charge>4||p.criticalBoost<1||p.criticalBoost>2)throw Error('会心・二刀流・補助倍率を確認してください');
 if(p.hits>1&&p.charge>1)throw Error('きあいためと複数ヒットの適用範囲は未検証です。1発ずつ指定してください。');if(p.typeDebuff < -100||p.typeDebuff>1000)throw Error('斬体の被ダメージ補正を確認してください');
 const percentFloor=x=>Math.floor(x+1e-8),ally=1+p.allyTension/100,enemyRes=v=>percentFloor(v*(1+(v>=0?1:-1)*p.enemyTension/100));
 const levelRate=percentFloor(1.04**p.levelUp*100)/100,enemyLevelRate=Math.ceil(.96**p.levelDown*100)/100;
 const effectiveAttack=p.attack+p.attack*p.attackStages*.2+percentFloor(p.attack*levelRate)-p.attack+percentFloor(p.sword*levelRate);
 const effectiveDefense=Math.max(0,percentFloor(p.defense*enemyLevelRate)+percentFloor(p.defense*p.defenseStages*.2));
 const slash=percentFloor(p.slash*ally),element=percentFloor((p.force?Math.floor(p.elementBonus/2):p.elementBonus)*ally)+(p.force?Math.floor(p.elementBuff/2):p.elementBuff),race=percentFloor(p.raceBonus*(ally+p.eradicate/100)),name=percentFloor(p.nameBonus*ally),critBonus=percentFloor(p.criticalBonus*ally);
 if(p.forceCharge<0||p.forceCharge>180||p.resistChange < -100||p.resistChange>1000)throw Error('属性補助を確認してください');
 const typeResistance=enemyRes(p.typeResistance)+p.forcedTypeResistance,elementResistance=enemyRes(p.elementResistance)+p.forcedResistance;
 const crits={normal:[1,1],single:[1.6,1.6],multi:[1.6,2],super:[2.3,2.7]}[p.criticalType],crit=p.criticalType!=='normal',addition=crit?(critBonus+p.criticalExtra)/100:0;
 const params={attack:effectiveAttack,defense:effectiveDefense,multiplier:p.multiplier/100,direct:p.direct,slash:slash/100,skillBuff:p.skillBuff/100,elementBonus:(element+p.forceCharge)/100,raceBonus:race/100,nameRate:1+name/100,causalityRate:1+p.causality/100,resistance:Math.max(0,1-typeResistance/100)*Math.max(0,1-elementResistance/100),resistChangeRate:Math.max(0,1+p.resistChange/100),typeDebuffRate:Math.max(0,1+p.typeDebuff/100),includeTrace:!!p.includeTrace,critical:crit,criticalMin:crits[0]+addition,criticalMax:crits[1]+addition,criticalBoost:p.criticalBoost,charge:p.charge,skillCorrection:1+p.skillCorrection/100,dualRate:p.dualRate};
 const hit=AutoDamage.physical(params);if(![hit.min*p.hits,hit.max*p.hits].every(Number.isSafeInteger))throw Error('合計ダメージが安全な整数範囲を超えています。');
 return {input:p,hit,min:hit.min*p.hits,max:hit.max*p.hits,effectiveAttack,effectiveDefense:p.direct?0:effectiveDefense,levelRate,enemyLevelRate,corrections:{slash,element,race,name,critBonus,typeResistance,elementResistance},factors:{typeDebuff:Math.max(0,1+p.typeDebuff/100),causality:1+p.causality/100,skill:p.multiplier/100,slash:1+(slash+p.skillBuff)/100,element:1+(element+p.forceCharge)/100,race:1+race/100,name:1+name/100,typeResistance:Math.max(0,1-typeResistance/100),elementResistance:Math.max(0,1-elementResistance/100),elementDebuff:Math.max(0,1+p.resistChange/100),criticalMin:crits[0]+addition,criticalMax:crits[1]+addition,criticalBoost:crit?p.criticalBoost:1,charge:p.charge,dual:p.dualRate},params,model:'physical-0.22',evidence:'https://github.com/AruDqw/dqw-damege-calc',limits:['物理の独立検証計算です。呪文・ブレス・攻魔複合は対象外です。','命中・ガード・敵シールド・ダメージ上限・敵行動はこの単発計算に含みません。','公開検証式との整合を確認するモデルで、公式が公開した完全な内部式ではありません。']};
}
root.PhysicalCalculator={defaults,calculate};
})(typeof window==='undefined'?globalThis:window);
