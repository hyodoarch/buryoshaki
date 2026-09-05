# 同梱プラグイン

`quartz-image-grid-captions/` は Image Grid Captions v0.1.0 の配布パッケージです。
`quartz.config.yaml` のローカルsourceから読み込みます。サイトと一緒にGit管理するため、GitHub Actionsでも兄弟ディレクトリや非公開リポジトリに依存しません。

SCSSの追加編集は不要で、プラグインのビルド済みCSSがTransformerのリソースとして読み込まれます。

更新する場合は、開発元の `quartz-image-grid-captions` で検証・ビルドし、`npm pack` の配布内容でこのフォルダを更新してください。`dist/index.js` を含む配布ファイルはGit管理対象です。
