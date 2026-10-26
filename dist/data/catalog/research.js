'use strict';
(function(root) {
  const C = root.Catalog9, master = root.PlannerData.real;
  const checked = '2026-10-22';
  const stats = values => Object.fromEntries(['hp','mp','attack','defense','magic','heal','speed','dex'].map((key, i) => [key, values[i]]));
  const physical = value => ['斬撃','体技'].map(type => ({group:'general', type, value}));
  const elements = (names, value) => names.map(element => ({group:'element', element, value}));
  // Both Lv45 damage passives are marked 得: apply only with proficiency.
  const gun = C.weapons.find(row => row.id === 'gun');
  const proficiencyBonuses = gun.bonuses.filter(row => row.value === .03 && (row.group === 'element' || row.group === 'general' && row.type === '斬撃'));
  gun.bonuses = gun.bonuses.filter(row => !proficiencyBonuses.includes(row));
  gun.favoredBonuses = [...(gun.favoredBonuses || []), ...proficiencyBonuses];
  for (const row of master.items.filter(row => row.slot === 'weapon' && row.name === gun.name)) {
    row.bonuses = row.bonuses.filter(bonus => !(bonus.value === .03 && (bonus.group === 'element' || bonus.group === 'general' && bonus.type === '斬撃')));
    row.favoredBonuses = gun.favoredBonuses;
  }
  const hearts = [
    {
      id:'orgo-awakened', name:'天魔王オルゴ・デミーラ（覚醒）', family:'orgo-mega', color:'赤', rank:'S覚醒', cost:204, costBonus:4,
      stats:stats([175,76,165,101,26,26,129,113]),
      bonuses:[...physical(.1), ...['ヒャド','ギラ'].flatMap(element => ['斬撃','体技'].map(type => ({group:'element',element,type,value:.12})))],
      source:'https://9db.jp/dqwalk/data/17831?p=2',
      sources:['https://9db.jp/dqwalk/data/17831?p=2','https://gamewith.jp/dq-walk/article/show/571589'],
      effects:['最大コスト+4','開幕まもりのたて1ターン（耐久計算未対応）'],
      unmodeled:['追い覚醒・プラ魂・ウラ魂の追加値を含まない。','状態異常耐性・悪い状態変化耐性7%と開幕まもりのたては生存計算へ未反映。'],
      defaultCount:1
    },
    {
      id:'rasveza-great', name:'大魔王ラスヴェーザ', family:'rasveza-anniversary6', color:'黒', rank:'S', cost:180, costBonus:0, noColorBonus:true,
      stats:stats([158,90,178,82,86,17,126,128]),
      bonuses:elements(['メラ','ギラ','ヒャド','デイン','ザバ'],.15),
      source:'https://9db.jp/dqwalk/data/16431',
      sources:['https://9db.jp/dqwalk/data/16431','https://gamewith.jp/dq-walk/article/show/168103'],
      effects:['黒：色一致補正なし・最大コスト加算なし'],
      unmodeled:['メラ・ヒャド耐性5%は生存計算へ未反映。'], defaultCount:1
    },
    {
      id:'rasveza-divine', name:'神魔王ラスヴェーザ（覚醒）', family:'rasveza-anniversary6', color:'黒', rank:'S覚醒', cost:180, costBonus:0, noColorBonus:true,
      stats:stats([170,93,190,87,91,18,132,135]),
      bonuses:elements(['メラ','ギラ','ヒャド','デイン','ザバ','ドルマ'],.22),
      source:'https://game8.jp/dqwalk/730192',
      sources:['https://9db.jp/dqwalk/data/16431','https://game8.jp/dqwalk/730192','https://gamewith.jp/dq-walk/article/show/168103'],
      effects:['黒：色一致補正なし・最大コスト加算なし'],
      unmodeled:['メラ・ヒャド耐性7%と天候による追加耐性5%は生存計算へ未反映。'], defaultCount:1
    }
  ];
  for (const heart of hearts) {
    if (C.hearts.some(row => row.id === heart.id)) throw Error('Research heart ID already exists');
    heart.checked = checked;
    heart.skills = [];
    heart.verified = ['Sの8能力・色・コスト・攻撃補正を複数資料で照合。'];
    C.hearts.push(heart);
    master.items.push({...heart, slot:'heart', verifiedModel:true, ready:false, skillIds:[], assumptions:[...heart.unmodeled]});
  }

  const gear = [];
  for (const [id, rawDefense, page] of [['adjust-head',105,'20071'],['adjust-body',135,'20072'],['adjust-legs',105,'20073']]) {
    const original = master.items.find(row => row.id === id);
    const source = 'https://9db.jp/dqwalk/data/' + page;
    Object.assign(original, {checked, source, baseStats:{defense:id==='adjust-body'?103:80}, passiveStats:{speed:7},
      verified:['0凸の能力値・斬撃10%・会心ダメージ7%・対ドッペル2%・すばやさ7を再照合。'],
      assumptions:['会心率5%を確定会心へ変換しない。被ダメージ耐性は生存計算へ未反映。']});
    const record = {...original, id:id+'-4', name:original.name+'（4凸）', limitBreak:4, ready:false,
      baseStats:{defense:rawDefense}, passiveStats:{attack:12,speed:19,defense:12,hp:12},
      stats:{defense:rawDefense+12,attack:12,speed:19,hp:12},
      bonuses:original.bonuses.map(bonus => ({...bonus})),
      verified:['4凸最大Lvの生守備力と限界突破の攻撃・すばやさ・守備・HP各12を分離して照合。'], defaultCount:0};
    master.items.push(record);
    gear.push(record);
  }

  // Keep actual ownership and saved zero quantities; only new IDs get defaults.
  const previousProfile = root.PlannerData.profile;
  root.PlannerData.profile = function(data) {
    const profile = previousProfile(data);
    if (data === master) for (const item of [...hearts,...gear]) {
      const owned = profile.inventory.find(row => row.id === item.id);
      if (owned) owned.count = item.defaultCount;
    }
    return profile;
  };
  C.scope = '代表'+C.weapons.length+'武器・'+C.hearts.length+'こころ。条件と未対応効果を分離。';
  const weapons = ['hero','gun','moon'].map(id => ({id, name:C.weapons.find(row=>row.id===id).name, source:C.weapons.find(row=>row.id===id).source,
    checked, status:'0/4凸攻撃力・主スキル倍率・MP・いきなりMPの掲載値を再照合。未対応固有効果は未対応のまま。'}));
  const pending = [
    {name:'いびつ世界の幻竜（覚醒）', source:'https://9db.jp/dqwalk/data/20139', reason:'白いこころの枠別能力補正が未対応のため、通常の1.3倍補正で登録しない。'},
    {name:'追い覚醒・こころ覚醒+', source:'https://9db.jp/dqwalk/data/6571?p=2', reason:'個体ごとの追加値が必要。掲載された火力比較用の上振れ値を標準値へ混ぜない。'}
  ];
  root.Data30 = {checked, hearts, gear, weapons, pending,
    summaryHTML() {
      return '<details class="panel"><summary>データ確認 10/22：こころ3件追加・調停者4凸3部位追加</summary>'+
        '<p>能力値と属性・斬体補正を出典照合しました。新規こころは比較用に各1個、4凸防具は未所持で追加します。既存の所持数・レベルは維持します。</p>'+
        '<ul>'+[...hearts,...gear].map(row=>'<li><a href="'+row.source+'" target="_blank" rel="noreferrer">'+row.name+'</a></li>').join('')+'</ul>'+
        '<p>勇者のつるぎ・祖竜【理】の銃剣・はてんの月輪も再照合。白いこころ、追い覚醒の追加値、未対応の耐性・特殊効果は加算していません。</p></details>';
    }
  };
})(typeof window === 'undefined' ? globalThis : window);
