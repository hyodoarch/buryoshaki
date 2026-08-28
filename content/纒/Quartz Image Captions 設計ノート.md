---
draft: true
---
以下をそのまま `DESIGN_NOTES.md` として保存できる形にまとめます。

````md
# Quartz Image Captions — Design Notes

## 1. この文書について

この文書は `quartz-image-captions` の制作経緯、設計方針、Quartz / Obsidian との関係、実装上の判断、既知の制約を記録するための開発メモである。

利用方法については `README.md`、バージョンごとの変更内容については `CHANGELOG.md` を参照する。

この文書では特に、

- なぜこのプラグインを制作したのか
- なぜ現在の実装方法になったのか
- Obsidian Image Captions と Quartz の違いをどのように吸収しているか
- プラグイン本体とサイト固有 CSS の役割をどのように分けているか

を残しておく。

---

## 2. 制作の経緯

### 2.1 Obsidian の画像キャプション

Obsidian では通常、画像を次のように埋め込む。

```md
![[image.jpg]]
````

画像幅も指定できる。

```md
![[image.jpg|405]]
```

しかし、画像の下にキャプションを表示する標準的な記法はない。

そこで Obsidian のコミュニティプラグイン **Image Captions** を導入した。

Image Captions では、例えば次のように記述できる。

```md
![[image.jpg|これはキャプションです]]
```

さらに、画像幅や配置指定も組み合わせられる。

```md
![[image.jpg|これはキャプションです|405]]
![[image.jpg|これはキャプションです|left|280]]
![[image.jpg|これはキャプションです|center|405]]
![[image.jpg|これはキャプションです|right|350]]
```

この記法は、画像ファイル名・キャプション・配置・幅を一つの Obsidian embed 内にまとめられるため、Markdown ノートとして扱いやすい。

---

## 3. Quartz 側で生じた問題

Obsidian の Image Captions を導入しても、その機能は Quartz には存在しない。

そのため、

```md
![[image.jpg|キャプション|right|350]]
```

と書いたノートを Quartz で公開しても、Obsidian と同じ `<figure>` / `<figcaption>` 構造にはならない。

当初は Quartz の `custom.scss` だけで、

```html
<p><img></p>
<p>キャプション</p>
```

のような構造を利用して、画像直後の段落をキャプションとして見せる方法を試した。

しかし、この方法には次の問題があった。

- 通常の段落とキャプションを HTML 構造上区別できない
    
- `<br>` の生成状況に影響される
    
- 画像幅によって段落の挙動が変わる
    
- left / right / center などの配置情報を扱いにくい
    
- Obsidian Image Captions の記法と Quartz の表示処理が分離してしまう
    
- CSS 側に過剰な推測処理が必要になる
    

そこで、CSS で見た目だけを模倣するのではなく、Quartz 用の Transformer Plugin として Image Captions の記法を解釈することにした。

---

## 4. 基本設計方針

最も重要な設計方針は、

> **Obsidian 側の Markdown 記法を変更せず、Quartz 側を Obsidian に合わせる**

ことである。

つまり、Obsidian で使用している、

```md
![[image.jpg|キャプション|right|350]]
```

を Quartz 用に別記法へ書き換えない。

一つの Markdown ファイルを、

- Obsidian で編集・閲覧
    
- Quartz で公開
    

の両方にそのまま使用できることを優先する。

---

## 5. 目標とする HTML

キャプション付き画像は、Quartz 上で概ね次のような HTML に変換する。

```html
<figure class="image-captions-figure image-captions-right">
  <img
    src="image.jpg"
    alt="これはキャプションです|right"
    width="350"
  >
  <figcaption class="image-captions-caption">
    これはキャプションです
  </figcaption>
</figure>
```

`<figure>` / `<figcaption>` を使用することで、画像とキャプションを一つの意味的な単位として扱う。

---

## 6. Quartz の処理との関係

現在の基本的な処理イメージは次の通りである。

```text
Markdown source
      │
      ▼
quartz-image-captions
textTransform()
      │
      ▼
