import type { AttackType, ContentType, Element, Stats } from "./types";

/** 小数切り捨て（ゲーム内 truncate 相当） */
export function truncate(value: number): number {
  return Math.trunc(value);
}

export interface PhysicalDamageInput {
  attack: number;
  defense: number;
  skillMultiplier: number;
  hits?: number;
  elementResist?: number;
  /** 百分率合計（例: 属性15 + 属性特技10 => 25） */
  elementDamagePercent?: number;
  familyDamagePercent?: number;
  attackTypeDamagePercent?: number;
  speciesDamagePercent?: number;
  bossDamagePercent?: number;
  skillDamageBoostPercent?: number;
  townEffectPercent?: number;
}

/**
 * 物理ダメージ計算
 * 参照: https://keisan.site/exec/user/1579578861
 *       https://9db.jp/dqwalk/data/7368
 */
export function calcPhysicalDamage(input: PhysicalDamageInput): {
  perHit: number;
  total: number;
  baseDamage: number;
} {
  const {
    attack,
    defense,
    skillMultiplier,
    hits = 1,
    elementResist = 100,
    elementDamagePercent = 0,
    familyDamagePercent = 0,
    attackTypeDamagePercent = 0,
    speciesDamagePercent = 0,
    bossDamagePercent = 0,
    skillDamageBoostPercent = 0,
    townEffectPercent = 0,
  } = input;

  const baseDamage = truncate(attack / 2 - defense / 4);
  if (baseDamage <= 0) {
    return { perHit: 0, total: 0, baseDamage };
  }

  const multiplier = skillMultiplier / 100;
  const resist = elementResist / 100;

  const frame1 =
    multiplier *
    resist *
    (1 + elementDamagePercent / 100) *
    (1 + familyDamagePercent / 100) *
    (1 + attackTypeDamagePercent / 100) *
    (1 + speciesDamagePercent / 100) *
    (1 + townEffectPercent / 100);

  let perHit = truncate(baseDamage * frame1);
  perHit = truncate(perHit * (1 + bossDamagePercent / 100));
  perHit = truncate(perHit * (1 + skillDamageBoostPercent / 100));

  return {
    perHit,
    total: perHit * hits,
    baseDamage,
  };
}

export interface SpellDamageInput {
  spellAttack: number;
  /** スキル固有の基礎威力上限 */
  basePowerCap: number;
  skillMultiplier: number;
  hits?: number;
  elementResist?: number;
  spellDamagePercent?: number;
  elementDamagePercent?: number;
  familyDamagePercent?: number;
  bossDamagePercent?: number;
  skillDamageBoostPercent?: number;
}

/**
 * 呪文ダメージ計算（簡易版）
 * 参照: https://9db.jp/dqwalk/data/7368
 */
export function calcSpellDamage(input: SpellDamageInput): {
  perHit: number;
  total: number;
} {
  const {
    spellAttack,
    basePowerCap,
    skillMultiplier,
    hits = 1,
    elementResist = 100,
    spellDamagePercent = 0,
    elementDamagePercent = 0,
    familyDamagePercent = 0,
    bossDamagePercent = 0,
    skillDamageBoostPercent = 0,
  } = input;

  const basePower = Math.min(spellAttack * 2 + 50, basePowerCap);
  const multiplier = skillMultiplier / 100;
  const resist = elementResist / 100;

  let perHit = truncate(
    basePower *
      multiplier *
      resist *
      (1 + spellDamagePercent / 100) *
      (1 + elementDamagePercent / 100) *
      (1 + familyDamagePercent / 100),
  );
  perHit = truncate(perHit * (1 + bossDamagePercent / 100));
  perHit = truncate(perHit * (1 + skillDamageBoostPercent / 100));

  return { perHit, total: perHit * hits };
}

export interface BreathDamageInput {
  attack: number;
  deftness: number;
  skillMultiplier: number;
  hits?: number;
  defense: number;
  elementResist?: number;
  elementDamagePercent?: number;
  familyDamagePercent?: number;
  attackTypeDamagePercent?: number;
}

/**
 * ブレスダメージ計算（簡易版）
 * きようさ+ちから ベース
 */
export function calcBreathDamage(input: BreathDamageInput): {
  perHit: number;
  total: number;
} {
  const {
    attack,
    deftness,
    skillMultiplier,
    hits = 1,
    defense,
    elementResist = 100,
    elementDamagePercent = 0,
    familyDamagePercent = 0,
    attackTypeDamagePercent = 0,
  } = input;

  const baseStat = attack + deftness;
  const baseDamage = truncate(baseStat / 2 - defense / 4);
  if (baseDamage <= 0) {
    return { perHit: 0, total: 0 };
  }

  const multiplier = skillMultiplier / 100;
  let perHit = truncate(
    baseDamage *
      multiplier *
      (elementResist / 100) *
      (1 + elementDamagePercent / 100) *
      (1 + familyDamagePercent / 100) *
      (1 + attackTypeDamagePercent / 100),
  );

  return { perHit, total: perHit * hits };
}

