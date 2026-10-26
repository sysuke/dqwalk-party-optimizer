# ウォーク編成ラボ：現行版の作業場所

現在公開中の **0.38** は [`walk-party-lab/`](walk-party-lab/) にあります。既存のNext.js試作はそのまま残しています。

```sh
git clone https://github.com/sysuke/dqwalk-party-optimizer.git
cd dqwalk-party-optimizer/walk-party-lab
npm start
```

http://127.0.0.1:4173 を開いてください。Node.js 18以上が必要です。追加パッケージのインストールは不要。テストは同じフォルダで `npm test`（516件合格）。

- [他のPCで作業を続ける手順・現在の状態](walk-party-lab/docs/CONTINUE.md)
- [残課題](walk-party-lab/docs/REMAINING.md)
- [コード構造](walk-party-lab/docs/ARCHITECTURE.md)

所持品・レベル等のブラウザ保存データはソースと別です。必要なデータはアプリからJSONを書き出して移してください。GitHubへのpushは、所有者限定の公開サイトを自動更新しません。

---

以下は既存のNext.js試作についてのREADMEです。

# DQ Walk パーティ編成オプティマイザ

ドラクエウォークの所持装備・こころ・ジョブレベルから、メガモン・ほこら・錬金百式・覚醒千里などのコンテンツ向けに **1ターン撃破** を目指したパーティ編成を提案する Web ツールです。

## 機能

- **ダメージ計算**: 物理 / 呪文 / ブレス（簡易版）
- **素早さ計算**: 行動順固定に必要なすばやさ、パーティ内順序調整
- **パーティ最適化**: 所持装備・こころ・ジョブから火力重視の編成を提案
- **コンテンツ対応**: メガモン / ギガモン / ほこら / 錬金百式 / 覚醒千里 等

## セットアップ

```bash
cd Projects/dqwalk-party-optimizer
npm install
npm run dev
```

http://localhost:3000 で起動します。

## テスト

```bash
npm test
```

## データの取り込み

### 重要: スクレイピングについて

[9db（みんドラ）の利用規約](https://9db.jp/games/terms) では、**プログラムによる情報取得（スクレイピング）が禁止** されています。本ツールには自動スクレイパーは含めていません。

代わりに以下の方法でデータを管理します:

1. **手動 JSON 作成** — `data/imported/` に JSON を配置
2. **インポートコマンド** — 外部で作成した JSON を取り込み

```bash
npm run import:data -- --file path/to/monsters.json
```

### JSON フォーマット例

```json
{
  "monsters": [
    {
      "id": "megamon_example",
      "name": "メガモン：サンプル",
      "contentType": "megamon",
      "family": "dragon",
      "stats": {
        "hp": 500000,
        "defense": 600,
        "agility": 900
      },
      "elementResist": { "gira": 150 }
    }
  ]
}
```

型定義は `src/lib/types.ts` を参照してください。

## 計算式の参照元

| 項目 | 参照 |
|------|------|
| 物理ダメージ | [高精度計算サイト 物理ダメージ計算機](https://keisan.site/exec/user/1579578861) |
| ダメージ枠（加算/乗算） | [9db ロマン砲解説](https://9db.jp/dqwalk/data/7368) |
| すばやさ・行動順 | [9db 確定先制解説](https://9db.jp/dqwalk/data/11777) |
| パーティ内順序 | [Game8 すばやさ調整](https://game8.jp/dqwalk/781486) |

## アーキテクチャ

```
src/
├── app/                  # Next.js UI + API
├── lib/
│   ├── calculator/       # ダメージ・素早さ計算
│   ├── optimizer/        # パーティ最適化
│   ├── data/             # DB ローダー
│   └── types.ts          # 型定義
├── data/
│   └── sample-database.ts  # 開発用サンプル
data/
└── imported/             # ユーザー取り込み JSON
```

## 今後の拡張案

- [ ] こころ・心珠の組み合わせ最適化（MIP / 全探索）
- [ ] サポート役（ピオリム・バフ）の自動配置
- [ ] 手動ローテーションシミュレーション
- [ ] ユーザーアカウント・所持データ保存
- [ ] コミュニティ共有 JSON リポジトリ連携

## ライセンス

MIT（ゲームデータの著作権はスクウェア・エニックス等に帰属）
