'use strict';
// Structural ownership scenario using existing catalog items, not a user profile.
module.exports=c=>{
 const m=c.PlannerData.real,f=require('./search-quality.cjs').cases(c).find(x=>x.id==='spell-roles-2t'),copy=x=>JSON.parse(JSON.stringify(x));
 for(const [id,count]of [['god',2],['hagumeta-charm',1]]){const row=f.profile.inventory.find(r=>r.id===id);if(row)row.count=count;else f.profile.inventory.push({id,count});}
 const config=copy(f.reference);config.actors[0].hearts[2]='god';config.actors[0].armors=Array.from({length:8},(_,i)=>i===4?'hagumeta-charm':'');config.actors[2].hearts[0]='god';
 // Use the previously found preparation/support plan, independent of the search.
 config.actions=[{actor:0,turn:1,skill:'tokumori',target:2},{actor:3,turn:1,skill:'dharma-prayer',target:2},{actor:1,turn:1,skill:'rondo',target:2},{actor:2,turn:1,skill:'true-magic-release',aiSkill:'forbidden-burst',target:2},{actor:0,turn:2,skill:'cheer',target:2},{actor:1,turn:2,skill:'rondo',target:2},{actor:2,turn:2,skill:'forbidden-burst',target:2},{actor:3,turn:2,skill:'encore',target:2},{actor:2,turn:2,skill:'forbidden-burst',target:2}];
 return {master:m,profile:f.profile,config,settings:c.PartyBattle.validate(f.settings)};
};
