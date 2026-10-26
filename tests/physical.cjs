const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');const c=vm.createContext({});for(const f of ['domain/damage/damage','domain/damage/physical-calculator'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../dist',f+'.js'),'utf8'),c);const D=c.AutoDamage,C=c.PhysicalCalculator;let n=0;function test(s,f){f();console.log('PASS '+s);n++;}
test('通常1100%・守備1000の独立手計算',()=>{const r=C.calculate({});assert.equal(r.hit.base,250);assert.equal(r.min,2574);assert.equal(r.max,2926);});
test('直撃と会心を混同しない',()=>{assert.equal(C.calculate({criticalType:'single'}).hit.base,250);assert.equal(C.calculate({direct:true}).hit.base,500);});
test('非会心にひらめき・会心加算が乗らない',()=>{assert.equal(C.calculate({criticalBoost:1.4,criticalBonus:30,criticalExtra:100}).min,C.calculate({}).min);});
test('二刀流を最後に切り上げる',()=>{const r=D.physical({attack:101,defense:0,multiplier:1.1,dualRate:.4});assert.equal(r.min,20);assert.equal(r.max,24);});
test('根絶やしは系統値を増幅する',()=>{assert.equal(C.calculate({raceBonus:20,eradicate:300}).corrections.race,80);});
test('テンションは整数%へ切り捨て',()=>{assert.equal(C.calculate({slash:7,allyTension:30}).corrections.slash,9);});
test('フォース半減はテンションより先に切り捨て',()=>{assert.equal(C.calculate({elementBonus:17,allyTension:30,force:true}).corrections.element,10);});
test('敵テンションは弱点を縮め耐性を増す',()=>{assert.equal(C.calculate({elementResistance:-20,enemyTension:30}).corrections.elementResistance,-14);assert.equal(C.calculate({typeResistance:40,enemyTension:30}).corrections.typeResistance,52);});
test('領域耐性変化は敵テンションの対象外',()=>{assert.equal(C.calculate({elementResistance:40,enemyTension:30,forcedResistance:-50}).corrections.elementResistance,2);});
test('多段会心倍率の乱数範囲',()=>{const r=C.calculate({attack:1000,defense:0,multiplier:100,criticalType:'multi',hits:2});assert.equal(r.min,1496);assert.equal(r.max,2128);});
test('レベルアップ加算とバイシオンを別に計算',()=>{assert.equal(C.calculate({levelUp:1,attackStages:1}).effectiveAttack,1240);});
test('レベルダウンは係数切り上げ',()=>{assert.equal(C.calculate({levelDown:2}).effectiveDefense,930);});
test('不正な段階・無限値・負倍率を拒否',()=>{for(const p of [{hits:1.5},{attackStages:4},{attack:Infinity},{multiplier:-1},{criticalType:'foo'}])assert.throws(()=>C.calculate(p));});
console.log(n+' physical formula checks passed');
