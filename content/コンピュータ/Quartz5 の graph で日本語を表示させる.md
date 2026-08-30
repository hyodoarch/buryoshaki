---
title: Quartz5 の graph で日本語を表示させる
date: 2026-07-18
modified: 2026-08-30
tags:
  - Obsidian
  - Quartz
  - グラフビュー
draft: false
---
Quartz5 のコミュニティプラグイン `graph` を使ったところ、私の環境では日本語ファイル名のノートを含むグラフビューが正常に表示されませんでした。日本語のノートではリンク関係が正しく認識されず、現在のノートだけが孤立して表示されることがあります。

そこで `quartz-community/graph` をフォークし、日本語 `slug` を正しく扱えるように修正しました。

フォークした graph-ja のリポジトリは下記アドレスで公開しています。
- [hyodoarch/graph-ja: Quartz 5 graph plugin fork with Japanese slug support and mobile rendering fixes.](https://github.com/hyodoarch/graph-ja)

## graph-ja で変更したこと
`graph-ja` は `quartz-community/graph` をフォークし、主に次の点を変更しています。

- 日本語を含む `slug` をデコード・正規化し、ノート間のリンクを正しく認識
- グラフのノード名に日本語向けフォントを指定
- ノードのマウスオーバー判定範囲を拡大
- モバイル環境でのグラフ描画を安定化

なお、「グラフビュー」という日本語表記や、ノード間距離・文字サイズなどの設定機能は、元のコミュニティ版 graphにも備わっています。

## 導入方法
1. `quartz.config.yaml` の参照先を変更する。
	- 変更前 → `source: github:quartz-community/graph`
	- 変更後 → `source: github:hyodoarch/graph-ja`

2. 元の `graph` をアンインストールする
	- 削除対象として `graph` が表示されるか確認 → `npx quartz plugin prune --dry-run`
	- 問題なければ → `npx quartz plugin prune`

3. graph-ja のインストールする
	- インストール → `npx quartz plugin install --from-config --latest`

> [!NOTE]  
>`graph-ja` をdesktop 用とmobile 用に分けて同じ設定ファイル内に2回記述している場合、初回の `install --from-config` で同じリポジトリを2回インストールしようとして、2件目に `already exists` と表示されることがあります。  
> 1件目のインストールが成功していれば、`npx quartz plugin list` で `graph-ja` が登録されていることを確認します。

4. インストール状態を確認する
	 - インストールされているプラグインの表示 → `npx quartz plugin list`
	 - `graph` が無いことを確認
	 - `graph-ja` があることを確認

5. 動作を確認する
	- ローカルサーバーを起動 → `npx quartz build --serve`
	- `http://localhost:8080` を開く
	- グラフビューで、日本語ファイル名のノートが正しく接続されていることを確認
	- ノードをマウスオーバーし、日本語のノート名が正しく表示されることを確認
	- Gitでcommit / pushし、公開サイトでも動作を確認
