/** 属性 */
export type Element =
  | "none"
  | "gira"
  | "biri"
  | "hoimi"
  | "io"
  | "dein"
  | "doruma"
  | "hyad"
  | "mahyad"
  | "bang"
  | "zao"
  | "rock";

/** 攻撃種別 */
export type AttackType = "slash" | "strike" | "thrust" | "spell" | "breath" | "other";

/** 系統（系統特効用） */
export type MonsterFamily =
  | "slime"
  | "beast"
  | "bird"
  | "plant"
  | "material"
  | "demon"
  | "zombie"
  | "dragon"
  | "human"
  | "aquatic"
  | "machine"
  | "insect"
  | "unknown";

/** コンテンツ種別 */
export type ContentType =
  | "megamon"
  | "gigamon"
  | "hokora"
  | "renkin"
  | "kakusei"
  | "story"
  | "event";

/** 戦闘モード */
export type BattleMode = "auto" | "manual";

/** ジョブ */
export type JobId =
  | "warrior"
  | "martial_artist"
  | "mage"
  | "priest"
  | "thief"
  | "dancer"
  | "sage"
  | "ranger"
  | "hero"
  | "swordmaster"
  | "pirate"
  | "armamentalist"
  | "monster_tamer"
  | "demon_spearman";

export interface JobLevel {
  jobId: JobId;
  level: number;
}

/** 百分率補正（例: 15 = +15%） */
export interface DamageModifiers {
  /** 属性ダメージ+◯% の合計 */
  elementDamage?: Partial<Record<Element, number>>;
  /** 属性特技ダメージ+◯% の合計 */
  elementSkillDamage?: Partial<Record<Element, number>>;
  /** 系統へのダメージ+◯% の合計 */
  familyDamage?: Partial<Record<MonsterFamily, number>>;
  /** 斬撃/体技/とくぎ ダメージ+◯% の合計 */
  attackTypeDamage?: Partial<Record<AttackType, number>>;
  /** 種族特効（例: メタル系） */
  speciesDamage?: number;
  /** 特定ボス特攻（例: りゅうおうへのダメージ+◯%） */
  bossDamage?: number;
  /** スキルダメージ強化+◯% */
  skillDamageBoost?: number;
  /** 町効果等 */
  townEffect?: number;
  /** イベント補正 */
  eventModifier?: number;
}

export interface Stats {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  spellAttack: number;
  spellHeal: number;
  agility: number;
  deftness: number;
}

export interface Skill {
  id: string;
  name: string;
  attackType: AttackType;
  element: Element;
  /** スキル倍率（100 = 1.0倍） */
  multiplier: number;
  /** ヒット数 */
  hits: number;
  mpCost: number;
  /** いきなりスキルか */
  isInstant?: boolean;
  /** ピオリム等のバフスキル */
  isBuff?: boolean;
  buffAgilityPercent?: number;
}

export interface Equipment {
  id: string;
  name: string;
  slot: "weapon" | "shield" | "head" | "body" | "legs" | "accessory";
  stats: Partial<Stats>;
  modifiers: DamageModifiers;
  /** 装備可能ジョブ */
  allowedJobs?: JobId[];
  /** 付与スキル */
  skills?: Skill[];
}

export interface Heart {
  id: string;
  name: string;
  family: MonsterFamily;
  color: "red" | "blue" | "green" | "yellow" | "purple";
  cost: number;
  /** ランク別ステータス [S, A, B, C, D] */
  rankStats: {
    hp: number[];
    mp: number[];
    attack: number[];
    defense: number[];
    spellAttack: number[];
    spellHeal: number[];
    agility: number[];
    deftness: number[];
  };
  /** ランク別特殊効果 */
  rankEffects: Record<"S" | "A" | "B" | "C" | "D", string[]>;
  modifiers: DamageModifiers;
}

export interface OwnedHeart {
  heartId: string;
  rank: "S" | "A" | "B" | "C" | "D";
}

export interface Monster {
  id: string;
  name: string;
  contentType: ContentType;
  family: MonsterFamily;
  stats: Stats;
  /** 属性耐性（100 = 等倍, 50 = 半減, 200 = 弱点2倍） */
  elementResist: Partial<Record<Element, number>>;
  /** 行動パターン概要 */
  actions?: string[];
}

export interface CharacterBuild {
  jobId: JobId;
  jobLevel: number;
  equipmentIds: string[];
  heartIds: OwnedHeart[];
  /** 手動指定の追加ステータス */
  bonusStats?: Partial<Stats>;
  /** 使用スキル */
  skillId: string;
  /** パーティ内位置 0-3 */
  partySlot: number;
}

export interface PartyRecommendation {
  builds: CharacterBuild[];
  totalDamage: number;
  turnOrder: TurnOrderEntry[];
  notes: string[];
  /** 1ターン撃破可能か */
  canOneTurnClear: boolean;
}

export interface TurnOrderEntry {
  name: string;
  agility: number;
  effectiveAgilityMin: number;
  effectiveAgilityMax: number;
  slot: number;
  isEnemy: boolean;
}

export interface OptimizationInput {
  ownedEquipment: string[];
  ownedHearts: OwnedHeart[];
  jobLevels: JobLevel[];
  targetMonsterId: string;
  contentType: ContentType;
  battleMode: BattleMode;
  /** 最大探索キャラ数（性能用） */
  maxCandidates?: number;
}

export interface GameDatabase {
  equipment: Equipment[];
  hearts: Heart[];
  monsters: Monster[];
  skills: Skill[];
  jobs: Record<
    JobId,
    {
      name: string;
      baseStatsPerLevel: Partial<Stats>;
      availableSkills: string[];
    }
  >;
}
