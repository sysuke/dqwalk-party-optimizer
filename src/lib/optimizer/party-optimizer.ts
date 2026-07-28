import type {
  CharacterBuild,
  ContentType,
  GameDatabase,
  Heart,
  JobId,
  OptimizationInput,
  OwnedHeart,
  PartyRecommendation,
  Stats,
  TurnOrderEntry,
} from "../types";
import {
  calcBreathDamage,
  calcPartyOrderAgility,
  calcPhysicalDamage,
  calcSpellDamage,
  calcTurnOrderRange,
  sumDamageModifiers,
  sumElementModifier,
  sumStats,
} from "../calculator/damage";

const RANK_INDEX = { S: 0, A: 1, B: 2, C: 3, D: 4 } as const;

function getHeartStats(heart: Heart, owned: OwnedHeart): Partial<Stats> {
  const idx = RANK_INDEX[owned.rank];
  return {
    hp: heart.rankStats.hp[idx],
    mp: heart.rankStats.mp[idx],
    attack: heart.rankStats.attack[idx],
    defense: heart.rankStats.defense[idx],
    spellAttack: heart.rankStats.spellAttack[idx],
    spellHeal: heart.rankStats.spellHeal[idx],
    agility: heart.rankStats.agility[idx],
    deftness: heart.rankStats.deftness[idx],
  };
}

function getJobBaseStats(
  db: GameDatabase,
  jobId: JobId,
  level: number,
): Partial<Stats> {
  const job = db.jobs[jobId];
  const stats: Partial<Stats> = {};
  for (const [key, perLevel] of Object.entries(job.baseStatsPerLevel) as [
    keyof Stats,
    number,
  ][]) {
    stats[key] = Math.floor(perLevel * level);
  }
  return stats;
}

function resolveBuildStats(
  build: CharacterBuild,
  db: GameDatabase,
): { stats: Stats; modifiers: ReturnType<typeof sumDamageModifiers> } {
  const equipment = build.equipmentIds
    .map((id) => db.equipment.find((e) => e.id === id))
    .filter(Boolean);

  const hearts = build.heartIds
    .map((owned) => {
      const heart = db.hearts.find((h) => h.id === owned.heartId);
      return heart ? { heart, owned } : null;
    })
    .filter(Boolean) as { heart: Heart; owned: OwnedHeart }[];

  const jobStats = getJobBaseStats(db, build.jobId, build.jobLevel);
  const equipStats = equipment.map((e) => e!.stats);
  const heartStats = hearts.map(({ heart, owned }) => getHeartStats(heart, owned));

  const stats = sumStats(jobStats, ...equipStats, ...heartStats, build.bonusStats ?? {});

  const modifiers = sumDamageModifiers(
    ...equipment.map((e) => e!.modifiers),
    ...hearts.map(({ heart }) => heart.modifiers),
  );

  return { stats, modifiers };
}

function calcBuildDamage(
  build: CharacterBuild,
  db: GameDatabase,
  monsterDefense: number,
  monsterSpellDefense: number,
  elementResist: number,
  monsterFamily: string,
): number {
  const skill = db.skills.find((s) => s.id === build.skillId);
  if (!skill) return 0;

  const { stats, modifiers } = resolveBuildStats(build, db);
  const elementMod = sumElementModifier(
    skill.element,
    modifiers.elementDamage,
    modifiers.elementSkillDamage,
  );
  const familyMod = modifiers.familyDamage[monsterFamily] ?? 0;
  const attackTypeMod = modifiers.attackTypeDamage[skill.attackType] ?? 0;

  switch (skill.attackType) {
    case "spell":
      return calcSpellDamage({
        spellAttack: stats.spellAttack,
        basePowerCap: 999,
        skillMultiplier: skill.multiplier,
        hits: skill.hits,
        elementResist,
        elementDamagePercent: elementMod,
        familyDamagePercent: familyMod,
        bossDamagePercent: modifiers.bossDamage,
        skillDamageBoostPercent: modifiers.skillDamageBoost,
      }).total;
    case "breath":
      return calcBreathDamage({
        attack: stats.attack,
        deftness: stats.deftness,
        skillMultiplier: skill.multiplier,
        hits: skill.hits,
        defense: monsterDefense,
        elementResist,
        elementDamagePercent: elementMod,
        familyDamagePercent: familyMod,
        attackTypeDamagePercent: attackTypeMod,
      }).total;
    default:
      return calcPhysicalDamage({
        attack: stats.attack,
        defense: monsterDefense,
        skillMultiplier: skill.multiplier,
        hits: skill.hits,
        elementResist,
        elementDamagePercent: elementMod,
        familyDamagePercent: familyMod,
        attackTypeDamagePercent: attackTypeMod,
        speciesDamagePercent: modifiers.speciesDamage,
        bossDamagePercent: modifiers.bossDamage,
        skillDamageBoostPercent: modifiers.skillDamageBoost,
        townEffectPercent: modifiers.townEffect,
      }).total;
  }
}

