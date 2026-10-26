'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist'),base=new URL('https://example.invalid/dqwalk-party-optimizer/');
let checked=0;
function check(ref,from){if(/^(https?:|data:|#)/.test(ref))return;const origin=new URL(from,base),url=new URL(ref,origin);if(!url.pathname.startsWith(base.pathname))throw Error('Pagesのサブパスから外れる参照: '+ref+' in '+from);const local=path.resolve(root,decodeURIComponent(url.pathname.slice(base.pathname.length)));if(!local.startsWith(root+path.sep)||!fs.statSync(local).isFile())throw Error('配信ファイルが存在しません: '+ref+' in '+from);checked++;}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g))check(match[1],'index.html');
for(const name of fs.readdirSync(path.join(root,'workers'))){if(!name.endsWith('.js'))continue;const source=fs.readFileSync(path.join(root,'workers',name),'utf8'),imports=source.match(/importScripts\(([\s\S]*?)\);/);if(imports)for(const match of imports[1].matchAll(/['"]([^'"]+)['"]/g))check(match[1],'workers/'+name);}
if(!fs.existsSync(path.join(root,'.nojekyll')))throw Error('.nojekyll が必要です');
console.log('GitHub Pages subpath references: '+checked+' checked');
