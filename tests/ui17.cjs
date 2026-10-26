const fs=require('fs'),vm=require('vm'),path=require('path'),A=require('assert');
const root=path.resolve(__dirname,'../dist'),nodes=new Map(),node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',elements:{content:{}},querySelectorAll:()=>[]});return nodes.get(s);};
const c=vm.createContext({console,document:{body:{dataset:{}},querySelector:node},localStorage:{getItem:()=>null,setItem(){}},setTimeout,URL,Blob});c.window=c;
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const [,file] of html.matchAll(/<script src="([^"]+)"/g))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
let n=0;function test(name,fn){fn();console.log('PASS '+name);n++;}
function balanced(html){const stack=[],voids=new Set(['input','br','hr','img','meta','link']);for(const m of html.matchAll(/<(\/?)([a-z][a-z0-9]*)\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi)){const tag=m[2].toLowerCase();if(voids.has(tag))continue;if(m[1])A.equal(stack.pop(),tag,'unbalanced '+m[0]);else stack.push(tag);}A.deepEqual(stack,[]);}
test('通常ナビは3画面、個別検証は閉じた折り畳み',()=>{const s=node('#tabs').innerHTML;A.equal((s.split('<details')[0].match(/data-page=/g)||[]).length,3);A(s.includes('data-page="party"'));A(s.includes('<details class="advanced-tools" >'));A(s.includes('data-page="calculator"'));balanced(s);});
test('データ説明は閉じた状態、算出ボタンが仮値説明より先',()=>{A(node('#mode-note').innerHTML.startsWith('<details class="data-help">'));const s=node('#view').innerHTML;A(s.indexOf('id="solve"')<s.indexOf('ボスの仮値を確認・変更'));balanced(s);});
const m=c.PlannerData.real,p=c.PlannerData.profile(m);let worker; c.Worker=function(){worker=this;this.terminate=()=>{};this.postMessage=()=>{};};
const inputs=new Map(),target={innerHTML:'',querySelector:selector=>{if(!inputs.has(selector))inputs.set(selector,{elements:{content:{}},isConnected:true});return inputs.get(selector);},querySelectorAll:()=>[]};
c.PartyUI.render({target,master:m,profile:p,content:m.contents.find(x=>x.id==='chapter18'),policy:'farm'});
test('敵の追加条件は折り畳み、全入力名とフォーム構造を維持',()=>{balanced(target.innerHTML);for(const name of ['hp','objective','turns','incoming','enemySpeedMax','element-メラ','allowPaths','cycles','extra-hp-0','extra-element-0-メラ'])A(target.innerHTML.includes('name="'+name+'"'),name);A(target.innerHTML.includes('<details class="panel enemy-settings">'));A(target.innerHTML.includes('守備力・系統・耐性を変更'));});
test('ヘッダー・保存の説明を折り畳み、モード切替を維持',()=>{A(html.includes('<details class="demo-settings">'));A(html.includes('id="mode-button"'));A(html.includes('<footer><details>'));});
console.log(n+' UI checks passed');
