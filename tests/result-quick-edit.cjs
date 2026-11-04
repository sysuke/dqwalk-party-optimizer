'use strict';
const A=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{loadRuntime}=require('../scripts/runtime.cjs'),c=loadRuntime();
vm.runInContext(fs.readFileSync(require.resolve('../dist/ui/party.js'),'utf8'),c);
const m=c.PlannerData.real,p=c.PlannerData.profile(m),weapon=m.items.find(i=>i.slot==='weapon'),before=JSON.stringify(p);
function test(name,fn){fn();console.log('PASS '+name);}
test('結果のレベル・武器所持数を変更しても他の職業・在庫と元入力を壊さない',()=>{const next=c.PartyUI.quickEditProfile(p,m,{'quick-level:0:job-8':'94',['quick-stock:'+weapon.id]:'0'});A.equal(next.characters[0].levels['job-8'],94);A.equal(next.inventory.find(x=>x.id===weapon.id).count,0);A.equal(JSON.stringify(p),before);A.equal(JSON.stringify(next.characters[1]),JSON.stringify(p.characters[1]));A.equal(next.inventory.length,p.inventory.length);});
test('不正入力をまとめて拒否し、保存前の所持品を変更しない',()=>{for(const values of [{'quick-level:0:job-8':'1.5'},{'quick-level:0:job-8':''},{'quick-level:0:job-8':'999'},{'quick-level:7:job-8':'80'},{'quick-stock:missing':'0'},{['quick-stock:'+weapon.id]:'-1'}])A.throws(()=>c.PartyUI.quickEditProfile(p,m,values));A.equal(JSON.stringify(p),before);});
test('未育成0を登録でき、敵入力は所持品へ混入しない',()=>{const next=c.PartyUI.quickEditProfile(p,m,{'quick-level:0:job-8':'0','quick-hp':'5000'});A.equal(next.characters[0].levels['job-8'],0);A.equal(next['quick-hp'],undefined);});
