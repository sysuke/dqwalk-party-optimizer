# 他のPCで作業を続ける

リポジトリ直下が現行アプリです。旧Next.js試作はGit履歴に残し、mainのファイルから削除しました。

## 取得・起動

GitとNode.js 18以上を用意し、GitHubの自分のアカウントで非公開リポジトリを取得します。この版はNode.js 24で検証しています。

```sh
git clone https://github.com/sysuke/dqwalk-party-optimizer.git
cd dqwalk-party-optimizer
npm start
```

http://127.0.0.1:4173 を開きます。追加パッケージのインストールやビルドは不要です。HTMLを直接開くとWorkerが動作しないことがあるため、上記のサーバーを使います。

## テストと変更の保存

```sh
npm test
npm run check:entrypoints
```

```sh
git add .
git commit -m "Improve party planner"
git push
```

最後の3コマンドはリポジトリ直下で実行します。作業前は `git pull --ff-only` で最新を取得してください。他のPCで未保存の変更がある場合、先にコミットし、互いの変更を上書きしないよう確認します。

## 現状と次の課題

現行版は0.53（2026-10-27）。まず [残課題](REMAINING.md)、[データ監査](DATA-QUALITY.md)、[コード構造](ARCHITECTURE.md)を確認してください。ゾーン成立時比較・4枚ブレイク・補助置換は実装済みですが、実測一致、職業基礎能力、敵の状態遷移、実行可能な速度装備の探索が残ります。回帰テスト数を実機一致例数として扱わないでください。

公開先は所有者限定の https://walk-party-planner.groovyflame10.chatgpt.site 。GitHub Pagesの有効化・公開成功確認は別途必要です。

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

GitHub Pagesは初回のPages有効化後、mainへのpushで更新します。手順は [GitHub Pages](GITHUB-PAGES.md)。以下は従来のSitesを更新する場合の説明です。Sitesの公開範囲は所有者のみを維持します。

CodexのSitesスキルを使い、`.openai/hosting.json` の既存 `project_id` からサイトを選択します。Sites側のソース用チェックアウトを別に開き、そこへこのフォルダのソースを反映して検証・同期・公開します。このGitHubリポジトリ全体をSitesのソースへ丸ごと同期したり、Gitの履歴を強制上書きしたりしないでください。

認証情報は新しいPCで取得し、トークンやCookieをファイル・Gitへ保存しません。`.openai/hosting.json` は公開先を識別する設定であり、認証トークンは含みません。
