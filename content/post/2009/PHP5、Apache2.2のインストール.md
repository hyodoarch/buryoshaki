---
title: PHP5、Apache2.2のインストール
date: '2009-02-08'
modified: '2009-02-08'
draft: false
categories:
- コンピュータ
tags:
- Apache
- PHP
old_url: https://www.hyodo-arch.com/buryoshaki/archives/160
wordpress_id: 160
---

なんとなくPHP5とApache2.2を自分のWindows XP環境で動かしてみたくなり、インストールすることにした。世の中にはPHPとApache、MySQL等をいっぺんにインストールできる便利なパッケージ"XAMPP"や"VertrigoServ"があるが、PHPやApache、MySQLそれぞれは独立したシステムであり、メージャーバージョンアップやセキュリティー対応等の修正版などは同時にリリースされるわけではないので、それぞれ個別に配布元のサイトからダウンロードし、インストールした。以下備忘録である。

**PHP5.2.8のインストール**

1. php.net から PHP5.2.8 zip package をダウンロードする。後で気がついたが、このzip パッケージには、PECL が付いていない。msi インストーラ版にはすべて付いているようなので、そっちの方が良いかも。
2. c:\phpを作成し、その中にzipファイルを展開する。c:\Program file 内にインストールしないのは、php.net のドキュメントによると、フォルダ名にスペースが含まれるパスへのインストールは非推奨となっていたからである。
3. 環境変数の Path を通す。設定方法は、コントロールパネルから
   > システム＞詳細設定タブ＞システム環境変数欄の Path を選択＞編集ボタンを押して ;c:\php を追記

   "ｃ" の前のセミコロン ";" を忘れないように。セミコロンは区切り文字である。再起動することにより有効となる。
4. php.ini の編集をする。セミコロンを消すと有効になる。

   拡張モジュールのディレクトリ設定

   ```
   extension_dir = "C:/php/ext"
   ```

   Webサーバーのドキュメントルートを設定

   ```
   doc_root = C:/Program Files/Apache Software Foundation/Apache2.2/htdocs
   ```

   日本語環境の設定をする。UTF-8が主流になってきたことを考えつつ、EUC-JPで書かれたスクリプトが多数あることも考慮して選択。

   ```
   default_charset = "UTF-8"
   extension=php_mbstring.dll
   mbstring.language = Japanese
   mbstring.internal_encoding = UTF-8
   mbstring.http_input = pass
   mbstring.http_output = pass
   mbstring.encoding_translation = Off
   mbstring.detect_order = UTF-8,SJIS,EUC-JP,JIS,ASCII
   mbstring.substitute_character = none;
   ```

**Apache 2.2.11 のインストール**

1. http://httpd.apache.org/ からWin32 Binary OpenSSL実装版インストーラ（サーバを公開する予定はないが・・・）をダウンロードしてインストール
2. confフォルダ内のhttpd.conf の編集Apache2.2用php5モジュールをロード。LoadModuleはアルファベット順に並んでいたので、それに倣うことにした。

   ```
   LoadModule php5_module "c:/php/php5apache2_2.dll"
   ```
3. phpを実行させるための記述をする。AddType application が記述されている後に追加。

   ```
   AddType application/x-httpd-php .php
   AddType application/x-httpd-php-source .phps
   ```
4. phpがApacheで作動するかのテストは以下のソースをtest.phpとでもいうファイル名でドキュメントルート\Apache2.2\htdocsに置く。

   ```
   <?php phpinfo(); ?>
   ```
5. ブラウザに "http://localhost/test.php" と入力し、phpinfoが表示されれば成功。うまくいかない場合は、php.ini , httpd.conf をもう一度見直した後、Apache をリスタートさせてからブラウザを再表示させる。

参考書籍：「まるごとPHP ! Vol.1」(インプレス)。
参考HP：[phpマニュアル](http://www.php.net/manual/ja/)、[Apache HTTP サーバ バージョン 2.2 ドキュメント](http://httpd.apache.org/docs/2.2/)、[PHPBOOK](http://www.phpbook.jp/index.html)
