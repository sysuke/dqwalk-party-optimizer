'use strict';
(function(root){
// Published experimental representative values include ultra-critical itself.
const table=[{total:2.2,mp:0,recovery:0},{total:3,mp:.1,recovery:.3},{total:4.1,mp:.15,recovery:.6},{total:5.3,mp:.25,recovery:.9},{total:6.5,mp:.35,recovery:1.2},{total:7.7,mp:.5,recovery:1.5}];
function level(n=0){if(!Number.isInteger(n)||n<0||n>5)throw Error('マナLvは0〜5で指定してください');return n;}
function cost(k,maxMP,mana=0,mpMultiplier=1){const boost=1+table[level(mana)].mp,rate=(k.mpRate||0)+(k.eradicate?.1:0),flat=k.mp||0;return {min:Math.floor((flat+Math.floor(maxMP*rate))*boost*mpMultiplier+1e-8),max:Math.ceil((flat+Math.ceil(maxMP*rate))*boost*mpMultiplier-1e-8)};}
function recovery(spent,mana,halved){return Math.floor(spent*table[level(mana)].recovery*(halved?.5:1)+1e-8);}
root.ManaRules36={table,level,cost,recovery,source:'https://9db.jp/dqwalk/data/17300',official:'https://walk.dragonquest.jp/web/help/show/140',note:'超暴走平均2.2、マナ込み代表倍率3.0/4.1/5.3/6.5/7.7。実測乱数の下限・上限ではありません。発動前Lvで計算し発動後にLv上昇する比較モデル。丸めと発動タイミングは実機照合待ち。'};
})(typeof window==='undefined'?globalThis:window);
