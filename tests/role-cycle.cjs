'use strict';
const A=require('node:assert/strict'),{loadRuntime}=require('../scripts/runtime.cjs'),fixture=require('./fixtures/role-cycle.cjs'),copy=x=>JSON.parse(JSON.stringify(x));
function test(name,fn){fn();console.log('PASS '+name);}
test('2人交換の行き止まりを3人の役割循環で改善し、小規模全配分と一致する',()=>{
 const c=loadRuntime(),f=fixture(c),R=c.RoleAssignment38,sim=q=>c.PartyBattle.simulate(q,f.master,f.profile,f.settings),seed=sim(f.config),before=JSON.stringify(f),compare=(a,b)=>b.damage-a.damage;
 const pairs=R.search([seed],f.master,f.profile,{...f.settings,rolePermutations:false},sim,compare,32);A.equal(pairs.best.damage,seed.damage);
 // Compose pair exchanges to enumerate the six three-person assignments.
 const configs=[f.config];for(const i of [0,1,2])for(const j of [0,1,2])if(i<j)configs.push(R.exchange(f.config,i,j,f.master));
 configs.push(R.exchange(R.exchange(f.config,0,1,f.master),1,2,f.master),R.exchange(R.exchange(f.config,0,1,f.master),0,2,f.master));
 const oracle=configs.map(sim).filter(r=>r.resourceOK).sort(compare)[0],found=R.search([seed],f.master,f.profile,f.settings,sim,compare,32);
 A(found.permutationCalls>0);A(found.calls<=32);A(found.best.damage>seed.damage);A.equal(found.best.damage,oracle.damage);A.equal(c.PartyBattle.inventory(found.best.config,f.master,f.profile).issues.length,0);
 A.equal(sim(found.best.config).damage,found.best.damage);A.equal(JSON.stringify(f),before);
 console.log('INFO 2人交換 '+pairs.best.damage+'／共同配分 '+found.best.damage+'、評価 '+found.calls+'件');
});
test('役割循環は人物の職業・解放状態を保ち、補助対象と自動攻撃の使用者を付け替える',()=>{
 const c=loadRuntime(),f=fixture(c),R=c.RoleAssignment38,config=copy(f.config);config.actors[0].rootUnlocked=true;config.actors[1].pathUnlocked=false;config.actions=[{actor:0,turn:1,skill:'encore',target:1},{actor:1,turn:1,skill:'true-magic-release',aiSkill:'love-stream'},{actor:2,turn:1,skill:'tokumori',target:1}];
 const before=JSON.stringify(config),next=R.permute(config,[2,0,1,3],f.master);A(next);A.equal(JSON.stringify(config),before);
 A.deepEqual(Array.from(next.actors,a=>[a.member,a.job,a.rootUnlocked,a.pathUnlocked]),config.actors.map(a=>[a.member,a.job,a.rootUnlocked,a.pathUnlocked]));
 A.deepEqual(copy(next.actions),[{actor:1,turn:1,skill:'encore',target:2},{actor:2,turn:1,skill:'true-magic-release',aiSkill:'love-stream'},{actor:0,turn:1,skill:'tokumori',target:2}]);
 A.deepEqual(copy(c.PartyBattle.inventory(next,f.master,f.profile).used),copy(c.PartyBattle.inventory(config,f.master,f.profile).used));
 A.equal(R.permute(config,[0,1,1,3],f.master),null);A.equal(R.permute(config,[0,1,2,4],f.master),null);A.equal(R.permute(config,[0,1,2],f.master),null);A.equal(R.permute(config,[3,0,1,2],f.master),null);
 delete config.actors[3].actualMagic;const four=R.permute(config,[3,0,1,2],f.master);A(four);A.deepEqual(Array.from(four.actors,a=>a.member),[0,1,2,3]);A.deepEqual(Array.from(four.actors,a=>a.weapon),['dharma-staff','hero','perseria','gun']);
});
test('共同配分も評価上限・期限・資源不成立を守る',()=>{
 const c=loadRuntime(),f=fixture(c),R=c.RoleAssignment38,sim=q=>c.PartyBattle.simulate(q,f.master,f.profile,f.settings),seed=sim(f.config),compare=(a,b)=>b.damage-a.damage;
 A(R.search([seed],f.master,f.profile,f.settings,sim,compare,1).calls<=1);
 A.equal(R.search([seed],f.master,f.profile,{...f.settings,_deadline:1},()=>{throw Error('期限後の評価');},compare,32).calls,0);
 const rejected=R.search([seed],f.master,f.profile,f.settings,q=>({...sim(q),resourceOK:false}),compare,32);A.equal(rejected.best,seed);A(rejected.permutationCalls>0);
});