/** 簡易パーティ最適化（全探索は重いためヒューリスティック） */
export function optimizeParty(
  input: OptimizationInput,
  db: GameDatabase,
): PartyRecommendation {
  const monster = db.monsters.find((m) => m.id === input.targetMonsterId);
  if (!monster) {
    throw new Error(`Monster not found: ${input.targetMonsterId}`);
  }

  const ownedEquip = db.equipment.filter((e) =>
    input.ownedEquipment.includes(e.id),
  );
  const ownedHeartData = input.ownedHearts
    .map((oh) => ({
      owned: oh,
      heart: db.hearts.find((h) => h.id === oh.heartId),
    }))
    .filter((x) => x.heart);

  const candidates: Array<{
    build: CharacterBuild;
    damage: number;
    agility: number;
  }> = [];

  for (const jobLevel of input.jobLevels) {
    const job = db.jobs[jobLevel.jobId];
    if (!job) continue;

    const usableEquip = ownedEquip.filter(
      (e) => !e.allowedJobs || e.allowedJobs.includes(jobLevel.jobId),
    );
    const weapon = usableEquip.find((e) => e.slot === "weapon");
    if (!weapon) continue;

    const otherEquip = usableEquip
      .filter((e) => e.id !== weapon.id)
      .slice(0, 4);

    for (const skillId of job.availableSkills) {
      const skill = db.skills.find((s) => s.id === skillId);
      if (!skill || skill.isBuff) continue;

      const elementResist =
        monster.elementResist[skill.element] ?? 100;

      // こころはコスト上限10想定で上位3つを greedily 選択
      const sortedHearts = [...ownedHeartData].sort((a, b) => {
        const modA = sumDamageModifiers(a.heart!.modifiers);
        const modB = sumDamageModifiers(b.heart!.modifiers);
        const scoreA =
          (modA.familyDamage[monster.family] ?? 0) +
          sumElementModifier(skill.element, modA.elementDamage, modA.elementSkillDamage);
        const scoreB =
          (modB.familyDamage[monster.family] ?? 0) +
          sumElementModifier(skill.element, modB.elementDamage, modB.elementSkillDamage);
        return scoreB - scoreA;
      });

      let cost = 0;
      const selectedHearts: OwnedHeart[] = [];
      for (const { owned, heart } of sortedHearts) {
        if (cost + heart!.cost <= 10) {
          selectedHearts.push(owned);
          cost += heart!.cost;
        }
      }

      const build: CharacterBuild = {
        jobId: jobLevel.jobId,
        jobLevel: jobLevel.level,
        equipmentIds: [weapon.id, ...otherEquip.map((e) => e.id)],
        heartIds: selectedHearts,
        skillId,
        partySlot: 0,
      };

      const damage = calcBuildDamage(
        build,
        db,
        monster.stats.defense,
        monster.stats.spellAttack,
        elementResist,
        monster.family,
      );

      const { stats } = resolveBuildStats(build, db);

      candidates.push({
        build,
        damage,
        agility: stats.agility,
      });
    }
  }

  candidates.sort((a, b) => b.damage - a.damage);
  const top = candidates.slice(0, 4);

  // 素早さ調整: 4番手→3番手→2番手→1番手の順に固定
  const ordered = [...top].sort((a, b) => a.agility - b.agility);
  const adjustedAgilities: number[] = [];
  for (let i = 0; i < ordered.length; i++) {
    if (i === 0) {
      adjustedAgilities.push(ordered[i].agility);
    } else {
      adjustedAgilities.push(
        calcPartyOrderAgility(adjustedAgilities[i - 1], input.contentType),
      );
    }
  }

  const builds = ordered.map((c, i) => ({
    ...c.build,
    partySlot: i,
    bonusStats: { agility: adjustedAgilities[i] - c.agility },
  }));

  const totalDamage = top.reduce((sum, c) => sum + c.damage, 0);
  const canOneTurnClear = totalDamage >= monster.stats.hp;

  const turnOrderEntries = calcTurnOrderRange(
    [
      ...builds.map((b, i) => {
        const { stats } = resolveBuildStats(b, db);
        const jobName = db.jobs[b.jobId].name;
        return {
          name: jobName,
          agility: stats.agility + (b.bonusStats?.agility ?? 0),
          slot: i,
          isEnemy: false,
        };
      }),
      {
        name: monster.name,
        agility: monster.stats.agility,
        slot: 99,
        isEnemy: true,
      },
    ],
    input.contentType,
  );

  const turnOrder: TurnOrderEntry[] = turnOrderEntries.map((e) => ({
    name: e.name,
    agility: e.agility,
    effectiveAgilityMin: e.effectiveAgilityMin,
    effectiveAgilityMax: e.effectiveAgilityMax,
    slot: e.slot,
    isEnemy: e.isEnemy,
  }));

  const notes: string[] = [];
  if (!canOneTurnClear) {
    notes.push(
      `現在の所持装備では1ターン撃破に ${(monster.stats.hp - totalDamage).toLocaleString()} ダメージ不足しています。`,
    );
  } else {
    notes.push("推定ダメージで1ターン撃破可能です。");
  }

  if (input.battleMode === "auto") {
    notes.push("自動戦闘: いきなりスキル優先・サポート役は後方配置を推奨。");
  } else {
    notes.push("手動戦闘: バフ→デバフ→火力の順で行動順を調整してください。");
  }

  notes.push(
    `素早さ計算: すばやさ × (100〜${input.contentType === "megamon" || input.contentType === "gigamon" ? 120 : 115}) / 100`,
  );

  return {
    builds,
    totalDamage,
    turnOrder,
    notes,
    canOneTurnClear,
  };
}
