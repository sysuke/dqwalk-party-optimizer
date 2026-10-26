'use strict';
(function(root){
const data={
  "checked": "2026-10-21",
  "scope": "0凸最大Lv。新規3セット9防具・2盾・6アクセ。直接火力に関係する数値のみ。",
  "records": [
    {
      "id": "new-legend-head",
      "name": "新たなる伝説の兜",
      "slot": "head",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 78
      },
      "passiveStats": {
        "defense": 3,
        "speed": 7
      },
      "stats": {
        "defense": 81,
        "speed": 7
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.08
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "criticalRate",
          "value": 0.03
        },
        {
          "group": "name",
          "name": "竜王",
          "value": 0.1
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "weather": "晴れ"
          },
          "bonuses": [
            {
              "group": "criticalRate",
              "value": 0.02
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/17140",
      "excluded": [
        "耐性・回復・ガード等、直接火力以外の効果はこの調査JSONの収録対象外",
        "限界突破分は含まない"
      ],
      "notes": [
        "最大性能表は特殊効果を含まないため、Lvの守備力を別加算。statsは両方の合計。"
      ]
    },
    {
      "id": "new-legend-body",
      "name": "新たなる伝説の鎧上",
      "slot": "body",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 100
      },
      "passiveStats": {
        "defense": 3,
        "speed": 7
      },
      "stats": {
        "defense": 103,
        "speed": 7
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.08
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "criticalRate",
          "value": 0.03
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "weather": "晴れ"
          },
          "bonuses": [
            {
              "group": "criticalRate",
              "value": 0.02
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/17141",
      "excluded": [
        "耐性・回復・ガード等、直接火力以外の効果はこの調査JSONの収録対象外",
        "限界突破分は含まない"
      ],
      "notes": [
        "最大性能表は特殊効果を含まないため、Lvの守備力を別加算。statsは両方の合計。"
      ]
    },
    {
      "id": "new-legend-legs",
      "name": "新たなる伝説の鎧下",
      "slot": "legs",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 78
      },
      "passiveStats": {
        "defense": 3,
        "speed": 7
      },
      "stats": {
        "defense": 81,
        "speed": 7
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.08
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "criticalRate",
          "value": 0.03
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "weather": "晴れ"
          },
          "bonuses": [
            {
              "group": "criticalRate",
              "value": 0.02
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/17142",
      "excluded": [
        "耐性・回復・ガード等、直接火力以外の効果はこの調査JSONの収録対象外",
        "限界突破分は含まない"
      ],
      "notes": [
        "最大性能表は特殊効果を含まないため、Lvの守備力を別加算。statsは両方の合計。"
      ]
    },
    {
      "id": "majin-horns",
      "name": "魔人のツノ",
      "slot": "head",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 74
      },
      "passiveStats": {
        "defense": 5,
        "speed": 6
      },
      "stats": {
        "defense": 79,
        "speed": 6
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "斬撃",
          "value": 0.04
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "体技",
          "value": 0.04
        },
        {
          "group": "element",
          "element": "ギラ",
          "type": "斬撃",
          "value": 0.04
        },
        {
          "group": "element",
          "element": "ギラ",
          "type": "体技",
          "value": 0.04
        },
        {
          "group": "criticalRate",
          "value": 0.02
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "weather": "晴れ"
          },
          "bonuses": [
            {
              "group": "criticalRate",
              "value": 0.02
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/14040",
      "excluded": [
        "耐性・回復・ガード等、直接火力以外の効果はこの調査JSONの収録対象外",
        "限界突破分は含まない"
      ],
      "notes": [
        "最大性能表は特殊効果を含まないため、Lvの守備力を別加算。statsは両方の合計。"
      ]
    },
    {
      "id": "majin-body",
      "name": "魔人の闘衣上",
      "slot": "body",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 95
      },
      "passiveStats": {
        "defense": 5,
        "speed": 6
      },
      "stats": {
        "defense": 100,
        "speed": 6
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "斬撃",
          "value": 0.04
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "体技",
          "value": 0.04
        },
        {
          "group": "element",
          "element": "ギラ",
          "type": "斬撃",
          "value": 0.04
        },
        {
          "group": "element",
          "element": "ギラ",
          "type": "体技",
          "value": 0.04
        },
        {
          "group": "criticalRate",
          "value": 0.02
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "weather": "晴れ"
          },
          "bonuses": [
            {
              "group": "criticalRate",
              "value": 0.02
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/14041",
      "excluded": [
        "耐性・回復・ガード等、直接火力以外の効果はこの調査JSONの収録対象外",
        "限界突破分は含まない"
      ],
      "notes": [
        "最大性能表は特殊効果を含まないため、Lvの守備力を別加算。statsは両方の合計。"
      ]
    },
    {
      "id": "majin-legs",
      "name": "魔人の闘衣下",
      "slot": "legs",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 74
      },
      "passiveStats": {
        "defense": 5,
        "speed": 6
      },
      "stats": {
        "defense": 79,
        "speed": 6
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "斬撃",
          "value": 0.04
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "体技",
          "value": 0.04
        },
        {
          "group": "element",
          "element": "ギラ",
          "type": "斬撃",
          "value": 0.04
        },
        {
          "group": "element",
          "element": "ギラ",
          "type": "体技",
          "value": 0.04
        },
        {
          "group": "criticalRate",
          "value": 0.02
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "weather": "晴れ"
          },
          "bonuses": [
            {
              "group": "criticalRate",
              "value": 0.02
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/14042",
      "excluded": [
        "耐性・回復・ガード等、直接火力以外の効果はこの調査JSONの収録対象外",
        "限界突破分は含まない"
      ],
      "notes": [
        "最大性能表は特殊効果を含まないため、Lvの守備力を別加算。statsは両方の合計。"
      ]
    },
    {
      "id": "hero-legend-head",
      "name": "伝説の勇者のはちがね",
      "slot": "head",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 66
      },
      "passiveStats": {
        "defense": 5,
        "speed": 5
      },
      "stats": {
        "defense": 71,
        "speed": 5
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.06
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "斬撃",
          "value": 0.08
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "体技",
          "value": 0.08
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "weather": "晴れ"
          },
          "bonuses": [
            {
              "group": "element",
              "element": "デイン",
              "type": "斬撃",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "デイン",
              "type": "体技",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/12239",
      "excluded": [
        "耐性・回復・ガード等、直接火力以外の効果はこの調査JSONの収録対象外",
        "限界突破分は含まない"
      ],
      "notes": [
        "最大性能表は特殊効果を含まないため、Lvの守備力を別加算。statsは両方の合計。"
      ]
    },
    {
      "id": "hero-legend-body",
      "name": "伝説の勇者のころも上",
      "slot": "body",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 87
      },
      "passiveStats": {
        "defense": 5,
        "speed": 5
      },
      "stats": {
        "defense": 92,
        "speed": 5
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.06
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "斬撃",
          "value": 0.08
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "体技",
          "value": 0.08
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "weather": "晴れ"
          },
          "bonuses": [
            {
              "group": "element",
              "element": "デイン",
              "type": "斬撃",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "デイン",
              "type": "体技",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/12240",
      "excluded": [
        "耐性・回復・ガード等、直接火力以外の効果はこの調査JSONの収録対象外",
        "限界突破分は含まない"
      ],
      "notes": [
        "最大性能表は特殊効果を含まないため、Lvの守備力を別加算。statsは両方の合計。"
      ]
    },
    {
      "id": "hero-legend-legs",
      "name": "伝説の勇者のころも下",
      "slot": "legs",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 66
      },
      "passiveStats": {
        "defense": 5,
        "speed": 5
      },
      "stats": {
        "defense": 71,
        "speed": 5
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.06
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "斬撃",
          "value": 0.08
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "体技",
          "value": 0.08
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "weather": "晴れ"
          },
          "bonuses": [
            {
              "group": "element",
              "element": "デイン",
              "type": "斬撃",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "デイン",
              "type": "体技",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/12241",
      "excluded": [
        "耐性・回復・ガード等、直接火力以外の効果はこの調査JSONの収録対象外",
        "限界突破分は含まない"
      ],
      "notes": [
        "最大性能表は特殊効果を含まないため、Lvの守備力を別加算。statsは両方の合計。"
      ]
    },
    {
      "id": "roto-sacred-shield",
      "name": "ロトのせいなる盾",
      "slot": "shield",
      "limitBreak": 0,
      "stats": {
        "defense": 62,
        "mp": 10,
        "attack": 10,
        "heal": 10
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.03
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.03
        },
        {
          "group": "general",
          "type": "呪文",
          "value": 0.03
        },
        {
          "group": "element",
          "element": "デイン",
          "value": 0.03
        },
        {
          "group": "name",
          "name": "竜王",
          "value": 0.1
        }
      ],
      "source": "https://9db.jp/dqwalk/data/17257",
      "skills": [
        {
          "name": "せいなるチカラ",
          "mp": "最大MP10%",
          "kind": "support",
          "effect": "悪い状態変化・状態異常予防、ガード率上昇、いてつくはどうガード、再行動。戦闘1回。"
        }
      ],
      "excluded": [
        "盾の再行動スキルはエンジン実装時のみ有効化する",
        "ガード・耐性は火力収録対象外"
      ]
    },
    {
      "id": "ouroboros-shield",
      "name": "ウロボロスのたて",
      "slot": "shield",
      "limitBreak": 0,
      "stats": {
        "defense": 58,
        "mp": 10,
        "attack": 10,
        "heal": 10
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.03
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.03
        },
        {
          "group": "element",
          "value": 0.02
        }
      ],
      "source": "https://9db.jp/dqwalk/data/10250",
      "skills": [
        {
          "name": "超越の闘志",
          "mp": "最大MP10%",
          "kind": "support",
          "effect": "限界突破、自分の攻撃力・守備力1段階上昇"
        }
      ],
      "excluded": [
        "ガード・回復・耐性は火力収録対象外"
      ]
    },
    {
      "id": "yellow-dragon-ring-plus",
      "name": "黄竜眼の指輪+",
      "slot": "accessory",
      "stats": {
        "attack": 15
      },
      "bonuses": [
        {
          "group": "element",
          "element": "バギ",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "バギ",
          "type": "体技",
          "value": 0.1
        }
      ],
      "source": "https://game8.jp/dqwalk/298203",
      "excluded": [
        "耐性・回復など直接火力以外は対象外"
      ],
      "uniqueFamily": "yellow-dragon-ring-plus"
    },
    {
      "id": "goddess-ring-plus",
      "name": "女神のゆびわ+",
      "slot": "accessory",
      "stats": {
        "attack": 10,
        "hp": 8
      },
      "bonuses": [
        {
          "group": "element",
          "element": "イオ",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "イオ",
          "type": "体技",
          "value": 0.1
        }
      ],
      "source": "https://game8.jp/dqwalk/350848",
      "excluded": [
        "耐性・回復など直接火力以外は対象外"
      ],
      "uniqueFamily": "goddess-ring-plus"
    },
    {
      "id": "mage-general-ring-plus",
      "name": "魔導将軍のゆびわ+",
      "slot": "accessory",
      "stats": {
        "attack": 12
      },
      "bonuses": [
        {
          "group": "element",
          "element": "ドルマ",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "ドルマ",
          "type": "体技",
          "value": 0.1
        }
      ],
      "source": "https://game8.jp/dqwalk/319907",
      "excluded": [
        "耐性・回復など直接火力以外は対象外"
      ],
      "uniqueFamily": "mage-general-ring-plus"
    },
    {
      "id": "dragon-orb-doubleplus",
      "name": "ドラゴンのオーブ++",
      "slot": "accessory",
      "stats": {
        "hp": 30
      },
      "bonuses": [
        {
          "group": "race",
          "race": "ドラゴン系",
          "value": 0.1
        }
      ],
      "source": "https://game8.jp/dqwalk/544927",
      "excluded": [
        "耐性・回復など直接火力以外は対象外"
      ],
      "uniqueFamily": "dragon-orb-doubleplus"
    },
    {
      "id": "light-orb",
      "name": "ひかりのたま",
      "slot": "accessory",
      "stats": {
        "defense": 30,
        "hp": 30,
        "mp": 30,
        "heal": 30,
        "magic": 30,
        "attack": 30
      },
      "bonuses": [],
      "source": "https://game8.jp/dqwalk/615804",
      "excluded": [
        "耐性・回復など直接火力以外は対象外"
      ],
      "uniqueFamily": "light-orb"
    },
    {
      "id": "flame-ruby-plus",
      "name": "ほのおのルビー+",
      "slot": "accessory",
      "stats": {
        "defense": 12
      },
      "bonuses": [
        {
          "group": "element",
          "element": "メラ",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "体技",
          "value": 0.1
        }
      ],
      "source": "https://game8.jp/dqwalk/304396",
      "excluded": [
        "耐性・回復など直接火力以外は対象外"
      ],
      "uniqueFamily": "flame-ruby-plus"
    }
  ]
};
const m=root.PlannerData.real;for(const record of data.records){const old=m.items.find(x=>x.slot===record.slot&&x.name===record.name&&(x.limitBreak||0)===(record.limitBreak||0));const row={...record,id:old?.id||record.id,ready:false,verifiedModel:true,skillIds:[],conditional:(record.conditionalBonuses||[]).map(c=>({when:c.condition.weather==='晴れ'?'sunny':'unsupported',bonuses:c.bonuses})),verified:['0.11：最大強化0凸。直接火力の能力・特殊効果を出典照合。'],assumptions:[...(record.excluded||[]),'会心率の確率発動、固有敵補正、盾スキルは今回の火力へ未算入。','詳細計算と装備探索は04で対応。旧探索への接続は未完了。']};if(old)Object.assign(old,row);else m.items.push(row);}
m.revision=11;root.Equipment11=data;
})(typeof window==='undefined'?globalThis:window);
