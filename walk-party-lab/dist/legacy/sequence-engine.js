'use strict';
(function(root){
const C=Catalog8,keys=['hp','mp','attack','defense','magic','heal','speed','dex'],weapon=id=>C.weapons.find(x=>x.id===id),skill=id=>C.skills.find(x=>x.id===id),clone=x=>JSON.parse(JSON.stringify(x));
function available(actor){const ids=new Set(['wait']);for(const s of weapon(actor.weapon)?.skills||[])ids.add(s);for(const s of weapon(actor.left)?.skills||[])if(skill(s)?.kind==='attack')ids.add(s);if(actor.inherit==='keki')for(const s of ['rondo'])ids.add(s);for(const id of actor.hearts||[])for(const s of C.hearts.find(h=>h.id===id)?.skills||[])ids.add(s);for(const s of C.skills)if(s.job===actor.job&&(s.id==='baishion'||actor.pathUnlocked)&&(!s.protagonist||actor.member===0))ids.add(s.id);return [...ids].map(skill).filter(Boolean);}
function build(actor,master,profile){
 const w=weapon(actor.weapon);if(!w)throw Error('武器を選んでください。');const hs=(actor.hearts||[]).filter(Boolean).map(id=>C.hearts.find(h=>h.id===id));if(hs.some(h=>!h)||new Set(hs.map(h=>h.id)).size!==hs.length)throw Error('こころが不正または重複しています。');
 const job=master.jobs.find(j=>j.id===actor.job),level=profile.characters[actor.member]?.levels[actor.job]||0,base=job?.levels[level];if(!base)throw Error('指定キャラの職業レベルを戦力記録で登録してください。');
 if(actor.left&&(actor.job!=='job-8'||w.type!=='片手剣'||weapon(actor.left)?.type!=='片手剣'||actor.inherit))throw Error('二刀流は魔人の片手剣同士、継承との併用不可です。');
 if(actor.inherit&&(weapon(actor.inherit)?.type!==w.type||!actor.proficiency))throw Error('継承には同じ武器種と錬度1以上が必要です。');
 const stats={...base.stats,dex:base.stats.dex||0},bonuses=[...w.bonuses,...(actor.favored?w.favoredBonuses||[]:[])],parts=[{label:w.name,stats:w.stats0}];
 const add=(s,f=1)=>{for(const k of keys)stats[k]=(stats[k]||0)+Math.floor((s?.[k]||0)*f);};add(w.stats0);if(actor.favored)add(w.favored);if(w.twoHand0)add({attack:w.twoHand0});
 const left=weapon(actor.left);if(left){add(left.stats0);if(actor.favored)add(left.favored);bonuses.push(...left.bonuses);parts.push({label:'左手 '+left.name,stats:left.stats0});}
 const armors=(actor.armors||[]).filter(Boolean).map(id=>master.items.find(i=>i.id===id));if(armors.some(i=>!i||!i.verifiedModel))throw Error('確認済み防具を選んでください。');for(const i of armors){if(left&&i.slot==='shield')throw Error('二刀流に盾は装備できません。');add(i.stats);bonuses.push(...(i.bonuses||[]));parts.push({label:i.name,stats:i.stats});}
 const heartParts=hs.map((h,index)=>{const color=job.slots[index]||'虹',f=color==='虹'||color.split('+').includes(h.color)?1.3:1;add(h.stats,f);bonuses.push(...h.bonuses);return {id:h.id,name:h.name,factor:f,cost:h.cost};});const cost=hs.reduce((n,h)=>n+h.cost,0),costLimit=base.cost+hs.length*4;if(cost>costLimit)throw Error('こころコスト超過：'+cost+' / '+costLimit);
 if(actor.actualAttack!==null&&actor.actualAttack!==undefined){if(!Number.isFinite(actor.actualAttack)||actor.actualAttack<=0||actor.actualAttack>100000)throw Error('実測攻撃力が不正です。');stats.attack=actor.actualAttack;}
 return {actor,weapon:w,left,hearts:hs,stats,bonuses,parts,heartParts,cost,costLimit,level,estimatedAttack:actor.actualAttack==null,available:available(actor),initial:!!actor.initial};
}
function simulate(config,master,profile){
 if(!Array.isArray(config.actors)||config.actors.length!==4||new Set(config.actors.map(a=>a.member)).size!==4)throw Error('4人を重複なく選んでください。');
 if(!Array.isArray(config.actions)||config.actions.length!==4||new Set(config.actions.map(a=>a.actor)).size!==4||config.actions.some(a=>!Number.isInteger(a.actor)||a.actor<0||a.actor>3))throw Error('今回は1ターン・4人各1行動の順番を指定してください。');
 const enemy=config.enemy;if(!enemy||!Number.isFinite(enemy.defense)||enemy.defense<0||!Number.isInteger(enemy.count)||enemy.count<1||enemy.count>4)throw Error('敵の守備力と敵数を確認してください。');
 for(const k of ['typeResistance','enemyTension'])if(!Number.isFinite(enemy[k])||enemy[k]<0||enemy[k]>100)throw Error('敵耐性・テンションを確認してください。');
 for(const e of AutoDamage.elements)if(!Number.isFinite(enemy.elements[e])||Math.abs(enemy.elements[e])>1000)throw Error('属性耐性を確認してください。');
 const builds=config.actors.map(a=>build(a,master,profile)),states=builds.map(()=>({attackStages:0,critStages:0,skillBuff:0,charge:1,tension:0,guaranteed:0,heroBonus:0,source:[],partner:null,limit:2}));const notes=[],logs=[];
 if(!['none','roto','brave'].includes(config.domain))throw Error('領域が不正です。');if(config.domain!=='none'&&!builds.some(b=>b.initial&&b.weapon.id===(config.domain==='roto'?'roto':'hero')))throw Error('選んだ領域の武器と開幕効果を設定してください。');
 const add=(i,tag)=>states[i].source.push(tag);
 builds.forEach((b,i)=>{if(!b.initial)return;const s=states[i];if(b.hearts.some(h=>h.id==='corpse')&&enemy.race==='ドラゴン系'){s.attackStages=2;add(i,'コープス：開幕攻撃2段階（通常群）');}if(b.weapon.id==='hero'){s.guaranteed=1;s.heroBonus=50;add(i,'会心必中：自身1行動・斬体50%');}if(b.weapon.id==='wing'&&i>=2){s.guaranteed=3;add(i,'禁忌の翼：右側配置・固有技に確定会心');}if(b.weapon.id==='roto'&&['ドラゴン系','？？？？系'].includes(enemy.race)){s.tension=50;add(i,'覚悟を宿す剣：自身SHT');}if(b.weapon.id==='moon'){s.partner=(i+1)%4;states[s.partner].partner=i;add(i,'相棒：右隣のキャラ'+(s.partner+1));}});
 if(builds.some(b=>b.weapon.id==='gun'))notes.push('祖竜の新世界・変異・ゾーンは未対応。祖竜による攻撃は計算しません。');
 for(const [index,action]of config.actions.entries()){
  const i=action.actor,b=builds[i],s=states[i],k=skill(action.skill);if(!k||!b.available.some(x=>x.id===k.id))throw Error('キャラ'+(i+1)+'は選んだスキルを習得していません。');if(k.kind==='unsupported')throw Error(k.name+'：'+k.note);
  let target=k.self?i:action.target;if(['attackBuff','skillBuff'].includes(k.kind)&&(!Number.isInteger(target)||target<0||target>3))throw Error('補助対象を選んでください。');
  // Fortune extends the LEFT neighbour when that neighbour begins its action.
  if(builds[(i+1)%4].initial&&builds[(i+1)%4].weapon.id==='lucky'&&s.guaranteed>0){s.guaranteed++;add(i,'ずっと続きますように：会心必中を延長');}
  let damage=null,detail='';const before=clone(s);
  if(k.kind==='attackBuff'){const t=states[target];t.attackStages=Math.min(t.limit,t.attackStages+k.stages);add(target,k.name+'：攻撃'+t.attackStages+'段階');detail='キャラ'+(target+1)+'の攻撃'+t.attackStages+'段階';}
  else if(k.kind==='skillBuff'){states[target].skillBuff=Math.max(states[target].skillBuff,k.value);add(target,k.name+'：威力+'+k.value+'%');detail='キャラ'+(target+1)+'の威力+'+k.value+'%';}
  else if(k.kind==='critBuff'){s.critStages=Math.min(2,s.critStages+k.stages);add(i,k.name+'：会心補助'+s.critStages+'段階');detail='自身の会心倍率補助'+[1,1.4,1.8][s.critStages]+'倍（確定会心にはならない）';}
  else if(k.kind==='charge'){s.charge=k.value;add(i,k.name+'：次の一撃'+k.value+'倍');detail='自身の次の斬撃・体技'+k.value+'倍';}
  else if(k.kind==='rondo'){
   const next=config.actions[index+1]?.actor;if(next!==undefined){if(builds[next].stats.attack>builds[next].stats.magic){states[next].critStages=Math.min(2,states[next].critStages+1);add(next,'風斬りのロンド：次行動者の会心補助');detail='キャラ'+(next+1)+'へ会心補助';}else detail='キャラ'+(next+1)+'へ暴走補助（呪文計算未対応）';}
   notes.push('風斬りのロンド自身の攻魔複合ダメージは未算定。表示合計はその分を含みません。');
  }
  if(k.kind==='attack'||k.kind==='rondo'){
   if(s.partner!==null){const t=states[s.partner];t.limit=3;t.attackStages=Math.min(3,t.attackStages+1);add(s.partner,'相棒：攻撃1段階・上限3段階');}
  }
  if(k.kind==='attack'){
   const candidates=k.elements.map(element=>{
    const sum=(group)=>AutoDamage.sum(b,group,k.type,element,enemy.race)*100;
    const params={attack:b.stats.attack,defense:enemy.defense,multiplier:k.multipliers[Math.min(enemy.count-1,k.multipliers.length-1)],hits:k.hits*(b.left?2:1),attackStages:before.attackStages,slash:sum('general'),elementBonus:sum('element'),raceBonus:sum('race'),criticalBonus:sum('critical'),criticalExtra:b.actor.job==='job-8'?50+(b.actor.majinPathCritical?50:0):0,criticalType:before.guaranteed>0?(k.crit||'single'):'normal',criticalBoost:[1,1.4,1.8][before.critStages],skillBuff:before.skillBuff+before.heroBonus,charge:before.charge,dualRate:b.left?.4+(['hero','roto','wing'].includes(b.weapon.id)?.05:0)+(['hero','roto','wing'].includes(b.left?.id)?.05:0):1,direct:!!k.direct,allyTension:before.tension,enemyTension:enemy.enemyTension,typeResistance:enemy.typeResistance,forcedTypeResistance:config.domain==='brave'?-20:0,elementResistance:element==='無'?0:enemy.elements[element],forcedResistance:config.domain==='roto'&&element==='デイン'?-50:0};
    // Charge applies only to the first strike of a multi-hit technique.
    const r=PhysicalCalculator.calculate({...params,hits:1});let min=r.min,max=r.max;if(params.hits>1){const other=PhysicalCalculator.calculate({...params,hits:1,charge:1});min+=other.min*(params.hits-1);max+=other.max*(params.hits-1);}return {min,max,element,params,base:r.hit.base,effectiveAttack:r.effectiveAttack};
   });damage=candidates.sort((a,b)=>b.min-a.min)[0];if(before.charge>1&&damage.params.hits>1)throw Error('きあいためと多段・二刀流の適用範囲は検証待ちです。単発で検証してください。');s.charge=1;detail=damage.element+' / '+(before.guaranteed>0?'確定会心':'会心不発の範囲')+' / 攻撃'+before.attackStages+'段階';
  }
  if(s.guaranteed>0){s.guaranteed--;if(!s.guaranteed)s.heroBonus=0;}
  // One-turn effects count the recipient's action; a self buff survives its own cast.
  if(k.kind!=='skillBuff'||target!==i)s.skillBuff=0;
  logs.push({order:index+1,actor:i,skill:k.id,name:k.name,source:k.source,target,detail,before,after:clone(s),damage});
 }
 const attacks=logs.filter(x=>x.damage);return {builds,logs,states,min:attacks.reduce((n,x)=>n+x.damage.min,0),max:attacks.reduce((n,x)=>n+x.damage.max,0),notes:[...new Set(notes)],estimated:builds.some(b=>b.estimatedAttack),complete:!notes.some(n=>n.includes('未算定')),scope:'1ターン・4人各1行動。敵行動・行動順乱数・命中・ガード・上限・シールド・生存は未計算。MPは資料不一致があるためこの画面では可否判定しません。'};
}
root.SequenceEngine={available,build,simulate};
})(typeof window==='undefined'?globalThis:window);
