const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),A=require('node:assert/strict');const ctx=vm.createContext({console});ctx.window=ctx;for(const f of ['data/contents','data/profiles','data/quick-catalog','domain/damage/combat-rules','data/rules','data/master','data/catalog/base','domain/damage/damage','domain/optimization/auto-optimizer'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../dist',f+'.js'),'utf8'),ctx,{filename:f});const D=ctx.AutoDamage,E=ctx.AutoOptimizer,m=ctx.PlannerData.real,p=ctx.PlannerData.profile(m),copy=x=>JSON.parse(JSON.stringify(x));let count=0;function test(n,f){f();count++;console.log('PASS '+n);}
test('直撃1100%の手計算による乱数下限・上限',()=>{const d=D.physical({attack:1000,defense:9999,multiplier:11,direct:true});A.equal(d.min,5148);A.equal(d.max,5852);});
test('単なる会心では守備を無視しない',()=>{const d=D.physical({attack:1000,defense:1000,multiplier:11,critical:true,criticalExtra:.5,criticalBonus:.07});A.equal(d.base,250);A.equal(d.min,5585);});
test('スキル会心7%は会心倍率に加算、1.07倍でない',()=>{const d=D.physical({attack:1000,defense:0,multiplier:11,direct:true,critical:true,criticalExtra:.5,criticalBonus:.07});A.equal(d.critical,2.17);A.equal(d.min,11171);});
test('攻撃3段階は攻撃値に60%加算してから計算',()=>{const d=D.physical({attack:1000,defense:0,multiplier:11,direct:true,attackStages:3});A.equal(d.base,800);});
test('時荒らしの検証済み2点と魔力上限',()=>{A.equal(D.spell({magic:15}).base,300);A.equal(D.spell({magic:1950}).base,3600);A.equal(D.spell({magic:9999}).base,3600);});
test('敵テンション3とブレイブの耐性20ポイント',()=>{A.equal(D.typeRate(.6,3,'none'),.48);A(Math.abs(D.typeRate(.6,3,'brave')-.68)<1e-9);});
const b={job:'job-8',stats:{attack:1000,magic:200},bonuses:[{group:'race',race:'ドラゴン系',value:.5}]},actor={criticalActions:1,rainbow:true,buffs:{}},enemy={effects:[]};
test('根絶やしは系統効果値を4倍、全ダメージ4倍ではない',()=>{const d=D.attack(b,{skill:'eradicate'},actor,enemy,{domain:'none'}),normal=D.attack(b,{skill:'fullslash'},actor,enemy,{domain:'none'});A.equal(d.raceBonus,2);A.equal(normal.raceBonus,.5);A(d.min>normal.min*1.9&&d.min<normal.min*2.1);});
test('レインボーフォースは半減した属性補正込みで属性選択',()=>{const d=D.attack({...b,bonuses:[{group:'element',element:'デイン',value:2}]},{skill:'fullslash'},actor,enemy,{domain:'roto'});A.equal(d.element,'デイン');});
test('全属性ダメージを無属性ダメージに加算しない',()=>{A.equal(D.sum({bonuses:[{group:'element',value:.17}]},'element','斬撃','無','ドラゴン系'),0);});
test('二刀流は2ヒット、それぞれ0.4＋補正',()=>{const solo=D.attack(b,{skill:'fullslash'},actor,enemy,{domain:'none'}),dual=D.attack({...b,left:{id:'x'},dualBonus:0},{skill:'fullslash'},actor,enemy,{domain:'none'});A.equal(dual.hits,2);A(Math.abs(dual.min/solo.min-.8)<.001);});
test('覚醒こころの仮コストを修正',()=>{for(const [id,cost]of [['estark',167],['zoma',149],['lamp',141],['god',152]])A.equal(m.items.find(i=>i.id===id).cost,cost);});
test('二刀流の左手ロトは142攻撃・ドラゴン20%',()=>{const i=m.items.find(i=>i.id==='roto-kai3');A.equal(i.stats.attack,142);A.equal(i.bonuses[0].value,.2);});
const settings=E.defaults(),result=E.solve(m,p,settings);
test('ダメージ未入力の初期状態で4人の装備全体と火力を返す',()=>{A.equal(result.status,'ok');A(result.results.length);for(const t of result.results){A(t.lower.known);A(t.lower.traces.every(x=>Number.isFinite(x.min)&&Number.isFinite(x.max)));A.equal(t.builds.length,4);A(t.builds.every(b=>b.hearts.length===4));A(t.lower.damage>0);}});
test('4人で共有する所持数とこころコストを厳守',()=>{for(const t of result.results){for(const [id,n]of Object.entries(t.used))A(n<=p.inventory.find(i=>i.id===id).count);for(const b of t.builds){A(b.cost<=b.baseCost+b.costBonus);A.equal(new Set(b.hearts.map(h=>h.monster||h.name)).size,4);}}});
test('名目速度順を探索中と最終候補で検査',()=>{for(const t of result.results)A(t.order.every(x=>x.nominal));});
test('やまびこ2発目は半威力、短縮を各着弾後に反映',()=>{const traces=result.results[0].lower.traces.filter(x=>x.skill==='timewave');A.equal(traces.length,4);A(Math.abs(traces[1].min/traces[0].min-.5)<.002);A(traces[2].typeRate>traces[0].typeRate);});
test('基礎能力の実測登録をキャラと職業の組で適用',()=>{const s=E.defaults();s.baseOverrides['0:job-5']={stats:{hp:900,mp:500,attack:300,defense:400,magic:200,heal:200,speed:777},cost:700};const b=E.baseFor(m,p,0,'job-5',s);A.equal(b.estimated,false);A.equal(b.value.stats.speed,777);A(E.baseFor(m,p,0,'job-0',s).estimated);});
test('武器を未所持にすると他キャラの装備を捏造しない',()=>{const q=copy(p);q.inventory.filter(i=>i.id.startsWith('hero-')).forEach(i=>i.count=0);const r=E.solve(m,q,settings);A.equal(r.status,'infeasible');A.equal(r.results.length,0);});
test('低すぎるコスト上限や不可能なHP条件を無視しない',()=>{const s=E.defaults();s.minHP=99999;A.equal(E.solve(m,p,s).status,'infeasible');});
test('最適化が所持品・基礎能力の元データを書き換えない',()=>{const q=copy(p),before=JSON.stringify(q);E.solve(m,q,settings);A.equal(JSON.stringify(q),before);});
test('仮性能を除外した候補では未確認の装備を使わない',()=>{const r=E.solve(m,p,{...settings,includeEstimated:false,enforceOrder:false});A.equal(r.status,'ok');for(const t of r.results)for(const b of t.builds)for(const i of [...b.items,...b.hearts,...(b.left?[b.left]:[])])A(i.verifiedModel);});
test('領域・数値範囲・基礎能力の不正入力を拒否',()=>{for(const s of [{domain:'both'},{hp:-1},{echoRate:2},{baseOverrides:{x:{stats:{attack:-1},cost:500}}}])A.throws(()=>E.validate(s));});
console.log(count+' automatic-calculation checks passed; '+result.nodes+' combinations; lower remaining HP '+result.results[0].lower.enemy.hp);

