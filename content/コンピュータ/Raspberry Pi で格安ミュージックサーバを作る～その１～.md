---
title: Raspberry Pi で格安ミュージックサーバを作る～その１～
date: '2013-12-17'
modified: '2014-10-24'
draft: false
categories:
- コンピュータ
- 音楽
tags:
- PCオーディオ
- Raspberry Pi
old_url: https://www.hyodo-arch.com/buryoshaki/archives/787
wordpress_id: 787
---

![格安ミュージックサーバ](/images/2013/Low-DSCN7848.jpg)
Raspberry Pi という ARM 系小型コンピュータの存在を先月に知った。一年半ほど前は結構話題になっていたらしい。とにかく安いので何をするかあまり考えず買ってみた。OS は、複数の Linux ディストリビューションを切り替えてブートできる NOOBS をインストールし GUI 環境で遊んでいたが、結局 Raspbian しか使ってない上に HDMI 入力端子のあるモニタが事務所に 1台しか無いこともあり、GUI で使うのはやめて SSH を設定して、PuTTY で Win7 から、もしくは ConnectBot で Android から接続して弄くるようになった。そうこうしているうちに Samba サーバを立てて事務所のデータバックアップを自宅でも行い、地理的冗長性を担保しようか？防犯カメラにしようか？など具体的に役に立つ利用方法を考え始め、最終的にミュージックサーバを作ることにした。理由は、事務所の音楽再生環境（Win7 + foobar2000 + TEAC/A-H01 + 自作スピーカー（長岡鉄男/BS-84、Fostex/FF105WK））が先月整い、費用の割りに音質が良く、操作性も快適なので、自宅でも同じような環境を作ってみたくなったのだ。事務所の再生環境については、「[foobar2000 で NHK ネットラジオを聴く](https://www.hyodo-arch.com/buryoshaki/archives/760)」を参照されたし。
自宅は 2DK アパートに妻と子どもの 3人暮らしなので、また Raspberry Pi のスケールに合うように、事務所の機器よりも小型にすることにした。またできるだけ安く、良い音を得られることを目標にした結果、上記の写真のようになった。下記に機器をリストアップする。

### 機器リスト

#### ミュージックサーバ

本体：
:   Raspberry Pi Type B
    > 4,379円

SDカード：
:   Amazon限定 Transcend SDHCカード 8GB Class10
    > 952円（最近は、4GB の方が高かったりする）

ケース：
:   Raspberry Pi Clear Case
    > 1,660円

USB電源：
:   [Docomo/AC アダプタ 04](https://www.nttdocomo.co.jp/product/option/about/ac_adapter04/)
    > 0円
    ※ これまで使い道の無かった Docomo ポイントを使って無料でGET!

USB無線 LAN アダプタ：
:   PLANEX/GW-USMicroN2W
    ※ 事務所で余っていたもの

OS：
:   [Raspbian](http://www.raspberrypi.org/downloads) (2013-09-25 版)
    > Free!

Apr：
:   [Music Player Daemon](http://www.musicpd.org/) (MPD) 0.18.5
    > Free!（スミマセン、Raspbian にインストールされるのは、ver.0.16.0 でした）

#### プリメインアンプ

USB-DAC 内臓 プリメインアンプ
:   [TOPPING/TP23](http://www.sirobako.com/shopdetail/025005000036/008/P/page1/recommend/)
    > 7,350円
    アンプ部：25W@4Ω，約14W@8Ω
    DAC 部：16Bit/48kHz

#### スピーカー（自作）

ユニット：
:   [Fostex/FF85WK](http://www.fostex.jp/products/FF85WK) ×2本
    > 6,550円
    ※[コイズミ無線](http://www.koizumi-musen.com/)のセールで購入

エンクロージャ：
:   バスレフ方式、3.5L
    ※ 取説付属の推奨エンクロージャの寸法を既製板材の規格に調整し、スリットダクトにしたもの。吸音材は家に大量にあったコットンパフをエンクロージャ内部 3面に貼った。
    ※ [この方のホームページ](http://homepage1.nifty.com/takabou/fe108e_backroad2.html)のエンクロージャが美しく製作されていたので、真似してみました。

エンクロージャ材料：
:   ラワンベニヤ 12t + エゾ松 180w×14t×1800L + カット代 + AEPカラースプレー
    > 3,870円

スピーカーケーブル：
:   [九州電気/OFC 0.12mm 素線多重ツイスト構造、0.75SQ](http://www.mimatsu.co.jp/cntnts/kyusyu_index.html) 5m 購入
    > 945円
    ※ターミナルを設けずユニットに直結

費用合計
:   25,706円

![Topping/TP23](/images/2013/Low-DSCN7849.jpg)
Topping/TP23 という製品は「USB-DAC 内臓 プリメインアンプ」と検索して探し出した。私が知りうる限り最安の製品である。TEAC/A-H01 を購入した頃は、その存在を知らなかった。スペックは TEAC/A-H01 より DAC、アンプの出力共に低いが、価格は 1/3 である。
電源スイッチは付いてない。コンピュータの電源とリンクして自動的にON/OFFする。寸法も小さく Raspberry Pi を上に乗せるとちょうど良い。Topping というメーカーは中国のメーカーらしいが、自社ホームページはなぜか見つからない。
音はフルレンジ一発のスピーカーとの組合せということもあり、ミニコンポや、Bose のアンプ内臓スピーカーのように変な味付けされた加工は行われていない感じで、ピュアオーディオと言える。クリアな音質で定位が良く分解能も結構高い。ソナタなどの曲では、プレイヤーの動作や息遣いまで小音量でも感じる。低域が物足りないのはやむを得ないが、8cm ユニットで 3.5L のエンクロージャにしては結構出ている。
MPD の操作は、Android から [MPDroid](https://play.google.com/store/apps/details?id=com.namelessdev.mpdroid&hl=ja) で行っている。Win7 からは、[GMPC](http://gmpclient.org/) 又は [SkyMPC](http://www.soramimi.jp/skympc/) を使用しているが、foobar2000 の使い勝手のようにはいかない。foobar2000 が MPD クライアントとして使えると最高なのだが・・・・。
約25,000円でこれだけの品質と操作性が手に入るのは嬉しい。
じっくりと音楽を聴く機会が増えた。
![段ボールのエンクロージャ](/images/2013/Low-DSCN7791.jpg)
上の写真は、エンクロージャが完成するまでの間、とりあえず鳴らすために作った段ボール・エンクロージャ。かなり残念な音だったw。バスレフ・ダクトも付けたり、内部を補強したり石やタイルを詰め込んだりしたのだけど、箱鳴りがひどく、密閉にしてもあまり変わらなかった。そもそも密閉できていたかも疑問。
次回、[Music Player Daemon](http://www.musicpd.org/) (MPD)を稼動させるまでの Raspberry Pi の設定を紹介したい。
関連記事 > 「[Raspberry Pi で格安ミュージックサーバを作る～その２～](https://www.hyodo-arch.com/buryoshaki/archives/843)」
※追記： Raspberry Pi Model B+ (Plus) が出ましたね。
