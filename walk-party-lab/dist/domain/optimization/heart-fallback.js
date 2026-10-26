'use strict';
(function(root) {
  function wrap(run,ids) {
    return function(master,profile,enemy,settings={},progress=()=>{}) {
      settings={...settings,_deadline:settings._deadline??Date.now()+(settings.maxTimeMs??({quick:15000,balanced:45000,thorough:120000}[settings.searchMode||'balanced']))};
      const primary=run(master,profile,enemy,settings,progress);
      if(Date.now()>=settings._deadline||settings.objective==='damage'||settings.heartFallback===false||primary.results?.some(row=>row.killed&&row.resourceOK)||!profile.inventory.some(row=>ids.includes(row.id)&&row.count>0))return primary;
      const remaining=settings.maxNodes==null?null:Math.max(0,settings.maxNodes-(primary.nodes||0));
      if(remaining===0)return primary;
      const alternate=JSON.parse(JSON.stringify(profile));
      for(const row of alternate.inventory)if(ids.includes(row.id))row.count=0;
      const fallback=run(master,alternate,enemy,remaining==null?settings:{...settings,maxNodes:remaining},p=>progress({...p,phase:'追加こころなしの候補を再比較・'+p.phase}));
      const selected=fallback.results?.some(row=>row.killed&&row.resourceOK)?fallback:primary;
      return {...selected,nodes:(primary.nodes||0)+(fallback.nodes||0),poolNodes:(primary.poolNodes||0)+(fallback.poolNodes||0),truncated:!!(primary.truncated||fallback.truncated),limits:[...(selected.limits||[]),'0.31以降に追加したこころを使わない所持品条件も再探索。候補を絞る近似探索の取りこぼしを減らします。'],heartFallbackCompared:true};
    };
  }
  root.HeartFallback={wrap};
  root.PartyPlanner.solve=wrap(root.PartyPlanner.solve,['phantom-dragon','phantom-dragon-awakened',...(root.Data32?.hearts||[]).map(row=>row.id)]);
})(typeof window==='undefined'?globalThis:window);
