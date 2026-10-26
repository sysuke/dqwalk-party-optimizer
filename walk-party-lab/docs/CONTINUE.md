# 他のPCで作業を続ける

このフォルダは、所有者限定で公開している「ウォーク編成ラボ」0.38のソースです。GitHubリポジトリ直下にある既存のNext.js試作とは別のアプリです。

## 取得・起動

GitとNode.js 18以上を用意し、GitHubの自分のアカウントで非公開リポジトリを取得します。この版はNode.js 24で検証しています。

```sh
git clone https://github.com/sysuke/dqwalk-party-optimizer.git
cd dqwalk-party-optimizer/walk-party-lab
npm start
```

http://127.0.0.1:4173 を開きます。追加パッケージのインストールやビルドは不要です。HTMLを直接開くとWorkerが動作しないことがあるため、上記のサーバーを使います。

## テストと変更の保存

```sh
npm test
npm run check:entrypoints
```

```sh
git add walk-party-lab
git commit -m "Improve party planner"
git push
```

最後の3コマンドはリポジトリ直下で実行します。作業前は `git pull --ff-only` で最新を取得してください。他のPCで未保存の変更がある場合、先にコミットし、互いの変更を上書きしないよう確認します。

## 現状と次の課題

- 現行版：0.38。公開サイトも0.38を反映済み。
- 公開URL：https://walk-party-planner.groovyflame10.chatgpt.site
- 主要画面：攻略選択、所持品・レベル記録、編成・結果。詳細ツールに装備・スキル順の検証、実測照合記録。
- 0.38では、魔剣士＋ペルセリア／大魔道士＋銃剣等の候補取りこぼしを改善。装備・手順役割の交換と育成済み別職を実計算で比較。
- 直近の計算・探索の回帰テストは513件合格。実機との一致例数ではありません。
- 基礎能力の仮値、未収録の職業特性、暴走魔法陣の持続、やまびこ威力補正、実測照合、敵ギミック、探索品質が残っています。
- [残課題](REMAINING.md)、[コード構造](ARCHITECTURE.md)、[0.38の変更](history/DATA-0.38.md)を最初に確認してください。

## 変更する場所

- 装備・こころ・スキル：`dist/data/catalog/`
- 数値式：`dist/domain/damage/`
- バフ・ターン・MP：`dist/domain/battle/`
- 装備・職業・手順探索：`dist/domain/optimization/`
- 画面：`dist/ui/` と `dist/styles/`
- ブラウザとWorkerの読み込み順：`scripts/entrypoints.cjs`
- 読み込み順を変えたら `npm run sync:entrypoints` を実行します。

## 所持データの移動

ソースと、ブラウザ保存の所持品・レベル・照合記録は別です。ソースをcloneしてもブラウザの入力データは移りません。現在使っているブラウザで所持品・レベルをJSON書き出しし、新しいPCの同じ画面から取り込んでください。照合記録には独立したJSON書き出しがありますが、照合記録の再取り込み画面は未実装です。保存データはGitHubへ自動送信しません。

## 公開サイトを更新する場合

GitHubへのpushだけでは公開サイトは更新されません。公開範囲は所有者のみを維持します。

CodexのSitesスキルを使い、`.openai/hosting.json` の既存 `project_id` からサイトを選択します。Sites側のソース用チェックアウトを別に開き、そこへこのフォルダのソースを反映して検証・同期・公開します。このGitHubリポジトリ全体をSitesのソースへ丸ごと同期したり、Gitの履歴を強制上書きしたりしないでください。

認証情報は新しいPCで取得し、トークンやCookieをファイル・Gitへ保存しません。`.openai/hosting.json` は公開先を識別する設定であり、認証トークンは含みません。
