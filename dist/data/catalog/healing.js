'use strict';
(function(root){
const C=root.Catalog9;
const love=C.skills.find(k=>k.id==='love-stream');love.healing={base:150,source:'https://9db.jp/dqwalk/data/20440',note:'掲載基礎値150。回復UP・追加詠唱ごとの回復は未算入、1行動1回の基礎値による参考比較。回復量の実測下限ではない。'};
const sea=C.skills.find(k=>k.id==='seabreeze');Object.assign(sea,{kind:'heal',unmodeledDamage:true,healing:{estimated:true,source:'https://9db.jp/dqwalk/data/19790'},note:'回復量は利用者の仮入力で比較。攻回複合攻撃の与ダメージ・幸運・回復会心は未算定。MP63を消費し、実際の行動枠を使う。'});
const lucky=C.weapons.find(w=>w.id==='lucky');lucky.unmodeled=['攻回複合の与ダメージ・幸運・HP条件強化は未算入。回復は仮入力で比較。'];const perseria=C.weapons.find(w=>w.id==='perseria');perseria.unmodeled=perseria.unmodeled.map(x=>x.replace('回復は未算入','回復補正・追加詠唱ごとの回復は未算入'));
root.HealingRules={forAction(k,settings){if(!k.healing)return null;if(k.healing.base)return {amount:k.healing.base,estimated:true,verifiedBase:true,known:true,scope:k.healing.note};const amount=settings.luckyHeal;return {amount:amount??0,estimated:true,known:amount!=null,scope:'ひと夏のシーブリーズ：1人あたりの回復量は仮入力。回復会心は不発、攻撃部分は未算定。'};}};
})(typeof window==='undefined'?globalThis:window);