/** メガモン/ギガモン等の乱数上限 */
export function getSpeedRandomMax(contentType: ContentType): number {
  switch (contentType) {
    case "megamon":
    case "gigamon":
    case "kakusei":
      return 120;
    default:
      return 115;
  }
}

/**
 * 行動順固定に必要な素早さ
 * 参照: https://9db.jp/dqwalk/data/11777
 *       https://game8.jp/dqwalk/781486
 */
export function calcRequiredAgilityToActBefore(
  targetAgility: number,
  contentType: ContentType,
  safetyMargin = 10,
): number {
  const randomMax = getSpeedRandomMax(contentType);
  const factor = randomMax / 100;
  return Math.ceil(targetAgility * factor + safetyMargin);
}

/** パーティ内 n+1 番手が n 番手より確実に先に動く素早さ */
export function calcPartyOrderAgility(
  slowerAgility: number,
  contentType: ContentType,
  safetyMargin = 10,
): number {
  return calcRequiredAgilityToActBefore(slowerAgility, contentType, safetyMargin);
}

export interface TurnOrderInput {
  name: string;
  agility: number;
  slot: number;
  isEnemy: boolean;
}

export function calcTurnOrderRange(
  entries: TurnOrderInput[],
  contentType: ContentType,
): Array<
  TurnOrderInput & {
    effectiveAgilityMin: number;
    effectiveAgilityMax: number;
  }
> {
  const randomMax = getSpeedRandomMax(contentType);
  return entries.map((entry) => ({
    ...entry,
    effectiveAgilityMin: truncate(entry.agility * (100 / 100)),
    effectiveAgilityMax: truncate(entry.agility * (randomMax / 100)),
  }));
}

/** 攻撃種別に応じたダメージ%合計を取得 */
export function sumAttackTypeModifier(
  attackType: AttackType,
  slashStrikePercent = 0,
  typeSpecificPercent = 0,
): number {
  if (attackType === "slash" || attackType === "strike") {
    return slashStrikePercent + typeSpecificPercent;
  }
  return typeSpecificPercent;
}

/** 属性ダメージ%合計（属性+属性特技） */
export function sumElementModifier(
  element: Element,
  elementDamage: Partial<Record<Element, number>> = {},
  elementSkillDamage: Partial<Record<Element, number>> = {},
): number {
  return (elementDamage[element] ?? 0) + (elementSkillDamage[element] ?? 0);
}

/** ステータス合算 */
export function sumStats(...parts: Partial<Stats>[]): Stats {
  const result: Stats = {
    hp: 0,
    mp: 0,
    attack: 0,
    defense: 0,
    spellAttack: 0,
    spellHeal: 0,
    agility: 0,
    deftness: 0,
  };

  for (const part of parts) {
    for (const key of Object.keys(result) as (keyof Stats)[]) {
      result[key] += part[key] ?? 0;
    }
  }

  return result;
}

export function sumDamageModifiers(
  ...modifiers: Array<{
    elementDamage?: Partial<Record<Element, number>>;
    elementSkillDamage?: Partial<Record<Element, number>>;
    familyDamage?: Partial<Record<string, number>>;
    attackTypeDamage?: Partial<Record<AttackType, number>>;
    speciesDamage?: number;
    bossDamage?: number;
    skillDamageBoost?: number;
    townEffect?: number;
    eventModifier?: number;
  }>
) {
  const result = {
    elementDamage: {} as Partial<Record<Element, number>>,
    elementSkillDamage: {} as Partial<Record<Element, number>>,
    familyDamage: {} as Partial<Record<string, number>>,
    attackTypeDamage: {} as Partial<Record<AttackType, number>>,
    speciesDamage: 0,
    bossDamage: 0,
    skillDamageBoost: 0,
    townEffect: 0,
    eventModifier: 0,
  };

  for (const mod of modifiers) {
    for (const [element, value] of Object.entries(mod.elementDamage ?? {})) {
      const key = element as Element;
      result.elementDamage[key] = (result.elementDamage[key] ?? 0) + value;
    }
    for (const [element, value] of Object.entries(mod.elementSkillDamage ?? {})) {
      const key = element as Element;
      result.elementSkillDamage[key] =
        (result.elementSkillDamage[key] ?? 0) + value;
    }
    for (const [family, value] of Object.entries(mod.familyDamage ?? {})) {
      result.familyDamage[family] = (result.familyDamage[family] ?? 0) + value;
    }
    for (const [type, value] of Object.entries(mod.attackTypeDamage ?? {})) {
      const key = type as AttackType;
      result.attackTypeDamage[key] = (result.attackTypeDamage[key] ?? 0) + value;
    }
    result.speciesDamage += mod.speciesDamage ?? 0;
    result.bossDamage += mod.bossDamage ?? 0;
    result.skillDamageBoost += mod.skillDamageBoost ?? 0;
    result.townEffect += mod.townEffect ?? 0;
    result.eventModifier += mod.eventModifier ?? 0;
  }

  return result;
}
