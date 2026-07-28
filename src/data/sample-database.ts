import type { GameDatabase } from "../lib/types";

/**
 * 開発用の最小サンプルデータ。
 * 重要: ここに予想・創造のデータを追加しないこと。
 * 実データは data/imported/ 配下の JSON を読み込む運用とする。
 */
export const sampleDatabase: GameDatabase = {
  jobs: {
    hero: {
      name: "勇者",
      baseStatsPerLevel: {
        hp: 8,
        mp: 2,
        attack: 3,
        defense: 2,
        spellAttack: 1,
        agility: 2,
        deftness: 2,
      },
      availableSkills: ["gigaslash", "gigaspell"],
    },
    swordmaster: {
      name: "剣聖",
      baseStatsPerLevel: {
        hp: 6,
        mp: 1,
        attack: 4,
        defense: 1,
        agility: 3,
        deftness: 3,
      },
      availableSkills: ["seikenzan", "hagureken"],
    },
    mage: {
      name: "魔法使い",
      baseStatsPerLevel: {
        hp: 4,
        mp: 4,
        attack: 1,
        spellAttack: 4,
        agility: 2,
        deftness: 1,
      },
      availableSkills: ["meragaion", "ionazen"],
    },
    priest: {
      name: "僧侶",
      baseStatsPerLevel: {
        hp: 5,
        mp: 4,
        attack: 1,
        spellHeal: 4,
        agility: 1,
        deftness: 1,
      },
      availableSkills: ["hoimi", "pirolim"],
    },
    warrior: {
      name: "戦士",
      baseStatsPerLevel: { hp: 7, attack: 3, defense: 3, agility: 1 },
      availableSkills: ["kaenzan"],
    },
    martial_artist: {
      name: "武闘家",
      baseStatsPerLevel: { hp: 6, attack: 3, agility: 3, deftness: 2 },
      availableSkills: ["seiryuu"],
    },
    thief: {
      name: "盗賊",
      baseStatsPerLevel: { hp: 5, attack: 2, agility: 4, deftness: 3 },
      availableSkills: ["hagureken"],
    },
    dancer: {
      name: "舞者",
      baseStatsPerLevel: { hp: 5, agility: 4, deftness: 3 },
      availableSkills: ["pirolim"],
    },
    sage: {
      name: "賢者",
      baseStatsPerLevel: { hp: 5, mp: 3, spellAttack: 3, spellHeal: 2 },
      availableSkills: ["meragaion", "hoimi"],
    },
    ranger: {
      name: "レンジャー",
      baseStatsPerLevel: { hp: 6, attack: 2, agility: 3 },
      availableSkills: ["kaenzan"],
    },
    pirate: {
      name: "海賊",
      baseStatsPerLevel: { hp: 6, attack: 3, agility: 2 },
      availableSkills: ["kaenzan"],
    },
    armamentalist: {
      name: "魔剣士",
      baseStatsPerLevel: { hp: 5, attack: 2, spellAttack: 3 },
      availableSkills: ["meragaion", "gigaslash"],
    },
    monster_tamer: {
      name: "モンスターマスター",
      baseStatsPerLevel: { hp: 5, attack: 2, agility: 2 },
      availableSkills: ["kaenzan"],
    },
    demon_spearman: {
      name: "魔槍士",
      baseStatsPerLevel: { hp: 6, attack: 3, agility: 2, deftness: 2 },
      availableSkills: ["seikenzan"],
    },
  },
  skills: [],
  equipment: [],
  hearts: [],
  monsters: [],
};