Quartz Markdown parser
      │
      ▼
Obsidian Flavored Markdown
      │
      ▼
image node
      │
      ▼
Quartz HTML AST
      │
      ▼
quartz-image-captions
htmlPlugins()
      │
      ▼
<figure>
  <img>
  <figcaption>
</figure>
```

通常の画像キャプションについては、Obsidian Flavored Markdown が先に、

```md
![[image.jpg|caption|350]]
```

を image node に変換する。

その後 `quartz-image-captions` が image node の `alt`、`width`、`height` などを読み取り、必要に応じて `<figure>` に変換する。

推奨 order は現在次の通り。

```text
30  Obsidian Flavored Markdown
35  Quartz Image Captions
40  GitHub Flavored Markdown
```

---

## 7. キャプションの解析

### 7.1 基本キャプション

```md
![[image.jpg|ランドリー室。]]
```

キャプション：

```text
ランドリー室。
```

---

### 7.2 幅

```md
![[image.jpg|ランドリー室。|350]]
```

末尾の数値を画像幅として扱う。

```text
width = 350
```

幅指定部分は表示キャプションには含めない。

---

### 7.3 配置

現在対応している配置指定：

```text
left
center
right
```

例：

```md
![[image.jpg|ランドリー室。|left|280]]
```

解析結果：

```text
caption   = ランドリー室。
alignment = left
width     = 280
```

---

## 8. captionRegex

Obsidian Image Captions と同様に、キャプション抽出用の正規表現を指定できる。

現在、実運用では次を使用している。

```yaml
captionRegex: "^([^|]+)"
```

これにより、

```md
![[image.jpg|ランドリー室。|right|350]]
```

から表示用キャプションとして、

```text
ランドリー室。
```

のみを取り出す。

`right` や `350` は表示されない。

---

## 9. 画像の alt 属性について

表示キャプションから `left` / `right` などを除去しても、画像の `alt` には配置情報を残している。

例えば、

```html
<img alt="ランドリー室。|right">
```

のようになる場合がある。

これは Obsidian Image Captions の CSS 的な扱いとの互換性を維持し、配置判定にも利用できるようにするためである。

表示される `<figcaption>` には `captionRegex` 適用後の文字列を使用する。

---

## 10. 複数画像への対応

### 10.1 当初の仕様

初期版では、

```html
<p>
  <img>
</p>
```

のように、一つの段落内に画像が一つだけ存在する場合を対象としていた。

そのため、

```md
![[image1.jpg|Caption 1|left|280]]

![[image2.jpg|Caption 2|left|280]]
```

のように空行を入れれば動作したが、Obsidian 側では画像を横並びにしにくいという問題があった。

---

### 10.2 v0.2.0 の変更

現在は、空行なしで連続した画像にも対応している。

```md
![[image1.jpg|Caption 1|left|280]]
![[image2.jpg|Caption 2|left|280]]
```

Quartz がこれを同一 paragraph 内の複数 image node として生成しても、それぞれ個別の `<figure>` に変換する。

概念的には、

```html
<p>
  <img>
  <img>
