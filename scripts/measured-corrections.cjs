'use strict';
const {loadMeasuredCases}=require('./measurement-fixtures.cjs');
const {resolve}=require('./audit-measurements.cjs');
const {loadRuntime}=require('./runtime.cjs');
function report(inputCases){
 const c=loadRuntime(),master=c.PlannerData.real,catalog=c.Catalog9;
 const cases=inputCases??loadMeasuredCases();
 return cases.map(row=>{
  const job=master.jobs.find(job=>job.name===row.actor.job);if(!job)throw Error('未対応の職業：'+row.actor.job);
  const profile=c.PlannerData.profile(master);profile.characters[0].levels[job.id]=row.actor.level;
  const assumptions=['こころは収録済みのS/覚醒データを使用。ランク・装着枠は未確認。','得意武器補正を適用。表示攻撃力を優先するため、能力値の枠補正を火力へ二重加算しない。'];
  const select=(rows,name)=>{const resolved=resolve(rows,name);if(resolved.status==='matched')return rows.find(x=>x.id===resolved.matches[0].id);
   throw Error('候補を一意に選べません：'+name);
  };
  const weapon=select(catalog.weapons,row.actor.weapon),inherit=select(catalog.weapons,row.actor.inheritance.weapon);
  const inherited=row.normalization?.inheritedUnconfirmed||{},attack=row.actor.displayAttackBeforeBuffs??inherited.displayAttackBeforeBuffs,limitBreak=row.actor.limitBreak??inherited.limitBreak;
  if(row.actor.displayAttackBeforeBuffs==null)assumptions.push('表示攻撃力'+attack+'は前回からの仮引継ぎ。今回の確定値とはしない。');
  if(row.actor.limitBreak==null)assumptions.push(limitBreak+'凸は前回からの仮引継ぎ。今回の確定値とはしない。');
  if(!Number.isFinite(attack)||![0,4].includes(limitBreak))throw Error('表示攻撃力・凸数を確認してください');
  const actor={member:0,job:job.id,weapon:weapon.id,limitBreak,inherit:inherit.id,inheritLevel:row.actor.inheritance.proficiency,favored:true,
   actualAttack:attack,majinCritical20:row.actor.confirmedHeartPath?.lv20==='超魔道'?25:row.actor.confirmedHeartPath?.lv20==='超人道'?15:null,majinCritical40:row.actor.confirmedHeartPath?.lv40==='超魔道'?25:row.actor.confirmedHeartPath?.lv40==='超人道'?15:null,
   hearts:row.actor.hearts.map(name=>select(catalog.hearts,name).id),armors:row.actor.equipment.map(name=>select(master.items,name).id).concat(row.actor.pearls.map(pearl=>{if(pearl['天超えし竜牙ダメージ']!==10||pearl['スキルの会心ダメージ']!==5)throw Error('未対応の心珠を推定しません');return 'dragonfang-pearl-critical-s';}))};
  if(job.id==='job-8'&&(actor.majinCritical20==null||actor.majinCritical40==null))throw Error('会心こころ道の両ノードを確認してください');
  if(job.id!=='job-8'){delete actor.majinCritical20;delete actor.majinCritical40;}
  const build=c.SequenceEngine.build(actor,master,profile,{weather:row.environment?.weather});
  const sum=(group,type='斬撃',element='イオ',race='マシン系')=>c.AutoDamage.sum(build,group,type,element,race)*100;
  const skill=catalog.skills.find(s=>s.id==='dragonfang');
  return {id:row.id,observed:row.observation.damagePerHit,status:'conditional-attacker-corrections-only',assumptions,
   confirmed:{displayAttack:row.actor.displayAttackBeforeBuffs,limitBreak:row.actor.limitBreak,weather:row.environment?.weather??null,path:job.id==='job-8'?{lv20:actor.majinCritical20,lv40:actor.majinCritical40}:null},
   usedInputs:{job:job.id,level:row.actor.level,displayAttack:build.stats.attack,limitBreak,weapon:weapon.id,inheritance:{weapon:inherit.id,proficiency:actor.inheritLevel},equipment:actor.armors,twoHanded:!actor.armors.some(id=>master.items.find(item=>item.id===id)?.slot==='shield'),hearts:build.hearts.map(h=>({id:h.id,name:h.name}))},
   appliedBonuses:Array.from(build.bonuses,b=>({...b})),
   rawPercentPoints:{slash:sum('general'),io:sum('element'),critical:sum('critical'),criticalPathAddition:build.majinPath.critical,
    dragonRace:sum('race','斬撃','イオ','ドラゴン系'),machineRace:sum('race'),skillSpecific:build.bonuses.filter(b=>b.group==='skillCorrection'&&b.skill===skill.id).reduce((n,b)=>n+b.value*100,0)},
   skill:{id:skill.id,singleEnemyMultiplierPercent:skill.multipliers[0],criticalType:skill.crit},
   attributeHandling:{originalElements:Array.from(skill.elements),forceStrong:!!skill.forceStrong,
    reportedForceBuffs:row.actor.buffs.filter(buff=>buff.includes('フォース')),
    scope:'現行コードの適用規則。攻撃時点の付与状態や敵耐性を確定するものではない。',
    rule:'無属性技へ変異フォースが有効な場合、属性耐性を50ポイント下げる。forceStrongの技は通常フォースの属性補正半減をしない。遺跡強化の被ダメージ軽減とは別。'},
   researchEvidence:row.enemy.researchEvidence||[],
   unresolved:[...row.unknowns,'敵の種類/属性耐性、会心ガード、状態変化が未確定のため最終ダメージは算出しない。'],
   warning:'装備・こころ道由来の生補正値。テンション/ゾーン増幅、戦闘中バフ、敵耐性はまだ掛けていない。観測値から係数を合わせない。'};
 });
}
if(require.main===module)console.log(JSON.stringify(report(),null,2));
module.exports={report};
