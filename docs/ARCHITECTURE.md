# コード構造と依存関係

## 現行の実行経路

`index.html` がデータ、計算処理、画面を順に読み込み、最後に `ui/app.js` が画面を起動する。画面で探索を開始すると `workers/` の入口から同じデータ・計算処理を読み込む。Worker内で画面やDOMは使用しない。

`data/` は従来のカタログを基礎、スキル、装備、追加収録、補正などに分けたもの。追加収録が基礎カタログを拡張するため、読み込み順に意味がある。数値の統合や再解釈は今回の整理では行っていない。

`domain/damage/` は物理式や属性・系統・斬体補正を扱う。`domain/battle/sequence-engine.js` がスキル効果とターン状態を更新し、`party-battle.js` が入力条件に基づくHP・MP・討伐・速度を検査する。`domain/optimization/` がそれらの計算を使って候補を比較する。画面表示やlocalStorageの処理は `ui/` に置く。

## 読み込み順の管理

`scripts/entrypoints.cjs` がブラウザと各Workerの依存ファイル・順序の管理元。パスは `dist/` 基準で記述する。

`scripts/sync-entrypoints.cjs --write` は管理元からHTMLのscript群とWorkerのimportScripts群を更新する。引数なしでは不一致をエラーにする。動的ローダーは導入せず、従来同様に通常のscriptとimportScriptsを使用する。

画面の `new Worker('workers/party.js')` などのURLは、UIファイルの場所ではなく `index.html` 基準。Worker内のimportScriptsはWorker自身の場所を基準とする。`tests/architecture.cjs` が両方の参照とDOMなし起動を検査する。

## 変更する場所

- 装備・こころ・スキルの収録を増やす場合：`data/catalog/` と対応する出典・回帰テスト
- ダメージ補正を直す場合：`domain/damage/` と端数・属性などの固定入力テスト
- スキル持続や再行動を直す場合：`domain/battle/sequence-engine.js`
- 生存・資源条件を直す場合：`domain/battle/party-battle.js`
- 候補の絞り込みを直す場合：`domain/optimization/`
- 入力や表示を直す場合：`ui/` と必要に応じて `styles/`

## 互換性と整理の範囲

ファイルの版番号を名前から外し、役割が分かる名前へ変更した。共有オブジェクト名（Catalog9、OrderRobust27等）とブラウザ保存キーは、既存の互換性と計算結果を維持するため変更していない。ES Modulesへの全面移行や計算ロジックの書き換えは行っていない。

旧配信コードは0.49で削除。旧sequence-engineだけを `tests/fixtures/sequence-v8.js` へ移し、過去の17件の回帰テストで使用する。配信対象には含めない。`solver.js` と `auto-optimizer.js` は現行画面でも参照されるため、旧機能に見えても削除していない。

過去の説明・監査は `docs/history/` へ移動した。古い文書に記載された当時のファイル名は履歴として残している。現在の配置はこの文書とREADMEを参照する。

## 検証

`node scripts/test.cjs` が、読み込み順の検査とすべての `.cjs` 回帰テストを別プロセスで実行する。途中で失敗した場合は非ゼロ終了し、失敗したテストの出力を表示する。バージョン0.29への移行では、既存の全順序・ダメージ固定値を維持することを確認する。
