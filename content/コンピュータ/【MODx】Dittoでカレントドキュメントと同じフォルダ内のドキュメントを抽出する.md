---
title: 【MODx】Dittoでカレントドキュメントと同じフォルダ内のドキュメントを抽出する
date: 2010-01-07
modified: 2010-01-07
draft: false
categories:
  - コンピュータ
tags:
  - Ditto
  - MODx
old_url: https://www.hyodo-arch.com/buryoshaki/archives/181
wordpress_id: 181
---
以下ウェブサイト「[くらしの道具](https://www.kurashinodogu.jp/)」の「[土井善男／緑白釉七寸半皿　くらしの道具](https://www.kurashinodogu.jp/dogutachi/artist/doi/01.html)」さんをはじめとする各作家・工房別作品ページの Ditto のスニペット・コールの備忘録です。同じフォルダ内のドキュメントの作品サムネイルとリンクを取得します。

## MODxのドキュメントツリー構成
![くらしの道具 MODxドキュメントツリー キャプチャ](/images/2010/FS_dogu_03.png)

## Ditto のスニペット・コール
次の記述でカレントドキュメントのと同じフォルダ内のドキュメントを抽出します。この1行のコードをカレントドキュメントに記述しておけば、作品ページ・ドキュメントのデータを増やしても自動的に更新されます。

```
[!Ditto? &id=`thumbnail` &parents=`[*parent*]` &depth=`1` &orderBy=`pagetitle ASC` &tpl=`doguByArtistWorkList`!]
```

## パラメータの説明
parents=`[\*parent\*]　･･････カレントドキュメントの親ドキュメント id を取得
depth=`1`　･･････取得する階層の深さ。デフォルトが `1` なので記述しなくてもOKです
orderBy=`pagetitle ASC`　･･････pagetitleを昇順にソート
tpl=`doguByArtistWorkList`　･･････テンプレートを指定（チャンク doguByArtistWorkList に記述）

## テンプレート・チャンク "doguByArtistWorkList"
```
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="[~[+id+]~]">[+workImage+]</a></h6>
</div><!-- ===== thumbnail ===== -->
```

## プレイスホルダの説明
[~[+id+]~]　･･････Dittoで抽出したドキュメントのURI
[+workImage+]　･･････Dittoで抽出したドキュメントのサムネイル用カスタムテンプレート変数

## 出力されるhtmlコード
```
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/artist/doi/01.html"><img src="assets/images/dogu/doi-IMGP1090.jpg" alt="土井善男 白磁七寸皿 画像" /></a></h6>
</div><!-- ===== thumbnail ===== -->
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/artist/doi/02.html"><img src="assets/images/dogu/doi-IMGP1091.jpg" alt="土井善男 白磁七寸皿 画像" /></a></h6>
</div><!-- ===== thumbnail ===== -->
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/artist/doi/03.html"><img src="assets/images/dogu/doi-IMGP1092.jpg" alt="土井善男 白磁七寸皿 画像" /></a></h6>
</div><!-- ===== thumbnail ===== -->
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/artist/doi/04.html"><img src="assets/images/dogu/doi-IMGP1093.jpg" alt="土井善男 白磁七寸皿 画像" /></a></h6>
</div><!-- ===== thumbnail ===== -->
<div class="thumbnail"><!-- ===== サムネイル画像 ===== -->
<h6><a href="web/dogutachi/artist/doi/05.html"><img src="assets/images/dogu/doi-IMGP1094.jpg" alt="土井善男 白磁七寸皿 画像" /></a></h6>
</div><!-- ===== thumbnail ===== -->
```

以上です。この記事は下記のウェブを参考にさせていただきました。

[Let's enjoy MODx](http://modx.liolion.net/)･･････スニペット、モジュールの解説が大変充実しています。
[ウェブ屋のCMS→modxヒキダス流（備忘録）／DittoのorderByパラメータによる、複数フィールドを使った並べ替え（ソート）](http://d.hatena.ne.jp/hikidas_ikeda/20090528/1243501085)･･････MODxを使っているウェブ制作会社のブログです。役に立つ記事が満載です。
