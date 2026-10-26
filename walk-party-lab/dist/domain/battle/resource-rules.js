'use strict';
(function(root){
function opening(b,state){if(!b.initial)return {min:0,max:0,known:true};const k=root.BattleCatalog13?.initialMP.find(x=>x.id===b.actor.weapon);if(!k)return {min:0,max:0,known:false};let min=k.flat,max=k.flat;const parts=[...k.components];if(b.actor.weapon==='gun'&&state.zone)parts.push('真新世界1%');for(const part of parts){const match=part.match(/(\d+(?:\.\d+)?)%/);if(match){min+=Math.floor(b.stats.mp*Number(match[1])/100);max+=Math.ceil(b.stats.mp*Number(match[1])/100);}}return {min,max,known:!k.incomplete};}
function action(b,k,before,after,damage){const cost=damage?.mpCost?{...damage.mpCost}:root.ManaRules36.cost(k,b.stats.mp,before.manaLevel||0,root.MageTools37?.costMultiplier(k,before)||1);if(b.actor.weapon==='gun'&&!before.zone&&after.zone){cost.min+=Math.floor(b.stats.mp*.01);cost.max+=Math.ceil(b.stats.mp*.01);}return cost;}
function passive(b,current,enabled,extra){return enabled&&!extra?Math.min(b.hearts.reduce((n,h)=>n+(h.recovery?.mp||0),0),Math.max(0,b.stats.mp-current)):0;}
root.ResourceRules36={opening,action,passive};
})(typeof window==='undefined'?globalThis:window);
