---
title: AutoHotkey を利用したトーンダイヤラー
date: 2014-08-18
modified: 2014-10-24
draft: false
categories:
  - コンピュータ
tags:
  - AutoHotkey
old_url: https://www.hyodo-arch.com/buryoshaki/archives/1020
wordpress_id: 1020
---
[トーンダイヤラー](http://www.sophia-it.com/content/%E3%83%88%E3%83%BC%E3%83%B3%E3%83%80%E3%82%A4%E3%83%A4%E3%83%A9%E3%83%BC) 又は DTMF ダイヤラーというものをご存知だろうか？

プッシュホンの音（[DTMF](http://ja.wikipedia.org/wiki/DTMF)。ピ・ポ・パというやつ）で電話をかける機器やソフトウェアのことである。10年以上前、仕事で Mac OS 8 くらいを使っていた頃、トーン発信機能が付いている電話帳ソフトがあり使っていた。その後、独立して設計事務所を開いてからは、 PC 環境が Windows に変わり、携帯電話を使う機会が多くなったこともあって、必要性を感じなくなっていた。しかし、官公庁やメーカーに問合せたりするときは、通話時間が長くなる場合もあるので、固定電話から掛けたい。その時にホームページに記載されている電話番号の脇にボタンがあってクリックすると電話が掛けられると便利そうだ。Skype をインストールすると、ブラウザ上の電話番号表示がボタンに変わり、ワンクリックで SkypeOut 通話できるようになるが、このよう感じでトーン発信できるソフトウェアはないだろうか？

そんなことを考えながら、トーンダイヤラーできるソフトウェアを探してみると、今では皆無で、あっても発表時期がかなり古い。見つけたものを列記する。

- [ダイヤルパッド](http://www.toxsoft.com/dialpad/index.html) > 起動できなかった
- [DTMF Dial 1.0.0.14](http://www.softpedia.com/progDownload/DTMF-Dial-Download-36740.html) > 試していない
- [トーンダイヤル](http://www.vector.co.jp/soft/win95/net/se056763.html) > 試していない

上記ソフトウェアをインストールしようか？どうか？迷いながら、ソフトウェアとして独立している必要はないので、Chrome の拡張機能のようなものは無いか？と探したが、無かった。その昔、独立した機器として存在したらしく、シャープやカシオ、ソニーなどでも作っていたようだ。現在は作られていないらしい。しかし、少しは需要があるらしく、Android アプリでいくつか見つかった。

- ["tone dialer" での Google 画像検索結果](http://goo.gl/k2Dyit)
- ["dtmf" での Google Play の検索結果](http://goo.gl/2RGKrM)

実はスマホは所有していないので PC で使用できるソフトウェアが欲しいが、もし良いものがあったとしても電話帳を新たに作ったりするのは面倒だ。簡単なものでよいので、自分で作れないかとちょっと考えたり調べたりしてみた。

- プログラムするとした場合の流れは、(1)ブラウザなどのドキュメント上の電話番号（数字）を選択し、(2)ホットキーでダイアログを表示し、(3)OKボタンをクリックすると (4)トーン信号を発信する、という流れになりそうだ
- [AutoHotokey](http://www.autohotkey.com/) の GUI と サウンド関数で上記は簡単にできそうだ。
- トーン発信音は、[ソフトウエアDTMFコントローラ](http://www.vector.co.jp/soft/win95/net/se123346.html)というソフトで作成できる。

そこで、上記を実現する AHK スクリプトを作成した。使用方法は、PC のスクリーン上の電話番号を選択した状態でホットキーを押す。すると下図のようなダイアログが表示されるので、OK ボタンをクリックすると、ピ・ポ・パとトーン信号を発信する、それだけである。電話帳を作る必要もない。
![tonedial.ahk の GUI](/images/2014/tonedial.png)
ダウンロード > [tonedial.zip](https://www.hyodo-arch.com/buryoshaki/wp-content/uploads/arc/tonedial.zip)

中身を見ていただければわかるが、2 byte 数字も有効にしてある。しかし、選択文字が電話番号として成り立つか？は判定していない。私は、普段使用している AHK スクリプトに下記のようにインクルードし、ホットキーを Ctrl + Space キーにしている。
```
#Include tonedial.ahk		;tonedial.ahk の読み込み

^Space::tonedial(80)		;トーンダイアルのホットキー
```

AutoHotkey を導入している方が対象になりますが、興味がありましたらお試しください。下記に情報サイトを列記します。

- [AutoHotkey](https://www.autohotkey.com/) > 本家サイト
- [AutoHotkey Forums](http://www.autohotkey.com/board/) > 本家サイトフォーラム
- [流行らせるページ跡地](http://lukewarm.s101.xrea.com/) > 最初の有力な日本語解説サイトの跡地
- [AutoHotkeyJp](https://sites.google.com/site/autohotkeyjp/) > 流行らせるページを見やすくした日本語解説サイト
- 個人サイト

- [AutoHotKeyによるマウス/キーボード徹底カスタマイズ](http://neue.cc/2008/10/27_110.html)
- [AutoHotkeyサンプル集](http://autohotkey.blog.fc2.com/)
