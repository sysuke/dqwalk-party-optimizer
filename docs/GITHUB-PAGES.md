# GitHub Pages

このリポジトリは現行アプリを直下へ配置しています。旧Next.js試作は削除し、Git履歴に残しています。

## 初回だけ行う設定

1. リポジトリの管理者が Settings → Pages → Build and deployment → Source で **GitHub Actions** を選択する。
2. Actions → Test and deploy GitHub Pages → Run workflow で main を実行する。
3. deploy成功後、Pages画面または実行結果の公開URLを開く。

Pagesサイトの初回有効化は管理者が設定画面で行います。通常の `GITHUB_TOKEN` は `pages:write` があってもサイトを新規作成できないため、deployジョブでは自動有効化しません。
`Get Pages site failed` や `Create Pages site failed: Resource not accessible by integration` が出た場合は、上記の Source 設定を確認してからワークフローを再実行してください。
リポジトリの設定やプランによって有効化できない場合は、Settings → Pages の案内に従ってください。

設定画面：https://github.com/sysuke/dqwalk-party-optimizer/settings/pages
実行画面：https://github.com/sysuke/dqwalk-party-optimizer/actions/workflows/pages.yml

標準の予定URLは https://sysuke.github.io/dqwalk-party-optimizer/ 。成功したdeploy出力を正として確認してください。

非公開リポジトリのPagesにはGitHub Pro等の対象プランが必要です。
設定画面でプラン制限が表示された場合は、対象プランを確認してください。Pagesのためにリポジトリの公開範囲を自動変更しません。
Pages有効化はサイトの公開につながります。既存Sitesの所有者限定設定とは別です。

## `configure-pages` が404で失敗するとき

2026-10-30の読み取り確認では、リポジトリは `visibility: public`、`has_pages: false`、Pages APIは404だった。クラウドから公開範囲・Pages設定は変更していない。

`enablement: false` はこのActionの通常の既定値であり、アプリのビルド失敗ではない。まずSettings → PagesでSourceをGitHub Actionsに設定し、その後Actionsの失敗した実行からRe-run failed jobs、またはRun workflowを実行する。`enablement: true` で自動公開する変更は行わない。

Sourceの選択肢が出ない場合は、リポジトリ管理権限や組織のPagesポリシーを確認する。設定が反映されても失敗する場合は、Pages APIの状態と新しいログで切り分ける。

## 更新

mainへのpushで、Node.js 24の回帰テストと配信パス検査を実行後、dist/だけを公開します。
PRはテストだけ実行し、デプロイしません。外部トークンの登録は不要です。
GITHUB_TOKENには公開ジョブで pages:write / id-token:write を付けています。

計算はブラウザで行います。所持品・レベルなどは端末のブラウザ内に保存されます。
従来のchatgpt.siteとは別オリジンなので、保存済みデータは自動移行されません。
所持データのJSONを書き出し、必要に応じて新しいサイトへ取り込んでください。
実測JSONは保存用の書き出しであり、現在インポート画面はありません。

## 参照

- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
