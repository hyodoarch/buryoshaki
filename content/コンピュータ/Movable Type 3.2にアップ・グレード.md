---
title: Movable Type 3.2にアップ・グレード
date: 2005-12-09
modified: 2005-12-09
draft: false
categories:
  - コンピュータ
tags:
  - コンピュータ
  - MovableType
old_url: https://www.hyodo-arch.com/buryoshaki/archives/120
wordpress_id: 120
---

![1123-c03.jpg](/images/2005/1209-f022_12.jpg)

ここ2日間ほど、50件を超えるスパムコメントに見舞われたので、スパム対策を講じる必要が出てきました。そこで、ブログ構築ソフト Movable Type を3.17-jaから3.2-ja-2にアップ・グレードしました。

アップ・グレードの手順の覚書をしておきます。私のサーバは XREA です。

1. mt-config.cgi-originalをmt-config.cgiにリネーム
2. mt-config.cgiの内容を下記のように変更
   28行目　CGIPath https://www.hyodo-arch.com/cgi-bin/
   70行目　DataSource ./db
   93行目　StaticWebPath https://www.hyodo-arch.com/mt-static/
   100行目　HelpURL https://www.hyodo-arch.com/mt-static/docs/
3. アップロード
   ディレクトリ mt-static を /public\_html/ にアップロード
   その他のファイル＆ディレクトリを /public\_html/cgi-bin にアップロード
4. システム・チェック
   https://www.hyodo-arch.com/cgi-bin/mt-check.cgiを実行
5. セットアップ・プログラムを実行
   https://www.hyodo-arch.com/cgi-bin/index.htmlを実行

以上で、アップ・グレード終了です。

現在の不具合は、サイトの再構築ができない場合が多いこと、ヘルプ・ファイルが開けないことです。それら以外は問題ないようです。

### 参照記事

> 黍若日記「Movable Type 3.2-ja XREAでのバージョンアップ」
> Movable Type 3.2 導入手順

どちらも非常にわかりやすい素晴らしい記事です。

### 今日の写真
コスモスです。しばらくは気ままに写真を載せます。シリーズ写真は考えてあるのですが、マニアックな内容のため、発表を躊躇っております。

#### 追記　12月29日
Movable Type 3.2 にすることにより、スパム対策は講じられましたが、サイトの再構築やトラックバック送信がが出来なくなるなどの新たな問題が発生しました。どうやらデータベース設定が BerkeleyDB だとサーバによっては動作しないことがあるようです。で、SQLiteに変更しました。変換スクリプトを使用すると簡単にできます。

1. cgi-bin 内にディレクトリ sqlite を作成
2. mt-db-convert.cgiを起動
3. Source DB Configuration は何もしない。（DataSource と ObjectDriver が自動入力されている）
4. Destination DB Configuration でObjectDriverにSQLite、cgi-bin/sqlite/db.dat を入力し、Convert ボタンを押す。
5. コンバート処理が実行される。最後の行に、mt-config.cgi の記述方法が出るので、ウィンドウは閉じないでおくこと。
6. mt-config.cgi の書き換え。具体的には
   63行目　ObjectDriver DBI::sqlite
   64行目　Database /virtual/hyodo/public\_html/cgi-bin/sqlite/db.dat
   70行目　#DataSource ./db　　＞＞　#を付ける
7. mt-db-convert.cgiを消去

以上でSQLiteに変更され、問題は解決しました。

#### 更なる参照記事

> Ogawa::Memoranda　　mt-db-convert.cgi: MTデータベースの相互変換CGIスクリプト
> The blog of H.Fujimoto　　Movable Type 3.2アップグレードの際にBerkeley DBから他のデータベースに変える手順

どちらも非常に素晴らしいスクリプト＆記事です。
