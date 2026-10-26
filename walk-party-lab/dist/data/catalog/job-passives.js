'use strict';
(function(root){
// Normal level-learned damage effects only. Permanent stats, monster collection,
// proficiency and optional kokorodo branches remain separate from these effects.
const both=v=>['斬撃','体技'].map(type=>({group:'general',type,value:v})),spell=v=>({group:'general',type:'呪文',value:v}),element=v=>({group:'element',value:v});
const rows=[
 ['job-0',20,both(.05),'https://gamewith.jp/dq-walk/article/show/365526'],['job-0',40,both(.05),'https://gamewith.jp/dq-walk/article/show/365526'],
 ['job-1',20,[...both(.05),spell(.05)],'https://9db.jp/dqwalk/data/7822'],['job-1',45,[...both(.05),spell(.05)],'https://9db.jp/dqwalk/data/7822'],
 ['job-3',45,both(.05),'https://gamewith.jp/dq-walk/article/show/384563'],
 ['job-4',20,[...both(.05),spell(.05)],'https://9db.jp/dqwalk/data/8731?p=2'],['job-4',45,[...both(.05),spell(.05)],'https://9db.jp/dqwalk/data/8731?p=2'],['job-4',75,[element(.02)],'https://9db.jp/dqwalk/data/8731?p=2'],['job-4',85,[element(.02)],'https://9db.jp/dqwalk/data/8731?p=2'],
 ['job-5',25,both(.05),'https://9db.jp/dqwalk/data/10517'],
 ['job-6',20,[...both(.05),{group:'general',type:'ブレス',value:.02}],'https://9db.jp/dqwalk/data/11150?p=2'],['job-6',45,[...both(.05),{group:'general',type:'ブレス',value:.02}],'https://9db.jp/dqwalk/data/11150?p=2'],['job-6',75,[...both(.03),{group:'general',type:'ブレス',value:.01}],'https://9db.jp/dqwalk/data/11150?p=2'],
 ['job-7',35,[spell(.05)],'https://9db.jp/dqwalk/data/12345?p=2'],['job-7',45,[spell(.05),{group:'general',type:'ブレス',value:.02}],'https://9db.jp/dqwalk/data/12345?p=2'],['job-7',75,[element(.02)],'https://9db.jp/dqwalk/data/12345?p=2'],
 ['job-8',25,both(.05),'https://9db.jp/dqwalk/data/8888?p=8'],['job-8',75,both(.03),'https://9db.jp/dqwalk/data/8888?p=8'],
 ['job-9',45,both(.05),'https://9db.jp/dqwalk/data/14000?p=11'],['job-9',85,both(.05),'https://9db.jp/dqwalk/data/14000?p=11'],
 ['job-10',20,[...both(.05),spell(.05)],'https://9db.jp/dqwalk/data/15000'],['job-10',45,[...both(.03),spell(.03)],'https://9db.jp/dqwalk/data/15000'],['job-10',75,[...both(.02),spell(.02)],'https://9db.jp/dqwalk/data/15000'],['job-10',95,[...both(.01),spell(.01)],'https://9db.jp/dqwalk/data/15000']
].map(([job,level,bonuses,source])=>({job,level,bonuses,source,favored:!(job==='job-8'&&level===25)}));
function bonuses(job,level,favored){return rows.filter(r=>r.job===job&&r.level<=level&&(!r.favored||favored)).flatMap(r=>r.bonuses.map(b=>({...b,source:r.source,origin:'職業Lv'+r.level})));}
root.JobPassives18={rows,bonuses,limits:['ニンジャLv25の得意条件は資料差があるため未加算。','永続・熟練度・こころ道・なかまモンスターの個人差は未登録なら加算しない。']};
})(typeof window==='undefined'?globalThis:window);
