"use client";

import { useMemo, useState } from "react";
import type {
  BattleMode,
  ContentType,
  JobId,
  JobLevel,
  OptimizationInput,
  OwnedHeart,
  PartyRecommendation,
} from "@/lib/types";
import { sampleDatabase } from "@/data/sample-database";
import { optimizeParty } from "@/lib/optimizer/party-optimizer";

const CONTENT_OPTIONS: { value: ContentType; label: string }[] = [
  { value: "megamon", label: "メガモン" },
  { value: "gigamon", label: "ギガモン" },
  { value: "hokora", label: "ほこら" },
  { value: "renkin", label: "錬金百式" },
  { value: "kakusei", label: "覚醒千里" },
  { value: "story", label: "ストーリー" },
  { value: "event", label: "イベント" },
];

const JOB_OPTIONS = Object.entries(sampleDatabase.jobs).map(([id, job]) => ({
  id: id as JobId,
  name: job.name,
}));

export default function HomePage() {
  const [contentType, setContentType] = useState<ContentType>("megamon");
  const [battleMode, setBattleMode] = useState<BattleMode>("manual");
  const [targetMonsterId, setTargetMonsterId] = useState("megamon_dragon_lord");
  const [jobLevels, setJobLevels] = useState<JobLevel[]>([
    { jobId: "hero", level: 50 },
    { jobId: "swordmaster", level: 45 },
    { jobId: "mage", level: 40 },
    { jobId: "priest", level: 35 },
  ]);
  const [ownedEquipment, setOwnedEquipment] = useState<string[]>(
    sampleDatabase.equipment.map((e) => e.id),
  );
  const [ownedHearts, setOwnedHearts] = useState<OwnedHeart[]>([
    { heartId: "dragon_lord", rank: "S" },
    { heartId: "metal_slime", rank: "A" },
    { heartId: "slime", rank: "B" },
  ]);
  const [result, setResult] = useState<PartyRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monsters = useMemo(
    () =>
      sampleDatabase.monsters.filter(
        (m) => m.contentType === contentType || contentType === "event",
      ),
    [contentType],
  );

  async function handleOptimize() {
    setLoading(true);
    setError(null);

    const input: OptimizationInput = {
      ownedEquipment,
      ownedHearts,
      jobLevels,
      targetMonsterId,
      contentType,
      battleMode,
    };

    try {
      const recommendation = optimizeParty(input, sampleDatabase);
      setResult(recommendation);
    } catch (e) {
      setError(e instanceof Error ? e.message : "不明なエラー");
    } finally {
      setLoading(false);
    }
  }

  function toggleEquipment(id: string) {
    setOwnedEquipment((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function updateJobLevel(jobId: JobId, level: number) {
    setJobLevels((prev) => {
      const existing = prev.find((j) => j.jobId === jobId);
      if (existing) {
        return prev.map((j) => (j.jobId === jobId ? { ...j, level } : j));
      }
      return [...prev, { jobId, level }];
    });
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 rounded-xl bg-dq-blue p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">DQ Walk パーティ編成オプティマイザ</h1>
        <p className="mt-2 text-sm opacity-90">
          所持装備・こころ・ジョブレベルから、1ターン撃破を目指した編成を提案します
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-6 rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-dq-blue">コンテンツ設定</h2>

          <label className="block">
            <span className="text-sm font-medium">コンテンツ種別</span>
            <select
              className="mt-1 w-full rounded border px-3 py-2"
              value={contentType}
              onChange={(e) => {
                const ct = e.target.value as ContentType;
                setContentType(ct);
                const first = sampleDatabase.monsters.find(
                  (m) => m.contentType === ct,
                );
                if (first) setTargetMonsterId(first.id);
              }}
            >
              {CONTENT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">対象モンスター</span>
            <select
              className="mt-1 w-full rounded border px-3 py-2"
              value={targetMonsterId}
              onChange={(e) => setTargetMonsterId(e.target.value)}
            >
              {monsters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="text-sm font-medium">戦闘モード</legend>
            <div className="mt-2 flex gap-4">
              {(["manual", "auto"] as BattleMode[]).map((mode) => (
                <label key={mode} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="battleMode"
                    checked={battleMode === mode}
                    onChange={() => setBattleMode(mode)}
                  />
                  {mode === "manual" ? "手動" : "自動"}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="space-y-4 rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-dq-blue">ジョブレベル</h2>
          {JOB_OPTIONS.slice(0, 8).map((job) => {
            const current = jobLevels.find((j) => j.jobId === job.id)?.level ?? 0;
            return (
              <label key={job.id} className="flex items-center justify-between gap-4">
                <span className="text-sm">{job.name}</span>
                <input
                  type="number"
                  min={0}
                  max={99}
                  className="w-20 rounded border px-2 py-1 text-right"
                  value={current}
                  onChange={(e) =>
                    updateJobLevel(job.id, Number(e.target.value))
                  }
                />
              </label>
            );
          })}
        </section>

        <section className="space-y-3 rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-dq-blue">所持装備</h2>
          {sampleDatabase.equipment.map((eq) => (
            <label key={eq.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={ownedEquipment.includes(eq.id)}
                onChange={() => toggleEquipment(eq.id)}
              />
              {eq.name}
            </label>
          ))}
        </section>

        <section className="space-y-3 rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-dq-blue">所持こころ</h2>
          {sampleDatabase.hearts.map((heart) => {
            const owned = ownedHearts.find((h) => h.heartId === heart.id);
            return (
              <div key={heart.id} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={!!owned}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setOwnedHearts((prev) => [
                        ...prev,
                        { heartId: heart.id, rank: "A" },
                      ]);
                    } else {
                      setOwnedHearts((prev) =>
                        prev.filter((h) => h.heartId !== heart.id),
                      );
                    }
                  }}
                />
                <span className="flex-1">{heart.name}</span>
                {owned && (
                  <select
                    className="rounded border px-2 py-1"
                    value={owned.rank}
                    onChange={(e) =>
                      setOwnedHearts((prev) =>
                        prev.map((h) =>
                          h.heartId === heart.id
                            ? { ...h, rank: e.target.value as OwnedHeart["rank"] }
                            : h,
                        ),
                      )
                    }
                  >
                    {(["S", "A", "B", "C", "D"] as const).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </section>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleOptimize}
          disabled={loading}
          className="rounded-lg bg-dq-gold px-8 py-3 font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "計算中..." : "最適パーティを提案"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {result && (
        <section className="mt-8 space-y-6 rounded-xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dq-blue">提案結果</h2>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                result.canOneTurnClear
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {result.canOneTurnClear ? "1ターン撃破可能" : "1ターン撃破不可"}
            </span>
          </div>

          <p className="text-sm">
            合計推定ダメージ:{" "}
            <strong>{result.totalDamage.toLocaleString()}</strong>
          </p>

          <div className="space-y-4">
            {result.builds.map((build, i) => {
              const job = sampleDatabase.jobs[build.jobId];
              const skill = sampleDatabase.skills.find(
                (s) => s.id === build.skillId,
              );
              return (
                <div
                  key={i}
                  className="rounded-lg border border-dq-gold/30 bg-dq-cream/50 p-4"
                >
                  <p className="font-semibold">
                    {i + 1}番手: {job.name} Lv.{build.jobLevel}
                  </p>
                  <p className="text-sm text-gray-600">
                    スキル: {skill?.name ?? build.skillId}
                  </p>
                  <p className="text-sm text-gray-600">
                    装備:{" "}
                    {build.equipmentIds
                      .map(
                        (id) =>
                          sampleDatabase.equipment.find((e) => e.id === id)
                            ?.name ?? id,
                      )
                      .join(" / ")}
                  </p>
                  <p className="text-sm text-gray-600">
                    こころ:{" "}
                    {build.heartIds
                      .map((h) => {
                        const heart = sampleDatabase.hearts.find(
                          (x) => x.id === h.heartId,
                        );
                        return heart ? `${heart.name}(${h.rank})` : h.heartId;
                      })
                      .join(" / ") || "なし"}
                  </p>
                </div>
              );
            })}
          </div>

          <div>
            <h3 className="mb-2 font-medium">行動順（素早さレンジ）</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-1">キャラ</th>
                  <th>すばやさ</th>
                  <th>レンジ</th>
                </tr>
              </thead>
              <tbody>
                {result.turnOrder.map((entry, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-1">
                      {entry.isEnemy ? "🟥 " : "🟦 "}
                      {entry.name}
                    </td>
                    <td>{entry.agility}</td>
                    <td>
                      {entry.effectiveAgilityMin} 〜 {entry.effectiveAgilityMax}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="list-inside list-disc text-sm text-gray-700">
            {result.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-8 text-center text-xs text-gray-500">
        計算式参照:{" "}
        <a
          href="https://keisan.site/exec/user/1579578861"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          物理ダメージ計算機
        </a>
        {" / "}
        <a
          href="https://9db.jp/dqwalk/data/11777"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          すばやさ解説
        </a>
      </footer>
    </main>
  );
}
