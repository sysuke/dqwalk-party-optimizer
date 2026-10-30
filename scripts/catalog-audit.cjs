'use strict';
// Inspect the final loaded catalogue, not superseded bootstrap records.
const {loadRuntime}=require('./runtime.cjs');
function audit(){
  const context=loadRuntime();
  const master=context.PlannerData.real,catalog=context.Catalog9;
  const concerns=row=>[...new Set([...(row.assumptions||[]),...(row.unmodeled||[])])];
  const review=rows=>rows.map(row=>({id:row.id,name:row.name,source:row.source,checked:row.checked||null,costSource:row.costSource,costChecked:row.costChecked,stats:row.stats,color:row.color,cost:row.cost,bonuses:row.bonuses,
    needsReview:concerns(row),missingDataNotes:concerns(row).filter(s=>/未収録|未対応|未接続|未反映|確認待ち/.test(s)),placeholderNotes:concerns(row).filter(s=>/仮値|仮置|未確認|仮の|推定|は仮|仮。/.test(s))}));
  const issues=[];
  for(const [kind,rows] of [['items',master.items],['weapons',catalog.weapons],['hearts',catalog.hearts],['skills',catalog.skills]]){
    const seen=new Set();for(const row of rows){if(seen.has(row.id))issues.push(kind+': duplicate '+row.id);seen.add(row.id);}
  }
  for(const heart of catalog.hearts)for(const key of ['hp','mp','attack','defense','magic','heal','speed','dex'])
    if(!Number.isFinite(heart.stats?.[key]))issues.push('heart '+heart.id+': missing '+key);
  for(const owner of [...catalog.weapons,...catalog.hearts])for(const id of owner.skills||[])
    if(!catalog.skills.some(skill=>skill.id===id))issues.push(owner.id+': unknown skill '+id);
  return {scope:'Final runtime data. Notes flag review work, not proof of incorrect values. verifiedModel does not certify every mechanic.',
    counts:{items:master.items.length,weapons:catalog.weapons.length,hearts:catalog.hearts.length,skills:catalog.skills.length,jobs:master.jobs.length,contents:master.contents.length},
    issues,jobs:review(master.jobs),contents:review(master.contents),items:review(master.items),weapons:review(catalog.weapons),hearts:review(catalog.hearts),skills:review(catalog.skills)};
}
if(require.main===module){const report=audit();console.log(JSON.stringify(report,null,2));if(report.issues.length)process.exitCode=1;}
module.exports={audit};
