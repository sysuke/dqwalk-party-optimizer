'use strict';
(function(root){
const slots=['shield','head','body','legs','pearl','pearl','accessory','accessory'],clone=x=>JSON.parse(JSON.stringify(x));
function solve(config,master,profile,options={},progress=()=>{}){
 const actor=Number(options.actor??3),action=Number(options.action??config.actions.length-1),objective=options.objective||'min',limit=options.maxNodes??100000;
 if(!Number.isInteger(actor)||actor<0||actor>3||!Number.isInteger(action)||action<0||action>=config.actions.length||config.actions[action].actor!==actor)throw Error('探索するキャラと、そのキャラの攻撃を選んでください。');
 if(!['min','max'].includes(objective)||!Number.isInteger(limit)||limit<1||limit>200000)throw Error('探索条件が不正です。');
 const initial=SequenceEngine.simulate(config,master,profile),selected=initial.logs[action];if(!selected.damage||selected.damage.hybrid)throw Error('計算対応済みの物理攻撃または呪文攻撃を選んでください。攻魔複合は今回の探索対象外です。');
 const stock=new Map();for(const x of profile.inventory){if(!Number.isInteger(x.count)||x.count<0||stock.has(x.id))throw Error('所持品の数量が不正です。');stock.set(x.id,x.count);}
 const used=new Map(),reserve=id=>{if(!id)return;used.set(id,(used.get(id)||0)+1);};
 const weaponItem=(id,lb)=>{const w=Catalog9.weapons.find(x=>x.id===id);const item=master.items.find(x=>x.slot==='weapon'&&x.name===w?.name&&(x.limitBreak||0)===(lb||0));if(!item)throw Error('所持品との対応が未登録の武器です：'+(w?.name||id));return item.id;};
 config.actors.forEach((a,i)=>{reserve(weaponItem(a.weapon,a.limitBreak));if(a.left)reserve(weaponItem(a.left,a.leftLimitBreak));if(a.inherit)reserve(weaponItem(a.inherit,0));for(const id of a.hearts||[]){if(!id)continue;const h=Catalog9.hearts.find(x=>x.id===id),item=master.items.find(x=>x.slot==='heart'&&(x.id===id||x.name===h?.name));if(!item)throw Error('所持品との対応が未登録のこころです：'+id);reserve(item.id);}if(i!==actor)for(const id of a.armors||[])reserve(id);});
 for(const [id,n]of used)if(n>(stock.get(id)||0))throw Error('固定した4人の装備が所持数を超えています：'+(master.items.find(x=>x.id===id)?.name||id));
 const remaining=id=>(stock.get(id)||0)-(used.get(id)||0),a=config.actors[actor],gear=master.items.filter(x=>x.verifiedModel&&slots.includes(x.slot)&&remaining(x.id)>0&&(!x.jobs||x.jobs.includes(a.job)));
 let pools=slots.map(slot=>['',...gear.filter(x=>x.slot===slot&&!(slot==='shield'&&a.left)).map(x=>x.id)]);
 // An accessory can be equipped once per character, even when several are owned.
 const q=clone(config),target=q.actors[actor],rawBase=SequenceEngine.build({...a,actualAttack:null,actualMagic:null},master,profile,config),offset={attack:a.actualAttack==null?null:a.actualAttack-rawBase.stats.attack,magic:a.actualMagic==null?null:a.actualMagic-rawBase.stats.magic};
 let nodes=0,valid=0,truncated=false,results=[],firstError='';const chosen=[],local=new Map(),keep=new Set();
 const compare=(x,y)=>y.damage[objective]-x.damage[objective]||y.damage[objective==='min'?'max':'min']-x.damage[objective==='min'?'max':'min']||x.key.localeCompare(y.key);
 function visit(depth){if(nodes>=limit){truncated=true;return;}if(depth===slots.length){nodes++;if(nodes%250===0)progress({nodes,valid});target.armors=[...chosen];target.actualAttack=null;target.actualMagic=null;try{if(offset.attack!==null||offset.magic!==null){const b=SequenceEngine.build(target,master,profile,q);if(offset.attack!==null)target.actualAttack=b.stats.attack+offset.attack;if(offset.magic!==null)target.actualMagic=b.stats.magic+offset.magic;}const r=SequenceEngine.simulate(q,master,profile),damage=r.logs[action].damage;if(!damage)throw Error('攻撃の計算結果がありません');valid++;const key=chosen.join('/');if(keep.has(key))return;const row={key,armors:[...chosen],actualAttack:target.actualAttack,actualMagic:target.actualMagic,damage:clone(damage),stats:r.builds[actor].stats,scope:r.scope,estimated:r.estimated,complete:r.complete};results.push(row);keep.add(key);results.sort(compare);if(results.length>3){const gone=results.pop();keep.delete(gone.key);}}catch(e){if(!firstError)firstError=e.message;}return;}
 const slot=slots[depth];for(const id of pools[depth]){if(id&&(local.get(id)||0)>=remaining(id))continue;if(id&&slot==='accessory'&&chosen.includes(id))continue;if((depth===5||depth===7)&&id<chosen[depth-1])continue;chosen[depth]=id;if(id)local.set(id,(local.get(id)||0)+1);visit(depth+1);if(id)local.set(id,local.get(id)-1);if(truncated)break;}chosen.length=depth;}
 visit(0);if(!results.length)throw Error(firstError||'所持数を満たす候補がありません。');return {actor,action,objective,nodes,valid,truncated,exact:!truncated,results,baseline:clone(selected.damage),candidateCounts:pools.map(x=>x.length),scope:'選択キャラの盾・頭・体上・体下・心珠2枠・アクセサリー2枠を探索。武器・こころ・職業・手順・並び順と他の3人の装備は固定。',limits:['収録・計算対応済み・所持品のみ。装備依存の未収録効果やセット効果は算入しない。','速度・HP・生存・MPの制約は探索しない。並び順・手動の補助条件が成立する前提。','実機攻撃力を指定した場合は現在装備との差分を反映。元の職業基礎能力の仮値を実測値に置換したものではない。']};
}
root.GearOptimizer={solve,slots};
})(typeof window==='undefined'?globalThis:window);
