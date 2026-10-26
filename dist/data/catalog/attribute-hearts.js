'use strict';
(function(root) {
  const checked='2026-10-23',C=root.Catalog9,m=root.PlannerData.real;
  const stats=values=>Object.fromEntries(['hp','mp','attack','defense','magic','heal','speed','dex'].map((key,i)=>[key,values[i]]));
  const physical=value=>['斬撃','体技'].map(type=>({group:'general',type,value}));
  const element=(name,value)=>['斬撃','体技'].map(type=>({group:'element',element:name,type,value}));
  const hearts=[
    {id:'ryu-chan',name:'リュウちゃん',family:'ryu-chan',color:'紫',rank:'S',cost:161,costBonus:4,
      stats:stats([160,101,84,68,104,62,91,94]),bonuses:[{group:'general',type:'呪文',value:.1},{group:'element',value:.05}],
      source:'https://gamewith.jp/dq-walk/article/show/531749',sources:['https://gamewith.jp/dq-walk/article/show/531749','https://gamewith.jp/dq-walk/article/show/168110'],unmodeled:['魅了耐性10%は生存計算へ未反映。']},
    {id:'ryu-chan-awakened',name:'リュウちゃん（覚醒）',family:'ryu-chan',color:'白',rank:'S覚醒',cost:161,costBonus:10,
      stats:stats([181,115,130,130,130,130,130,118]),bonuses:[{group:'element',value:.2}],
      source:'https://gamewith.jp/dq-walk/article/show/531749',sources:['https://gamewith.jp/dq-walk/article/show/531749','https://9db.jp/dqwalk/data/17268'],unmodeled:['スキルHP回復10%・？？？？系耐性3%・魅了耐性10%は未反映。','全属性ダメージUPは無属性へ適用しない。']},
    {id:'mordegon',name:'魔王ウルノーガ',family:'mordegon',color:'黒',rank:'S',cost:181,costBonus:0,noColorBonus:true,
      stats:stats([150,80,210,78,21,37,137,101]),bonuses:[...physical(.11),...element('ドルマ',.11),...element('デイン',-.11)],
      source:'https://gamewith.jp/dq-walk/article/show/567600',sources:['https://gamewith.jp/dq-walk/article/show/567600','https://game8.jp/dqwalk/796360'],unmodeled:['会心率5%を確定会心へ変換しない。ドルマ耐性10%は生存計算へ未反映。']}
  ];
  for(const row of hearts) {
    const record={...row,checked,skills:[],effects:['最大コスト+'+row.costBonus],introducedRevision:32};
    C.hearts.push(record);
    m.items.push({...record,slot:'heart',ready:false,verifiedModel:true,skillIds:[],verified:['Sの8能力・色・コスト・攻撃補正と不利効果を出典照合。'],assumptions:[...row.unmodeled]});
  }
  for(const row of [...C.hearts,...m.items.filter(row=>row.slot==='heart')])if(row.color==='黒') {
    row.effects=(row.effects||[]).filter(text=>!text.startsWith('黒：'));
    row.effects.push('黒枠のみ色合わせ1.3倍・虹枠では補正なし。最大コスト加算なし。');
    row.colorBonusSource='https://walk.dragonquest.jp/web/help/';
  }
  const previous=root.PlannerData.profile;
  root.PlannerData.profile=function(master){const p=previous(master);if(master===m)for(const row of p.inventory)if(hearts.some(h=>h.id===row.id))row.count=1;return p;};
  C.scope='代表'+C.weapons.length+'武器・'+C.hearts.length+'こころ。白・黒は枠別補正。';
  root.Data32={checked,hearts,summaryHTML:()=>'<details class="panel"><summary>10/23：リュウちゃん通常・覚醒／ウルノーガを追加</summary><p>白の全属性20%と最大コスト+10、ウルノーガのドルマ斬体+11%・デイン斬体-11%を反映。新規こころは各1個の比較用初期値です。既存の所持数は維持します。</p><ul>'+hearts.map(row=>'<li><a href="'+row.source+'" target="_blank" rel="noreferrer">'+row.name+'</a></li>').join('')+'</ul><p>黒は黒を含む枠でのみ1.3倍。虹枠は補正なし。<a href="https://walk.dragonquest.jp/web/help/" target="_blank" rel="noreferrer">公式の色合わせ説明</a></p><p>確率会心・耐性・回復技・個体別の追加能力は未対応部分を残しています。</p></details>'};
})(typeof window==='undefined'?globalThis:window);
