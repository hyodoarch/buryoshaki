---
title: 【MODx】Dittoで子ドキュメントの概要を抽出する
date: 2010-01-05
modified: 2010-01-05
draft: false
categories:
  - コンピュータ
tags:
  - Ditto
  - MODx
old_url: https://www.hyodo-arch.com/buryoshaki/archives/180
wordpress_id: 180
---
ようやく Ditto も使えるようになってきました。以下ウェブサイト「[くらしの道具](https://www.kurashinodogu.jp/)」の「[作家・工房紹介　くらしの道具](https://www.kurashinodogu.jp/introduction/)」での Ditto のスニペット・コールの備忘録です。

## MODxのドキュメントツリー構成
![くらしの道具 MODxドキュメントツリー キャプチャ](/images/2010/FS_dogu_02.png)

## Ditto のスニペット・コール
次の記述で「作家・工房紹介」ドキュメントの子ドキュメントを抽出します。この1行のコードを「作家・工房紹介」ドキュメントに記述しておけば、子ドキュメント（各作家・工房の個別ドキュメント）のデータが増えても自動的に更新されます。

```
[!Ditto? &parents=`7` &randomize=`1` &tpl=`intro-box-1` &tplAlt=`intro-box-2`!]
```

## パラメータの説明
parents=`7`　･･････抽出する子ドキュメントの親ドキュメントid
randomize=`1`　･･････抽出する順序をランダムにする（作家さんの表示順序をランダムにする）
tpl=`intro-box-1`　･･････テンプレートを指定（チャンク intro-box-1 に記述）
tplAlt=`intro-box-2`　･･････交互に適用するテンプレートを指定（チャンク intro-box-2 に記述）
このケースでは、リストを下図のように2カラムで表示したかったので、tplAltパラメータが非常に役に立ちました。

![くらしの道具 ブロック図](/images/2010/FS_dogu_box-01.png)

## テンプレート・チャンク "intro-box-1"
```html
<div class="entry">
<div class="intro-box"><!-- ===== 作家・工房紹介リストボックス ===== -->
<div class="intro-img">
<p><a href="[~[+id+]~]">[+thumbnail+]</a></p>
</div>
<div class="intro-tx">
<h2><a href="[~[+id+]~]">[+pagetitle+]</a></h2>
<p>[+introtext+]</p>
</div>
</div><!-- ===== intro-box ===== -->
```

## テンプレート・チャンク "intro-box-2"
```html
<div class="intro-box"><!-- ===== 作家・工房紹介リストボックス ===== -->
<div class="intro-img">
<p><a href="[~[+id+]~]">[+thumbnail+]</a></p>
</div>
<div class="intro-tx">
<h2><a href="[~[+id+]~]">[+pagetitle+]</a></h2>
<p>[+introtext+]</p>
</div>
</div><!-- ===== intro-box ===== -->
</div><!-- ===== entry ===== -->
```

## プレイスホルダの説明
[~[+id+]~]　･･････Dittoで抽出したドキュメント（子ドキュメント）のURI
[+thumbnail+]　･･････Dittoで抽出したドキュメント（子ドキュメント）のサムネイル用カスタムテンプレート変数
[+pagetitle+]　･･････Dittoで抽出したドキュメント（子ドキュメント）のリソース名（タイトル）
[+introtext+]　･･････Dittoで抽出したドキュメント（子ドキュメント）の要約（序説）

## 出力されるhtmlコード
```html
<div class="entry">
<div class="intro-box"><!-- ===== 作家・工房紹介リストボックス ===== -->
<div class="intro-img">
<p><a href="web/introduction/intro-shuji.html"><img src="assets/images/artists/shuji-IMGP0649.jpg" alt="山田脩二サムネイル" /></a></p>
</div>
<div class="intro-tx">
<h2><a href="web/introduction/intro-shuji.html">山田脩二</a></h2>
<p>カメラマンから瓦師（カワラマン）になった人です。達磨窯を地元に復活させ、土を焼く。瓦の原土で焼かれた皿は、いぶし銀でカッコイイ。</p>
</div>
</div><!-- ===== intro-box ===== -->
<div class="intro-box"><!-- ===== 作家・工房紹介リストボックス ===== -->
<div class="intro-img">
<p><a href="web/introduction/intro-mayu.html"><img src="assets/images/artists/mayu-IMGP7624ic.jpg" alt="齋藤まゆサムネイル" /></a></p>
</div>
<div class="intro-tx">
<h2><a href="web/introduction/intro-mayu.html">齋藤まゆ</a></h2>
<p>やさしく、和やかな絵付け。様々な柄の組み合わせが彼女のスタイルをつくっています。食器や小物からインテリア、オブジェを制作しています。 </p>
</div>
</div><!-- ===== intro-box ===== -->
</div><!-- ===== entry ===== -->
```

以上です。この記事は下記のウェブを参考にさせていただきました。
[Let's enjoy MODx](http://modx.liolion.net/)･･････スニペット、モジュールの解説が大変充実しています。
[DAICHIFIVE「Dittoのプレースホルダ一覧」](http://blog.daichifive.com/archives/6)･･････MODxだけでなく、ウェブ全般のTipsが非常に役に立ちます。。
