'use strict';
(function(root){
const data={
  "checked": "2026-10-21",
  "hearts": [
    {
      "id": "lamp-base",
      "name": "ランプのまじん",
      "rank": "S",
      "color": "青",
      "cost": 107,
      "costBonus": 4,
      "stats": {
        "hp": 105,
        "mp": 50,
        "attack": 100,
        "defense": 41,
        "magic": 20,
        "heal": 17,
        "speed": 134,
        "dex": 145
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "体技",
          "value": 0.1
        }
      ],
      "effects": [
        "ジバリア耐性10%",
        "攻撃減耐性10%"
      ],
      "skills": [],
      "unmodeled": [],
      "family": "lamp",
      "source": "https://9db.jp/dqwalk/data/3496",
      "checked": "2026-10-21",
      "conditionalEffects": [],
      "uncertain": []
    },
    {
      "id": "bone-awakened",
      "name": "ボーンファイター（覚醒）",
      "rank": "S",
      "color": "黄",
      "cost": 153,
      "costBonus": 4,
      "stats": {
        "hp": 173,
        "mp": 70,
        "attack": 81,
        "defense": 124,
        "magic": 46,
        "heal": 46,
        "speed": 40,
        "dex": 63
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.07
        }
      ],
      "effects": [
        "メラ耐性9%",
        "ヒャド耐性9%",
        "転び耐性9%",
        "受けるスキル・どうぐHP回復10%",
        "ゴッドハンド：ゴッドガード発動率3%",
        "二刀：ガード率2%"
      ],
      "skills": [
        "番兵のスクルト",
        "ブレードガード"
      ],
      "unmodeled": [
        "番兵のスクルトは戦闘中1回。消費MP・持続未収集",
        "同じページの変更一覧にはゴッドガード2%とありS効果欄3%と不一致。自動加算せず注記"
      ],
      "family": "bone",
      "source": "https://9db.jp/dqwalk/data/14895",
      "checked": "2026-10-21",
      "conditionalEffects": [],
      "uncertain": [
        "ゴッドガード上昇率：S特殊効果3%、変更一覧2%で同一ページ内不一致"
      ]
    },
    {
      "id": "bone-base",
      "name": "ボーンファイター",
      "rank": "S",
      "color": "黄",
      "cost": 126,
      "costBonus": 4,
      "stats": {
        "hp": 149,
        "mp": 60,
        "attack": 69,
        "defense": 107,
        "magic": 40,
        "heal": 40,
        "speed": 35,
        "dex": 56
      },
      "bonuses": [],
      "effects": [
        "メラ耐性7%",
        "ヒャド耐性7%",
        "転び耐性7%",
        "受けるスキル・どうぐHP回復5%"
      ],
      "skills": [
        "ブレードガード"
      ],
      "unmodeled": [
        "ブレードガードの消費MP・持続未収集"
      ],
      "family": "bone",
      "source": "https://9db.jp/dqwalk/data/14895",
      "checked": "2026-10-21",
      "conditionalEffects": [],
      "uncertain": []
    },
    {
      "id": "ganasadai",
      "name": "暗黒皇帝ガナサダイ",
      "rank": "S",
      "color": "青",
      "cost": 150,
      "costBonus": 4,
      "stats": {
        "hp": 143,
        "mp": 87,
        "attack": 105,
        "defense": 96,
        "magic": 45,
        "heal": 41,
        "speed": 113,
        "dex": 123
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.1
        },
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
      "effects": [
        "混乱耐性7%",
        "怯え耐性7%"
      ],
      "skills": [],
      "unmodeled": [
        "ゴッドハンド：ゴッドレイジ威力10%",
        "ニンジャ：威圧状態の敵へのダメージ10%"
      ],
      "family": "ganasadai",
      "source": "https://9db.jp/dqwalk/data/3479",
      "checked": "2026-10-21",
      "conditionalEffects": [
        {
          "condition": "ゴッドハンド",
          "effect": "ゴッドレイジ威力+10%",
          "modeled": false
        },
        {
          "condition": "ニンジャかつ敵が威圧状態",
          "effect": "ダメージ+10%",
          "modeled": false
        }
      ],
      "uncertain": [],
      "sources": [
        "https://9db.jp/dqwalk/data/3479",
        "https://9db.jp/dqwalk/data/11235"
      ]
    },
    {
      "id": "baramos-awakened",
      "name": "魔王バラモス（覚醒）",
      "rank": "S",
      "color": "黄緑",
      "cost": 174,
      "costBonus": 4,
      "stats": {
        "hp": 188,
        "mp": 106,
        "attack": 76,
        "defense": 127,
        "magic": 70,
        "heal": 100,
        "speed": 58,
        "dex": 65
      },
      "bonuses": [],
      "effects": [
        "スキルHP回復12%",
        "斬撃・体技耐性7%",
        "呪文耐性7%",
        "イオ耐性10%",
        "ヒャド耐性5%",
        "混乱耐性20%"
      ],
      "skills": [],
      "unmodeled": [
        "回復量と被ダメージ耐性は現行攻撃ダメージ式とは別"
      ],
      "family": "baramos",
      "source": "https://9db.jp/dqwalk/data/12475?p=3",
      "checked": "2026-10-21",
      "conditionalEffects": [],
      "uncertain": [],
      "notes": [
        "黄と緑いずれかの枠で色一致補正を適用"
      ]
    },
    {
      "id": "retis",
      "name": "レティス",
      "rank": "S",
      "color": "赤",
      "cost": 149,
      "costBonus": 4,
      "stats": {
        "hp": 127,
        "mp": 55,
        "attack": 120,
        "defense": 72,
        "magic": 19,
        "heal": 19,
        "speed": 97,
        "dex": 84
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "デイン",
          "type": "体技",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "ジバリア",
          "type": "斬撃",
          "value": 0.06
        },
        {
          "group": "element",
          "element": "ジバリア",
          "type": "体技",
          "value": 0.06
        },
        {
          "group": "element",
          "element": "バギ",
          "type": "斬撃",
          "value": 0.03
        },
        {
          "group": "element",
          "element": "バギ",
          "type": "体技",
          "value": 0.03
        }
      ],
      "effects": [
        "転び耐性10%",
        "ふきとばし耐性10%"
      ],
      "skills": [],
      "unmodeled": [],
      "family": "retis",
      "source": "https://9db.jp/dqwalk/data/6480",
      "checked": "2026-10-21",
      "conditionalEffects": [],
      "uncertain": []
    },
    {
      "id": "arm-lion",
      "name": "アームライオン",
      "rank": "S",
      "color": "赤",
      "cost": 92,
      "costBonus": 4,
      "stats": {
        "hp": 127,
        "mp": 54,
        "attack": 73,
        "defense": 55,
        "magic": 14,
        "heal": 14,
        "speed": 57,
        "dex": 50
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "ヒャド",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "ヒャド",
          "type": "体技",
          "value": 0.1
        }
      ],
      "effects": [
        "幻惑耐性10%",
        "怯え耐性10%"
      ],
      "skills": [
        "きあいため"
      ],
      "unmodeled": [
        "ヒャド属性とくぎ10%はブレスを含む可能性の範囲確認が必要。斬撃体技の追加値のみ確実に収録可",
        "きあいためのMP・持続未収集"
      ],
      "family": "arm-lion",
      "source": "https://9db.jp/dqwalk/data/690",
      "checked": "2026-10-21",
      "conditionalEffects": [],
      "uncertain": []
    },
    {
      "id": "hell-condor",
      "name": "ヘルコンドル",
      "rank": "S",
      "color": "赤",
      "cost": 81,
      "costBonus": 4,
      "stats": {
        "hp": 51,
        "mp": 26,
        "attack": 101,
        "defense": 22,
        "magic": 6,
        "heal": 6,
        "speed": 80,
        "dex": 76
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
          "element": "バギ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "バギ",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "体技",
          "value": 0.07
        }
      ],
      "effects": [
        "ジバリア耐性7%",
        "魅了耐性7%"
      ],
      "skills": [],
      "unmodeled": [
        "属性とくぎはブレス範囲未確認、物理は明確"
      ],
      "family": "hell-condor",
      "source": "https://9db.jp/dqwalk/data/2051",
      "checked": "2026-10-21",
      "conditionalEffects": [],
      "uncertain": []
    },
    {
      "id": "hell-beast",
      "name": "ヘルビースト",
      "rank": "S",
      "color": "青",
      "cost": 39,
      "costBonus": 4,
      "stats": {
        "hp": 27,
        "mp": 38,
        "attack": 52,
        "defense": 15,
        "magic": 17,
        "heal": 18,
        "speed": 83,
        "dex": 50
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.1
        }
      ],
      "effects": [
        "毒耐性10%",
        "眠り耐性10%"
      ],
      "skills": [],
      "unmodeled": [],
      "family": "hell-beast",
      "source": "https://9db.jp/dqwalk/data/7585",
      "checked": "2026-10-21",
      "conditionalEffects": [],
      "uncertain": [],
      "sources": [
        "https://9db.jp/dqwalk/data/7585",
        "https://9db.jp/dqwalk/data/512"
      ]
    },
    {
      "id": "king-slime",
      "name": "キングスライム",
      "rank": "S",
      "color": "青",
      "cost": 75,
      "costBonus": 4,
      "stats": {
        "hp": 40,
        "mp": 58,
        "attack": 81,
        "defense": 23,
        "magic": 28,
        "heal": 31,
        "speed": 120,
        "dex": 74
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.07
        }
      ],
      "effects": [
        "会心率4%",
        "イオ耐性7%",
        "即死耐性7%"
      ],
      "skills": [],
      "unmodeled": [],
      "family": "king-slime",
      "source": "https://9db.jp/dqwalk/data/5401",
      "checked": "2026-10-21",
      "conditionalEffects": [],
      "uncertain": [],
      "critChance": 0.04
    },
    {
      "id": "king-slime-awakened",
      "name": "キングスライム（覚醒）",
      "rank": "S",
      "color": "青",
      "cost": 102,
      "costBonus": 4,
      "stats": {
        "hp": 54,
        "mp": 64,
        "attack": 102,
        "defense": 36,
        "magic": 30,
        "heal": 33,
        "speed": 122,
        "dex": 90
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "race",
          "race": "スライム系",
          "value": 0.07
        },
        {
          "group": "race",
          "race": "ドラゴン系",
          "value": 0.05
        }
      ],
      "effects": [
        "会心率4%",
        "イオ耐性7%",
        "即死耐性7%"
      ],
      "skills": [],
      "unmodeled": [],
      "family": "king-slime",
      "source": "https://9db.jp/dqwalk/data/5401",
      "checked": "2026-10-21",
      "conditionalEffects": [],
      "uncertain": [],
      "critChance": 0.04
    }
  ],
  "gear": [
    {
      "id": "princess-veil",
      "name": "プリンセスベール",
      "slot": "head",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 74
      },
      "passiveStats": {
        "speed": 6
      },
      "stats": {
        "defense": 74,
        "speed": 6
      },
      "bonuses": [
        {
          "group": "general",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "バギ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "バギ",
          "type": "体技",
          "value": 0.07
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
              "element": "メラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ギラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ヒャド",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "バギ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "イオ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "デイン",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ドルマ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ジバリア",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ザバ",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/13894",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "耐性は被ダメージへ未反映。終了時MP回復3は明示的に周回モデルへ接続した場合のみ使用。"
      ],
      "uncertain": [],
      "battleEndMPRecovery": 3,
      "notes": [
        "無属性へ晴れの全属性ダメージを適用しない。0凸のため限界突破パッシブは含まない。"
      ]
    },
    {
      "id": "princess-robe-body",
      "name": "プリンセスローブ上",
      "slot": "body",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 95
      },
      "passiveStats": {
        "speed": 6
      },
      "stats": {
        "defense": 95,
        "speed": 6
      },
      "bonuses": [
        {
          "group": "general",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "バギ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "バギ",
          "type": "体技",
          "value": 0.07
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
              "element": "メラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ギラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ヒャド",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "バギ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "イオ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "デイン",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ドルマ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ジバリア",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ザバ",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/13893",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "耐性は被ダメージへ未反映。終了時MP回復3は明示的に周回モデルへ接続した場合のみ使用。"
      ],
      "uncertain": [],
      "battleEndMPRecovery": 3,
      "notes": [
        "無属性へ晴れの全属性ダメージを適用しない。0凸のため限界突破パッシブは含まない。"
      ]
    },
    {
      "id": "princess-robe-legs",
      "name": "プリンセスローブ下",
      "slot": "legs",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 74
      },
      "passiveStats": {
        "speed": 6
      },
      "stats": {
        "defense": 74,
        "speed": 6
      },
      "bonuses": [
        {
          "group": "general",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "バギ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "バギ",
          "type": "体技",
          "value": 0.07
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
              "element": "メラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ギラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ヒャド",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "バギ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "イオ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "デイン",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ドルマ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ジバリア",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ザバ",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/13892",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "耐性は被ダメージへ未反映。終了時MP回復3は明示的に周回モデルへ接続した場合のみ使用。"
      ],
      "uncertain": [],
      "battleEndMPRecovery": 3,
      "notes": [
        "無属性へ晴れの全属性ダメージを適用しない。0凸のため限界突破パッシブは含まない。"
      ]
    },
    {
      "id": "blackking-helm",
      "name": "黒王のメタルキング兜",
      "slot": "head",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 73
      },
      "passiveStats": {
        "speed": 6
      },
      "stats": {
        "defense": 73,
        "speed": 6
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ドルマ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ドルマ",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ヒャド",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ヒャド",
          "type": "体技",
          "value": 0.07
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
              "element": "メラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ギラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ヒャド",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "バギ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "イオ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "デイン",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ドルマ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ジバリア",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ザバ",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/13227",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "耐性は被ダメージへ未反映。終了時MP回復3は明示的に周回モデルへ接続した場合のみ使用。"
      ],
      "uncertain": [],
      "battleEndMPRecovery": 3
    },
    {
      "id": "blackking-body",
      "name": "黒王のメタルキング鎧上",
      "slot": "body",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 95
      },
      "passiveStats": {
        "speed": 6
      },
      "stats": {
        "defense": 95,
        "speed": 6
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ドルマ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ドルマ",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ヒャド",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ヒャド",
          "type": "体技",
          "value": 0.07
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
              "element": "メラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ギラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ヒャド",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "バギ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "イオ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "デイン",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ドルマ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ジバリア",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ザバ",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/13228",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "耐性は被ダメージへ未反映。終了時MP回復3は明示的に周回モデルへ接続した場合のみ使用。"
      ],
      "uncertain": [],
      "battleEndMPRecovery": 3
    },
    {
      "id": "blackking-legs",
      "name": "黒王のメタルキング鎧下",
      "slot": "legs",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 73
      },
      "passiveStats": {
        "speed": 6
      },
      "stats": {
        "defense": 73,
        "speed": 6
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ドルマ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ドルマ",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ヒャド",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "ヒャド",
          "type": "体技",
          "value": 0.07
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
              "element": "メラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ギラ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ヒャド",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "バギ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "イオ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "デイン",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ドルマ",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ジバリア",
              "value": 0.03
            },
            {
              "group": "element",
              "element": "ザバ",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/13229",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "耐性は被ダメージへ未反映。終了時MP回復3は明示的に周回モデルへ接続した場合のみ使用。"
      ],
      "uncertain": [],
      "battleEndMPRecovery": 3
    },
    {
      "id": "ramia-feather",
      "name": "ラーミアの羽飾り",
      "slot": "head",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 66
      },
      "passiveStats": {
        "speed": 6,
        "mp": 5
      },
      "stats": {
        "defense": 66,
        "speed": 6,
        "mp": 5
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.05
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.05
        },
        {
          "group": "element",
          "element": "イオ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "イオ",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "体技",
          "value": 0.07
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "hpPercentMin": 100
          },
          "bonuses": [
            {
              "group": "general",
              "type": "体技",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/12462",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "HP100%以上時の体技3%は動的HP条件。未接続の実装では適用せず注記。",
        "耐性・職業固有特性の発動率増加は未反映。",
        "バラモスへのダメージ10%は固有敵名一致機構が有効な場合だけ使用。"
      ],
      "uncertain": [],
      "namedBonuses": [
        {
          "group": "name",
          "name": "バラモス",
          "value": 0.1
        }
      ]
    },
    {
      "id": "ramia-robe-body",
      "name": "ラーミアの霊衣上",
      "slot": "body",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 87
      },
      "passiveStats": {
        "speed": 6,
        "mp": 5
      },
      "stats": {
        "defense": 87,
        "speed": 6,
        "mp": 5
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.05
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.05
        },
        {
          "group": "element",
          "element": "イオ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "イオ",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "体技",
          "value": 0.07
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "hpPercentMin": 100
          },
          "bonuses": [
            {
              "group": "general",
              "type": "体技",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/12463",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "HP100%以上時の体技3%は動的HP条件。未接続の実装では適用せず注記。",
        "耐性・職業固有特性の発動率増加は未反映。"
      ],
      "uncertain": [],
      "namedBonuses": []
    },
    {
      "id": "ramia-robe-legs",
      "name": "ラーミアの霊衣下",
      "slot": "legs",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "defense": 66
      },
      "passiveStats": {
        "speed": 6,
        "mp": 5
      },
      "stats": {
        "defense": 66,
        "speed": 6,
        "mp": 5
      },
      "bonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.05
        },
        {
          "group": "general",
          "type": "体技",
          "value": 0.05
        },
        {
          "group": "element",
          "element": "イオ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "イオ",
          "type": "体技",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "斬撃",
          "value": 0.07
        },
        {
          "group": "element",
          "element": "メラ",
          "type": "体技",
          "value": 0.07
        }
      ],
      "conditionalBonuses": [
        {
          "condition": {
            "hpPercentMin": 100
          },
          "bonuses": [
            {
              "group": "general",
              "type": "体技",
              "value": 0.03
            }
          ]
        }
      ],
      "source": "https://9db.jp/dqwalk/data/12464",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "HP100%以上時の体技3%は動的HP条件。未接続の実装では適用せず注記。",
        "耐性・職業固有特性の発動率増加は未反映。"
      ],
      "uncertain": [],
      "namedBonuses": []
    },
    {
      "id": "water-amulet-plus",
      "name": "水のアミュレット+",
      "slot": "accessory",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "mp": 10,
        "attack": 8
      },
      "passiveStats": {},
      "stats": {
        "mp": 10,
        "attack": 8
      },
      "bonuses": [
        {
          "group": "element",
          "element": "ヒャド",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "ヒャド",
          "type": "体技",
          "value": 0.1
        }
      ],
      "conditionalBonuses": [],
      "source": "https://9db.jp/dqwalk/data/13083",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "麻痺耐性10%は未反映。"
      ],
      "uncertain": [],
      "uniqueFamily": "water-amulet-plus"
    },
    {
      "id": "princess-earring-plus",
      "name": "王女の耳飾り+",
      "slot": "accessory",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "hp": 20
      },
      "passiveStats": {},
      "stats": {
        "hp": 20
      },
      "bonuses": [
        {
          "group": "element",
          "element": "ギラ",
          "type": "斬撃",
          "value": 0.1
        },
        {
          "group": "element",
          "element": "ギラ",
          "type": "体技",
          "value": 0.1
        }
      ],
      "conditionalBonuses": [],
      "source": "https://9db.jp/dqwalk/data/14483",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "幻惑耐性10%は未反映。"
      ],
      "uncertain": [],
      "uniqueFamily": "princess-earring-plus"
    },
    {
      "id": "crimson-dragon-orb-plus",
      "name": "紅蓮の竜玉+",
      "slot": "accessory",
      "limitBreak": 0,
      "maxLevel": true,
      "baseStats": {
        "attack": 6,
        "heal": 6
      },
      "passiveStats": {},
      "stats": {
        "attack": 6,
        "heal": 6
      },
      "bonuses": [
        {
          "group": "element",
          "element": "ジバリア",
          "value": 0.1
        }
      ],
      "conditionalBonuses": [],
      "source": "https://9db.jp/dqwalk/data/9402",
      "verifiedAt": "2026-10-21",
      "excluded": [
        "混乱耐性10%は未反映。"
      ],
      "uncertain": [],
      "uniqueFamily": "crimson-dragon-orb-plus",
      "notes": [
        "強化前の紅蓮の竜玉は攻撃魔力6だが、強化後の出典は回復魔力6。名称の類似から転用しない。"
      ]
    }
  ],
  "weapons": [
    {
      "id": "galaxy",
      "name": "ぎんがのつるぎ",
      "type": "片手剣",
      "stats0": {
        "attack": 172
      },
      "stats4": {
        "attack": 225
      },
      "favored": {
        "attack": 12
      },
      "bonuses": [
        {
          "group": "race",
          "race": "ゾンビ系",
          "value": 0.05
        },
        {
          "group": "race",
          "race": "ドラゴン系",
          "value": 0.05
        }
      ],
      "skills": [
        "haouzan",
        "sky-hayabusa",
        "supercharge"
      ],
      "force": [
        "メラ"
      ],
      "forceDuration": 4,
      "limitBonus": 0.28,
      "dualBonus": 0,
      "initial": [
        "いきなりメラフォース：4行動",
        "世界樹の女神の加護：耐久効果は未算入"
      ],
      "source": "https://9db.jp/dqwalk/data/10170",
      "unmodeled": [
        "まれな直撃・会心率2%・致死耐え・状態異常防止",
        "バトマス攻撃5・パラディン守備5"
      ]
    },
    {
      "id": "tachiaoi",
      "name": "大太刀・立葵",
      "type": "両手剣",
      "stats0": {
        "attack": 177
      },
      "stats4": {
        "attack": 231
      },
      "twoHand0": 88,
      "twoHand4": 115,
      "favored": {
        "attack": 12
      },
      "bonuses": [
        {
          "group": "race",
          "race": "ゾンビ系",
          "value": 0.05
        },
        {
          "group": "race",
          "race": "ドラゴン系",
          "value": 0.05
        }
      ],
      "twoHandBonuses": [
        {
          "group": "general",
          "type": "斬撃",
          "value": 0.03
        },
        {
          "group": "element",
          "element": "イオ",
          "type": "斬撃",
          "value": 0.03
        },
        {
          "group": "element",
          "element": "イオ",
          "type": "体技",
          "value": 0.03
        }
      ],
      "skills": [
        "koujin",
        "zantetsu"
      ],
      "initialRaceAmplify": 0.5,
      "initialRaceDuration": 2,
      "limitBonus": 0.28,
      "dualBonus": 0,
      "initial": [
        "勇者の血筋：系統特効の効果値1.5倍・2行動"
      ],
      "source": "https://9db.jp/dqwalk/data/9906",
      "unmodeled": [
        "残HP15%以下の消滅・メタル固定ダメージ",
        "魔剣士限定攻撃5"
      ]
    }
  ],
  "skills": [
    {
      "id": "giga-airslash",
      "name": "ギガ空裂斬",
      "elements": [
        "デイン",
        "バギ"
      ],
      "multipliers": [
        370
      ],
      "mp": 41,
      "source": "https://9db.jp/dqwalk/data/12235",
      "attackTarget": "all",
      "hits": 1,
      "type": "斬撃",
      "kind": "attack"
    },
    {
      "id": "light-dragon-slash",
      "name": "光竜のギガスラッシュ",
      "elements": [
        "イオ",
        "デイン"
      ],
      "multipliers": [
        420
      ],
      "mp": 45,
      "source": "https://9db.jp/dqwalk/data/15276",
      "attackTarget": "all",
      "hits": 1,
      "type": "斬撃",
      "kind": "attack"
    },
    {
      "id": "catastrophe",
      "name": "カタストロフクロス",
      "elements": [
        "無"
      ],
      "multipliers": [
        290
      ],
      "mp": 45,
      "source": "https://9db.jp/dqwalk/data/14033",
      "attackTarget": "all",
      "hits": 2,
      "type": "斬撃",
      "kind": "attack"
    },
    {
      "id": "haouzan",
      "name": "覇王斬",
      "elements": [
        "無"
      ],
      "multipliers": [
        900
      ],
      "mp": 50,
      "source": "https://9db.jp/dqwalk/data/10170",
      "attackTarget": "single",
      "hits": 1,
      "type": "斬撃",
      "kind": "attack",
      "crit": "super",
      "note": "まれな直撃は不発として通常の守備力項を使用。確率会心も自動成功にしない。"
    },
    {
      "id": "sky-hayabusa",
      "name": "天翔はやぶさ斬り",
      "elements": [
        "無"
      ],
      "multipliers": [
        240
      ],
      "mp": 38,
      "source": "https://9db.jp/dqwalk/data/10170",
      "attackTarget": "all",
      "hits": 2,
      "type": "斬撃",
      "kind": "attack"
    },
    {
      "id": "supercharge",
      "name": "超きあいため",
      "kind": "charge",
      "value": 2.25,
      "self": true,
      "mp": 10,
      "source": "https://9db.jp/dqwalk/data/10170"
    },
    {
      "id": "koujin",
      "name": "光刃",
      "elements": [
        "イオ"
      ],
      "multipliers": [
        440
      ],
      "mp": 51,
      "source": "https://9db.jp/dqwalk/data/9906",
      "attackTarget": "all",
      "hits": 1,
      "type": "斬撃",
      "kind": "attack",
      "note": "消滅適性が未登録のため消滅効果は不算入。"
    },
    {
      "id": "zantetsu",
      "name": "斬鉄の風",
      "elements": [
        "バギ"
      ],
      "multipliers": [
        450
      ],
      "mp": 32,
      "source": "https://9db.jp/dqwalk/data/9906",
      "attackTarget": "single",
      "hits": 1,
      "type": "斬撃",
      "kind": "attack"
    }
  ]
},C=root.Catalog9,m=root.PlannerData.real;
for(const w of data.weapons){if(C.weapons.some(x=>x.id===w.id))throw Error('武器ID重複');C.weapons.push(w);for(const lb of [0,4]){const old=m.items.find(x=>x.slot==='weapon'&&x.name===w.name&&(x.limitBreak||0)===lb);const row={...w,id:old?.id||w.id+'-'+lb,slot:'weapon',limitBreak:lb,weaponType:w.type,stats:{...(lb?w.stats4:w.stats0)},verifiedModel:true,ready:false,skillIds:[],verified:['0.16：最大Lv0/4凸・主要物理スキルを照合'],assumptions:w.unmodeled};if(old)Object.assign(old,row);else m.items.push(row);}}
for(const k of data.skills){if(C.skills.some(x=>x.id===k.id))throw Error('スキルID重複');C.skills.push(k);}for(const [id,skill]of [['light-greatsword','giga-airslash'],['eightdragon','light-dragon-slash'],['estark-blade','catastrophe']])C.weapons.find(w=>w.id===id).skills.push(skill);
for(const row of data.hearts){const skillNames=row.skills;const h={...row,color:row.color==='黄緑'?'黄+緑':row.color,skills:[],rank:row.name.includes('覚醒')?'S覚醒':'S',unmodeled:[...row.unmodeled,...skillNames.map(s=>s+'：習得情報のみ収録・計算未対応')],effects:[...row.effects,...skillNames.map(s=>'習得：'+s+'（計算未対応）')]};C.hearts.push(h);const old=m.items.find(x=>x.slot==='heart'&&x.name===h.name);const entry={...h,id:old?.id||h.id,slot:'heart',ready:false,verifiedModel:true,skillIds:[],verified:['0.16：S全8能力・コスト・色・物理補正を照合'],assumptions:[...h.unmodeled,...h.uncertain]};if(old)Object.assign(old,entry);else m.items.push(entry);}
for(const g of data.gear){const old=m.items.find(x=>x.slot===g.slot&&x.name===g.name&&(x.limitBreak||0)===0);const row={...g,id:old?.id||g.id,ready:false,verifiedModel:true,skillIds:[],conditional:(g.conditionalBonuses||[]).filter(c=>c.condition.weather==='晴れ').map(c=>({when:'sunny',bonuses:c.bonuses})),verified:['0.16：最大Lv0凸・素の能力と固定パッシブを分離して照合'],assumptions:g.excluded||[]};if(old)Object.assign(old,row);else m.items.push(row);}
BattleCatalog13.initialMP.push({id:'galaxy',flat:20,components:['メラフォース10','女神の加護10'],source:data.weapons[0].source},{id:'tachiaoi',flat:11,components:['勇者の血筋11'],source:data.weapons[1].source});m.revision=16;C.scope='代表'+C.weapons.length+'武器・'+C.hearts.length+'こころ。条件と未対応効果を分離。全装備の網羅や使用率の実測ではありません。';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));data.summaryHTML=()=>'<details class="panel"><summary>0.16 データ追加：武器2・スキル8・こころ11・防具アクセ12</summary><p>確認日 '+data.checked+'。最大強化0/4凸の武器と、Sこころ、0凸防具を収録。晴れ条件は一致時のみ加算し、HP条件・耐性・未対応スキルは確認値と分けています。通常・覚醒は同種として同時装備できません。</p>'+[['武器',data.weapons],['追加スキル',data.skills],['こころ',data.hearts],['防具・アクセ',data.gear]].map(([label,rows])=>'<h3>'+label+'</h3><ul>'+rows.map(r=>'<li><a href="'+esc(r.source)+'" target="_blank" rel="noreferrer">'+esc(r.name)+'</a></li>').join('')+'</ul>').join('')+'<p>追加データは初期所持リストへ補充します。既存の所持数やレベルは維持します。未確認のこころスキル、HP条件、確率効果は数値を仮定して加算しません。</p></details>';root.Data16=data;
})(typeof window==='undefined'?globalThis:window);
