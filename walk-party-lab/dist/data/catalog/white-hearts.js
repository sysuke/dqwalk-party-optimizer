'use strict';
(function(root) {
  const checked='2026-10-23',C=root.Catalog9,m=root.PlannerData.real;
  const keys=['hp','mp','attack','defense','magic','heal','speed','dex'];
  const source='https://gamewith.jp/dq-walk/article/show/582866';
  const hearts=[
    {id:'phantom-dragon',name:'いびつ世界の幻竜',color:'紫',rank:'S',values:[133,131,25,84,131,53,89,104],bonuses:[{group:'general',type:'呪文',value:.09},{group:'element',value:.07}],recovery:{mp:3,hp:0}},
    {id:'phantom-dragon-awakened',name:'いびつ世界の幻竜（覚醒）',color:'白',rank:'S覚醒',values:[144,144,136,136,136,136,136,114],bonuses:[...['斬撃','体技','ブレス','呪文'].map(type=>({group:'general',type,value:.13})),{group:'race',race:'？？？？系',value:.07},{group:'race',race:'ドッペル系',value:.1}],recovery:{mp:4,hp:0}}
  ];
  for(const row of hearts) {
    const {values,...record}=row;
    const h={...record,stats:Object.fromEntries(keys.map((key,i)=>[key,values[i]])),family:'phantom-dragon',cost:167,costBonus:4,checked,source,sources:[source,'https://game8.jp/dqwalk/832739','https://9db.jp/dqwalk/data/20139'],skills:[],effects:['最大コスト+4','ターン開始MP'+row.recovery.mp+'回復'],unmodeled:['追い覚醒・プラ魂・ウラ魂の追加値は含まない。','回復技のHP回復効果は未対応。']};
    C.hearts.push(h);m.items.push({...h,slot:'heart',ready:false,verifiedModel:true,skillIds:[],verified:['S/覚醒の8能力・コスト・攻撃補正・固定MP回復を照合。'],assumptions:h.unmodeled});
  }
  const previous=root.PlannerData.profile;
  root.PlannerData.profile=function(master){const p=previous(master);if(master===m)for(const item of p.inventory)if(hearts.some(h=>h.id===item.id))item.count=1;return p;};
  root.Data30.pending=root.Data30.pending.filter(row=>!row.name.includes('幻竜'));
  const oldSummary=root.Data30.summaryHTML;
  root.Data30.summaryHTML=()=>oldSummary().replace('白いこころ、追い覚醒','追い覚醒');
  C.scope='代表'+C.weapons.length+'武器・'+C.hearts.length+'こころ。白は枠別補正・切上げ。';
  root.Data31={checked,hearts,source,summaryHTML:()=>'<details class="panel"><summary>10/23：幻竜の通常・覚醒こころと白の枠別補正</summary><p>通常と覚醒は各1個を比較用に追加。既存の所持数は保持します。白は通常の色一致1.3倍を使わず、能力ごとの倍率と切上げを適用します。</p><p><a href="https://gamewith.jp/dq-walk/article/show/582866" target="_blank" rel="noreferrer">幻竜の能力・効果</a>／<a href="https://gamewith.jp/dq-walk/article/show/537844" target="_blank" rel="noreferrer">白の枠別補正</a></p><p>白の新世界は耐久・解除モデル未対応。追い覚醒・プラ魂・ウラ魂の追加値は加算しません。</p></details>'};
})(typeof window==='undefined'?globalThis:window);
