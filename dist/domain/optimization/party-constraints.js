'use strict';
(function(root){
const fields=['member','job','weapon','limitBreak','left','leftLimitBreak','inherit','inheritLevel','inheritLimitBreak'];
function lockActor(actor){return {member:actor.member,job:actor.job,weapon:actor.weapon,limitBreak:actor.limitBreak||0,left:actor.left||'',leftLimitBreak:actor.leftLimitBreak||0,inherit:actor.inherit||'',inheritLevel:actor.inherit?(actor.inheritLevel||1):0,inheritLimitBreak:actor.inheritLimitBreak||0};}
function matches(actor,lock){if(!lock||actor.member!==lock.member)return !lock;const value=lockActor(actor);return fields.every(key=>value[key]===lock[key]);}
function accepts(config,conditions){const excluded=new Set(conditions.excludedWeapons||[]);return config.actors.every(a=>![a.weapon,a.left,a.inherit].some(id=>excluded.has(id)))&&(!conditions.fixedLead||config.actors.some(a=>matches(a,conditions.fixedLead)));}
function apply(raw,master,profile){
 const excluded=raw.excludedWeapons??[];if(!Array.isArray(excluded)||excluded.length>Catalog9.weapons.length||excluded.some(id=>typeof id!=='string'||!Catalog9.weapons.some(w=>w.id===id)))throw Error('使わない武器の指定が不正です。');
 const excludedWeapons=[...new Set(excluded)],names=new Set(Catalog9.weapons.filter(w=>excludedWeapons.includes(w.id)).map(w=>w.name));
 const effective=excludedWeapons.length?{...profile,inventory:profile.inventory.map(row=>{const item=master.items.find(i=>i.id===row.id);return item?.slot==='weapon'&&names.has(item.name)?{...row,count:0}:row;})}:profile;
 let fixedLead=null;if(raw.fixedLead!=null){const a=raw.fixedLead;if(typeof a!=='object'||!Number.isInteger(a.member)||!profile.characters[a.member]||!master.jobs.some(j=>j.id===a.job)||!(profile.characters[a.member].levels[a.job]>0))throw Error('固定するキャラと育成済み職業を確認してください。');fixedLead=lockActor(a);
  for(const [id,lb]of [[fixedLead.weapon,fixedLead.limitBreak],[fixedLead.left,fixedLead.leftLimitBreak],[fixedLead.inherit,fixedLead.inheritLimitBreak]]){if(!id)continue;const w=Catalog9.weapons.find(w=>w.id===id);if(!w||![0,4].includes(lb))throw Error('固定する武器・凸数の指定が不正です。');if(excludedWeapons.includes(id))throw Error('固定する武器を「使わない武器」に指定できません。');const item=master.items.find(i=>i.slot==='weapon'&&i.name===w.name&&(i.limitBreak||0)===lb);if(!item||!effective.inventory.some(row=>row.id===item.id&&row.count>0))throw Error('固定する武器の所持数を確認してください。');}
  if(!fixedLead.weapon||fixedLead.inherit&&(!Number.isInteger(fixedLead.inheritLevel)||fixedLead.inheritLevel<1||fixedLead.inheritLevel>10))throw Error('固定する武器・継承錬度を確認してください。');
 }
 return {profile:effective,excludedWeapons,fixedLead};
}
root.PartyConstraints={apply,matches,accepts,lockActor};
})(typeof window==='undefined'?globalThis:window);
