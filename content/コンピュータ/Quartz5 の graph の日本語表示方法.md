---
title: Quartz5 の graph の日本語表示方法
date: 2026-07-18
modified: 2026-07-18
tags:
  - Obsidian
  - Quartz
  - グラフビュー
draft: false
---
以下、Obsidian、Node.js、Git、GitHub、Quartz5 のインストール・登録等の設定が完了していいることが前提となります。
### 1. 日本語記事でグラフが正常に表示されない

日本語ファイル名の記事、日本語フォルダ下の記事では、現在の記事だけが孤立したノードとして表示されました。

原因は、Graph 内部で扱う次の slug 表現が一致していなかったためです。
- ブラウザURL
- 記事データのキー
- 内部リンクのリンク先
日本語URLはパーセントエンコードされるため、日本語記事でだけ不具合が発生します。

### 2. `graph.inline.ts`を日本語slug対応に変更した
次のファイルを編集しました。
```text
.quartz\plugins\graph\src\components\scripts\graph.inline.ts
```
`decodeURIComponent()`と`simplifySlug()`をまとめた`normalizeSlug()`を追加し、次の値を同じ方法で正規化しました。
- 現在表示中の記事slug
- Graphデータ内の記事slug
- 内部リンクのリンク先slug
- 訪問済み記事のslug
併せて、グラフのノード名を日本語ゴシック体で表示するように変更しました。

### 3. Graphプラグインを再ビルドした
`graph.inline.ts`はソースファイルなので、公開用の`dist`も作り直す必要がありました。
```cmd
npm install --include=dev
npm run build
```
これで`dist`内のJavaScriptにも変更が反映されました。

### 4. ローカルプレビューでは正常に反映された
```cmd
npx quartz build --serve -o content-preview
```
※ `content-preview` フォルダをローカルプレビューフォルダに設定している場合

では、ローカルにある改変済みの

```text
.quartz\plugins\graph
```

が使用されるため、変更が反映されました。

### 5. 公開サイトでは変更が反映されなかった

`.quartz`フォルダはGitの管理対象外だったため、改変したGraphプラグインはGitHubへ送られていませんでした。

GitHub Actionsでは、公開時に公式プラグインを改めて取得していたため、公開サイトでは改変前のGraphが使われました。

### 6. Graph公式リポジトリをフォークした
公式版、
```text
quartz-community/graph
```
をフォークして、
```text
githubAccountName/graph
```
を作成しました。

フォークをローカルへcloneし、改変した`graph.inline.ts`をコピーしました。
```text
..\GitHub\graph
```
その後、再ビルドして、`src`と`dist`をフォーク側へpushしました。

### 7. Quartzの参照先をフォーク版へ変更した
`quartz.config.yaml`のGraph設定を、デスクトップ用・モバイル用ともに変更しました。
```yaml
source: github:githubAccountName/graph
```

### 8. `quartz.lock.json`もフォーク版へ変更した
Graphの公式版とフォーク版は、どちらもプラグイン名が`graph`です。

そのため、設定ファイルだけ変更しても、Quartzは既存の公式版Graphを「インストール済み」と判断していました。

そこで、`quartz.lock.json`のGraph項目を次の内容へ更新しました。
```json
"source": "github:githubAccountName/graph",
"resolved": "https://github.com/githubAccountName/graph.git",
"commit": "フォーク版のコミットSHA"
```
その後、ローカルのGraphフォルダを削除し、ロックファイルから入れ直しました。

```cmd
rmdir /s /q .quartz\plugins\graph
npx quartz plugin install --clean graph
```
`npx quartz plugin`で、次の表示になることを確認しました。
```text
graph    github:githubAccountName/graph
```

### 9. GitHub Actionsのキャッシュが公式版Graphを残していた
GitHub Actionsでは、`.quartz/plugins`をキャッシュしていました。

そのため、古い公式版Graphが復元され、フォーク版のコミットへ更新しようとして失敗していました。

ログには次のように表示されました。
```text
graph: updating to ...
graph: failed to update
```

### 10. `deploy.yml`でGraphだけ毎回入れ直すようにした
`.github/workflows/deploy.yml`のインストール処理を次のように変更しました。
```yaml
- name: Install Quartz plugins
  run: |
    rm -rf .quartz/plugins/graph
    npx quartz plugin install --clean graph
    npx quartz plugin install
```
最初は`run: |`の`|`が抜けていたため、3行が1つのコマンドとして実行され、Actionsが失敗しました。`|`を追加して解決しました。

## 現在の構成
```text
githubAccountName/graph
    改変したGraphプラグイン本体

quartz.config.yaml
    Graph の参照先を githubAccountName/graph に指定

quartz.lock.json
    使用するフォーク版のコミットを固定

deploy.yml
    Actions実行時にGraphの古いキャッシュを削除して再取得
```
つまり今回の作業は、単なる日本語対応だけでなく、
1. Graphのslug処理を修正    
2. プラグインをビルド    
3. フォーク版として管理    
4. Quartzの設定とロックファイルを変更    
5. GitHub Actionsのキャッシュ対策    

まで行った、という流れです。