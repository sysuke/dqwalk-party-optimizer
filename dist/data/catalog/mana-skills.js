'use strict';
(function(root){
const C=root.Catalog9,source='https://9db.jp/dqwalk/data/17540';
C.skills.push({id:'true-magic-release',name:'真魔解放',kind:'autoRelease',mp:45,self:true,duration:4,source,note:'マナLv1・暴走の超暴走化。一部MP回復半減。命令不可なのでAIが指定の攻撃を選ぶ場合のみ比較する。'});
const w=C.weapons.find(w=>w.id==='paradox-staff');w.skills.push('true-magic-release');w.unmodeled=w.unmodeled.filter(x=>!x.includes('真魔解放')).concat('真魔解放・マナは公開検証の代表倍率を使う参考シナリオ。実測照合は未完了。');
root.ManaData36={source,checked:'2026-10-23'};
})(typeof window==='undefined'?globalThis:window);
