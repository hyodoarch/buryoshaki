---
draft: true
---
## ToDo
- Image Captions は2～4段組みを可能にしたい。
	- [x] Obsidian のプラグインが作れるか？ → Image Grid を参考にするのがよさそう。
	- [x] Quartz はできそう。
	- [x] 実装をどうするか？段組み用パラメータを付加するか？


```markdown
```image-grid 3
![[image01.jpg|キャプション1]]
![[image02.jpg|キャプション2]]
![[image03.jpg|キャプション3]]
```

- [ ] graph は utils 0.1.0 → 0.1.1 にするだけで日本語問題が解決するかも。
- Minimal Theme を使い続けるか？
	- [ ] Dragger と干渉する。
	- [ ] 外観をデフォルトにする。
	- [ ] CSSスニペットを自宅PCから持ってくる。
		- [ ] 本文行間
		- [ ] Image Captions
- [x] マーメイドのテキストが、margin-bottom を小さくする。canvasと同様の設定にできないか？
- [x] footer が寂しいよね。
-  blog.hyodo-arch.com が google に"兵藤事務所" と認識されているようだ。
	- [x] トップページの `canonical` を `/index` → `/`
	- [x] `WebSite` JSON-LD をトップページに追加して、`name: "無聊写記"` を明示
	- [x] トップページ `<title>` を「無聊写記」または「無聊写記｜ようこそ」にする
	- [x] `og:site_name` を `name=` → `property=` にする
	- [x] フォルダにindex.mdを作成し、description プロパティを付ける。
- 日本語タイトルとpermanent link について下記の方針とする。（2026-09-01）
	- [x] ノート名由来のURLを継続することに決定
	- [x] permalink は、ノート名を変更する可能性がある場合に使う
	- [x] title プロパティは廃止する。
- [x] 404ページに「最近のノート」または「おすすめのノート」を載せる。
- [x] Link カードプラグインのようにリスト表示させると華やかかも。
- Explorer を使いやすく
	- [x] カレントノートの色を変える。
	- [x] カレントノートを開いたときにスクロールしないようにする。

## カテゴリー左にアイコンがあると良い。 ≫ 完了
- VectorScript ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/code)
- アート ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/shapes)
- コンピュータ ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/display)
- 映画 ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/film)
- 音楽 ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/headphones)
- 建築 ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/house-chimney-window)
- 告知 ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/message)
- 雑記 ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/paper-plane)
- 写真 ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/camera)
- 本 ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/book)
- 料理 ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/utensils)
- 無聊写記について ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/comment)
- おすすめのノート ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/star)
- プロフィール ≫ [Font Awesome](https://fontawesome.com/icons/classic/solid/heart)

