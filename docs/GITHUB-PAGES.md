# GitHub Pages

このリポジトリは現行アプリを直下へ配置しています。旧Next.js試作は削除し、Git履歴に残しています。

## 初回だけ行う設定

1. Actions → Test and deploy GitHub Pages → Run workflow で main を実行する。
2. deploy成功後、Pages画面または実行結果の公開URLを開く。

deployジョブはPagesサイトが未設定の場合、GitHub Actionsを公開元として自動で有効化します。
リポジトリの設定やプランによって有効化できない場合は、Settings → Pages の案内に従ってください。

設定画面：https://github.com/sysuke/dqwalk-party-optimizer/settings/pages
実行画面：https://github.com/sysuke/dqwalk-party-optimizer/actions/workflows/pages.yml

標準の予定URLは https://sysuke.github.io/dqwalk-party-optimizer/ 。成功したdeploy出力を正として確認してください。

非公開リポジトリのPagesにはGitHub Pro等の対象プランが必要です。
設定画面でプラン制限が表示された場合は、プラン変更または公開リポジトリ化が必要です。
リポジトリの公開範囲はこの移行で変更していません。Pagesサイトは一般公開する方針をユーザー確認済みです。

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
