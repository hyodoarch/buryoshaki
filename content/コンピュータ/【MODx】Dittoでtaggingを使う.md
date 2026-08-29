---
title: 【MODx】Dittoでtaggingを使う
date: 2010-01-13
modified: 2010-10-19
draft: false
categories:
  - コンピュータ
tags:
  - Ditto
  - MODx
old_url: https://www.hyodo-arch.com/buryoshaki/archives/182
wordpress_id: 182
---

以下ウェブサイト「[くらしの道具](https://www.kurashinodogu.jp/)」の「[ぐい呑／くらしの道具](https://www.kurashinodogu.jp/dogutachi/category/guinomi/00.html)」など種類別作品ページの Ditto のスニペット・コールの備忘録です。同じフォルダ内の親ドキュメントのリソース名と一致するタグを、作家別ドキュメントから抽出します。
## MODxのドキュメントツリー構成
![くらしの道具 MODxドキュメントツリー キャプチャ](/images/2010/FS_dogu_04.png)
## メイン画像のDitto のスニペット・コール
次の記述でカレントドキュメントの親ドキュメント・タイトル名と一致するタグを、作家別作品ドキュメントから抽出します。JavaScriptを使用した方が簡単ですが、独立したページを出力するようにしたかったので、このようにしています。種類別作品ページは、リソース名とエイリアス以外は全て同じデータです。作家別作品ページが増減しても自動的に更新されます。

```
[!Ditto? &id=`main` &parents=`137` &depth=`2` &language=`japanese-utf8`
&extenders=`tagging` &tagData=`categoryUse` &tagDelimiter=`,`
&tags=`[[GetField? &parent=`1` &parentLevel=`1` &field=`pagetitle`]]`
&orderBy=`pagetitle ASC` &start=`[*pagetitle*]` &total=`1` &tpl=`doguByCategoryMain`!]
```

## パラメータの説明
parents=`137`　･･････取得したいドキュメントフォルダ id
depth=`2　･･････取得する階層の深さ。
language=`japanese-utf8` 　･･････日本語ファイルを使用
extenders=`tagging` 　･･････タギングを使えるようにする
tagData=`categoryUse` 　･･････タグに使うカスタムフィールドを指定
tagDelimiter=`,` 　･･････タグの区切り文字を指定
tags=`[[GetField? &parent=`1` &parentLevel=`1` &field=`pagetitle`]]` 　･･････親ドキュメントフォルダ名と一致するタグ（tagDataで指定したフィールドのタグ）を抽出。GetField スニペットはとても便利です。
orderBy=`pagetitle ASC`　･･････pagetitleを昇順にソート
start=`[\*pagetitle\*]`　･･････表示オフセット。抽出したドキュメントのn-1番目から表示する。
total=`1` 　･･････抽出したドキュメントを何件表示するか
start=`[\*pagetitle\*]`　･･････日本語ファイルを使用
tpl=`doguByCategoryMain`　･･････テンプレートを指定（チャンク doguByCategoryMain に記述）

## テンプレート・チャンク "doguByCategoryMain"
```html
<div class="medium-column"><!-- ===== 作品メイン画像 ===== -->
<p>[+workImage+]</p>
</div><!-- ===== medium-column ===== -->
<div class="medium-column"><!-- ===== 作家名、作品名、材質、寸法等 ===== -->
<table>
<tr><th class="tx-bottom">
<h1>[[GetField? &parent=`1` &parentLevel=`1` &field=`pagetitle`]]</h1>
</th></tr>
<tr><td class="tx-bottom">
<strong>[+workName+]／[+artistName+]</strong><br />
[+workMaterial+]<br />
[+workSize+]&nbsp;[+availability+]
</td></tr>
</table>
</div><!-- ===== medium-column ===== -->
```

## プレイスホルダの説明
[+workImage+]　･･････Dittoで抽出したドキュメントの画像用カスタムテンプレート変数を取得
[[GetField? &parent=`1` &parentLevel=`1` &field=`pagetitle`]]　･･････親ドキュメントのリソース名をGetField スニペットで取得
[+workName+]　･･････Dittoで抽出したドキュメントから作品名用カスタムテンプレート変数を取得
[+artistName+]　･･････Dittoで抽出したドキュメントから作家名用カスタムテンプレート変数を取得
[+workMaterial+]　･･････Dittoで抽出したドキュメントから材質用カスタムテンプレート変数を取得
[+workSize+]　･･････Dittoで抽出したドキュメントから寸法用カスタムテンプレート変数を取得
[+availability+]　･･････Dittoで抽出したドキュメントから在庫用カスタムテンプレート変数を取得

## 出力されるhtmlコード
```html
</div><!-- ===== medium-column ===== -->
<div class="medium-column"><!-- ===== 作家名、作品名、材質、寸法等 ===== -->
<table>
<tr><th class="tx-bottom">
<h1>ぐい呑</h1>
</th></tr>
<tr><td class="tx-bottom">
<strong>ぐい呑／奥の麻衣子</strong><br />
水目桜／拭漆　<br />
径7cm、高さ6cm&nbsp;
</td></tr>
</table>
</div><!-- ===== medium-column ===== -->
```

メイン画像部分は以上です。次にサムネイル画像部分の説明です。

## サムネイル画像のDitto のスニペット・コール
種類別タグに一致するサムネイル画像を抽出するのは、ちょっと複雑です。Dittoを入れ子にして解決しました。最初のDitto コールでカレントドキュメントと同じフォルダ内のドキュメントを抽出し、URI を利用します。次に、ネストするDitto コールで、親ドキュメント・タイトル名と一致するタグを、作家別作品ドキュメントから抽出します。

## 最初のDitto のスニペット・コール
```
[!Ditto? &id=`thumbnailUse` &parents=`[*parent*]` &depth=`1`
&orderBy=`pagetitle ASC` &tpl=`doguByCategoryWorkList`!]
```

## 最初のDitto のパラメータの説明
parents=`[\*parent\*]`　･･････親ドキュメント idを取得
depth=`1`　･･････取得する階層の深さ。
orderBy=`pagetitle ASC`　･･････pagetitleを昇順にソート
tpl=`doguByCategoryWorkList`　･･････テンプレートを指定（チャンク doguByCategoryWorkList に記述）

## テンプレート・チャンク "doguByCategoryWorkList"
```html
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="[~[+id+]~]">
[[Ditto? &id=`thumbnailImg` &parents=`137` &depth=`2` &language=`japanese-utf8`
&extenders=`tagging` &tagData=`categoryUse` &tagDelimiter=`,`
&tags=`[[GetField? &parent=`1` &parentLevel=`1` &field=`pagetitle`]]`
&orderBy=`pagetitle ASC` &start=`[+pagetitle+]` &total=`1` &tpl=`doguThumbnailUseImg`]]
</a></h6>
</div><!-- ===== thumbnail ===== -->
```

## プレイスホルダ　及び　ネストするDittoのパラメータの説明
[~[+id+]~]　･･････最初のDittoで抽出したドキュメントのURI
Dittoのパラメータは、idとtpl以外は、メイン画像のコールと同じです。

## ネストしたテンプレート・チャンク "doguThumbnailUseImg"
```
[+workImage+]
```
[+workImage+]　･･････Dittoで抽出したドキュメントの画像用カスタムテンプレート変数を取得

## 出力されるhtmlコード
```html
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/category/guinomi/00.html">
<img src="assets/images/dogu/okuno-IMGP0427.jpg" alt="  画像" />
</a></h6>
</div><!-- ===== thumbnail ===== -->
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/category/guinomi/01.html">
<img src="assets/images/dogu/okuno-IMGP0430.jpg" alt="  画像" />
</a></h6>
</div><!-- ===== thumbnail ===== -->
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/category/guinomi/02.html">
<img src="assets/images/dogu/okuno-IMGP0431.jpg" alt="  画像" />
</a></h6>
</div><!-- ===== thumbnail ===== -->
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/category/guinomi/03.html">
<img src="assets/images/dogu/okuno-IMGP0435.jpg" alt="  画像" />
</a></h6>
</div><!-- ===== thumbnail ===== -->
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/category/guinomi/04.html">
<img src="assets/images/dogu/okuno-IMGP0432.jpg" alt="  画像" />
</a></h6>
</div><!-- ===== thumbnail ===== -->
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/category/guinomi/05.html">
</a></h6>
</div><!-- ===== thumbnail ===== -->
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/category/guinomi/06.html">
</a></h6>
</div><!-- ===== thumbnail ===== -->
```

サムネイル画像部分は以上です。h6タグは適切な使い方ではありませんが、その辺は見逃してください(笑)。又、同じタグの総数が15以下の場合は、html出力をご覧いただけるとお分かりのように、タグ不足分だけimgタグが出力されず空になります。リンクだけが存在し、それが画面に表れないのは良いことではありません。他にやり方があるのでしょうが、今のところ僕にとってはこれが自動化の限界です。気になる場合は、非公開にすればいいかな、と思っています。

この記事は下記のウェブを参考にさせていただきました。
[Let's enjoy MODx](http://modx.liolion.net/)･･････スニペット、モジュールの解説が大変充実しています。
[ウェブ屋のCMS→modxヒキダス流（備忘録）／Dittoのタギング（tagging）をフィルター代わりに使う](http://d.hatena.ne.jp/hikidas_ikeda/20090517/1242521866)･･････MODxを使っているウェブ制作会社のブログです。役に立つ記事が満載です。
