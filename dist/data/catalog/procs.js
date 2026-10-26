'use strict';
(function(root){
const C=root.Catalog9,m=root.PlannerData.real,source='https://9db.jp/dqwalk/data/17860';
const w={id:'dharma-staff',name:'ダーマの神杖',type:'杖',stats0:{attack:69,magic:23,heal:103},stats4:{attack:91,magic:28,heal:121},favored:{mp:12,heal:12},jobStats:{'job-2':{mp:10}},bonuses:[],limitBonus:0,skills:['dharma-prayer'],source,introducedRevision:34};
C.weapons.push(w);
C.skills.push({id:'dharma-prayer',name:'ダーマの祈り',kind:'jobPrayer',mpRate:.15,maxUses:2,source,note:'対象の行動開始時職業特性を確定発動。現在は大魔道士の連続呪文に対応。やまびこは別判定。'});
for(const lb of [0,4]){const old=m.items.find(x=>x.slot==='weapon'&&x.name===w.name&&(x.limitBreak||0)===lb),row={...w,id:old?.id||w.id+'-'+lb,slot:'weapon',weaponType:'杖',limitBreak:lb,stats:lb?w.stats4:w.stats0,verifiedModel:true,ready:false,skillIds:[],verified:['最大Lvの能力・祈り消費MP15%・2回制限'],assumptions:['祈り以外の未収録スキル・回復は未算入。']};if(old)Object.assign(old,row);else m.items.push(row);}
root.BattleCatalog13.initialMP.push({id:w.id,flat:23,components:['幼き聖賢15','まもりのたて8'],source});
const old=root.PlannerData.profile;root.PlannerData.profile=function(master){const p=old(master);if(master===m){const id=m.items.find(x=>x.slot==='weapon'&&x.name===w.name&&(x.limitBreak||0)===0)?.id,row=p.inventory.find(x=>x.id===id);if(row)row.count=1;}return p;};
const summary=root.Data33.summaryHTML;root.Data33.summaryHTML=()=>summary().replace('暴走・超暴走・マナ・やまびこ・連続呪文・確率ゾーン・ギガモンのシールドや解除は未算入です。結果は通常詠唱モデルの比較です。','0.34：祈りによる連続呪文、発動確認済みの暴走・やまびこを追加。超暴走・マナ・ギガモンの特殊処理は未対応です。');
})(typeof window==='undefined'?globalThis:window);
