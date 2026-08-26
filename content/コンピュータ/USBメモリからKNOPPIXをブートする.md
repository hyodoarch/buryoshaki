---
title: USBメモリからKNOPPIXをブートする
date: '2009-02-27'
modified: '2009-02-27'
draft: false
categories:
- コンピュータ
tags:
- KNOPPIX
- PortableApps
- USBメモリ
old_url: https://www.hyodo-arch.com/buryoshaki/archives/163
wordpress_id: 163
---

![IMGP6844.jpg](/images/2009/IMGP6844.jpg)
昨年末にハードディスクがクラッシュしてWindowsが起動ができなくり、大変な騒ぎでしたが、ブートセクタがおかしくなっただけだったようなので、KNOPPIXをCDに焼き、CDドライブからOSを起動することにより、データを救出することができました（参照＞[ハードディスククラッシュ顛末記](https://www.hyodo-arch.com/buryoshaki/2008/12/post-119.html)）。このような緊急事態がしょっちゅう起こらないことを祈るばかりですが、CDからのKNOPPIX起動、操作は、ハードディスクと異なりアクセスに非常に時間がかかるので、USBメモリからKNOPPIXを起動すれば快適だろうと思い、今後に備えてUSBメモリにインストールしてみました。以下備忘録。

検索して調べてみたところ、一番簡単そうだった次の方法で作成しました（参考＞[USBブートするKNOPPIXを作ってみた。 - linoの日記](http://d.hatena.ne.jp/lino/20090102/1230907474)）。

### 必要なもの
1. KNOPPIXをブートできるCD、DVDなど（無い場合はあらかじめ作成しておく）
2. USBメモリ（僕の使用した物は、SanDisc製、8G、FAT32フォーマットで、既にPortableアプリやデータなど入れて使用しているものです）

### 作成方法
1. KNOPPIXをブート
2. USBメモリを差し、認識されたらマウントを解除
3. メニューのKNOPPIX - root shellを起動する
4. shelll上で"mkbootdev"と入力する
5. メニューに従ってインストール

これだけで簡単にKNOPPIX起動USBメモリができました。CDと比べると格段に快適です。

ここでふと思ったのですが、Windows もUSBメモリで起動できれば便利ですね。必要なポータブル・アプリケーションもインストールして持ち歩けば、（何がインストールされているかわからないようなPCを使わなければならないときは）外出先のPCをUSBメモリでブートして普段と同じ環境で使用できますし、完全に使用履歴がそのPCに残らないと思うので（U3や PortableAppsも履歴が残らないが）安心ですよね。 
Windows Portable なんていうUSBメモリから起動できる製品があれば結構売れるかも知れません。もし製品化されてもアクティべーションの問題があるので、USBメモリへのプリインストール版とかにはなってしまうと思いますが。

ちなみに [PortableApps.com](http://portableapps.com/) の Applications タブに Operating System カテゴリがあり、Linuxを組んだものは Comming soon だそうです。Firefoxなども使えますしGmailなどのクラウド・サービスはブラウザさえ使えれば問題ないわけですし・・・Windows環境にこだわる最大の理由は、PhotoshopやVectorworksなど市販アプリケーションがWindowsやMacでなければ使えないということですかね。

### 今日の写真
先日参加した川口メディアセブンのイベント"55km2"で撮った三地蔵。とても温かそうです。場所は川口と越谷の市境付近の越谷側です。
