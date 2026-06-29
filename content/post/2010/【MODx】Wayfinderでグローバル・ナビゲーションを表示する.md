---
title: 【MODx】Wayfinderでグローバル・ナビゲーションを表示する
date: '2010-01-03'
modified: '2010-01-03'
draft: false
categories:
- コンピュータ
tags:
- MODx
- Wayfinder
old_url: https://www.hyodo-arch.com/buryoshaki/archives/179
wordpress_id: 179
---

昨秋、妻のショップのウェブ制作に[MODx](http://modxcms-jp.com/)というCMSを導入しました。概念がわかりやすいので、HTMLとCSSが使える人ならば、チャンク（再利用する部分などをパーツ化したもの）やテンプレート変数（MTで言うところのカスタムフィールド）を使うだけでも効率よくウェブ制作できるのではないかと思います。

最近ようやくスニペットやプラグインを使えるようになってきました。この記事では、Wayfinder の使い方を備忘録としてまとめます。

実際の制作したウェブはこちら･･････[くらしの道具](https://www.hyodo-arch.com/dogu/)

**MODxのドキュメントツリー構成**

![くらしの道具 MODxドキュメントツリー キャプチャ](/images/2010/FS_dogu_01.png)

**グローバル・ナビゲーション部分のチャンク・コード**

```
<div id="global-navi"><!-- +++++ グローバル・ナビ +++++ -->
[[Wayfinder?startId=`8` &level=`1` &excludeDocs=`236,254` &hereClass=`current`]]
</div><!-- +++++ global-navi +++++ -->
```

**パラメータの説明：**

**startId=`8`**　･･････リストアップする親ドキュメントのid
**level=`1`**　･･････リストアップする階層の深さ
**hereClass=`current`**　･･････カレントドキュメントに挿入するクラス。デフォルトでは"active"挿入されますが、僕の習慣で"current"と指定しています。
**excludeDocs=`236,254`**　･･････リストアップから除外するドキュメントのid（404ページと閉鎖中ページ）

**出力されるhtmlコード**

```
<div id="global-navi"><!-- +++++ グローバル・ナビ +++++ -->
<ul><li class="current"><a href="https://www.hyodo-arch.com/dogu/" title="HOME" >HOME</a></li>
<li><a href="/dogu/web/kawaraban.html" title="かわら版" >かわら版</a></li>
<li><a href="/dogu/web/dogutachi.html" title="くらしの道具たち" >くらしの道具たち</a></li>
<li><a href="/dogu/web/introduction.html" title="作家・工房紹介" >作家・工房紹介</a></li>
<li class="last"><a href="/dogu/web/information.html" title="店舗案内" >店舗案内</a></li>
</ul>
</div><!-- +++++ global-navi +++++ -->
```

テンプレートにプレイスホルダを使ってチャンクを記述し、パラメータで指定すれば、様々な条件でリストアップすることができます。ここでは、デフォルトで十分でしたので、テンプレートは使用していません。

**グローバル・ナビゲーション部分のCSS**

```
/* +++++++++++++++ ヘッダー（グローバルナビ部分） +++++++++++++++ */
#global-navi	{clear: both;}
#global-navi ul {
margin: 0px 0px 0px 5px;
padding: 0;
list-style-type: none;
list-style-position: outside;
}
#global-navi li {
display: inline;
padding: 0px 10px 0px 0px;
font: bold 11pt Arial,sans-serif;
}
#global-navi a	{
color: #aaaaaa;
text-decoration: none;
}
#global-navi li.current>a {color: #555555;}
#global-navi a:hover	{color: #ff8c00;}
```

CSSのポイントは、li タグをインラインとし、a タグの色をカレントとカレント以外を分けて指定することだけです。背景などを使ってタブのイメージも入れていないので、ただ横方向にグローバル・ナビゲーションのテキストがリストアップされるだけのシンプルなものですが、カレントドキュメントを濃いグレーで、カレント以外を薄いグレーで表示させることが、このスニペット・コール1行で済ませられ、且つ複数のドキュメントで共用できるため、非常にメンテナンス性が良いです。ちなみにこのブログ「無聊写記」のグローバル・ナビゲーション（ブログ、フォト、ブックス、フリマ、プロフィール）は、各々のタブ（５種類）を作っているので、効率が悪いです(笑)

この記事は下記のウェブを参考にさせていただきました。
[Let's enjoy MODx](http://modx.liolion.net/)･･････スニペット、モジュールの解説が大変充実しています。
