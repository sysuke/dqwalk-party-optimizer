'use strict';
(function(root){
 const num=v=>Number(v)||0;
function uniqueStates(states,score,limit){const seen=new Set();return states.sort((a,b)=>score(b)-score(a)).filter(s=>{const key=s.items.map(g=>g.id).sort().join('/')+'|'+s.hearts.map(h=>h.id).sort().join('/');if(seen.has(key))return false;seen.add(key);return true;}).slice(0,limit);}
function optimize(data, target){
 const roles=['物理','呪文','回復']; const weights=target.mode==='周回'?{hp:.03,speed:.5}:target.mode==='耐久'?{hp:.6,speed:.03}:{hp:.15,speed:.08};
 function statsScore(s,role,element){let power=role==='回復'?s.heal:role==='呪文'?s.magic:s.attack;return power*(role==='回復'?1:num(target.weakness[element]??1))+s.hp*weights.hp+s.speed*weights.speed;}
 const totals={}; data.gear.forEach(g=>totals['g:'+g.id]=num(g.count));data.hearts.forEach(h=>totals['h:'+h.id]=num(h.count));
 const allCandidates=[0,1,2,3].map(member=>{
 let candidates=[];
 data.jobs.filter(j=>num(j.member)===member+1&&num(j.level)>0).forEach(job=>{
 const colors=String(job.colors).split('/');
 data.gear.filter(g=>g.slot==='武器'&&num(g.count)>0&&num(g.minLevel)<=num(job.level)&&(g.jobs==='*'||String(g.jobs).split('/').includes(job.job))&&roles.includes(g.role)&&g.role===job.role).forEach(weapon=>{
 let states=[{s:{attack:num(job.attack)+num(weapon.attack),magic:num(job.magic)+num(weapon.magic),heal:num(job.heal)+num(weapon.heal),hp:num(job.hp)+num(weapon.hp),speed:num(job.speed)+num(weapon.speed)},used:{['g:'+weapon.id]:1},items:[weapon],hearts:[],cost:0,bonus:0,names:[]}];
 const score=s=>statsScore(s.s,weapon.role,weapon.element);
 ['盾','頭','体上','体下','アクセサリー'].forEach(slot=>{
 const gear=data.gear.filter(g=>g.slot===slot&&num(g.count)>0&&num(g.minLevel)<=num(job.level)&&(g.jobs==='*'||String(g.jobs).split('/').includes(job.job)));
 states=states.flatMap(st=>[null,...gear].map(g=>{if(!g)return st;let s={...st.s};Object.keys(s).forEach(k=>s[k]+=num(g[k]));return {...st,s,items:[...st.items,g],used:{...st.used,['g:'+g.id]:1}};})).sort((a,b)=>score(b)-score(a)).slice(0,24);
 });
 for(let slot=0;slot<Math.min(4,colors.length);slot++){
 states=uniqueStates(states.flatMap(st=>[null,...data.hearts.filter(h=>num(h.count)>0&&!st.names.includes(h.name))].map(h=>{if(!h)return st;let factor=colors[slot]==='虹'||colors[slot].split('+').includes(h.color)?num(job.colorBonus):1;let s={...st.s};Object.keys(s).forEach(k=>s[k]+=Math.floor(num(h[k])*factor));return {...st,s,cost:st.cost+num(h.cost),bonus:st.bonus+num(h.costBonus),hearts:[...st.hearts,{...h,slot:slot+1,factor}],names:[...st.names,h.name],used:{...st.used,['h:'+h.id]:1}};})),score,100);
 }
 states.filter(s=>s.cost<=num(job.cost)+s.bonus&&s.s.hp>=num(target.minHp)&&s.s.speed>=num(target.minSpeed)).slice(0,100).forEach(st=>candidates.push({...st,job,weapon,score:score(st),isHeal:weapon.role==='回復'?1:0}));
 });});
 // Retain choices from each job; a single strong job must not erase healer alternatives.
 return candidates.sort((a,b)=>b.score-a.score);
 });
 if(allCandidates.some(c=>!c.length))return {teams:[],missing:allCandidates.map((c,i)=>c.length?null:i+1).filter(Boolean)};
 let beam=[{members:[],used:{},score:0,healers:0}];
 for(const choices of allCandidates){let next=[];for(const team of beam)for(const c of choices){let used={...team.used};let ok=true;for(const [key,value]of Object.entries(c.used)){used[key]=(used[key]||0)+value;if(used[key]>totals[key]){ok=false;break;}}if(ok)next.push({members:[...team.members,c],used,score:team.score+c.score,healers:team.healers+c.isHeal});}
 beam=[];for(let heal=0;heal<=4;heal++)beam.push(...next.filter(t=>t.healers===heal).sort((a,b)=>b.score-a.score).slice(0,120));
 }
 const seen=new Set();const teams=beam.filter(t=>t.healers>=num(target.healers)).sort((a,b)=>b.score-a.score).filter(t=>{const key=t.members.map(m=>m.job.id+':'+m.items.map(g=>g.id).sort().join('/')+':'+m.hearts.map(h=>h.id).sort().join('/')).join('|');if(seen.has(key))return false;seen.add(key);return true;}).slice(0,3);
 return {teams,missing:[],counts:allCandidates.map(c=>c.length)};
}
root.WalkEngine={optimize};if(typeof module!=='undefined')module.exports=root.WalkEngine;
})(typeof window==='undefined'?globalThis:window);
