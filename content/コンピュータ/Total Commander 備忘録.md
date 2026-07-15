---
title: Total Commander 備忘録
date: '2014-08-18'
modified: '2014-10-23'
draft: false
categories:
- コンピュータ
tags:
- Total Commander
- ファイルマネージャ
old_url: https://www.hyodo-arch.com/buryoshaki/archives/979
wordpress_id: 979
---

![tc-ss](/images/2014/tc-ss1.png)
昨年の 1月より、Windows 環境の[ファイルマネージャ](http://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3)に [Total Commander](http://www.ghisler.com/) を使っている。使用開始時のバージョンは、8.01 で、今年の 4月に 8.51a がリリースされていたので、盆休みにアップデートした。
ファイルマネージャは、PC 上での作業をする際、全ての入口となる重要なアプリケーションである。Total Commander 使い始めて 1年半になるが、使いやすく気に入っている。たまに他人の PC などを使って [Windows Explorer](http://ja.wikipedia.org/wiki/Windows_Explorer) で作業しなければならないときなど、ファイル操作が煩わしくて死ぬかと思うほどである。どうして以前は Windows 標準のエクスプローラなんか使っていられたのだろうか？これまでの経緯と考察、設定の備忘録を残しておくことにする。

### Win 標準のエクスプローラは効率が悪いことに気が付いた
コピーや移動のたびに複数の Windows 標準のエクスプローラを開く行為は、かなり面倒だ。またエクスプローラを起動するたびに、作業フォルダにアクセスするのも面倒。もちろん「お気に入り」に登録しておけば、すぐにアクセスできるが、サイドバーが「お気に入り」であふれて使い難くなる。
ファイル管理は、もっとも基本的な操作である。それを「面倒だ」感じるということは、きっと効率が悪いのであろう。プライベートでも仕事でもかなり無駄な時間を使っているに違いない。

### タブ切替え 2ペインのファイルマネージャ
ウェブブラウザのようにタブで作業フォルダを切り替えられると便利かも・・・・SFTPクライアントの [WinSCP](http://winscp.net/eng/docs/lang:jp) の外観は、ローカルとリモートが比較しやすいように 2ペインを選択できるようになっているが、ファイルマネージャも同じような外観になっていると使いやすいだろうなぁ・・・・と思いながらタブ切替え 2ペインのファイルマネージャ探してみたところ、いくつか見つかった。

- [Windows Double Explorer](http://wde.codeplex.com/)
- [xplorer2](http://zabkat.com/index.htm)
- [CubicExplorer](http://www.cubicreality.com/ce/)
- [Vector の「各種ファイラ」カテゴリー](http://www.vector.co.jp/vpack/filearea/win/util/file/filer/)
- [Total Commander](http://www.ghisler.com/)

どれも初めて知る名前のアプリケーションばかりだった。ファイルマネージャは、現在ではあまり注目されない分野かもしれない。しかしマニアックで機能豊富なソフトウェアが多いことも分かった。
上記のリストのファイルマネージャをいくつか使ってみた。最終的に、海外のシェアウェアだが一番歴史が古い、Total Commander を使うことにした。決め手は、

- [日本語化キット](http://www.ghisler.com/languages.htm)、[日本語チュートリアル](http://www.ghisler.com/tutorials_jp/beginners.htm)が用意されている
- カスタマイズの自由度
- プラグインが豊富

### Total Commander の設定
#### ― インストール ―
[Download Total Commander 8.51a final](http://www.ghisler.com/amazons3.php) から、インストーラをダウンロード。8.01 までは、32bit バージョンを使用していたが、今回から 64bit バージョンを使ってみることにする。インストール方法は、ダウンロードしたインストーラをダブルクリックする。

私は、事務所と自宅の PC 環境を揃えているので、Dropbox にインストールした。しかしながらユーザデータのロケーションは、標準の

```
c:\Users\username\AppData\Roaming\GHISLER\
```

に設定している。また、[Installer for USB sticks](http://www.ghisler.com/usbinst.htm) というページに USB メモリにインストールする方法がある。

#### ― 日本語化 ―
標準のインストーラでは、日本語は含まれていないので、別途日本語化キットが必要になる。[Additional languages](http://www.ghisler.com/languages.htm) より Japanese をダウンロードする。ファイル名は、"wcmd\_jpn.zip"である。Total Commander を起動し、"wcmd\_jpn.zip"を選択後ダブルクリック又は Enter キーを押すと、日本語化キットが自動的にインストールされ、メニューやオプションの設定項目が日本語になる。
日本語チュートリアルが公式サイトにある。

- [Total Commander - Tutorials - 日本語版入門編](http://www.ghisler.com/tutorials_jp/beginners.htm)
- [Total Commander - Tutorials - 日本語版上級編](http://www.ghisler.com/tutorials_jp/advanced.htm)

#### ― SFTP の設定 ―
プラグインの追加で SFTP 接続ができる。普段は WinSCP を使わなくても良い。Pageant も使える。
[File system extensions (plugins)](http://www.ghisler.com/plugins.htm#filesys) より SFTP をダウンロードする。ファイル名は、"sftpplug.zip"である。Total Commander を起動し、"sftpplug.zip"を選択後ダブルクリック又は Enter キーを押すと、自動的にインストールされる。
次に別途 SSL 関連の DLL ファイルを下記より入手する。

- 入手先 > [cURL - Download](http://curl.haxx.se/download.html#Win64MinGW64)
- 必要ファイル > MinGW64 7.34.0 devel SSL SSH Günter Knauf 2.18 MB
- ファイル名 > curl-7.34.0-devel-mingw64.7z

上記のファイルをダブルクリック又は Enter キーを押すと、解凍せずにアーカイブファイル内を閲覧することができる。（8.01 の 32bit 版では、7z 用のプラグインが必要だったはずだが、8.51 の 64bit 版では、7z 用のプラグイン無しで解凍できた。）curl-7.34.0-devel-mingw64.7z\bin 内より下記 DLL ファイルを Total Commander のプログラムフォルダ \totalcmd\plugins\wfx\sftpplug にコピーする。

- libeay32.dll
- libssh2.dll
- zlib1.dll

使い方は、カレントディレクトリの表示欄に下記のように打ち込むと、SFTP 接続モードになる。

```
\\\Secure FTP\
```

F7 キーで新規接続先を追加、Alt+Enter で接続先情報編集、ダブルクリック又は Enter キーで接続である。Pageant を使用しての鍵認証に対応している。

#### ― 便利な使い方 ―
タブ切替え、2ペインであること自体が、とにかく便利である。私の場合、下記のような点や機能が便利に思っている。

- ボタンバーにコントロールパネルや、デスクトップ、スタートアップフォルダを登録
- エディターなど、よく使うアプリケーションの登録
- プロジェクト毎のアイコンを作成し、ボタンバーにフォルダを登録
- ファイルの複数リネームで置換や連番を付けたりするとき
- ファンクション・キーでの画像やテキストの表示やファイル操作
- パス名を含めた名前をクリップボードへ
- などなど

コントロールパネルのコマンドは、
```
control
```

プログラムの起動のコマンドは、EmEditor の場合
```
"C:\Program Files\EmEditor\EmEditor.exe"
```

フォルダー表示のコマンドは、デスクトップ の場合
```
cd c:\users\username\desktop\
```

ルート表示のコマンドは、
```
cm_OpenDrives
```

SFTP 接続のコマンドは、RaspberryPi に接続の場合、
```
cd \\\Secure FTP\RaspberryPi\
```

#### ― シェアウェア ―
Total Commander はシェアウェアである。価格は、US$44 もする。しかし、Windows がある限り使い続けることを考えれば、Office や Adobe CS を購入するよりずっと確実な買い物であると思う。Paypal での支払いが可能だ。メールや Fax での購入にも対応してくれるようだ。
購入後、ライセンス・キーがすぐにメールで送られてくる。また、プログラムの入った CD-ROM が郵送で届く。なぜこんなレガシーなサービスがあるのだろうか？と思ったが、OS の新規インストールや PC のメンテナンス等でネットに接続されていない環境で必要なときがあるだろうから、そのためのサービスなのだろう。
ちなみにライセンス・キーが無くても使用できる。キーが無いと、起動時に購入を促すウィンドウが表示される。
ホームページは非常に簡素で、レガシーで、スクリーンショットも無いのだが、それが好ましく感じる。

#### ― Android 版 ―
Android 版があり、こちらも愛用している。LAN や SFTP プラグインがあるので、LAN 内のファイル操作、SFTP 接続も可能だ。Android 版はフリーである。

### 最後に
この記事を書くために、ファイルマネージャについていろいろと調べていたところ、MS-DOS 時代に愛用していた FILMTN と、元祖ファイルマネージャといわれる Noton Commander クローンが、現在も開発され続けていることを知って驚愕した。と同時に DOS 時代のファイルマネージャは使いやすく、カスタマイズもしやすかったことを思い出した。

- [WinFM2008](http://homepage2.nifty.com/NYanagi/WinFM2000.html) > FILMTN のWindows 版後継ファイルマネージャ。シェアウェア
- [Far Manager](http://farmanager.com/index.php?l=en) > Noton Commander クローン。SFTP 接続用のプラグインもある。
