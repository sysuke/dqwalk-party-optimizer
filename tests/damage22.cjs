const fs=require('fs'),path=require('path'),vm=require('vm'),A=require('assert/strict'),root=path.resolve(__dirname,'../dist'),c=vm.createContext({console});c.window=c;for(const [,file]of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g))if(file!=='ui/app.js')vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});const C=c.PhysicalCalculator;let n=0;function test(name,fn){fn();n++;console.log('PASS '+name);}
test('公開式モデル由来の固定256条件で下限上限を再照合',()=>{const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/physical22.json'),'utf8'));A.equal(fixture.fixtures.length,256);A.equal(fixture.sha256.length,64);for(const [i,row]of fixture.fixtures.entries()){A(Number.isFinite(row.expected.min)&&Number.isFinite(row.expected.max));const r=C.calculate(row.input);A.equal(r.min,row.expected.min,'min '+i);A.equal(r.max,row.expected.max,'max '+i);}});
test('剣魔合一25×Lv4倍率1.16を28へ誤って切り捨てない',()=>{const r=C.calculate({attack:1000,sword:25,levelUp:4});A.equal(r.effectiveAttack,1189);});
test('属性弱化と斬体被ダメージ補正は別々に乗算',()=>{const r=C.calculate({resistChange:30,typeDebuff:20,includeTrace:true});A.equal(r.factors.elementDebuff,1.3);A.equal(r.factors.typeDebuff,1.2);A.equal(r.min,4015);A.equal(r.max,4564);A.equal(r.hit.stages.min.first,4015);});
test('独立手計算で丸め3段階を追跡',()=>{const r=C.calculate({attack:101,defense:0,multiplier:110,dualRate:.4,includeTrace:true});A.equal(r.hit.stages.min.base,46);A.equal(r.hit.stages.min.first,50);A.equal(r.hit.stages.min.second,50);A.equal(r.hit.stages.min.third,20);A.equal(r.min,20);A.equal(r.max,24);});
test('ため後の切り捨てと二刀後の切り上げを混ぜない',()=>{const r=C.calculate({attack:101,defense:0,multiplier:110,charge:2.3,dualRate:.4,includeTrace:true});A.equal(r.hit.stages.min.first,50);A.equal(r.hit.stages.min.second,115);A.equal(r.hit.stages.min.third,46);});
test('適用範囲未照合のため複数ヒットを全弾倍化しない',()=>{A.throws(()=>C.calculate({hits:2,charge:2}),/1発ずつ/);A.equal(C.calculate({hits:2}).min,C.calculate({hits:1}).min*2);});
test('FC・ゾーン属性・領域斬体補正を個別入力して計算可能',()=>{const r=C.calculate({force:true,elementBonus:40,elementBuff:45,forceCharge:120,forcedTypeResistance:-20});A.equal(r.corrections.element,42);A.equal(r.factors.element,2.62);A.equal(r.factors.typeResistance,1.2);});
test('負の斬体被ダメージ補正も独立群、範囲外は拒否',()=>{const r=C.calculate({typeDebuff:-100});A.equal(r.min,0);A.equal(r.max,0);A.throws(()=>C.calculate({typeDebuff:-101}),/斬体/);});
test('凍結と斬体被ダメージ補正は参照式と同じ加算群にまとめる',()=>{
 for(const [freezeLevel,freeze]of [[1,10],[2,15]]){
  const combined=C.calculate({freezeLevel,typeDebuff:20,includeTrace:true});
  const equivalent=C.calculate({freezeLevel:0,typeDebuff:20+freeze,includeTrace:true});
  A.equal(combined.factors.damageTakenGroup,1+(20+freeze)/100);
  A.equal(combined.min,equivalent.min);A.equal(combined.max,equivalent.max);
  A.deepEqual(combined.hit.stages,equivalent.hit.stages);
 }
 const reduced=C.calculate({freezeLevel:1,typeDebuff:-80});
 A.equal(reduced.factors.damageTakenGroup,.3);
 // Synthetic -80 is a group-composition test, not a mapping of ruins reinforcement.
});
test('数値画面で修正欄と検証範囲を表示、旧入力を無言で再解釈しない',()=>{c.localStorage={getItem:()=>JSON.stringify({resistChange:30})};const nodes={},target={innerHTML:'',querySelector:s=>nodes[s]||(nodes[s]={})};c.CalculatorUI.render({target,master:c.PlannerData.real});for(const name of ['typeDebuff','resistChange','elementBuff','forceCharge','forcedTypeResistance'])A(target.innerHTML.includes('name="'+name+'"'));A(target.innerHTML.includes('旧入力'));A(target.innerHTML.includes('実機での照合例は未登録'));A.equal((target.innerHTML.match(/数式検証の範囲と未検証事項/g)||[]).length,1);});
test('安全な整数精度を超える条件で不正確な巨大数を返さない',()=>{A.throws(()=>C.calculate({attack:1e7,multiplier:1e7,slash:1e7,elementBonus:1e7,raceBonus:1e7}),/安全な整数範囲/);});
console.log(n+' precision audit checks passed');