</p>
```

から、

```html
<figure>...</figure>
<figure>...</figure>
```

へ変換する。

これによって、Obsidian と Quartz の両方で同一 Markdown を使い、複数画像を横並びにできる。

---

## 11. Markdown キャプション

キャプション内部では Markdown を使用できる。

例：

```md
![[image.jpg|これは **強調表示** を含むキャプションです]]
```

キャプション部分は `remark-parse` / `remark-gfm` / `remark-rehype` を用いて HTML 化する。

---

## 12. 外部リンク

### 12.1 問題

Image Captions 本来の記法では、キャプション内部に通常の Markdown Link を記述できる。

```md
![[image.jpg|[Wikipedia](https://example.com)]]
```

しかし Quartz の Obsidian Flavored Markdown 側では、wikilink alias 内部にある、

```text
[
]
```

が外側の、

```text
![[ ... ]]
```

の解析と衝突する。

その結果、

```md
![[image.jpg|Caption [Wikipedia](https://example.com)]]
```

全体が画像 embed として認識されず、Markdown ソースがそのまま本文に表示される問題が発生した。

---

### 12.2 解決方法

この問題を解決するため、`textTransform()` を追加した。

Quartz が Markdown AST を生成する前に、

```md
![[image.jpg|Caption [Wikipedia](https://example.com)|600]]
```

の alias 全体を一時的な安全な文字列へ変換する。

概念的には、

```text
Caption [Wikipedia](https://example.com)|600
```

を、

```text
__QIC_CAPTION_xxxxxxxxx_END__
```

のような文字列に保護する。

そのため Obsidian Flavored Markdown は、

```md
![[image.jpg|__QIC_CAPTION_xxxxxxxxx_END__]]
```

を通常の画像 embed として解析できる。

image node が生成された後、`quartz-image-captions` がこの一時文字列を元の alias に戻す。

その後、キャプション部分を Markdown として再解析する。

最終的には、

```html
<figcaption>
  Caption <a href="https://example.com">Wikipedia</a>
</figcaption>
```

となる。

---

## 13. 内部リンク

キャプション内部で通常の、

```md
[[Note]]
```

をそのまま使用すると、外側の、

```md
![[ ... ]]
```

と構文が衝突する。

そのため Image Captions 互換の記法として、

```text
<<Note>>
```

を使用する。

例：

```md
![[image.jpg|See <<Related Note>>]]
```

表示名を変える場合：

```md
![[image.jpg|See <<Related Note|this note>>]]
```

プラグイン内部で Markdown Link へ変換し、その後 Quartz のリンク処理に渡す。

---

## 14. ファイル名プレースホルダー

Image Captions と同様のプレースホルダーを扱う。

```md
![[image.jpg|%]]
```

表示：

```text
image
```

```md
![[image.jpg|%.%]]
```

表示：

```text
image.jpg
```

```md
![[image.jpg|\%]]
```

表示：

```text
%
```

---

## 15. キャプションなし画像

次のような通常画像は Image Captions の処理対象にしない。

```md
![[image.jpg]]
```

または、

```md
![[image.jpg|405]]
```

これらは Quartz 本来の画像表示を維持する。

これは、Image Captions を導入したことによって既存ノートの通常画像表示が変化することを避けるためである。

---

## 16. CSS の設計方針

### 16.1 プラグイン CSS

プラグインには基本表示用の CSS が含まれている。

主なクラス：

```text
.image-captions-figure
.image-captions-caption
.image-captions-left
.image-captions-center
.image-captions-right
```

プラグイン CSS は、Image Captions が単独でも基本的に動作できるための基準スタイルである。

---

### 16.2 サイト固有 CSS

実際のサイトの見た目については、Quartz サイト側の `custom.scss` で調整する。

これは意図的な設計である。

プラグインは、

> 画像キャプションをどのような構造・意味で扱うか

を担当する。

一方 `custom.scss` は、

> そのサイトでどのように見せるか

を担当する。

この二つを分離する。

---

## 17. 「無聊写記」での表示方針

現在「無聊写記」では、プラグイン本体とは別に `custom.scss` で次の調整をしている。

### figure

- 背景なし
    
- padding なし
    
- border-radius なし
    
- 画像幅に合わせた `fit-content`
    
- 最大幅は本文幅を超えない
    

### 画像

- `display: block`
    
- `max-width: 100%`
    
- `height: auto`
    
- margin / padding なし
    

### キャプション

- 14px
    
- ゴシック体
    
- `line-height: 1.6`
    
- 左揃え
    
- 背景なし
    
- padding なし
    

これらは `quartz-image-captions` の一般仕様ではなく、「無聊写記」のサイトデザインである。

---

## 18. 本文幅との関係

「無聊写記」の本文は一定の最大幅を持つ。

一方、Image Captions の `<figure>` を通常本文と同じ固定幅処理の対象にすると、350px の画像でも figure が本文幅いっぱいに広がる問題が生じた。

そこで、

```text
figure.image-captions-figure
```

を通常本文幅固定の対象から除外し、Image Captions 専用 CSS で幅を管理している。

基本方針：

```text
画像が小さい
→ figure も画像幅に合わせる

画像が大きい
→ figure は本文最大幅を超えない
```

---

## 19. left / right と本文位置

Quartz の article 領域は本文幅より広いため、単純に、

```css
float: left;
```

または、

```css
float: right;
```

だけを指定すると、本文の左右端ではなく article 全体の左右端を基準として配置される場合がある。

そのため「無聊写記」の `custom.scss` では、本文幅との差を利用して left / right の位置補正を行っている。

これはサイト固有処理であり、プラグイン本体には組み込まない。

---

## 20. 複数 float 画像

例えば、

```md
![[image1.jpg|Caption 1|left|280]]
![[image2.jpg|Caption 2|left|280]]
```

を横並びにするとき、2枚目にも「本文左端へ合わせる補正 margin」が入ると、右側の画像が本文幅を超えてしまう。

そこでサイト側 CSS では、

```scss
figure.image-captions-left + figure.image-captions-left {
  margin-left: 0;
}
```

のように、連続する2枚目以降の補正を解除している。

right についても同様の考え方を使用する。

---

## 21. 本文の回り込み

CSS の `float` 本来の挙動では、画像の横に後続本文が回り込む。

Quartz では当初、

```text
画像
      本文本文本文
      本文本文本文
```

という表示になった。

一方、Obsidian の実際の表示では、

- 小さい画像同士は横並びになる
    
- 通常本文が始まると、その本文は画像の横へ回り込まない
    

という挙動になっていた。

「無聊写記」では Obsidian の挙動に合わせることにした。

したがって、

```text
画像1  画像2

本文本文本文本文
本文本文本文本文
```

を基本とする。

この制御もプラグイン本体ではなく `custom.scss` で行う。

理由は、本文を画像横へ回り込ませたいサイトも存在し得るためである。

---

## 22. Obsidian と Quartz の DOM の違い

同じ Markdown でも、Obsidian と Quartz では DOM 構造が同一ではない。

Quartz では主に、

```html
<figure class="image-captions-figure image-captions-left">
  ...
</figure>
```

自体をレイアウト対象にできる。

一方 Obsidian では、外側に `.image-embed` などの wrapper が存在する。

そのため Obsidian の CSS では、

```css
.image-embed[alt*="|left"]
```

など、外側 wrapper を float させる必要がある。

つまり、

```text
Quartz
→ figure を float

Obsidian
→ image-embed を float
```

となる場合がある。

CSS コードそのものを完全に共通化することは難しいが、

> Markdown 記法と最終的な見た目を揃える

ことを優先する。

---

## 23. Obsidian と Quartz の役割

現在の目標は、

```text
同一 Markdown
      │
      ├── Obsidian
      │      ↓
      │   Image Captions
      │
      └── Quartz
             ↓
         quartz-image-captions
```

で、可能な限り同等の結果を得ることである。

完全に同一の DOM を作ることは目的ではない。

---

## 24. 現在のサポート範囲 — v0.2.0

v0.2.0 時点では主に次をサポートする。

- Obsidian-style image embed
    
- キャプション
    
- width
    
- height
    
- `left`
    
- `center`
    
- `right`
    
- captionRegex
    
- Filename placeholders
    
- Caption Markdown
    
- Caption 外部 Markdown Link
    
- `<<wikilink>>`
    
- 同一段落内の複数キャプション画像
    
- 連続画像の個別 `<figure>` 化
    
- Standard Markdown image
    

---

## 25. プラグインとサイト CSS の責任分担

### quartz-image-captions

担当するもの：

- Markdown / image metadata の解析
    
- キャプション抽出
    
- width / height
    
- alignment
    
- Markdown link 保護
    
- Markdown link 復元
    
- Caption Markdown
    
- `<figure>`
    
- `<figcaption>`
    
- 基本 CSS
    

### Quartz サイト側 custom.scss

担当するもの：

- 本文幅
    
- 画像の最大表示幅
    
- figure の配置位置
    
- キャプションのフォント
    
- キャプションの文字サイズ
    
- キャプションの text-align
    
- float 間隔
    
- 複数画像の横並び調整
    
- 本文の回り込み可否
    
- モバイル表示調整
    

この分離を維持する。

---

## 26. 実装上の原則

今後の変更についても、次の原則を維持する。

### 1. Obsidian の Markdown を変更しない

Quartz 固有記法をできるだけ作らない。

### 2. 既存画像を壊さない

キャプションなし画像は Quartz 本来の処理に任せる。

### 3. 構造とデザインを分離する

プラグインは意味構造を担当し、サイトの見た目は `custom.scss` に任せる。

### 4. Obsidian Image Captions との互換性を優先する

独自拡張を増やしすぎない。

### 5. 問題はできるだけ適切な処理段階で解決する

例：

```text
Markdown parser より前の問題
→ textTransform

image node 以降の問題
→ htmlPlugins

見た目の問題
→ CSS
```

---

## 27. テスト

現在、主要な Caption Parser に対して Vitest を使用している。

確認対象には次が含まれる。

- 基本 caption
    
- alignment
    
- captionRegex
    
- trailing width
    
- Filename placeholder
    
- escaped %
    
- caption wikilink
    
- 複数画像対応
    
- Markdown Link alias の保護
    
- 保護 alias の復元
    

機能を追加するときは、可能な限り対応するテストも追加する。

---

## 28. ビルド

開発時の基本確認：

```bash
npm test
npm run build
```

必要に応じて、

```bash
npm run check
```

も実行する。

Quartz Community Plugin は `dist/` を利用するため、ソース変更後は必ず build して生成物も commit する。

---

## 29. 更新手順

プラグイン側：

```bash
npm test
npm run build
git add -A
git commit -m "..."
git push
```

Quartz サイト側：

```bash
npx quartz plugin install --latest quartz-image-captions
```

その後、

```bash
npx quartz build --serve
```

でローカル確認する。

---

## 30. バージョン

現在：

```text
v0.2.0
```

### v0.1.0

初期実装。

主な機能：

- Caption
    
- width
    
- alignment
    
- Filename placeholder
    
- Caption Markdown
    
- `<<wikilink>>`
    

### v0.2.0

主な追加・改善：

- 同一段落内の複数キャプション画像
    
- 空行なしの連続画像
    
- 複数 `<figure>` への変換
    
- Caption 内 Markdown Link の保護・復元
    
- Obsidian / Quartz 間の実運用互換性改善
    

詳細は `CHANGELOG.md` を参照。

---

## 31. 今後の方針

現時点では、必要な基本機能が揃っている。

今後は先に機能を増やすのではなく、実際の Quartz サイトで使用しながら、

- Obsidian との表示差
    
- モバイル表示
    
- 特殊な Caption Markdown
    
- 複数画像
    
- left / center / right
    
- 長いキャプション
    
- 外部リンク
    
- 内部リンク
    

などで問題が発生した場合に対応する。

特にサイト固有の見た目の問題については、すぐにプラグイン本体へ機能追加せず、

> プラグインの責任なのか  
> サイト CSS の責任なのか

を切り分けて判断する。

---

## 32. 最終的な設計思想

`quartz-image-captions` の目的は、新しい Markdown 記法を作ることではない。

目的は、

> **Obsidian で書いた Image Captions の Markdown を、そのまま Quartz でも自然に公開できるようにすること**

である。

したがって、

```text
Obsidian を執筆環境
Quartz を公開環境
```

として利用しても、画像キャプションのためだけに Markdown を書き換える必要がない状態を目標とする。

プラグインはその二つの環境の差を吸収するための小さな互換レイヤーとして設計する。

```

一点だけ、この原稿を作っていて気づくところがあります。**README は英語、DESIGN_NOTES は日本語**という構成で問題ないと思います。README は第三者がリポジトリを見たときの説明、DESIGN_NOTES は今後こちらで改修するときの技術メモ、と役割が明確になります。
```