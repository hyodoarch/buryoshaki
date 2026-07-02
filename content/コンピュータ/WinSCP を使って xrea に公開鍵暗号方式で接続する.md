---
title: WinSCP を使って xrea に公開鍵暗号方式で接続する
date: '2009-09-21'
modified: '2009-09-21'
draft: false
categories:
- コンピュータ
tags:
- WinSCP
- xrea
old_url: https://www.hyodo-arch.com/buryoshaki/archives/175
wordpress_id: 175
---

僕はレンタルサーバ（xrea）とのファイル転送に、SFTP通信ができる [WinSCP](http://winscp.net/eng/docs/lang:jp) を使用している。この数カ月ほどWinSCPを立ち上げたときにバージョン 4.19が利用できる旨のメッセージが出ていたので、先日なんとなくバージョンアップした。バージョンアップはインストーラで自動的に行ってくれるので、設定ファイルをバックアップしたり、以前のバージョンをアンインストールしたりすることなく行えた。そしてなんとなくWinSCPのヘルプを読んでいると、以前より気になっていた、[公開鍵暗号方式](http://ja.wikipedia.org/wiki/%E5%85%AC%E9%96%8B%E9%8D%B5%E6%9A%97%E5%8F%B7#.E5.AE.9F.E9.9A.9B.E3.81.AE.E4.BD.BF.E3.82.8F.E3.82.8C.E6.96.B9)つまり公開鍵と秘密鍵による認証について、xreaでもどうやらできることが分かった。以下手順の備忘録。

**xreaサーバとのSFTP通信**

1. xreaのコントロールパネルにアクセスして、管理メニュー＞ホスト情報登録＞SSH登録ボタンを押す。
2. WinSCPのログイン設定のプロトコルをSFTPを選択、SCP代替システムにチェックを入れる。

ここまでは半年ほど前にFFFTPからWinSCPに乗り換えたときをすぐにできた。次の記述が今回できるようになったこと。大学や研究所のサーバを利用する人にとっては当たり前のことのようである。

**まずPuTTYjpの入手とインストール**
公開鍵と秘密鍵による認証は、PuTTYというターミナルエミュレータが別途必要となる。日本語を入力・表示するには、hdkさん作成の[PuTTYjp](http://hp.vector.co.jp/authors/VA024651/PuTTYkj.html)という非公式パッチをダウンロードし、WinSPCのプログラム本体が入っているフォルダにあるPuTTYフォルダに展開する。さらに環境設定＞アプリケーション＞PuTTYのパスに "puttyjp.exe" を参照させる。

ここから先は「[XREAでも暗号化SFTPサーバーを利用しよう](http://www.fs4y.com/modules/pukiwiki1/114.html?language=ja)」を参照した。詳しい手順が掲載されているので、読まれることをおススメする。以下に手順の概要を記す。

**xrea に公開鍵暗号方式で接続する**

1. PuTTYgenを立ち上げ、公開鍵・秘密鍵の生成し、パスフレーズを登録し、保存する。
2. WinSCPからxreaのユーザ・ディレクトリに ".ssh" ディレクトリを作成する。
3. ".ssh" ディレクトリに "authorized\_keys" という名称のファイルを作成し、PuTTYgenで生成した公開鍵(Public key for･･･欄)をコピペする。
4. Pageantを立ち上げ、"Add Key"ボタンを押し、ppkファイル（先ほどPuTTYgenで生成した公開鍵・秘密鍵ファイル。パスフレーズを求められる）を登録する。ショートカットを作成しておくと便利。
5. WinSCPログインのセッションのパスワード欄を空欄にし(xrea発行のパスワードは使用しない）、秘密鍵欄にはppkファイルを参照させる。
6. WinSCPでログインする。

以上で、公開鍵と秘密鍵による認証によるSFTP通信ができるようになりました。

---

## 旧ブログのコメント

> WordPress時代の承認済みコメントを、記録として移行しています。

### **Speakerxvs** — 2025-04-12

> 55 thousand Greek 30 thousand Armenian

### **Brettevits** — 2026-01-28

> Data-Leaks – The Largest Dark Web Leak Database Ever Built Your leaked data is not gone — its being traded in telegram leaked database dumps data leak github files and countless leaks online. Data-Leaks uncovers them instantly. Search 33B stolen passwords and 50M new leaks daily including known passwords from breach dumps and discord data leak archives no one else tracks. Run a free dark web check detect credential reuse and monitor personal information data breach risks — all in seconds. Full access is just 2 — scan deeper download verified leak data and stay ahead of hackers. Reveal the Truth: Data leak github
