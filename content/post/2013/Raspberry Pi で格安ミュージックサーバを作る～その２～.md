---
title: Raspberry Pi で格安ミュージックサーバを作る～その２～
date: '2013-12-24'
modified: '2014-10-23'
draft: false
categories:
- コンピュータ
- 音楽
tags:
- PCオーディオ
- Raspberry Pi
old_url: https://www.hyodo-arch.com/buryoshaki/archives/843
wordpress_id: 843
---

![Raspberry Pi と Topping/TP23|450](/images/2013/Low-DSCN7846.jpg)
[前回](https://www.hyodo-arch.com/buryoshaki/archives/787)は、Raspberry Pi を使った格安ミュージックサーバのハード構成を紹介した。今回は、Raspberry Pi をミュージックサーバとして使うために私が行った設定を紹介する。ネット検索で参考にさせていただいた HP は大変貴重な情報がある。また参考書として、「[Raspberry Pi ユーザーガイド](http://www.amazon.co.jp/gp/product/4844333747/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4844333747&linkCode=as2&tag=buryoshaki-22)」が役に立った。

### raspi-config の設定

私の場合は、raspbian をしばらくグラフィカル・デスクトップ環境で遊んだあと、ターミナルより sudo raspi-config で下記の設定を行った。

1. Change User Password > pi ユーザのパスワード変更
2. Enable Boot to Desktop/Scratch > ブート時の起動方法を "Text console" に変更
3. Internationalisation Options / Change Keyboad Layout > 自動的に設定してくれる
4. Advanced Options / Hostname > ホストネームを "MusicServer" に変更
5. Advanced Options / Memory Split > GPU のメモリ割り当てを "16" に変更（"0"でもいいのかもしれないが、"16"とした。）
6. Advanced Options / SSH > Enable に変更

### 公開鍵で SSH 認証できるようにする

下記リンクの解説及び設定方法が非常に分かりやすい。SSH クライアントは、PuTTY を使用している。
参考HP > [Qaplaの覚書・メモ・備忘録・独言 Raspberry Pi のSSHでファイル認証](http://qapla.blog52.fc2.com/blog-entry-305.html)

### LAN の固定IP の設定

sudo nano /etc/network/interfaces で編集

```
auto lo

iface eth0 inet dhcp static
     address 192.168.1.xx
     netmask 255.255.255.0
     gateway 192.168.1.x

allow-hotplug wlan0
iface wlan0 inet manual
wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
iface default inet dhcp
```

### 無線LANの設定

sudo nano /etc/network/interfaces で編集

```
auto lo

iface eth0 inet static
     address 192.168.1.xx
     netmask 255.255.255.0
     gateway 192.168.1.x

#コメントアウト     allow-hotplug wlan0
#コメントアウト     iface wlan0 inet manual
#コメントアウト     wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
#コメントアウト     iface default inet dhcp

#以下、無線LANアダプタの設定
auto wlan0
iface wlan0 inet static
     address 192.168.1.xx
     netmask 255.255.255.0
     gateway 192.168.1.x
wpa-conf /etc/wpa.conf
```

sudo nano /etc/wpa.conf で新規ファイルを作成し、下記を記入する

```
network={
     ssid="<無線LAN機器のSSID>"
     key_mgmt=WPA-PSK
     psk="<ＷＰＡキー>"
```

### MPDのインストール

[MPD 公式ページ](http://www.musicpd.org/)
参考HP > [Raspberry PiをMPD（Music Player Daemon）サーバにする](http://www.soramimi.jp/raspberrypi/mpd/)
下記コマンドをターミナルから打ち Music Player Daemon のインストール及び設定を行う。

1. sudo apt-get install mpd mpc↵
    > MPD と MPC のインストール。MPC は MPD の CLI クライアントである
2. sudo service mpd start↵
    > MPD を起動する
3. sudo nano /etc/mpd.conf↵
    > 設定ファイルの変更

   ```
   auto_update   "yes"    # 自動的にプレイリストを更新する（コメントをはずす）
   #bind_to_address   "localhost"    # エラーが出る場合（コメントをつける）
   mixer_type   "software"    # 有効にするとクライアントから音量調整可能になる（コメントをはずす）
   ```
4. sudo /etc/init.d/mpd restart↵
    > mpd の再起動

次に USB-DAC へ出力するための設定を行う。USB-DAC の種類は自動的に認識してくれた。
参考HP > [SAKURAの独り言:ubuntu studio 12.04でMPD (備忘録)](http://blog.livedoor.jp/sakura_saku_saku1004/archives/51873106.html)

1. cat /proc/asound/cards↵
    > USB-DAC のインデックスを調べる
2. sudo nano /etc/modprobe.d/alsa-base.conf↵
    > USB-DAC をデフォルトのサウンドデバイスに設定するために下記を記述する

   ```
   options snd-usb-audio index=0
   options snd-bcm2835-audio index=1
   options snd-usb-audio nrpacks=1
   ```
3. sudo reboot↵
    > Raspberry Pi を再起動する

### Samba サーバをマウントする

私は、音楽ファイルを Samba サーバ上に保存している。下記コマンドをターミナルから打ち、Raspberry Pi から Samba サーバをマウントする。一般的な NAS もたぶん同様の設定方法だと思われる。

1. sudo apt-get install cifs-utils↵
    > cifsマウントユーティリティをインストール
2. cd /mnt↵
    > mnt ディレクトリへ移動
3. sudo mkdir share\_music↵
    > 音楽データ用ディレクトリ "share\_music" を作成
4. sudo chmod 777 share\_music↵
    > パーミッション変更
5. sudo mount -t cifs -o user=*UserName*%*PassWord* //192.168.1.xx/*share*/*music* /mnt/share\_music↵
    > samba サーバー上の共有音楽データ・ディレクトリをマウントする
6. ls /mnt/share\_music↵
    > 共有音楽データ・ディレクトリがマウントされたか？を確認する
7. sudo ln -s /mnt/share\_music /var/lib/mpd/music/↵
    > mpd の music データフォルダにシンボリックリンクを作成
8. umount //192.168.1.xx/*share*/*music*↵
    > 共有音楽データ・ディレクトリのアンマウントする

次に、共有音楽データ・ディレクトリを起動時に自動的にマウントする設定を行う。

1. sudo nano /etc/fstab↵
    > fstab に追記することにより、起動時に自動的にマウントするようにできるらしい。

   ```
   //192.168.1.xx/share/music /mnt/share_music cifs username=UserName,password=PassWord
   ```
2. しかし、再起動しても自動的にマウントされなかった。sudo mount -a を実行すれば、マウントされる。しかたないので、sudo nano /etc/rc.local を実行し、exit 0 の直前に mount -a を追記した。rc.local は起動時に最後に読み込まれるファイルとのこと。

### 目覚ましとして使う

Raspberry Pi も USB-DAC 内臓のプリメインアンプ Topping/TP23 も電源スイッチが無いので、電源は 24時間入れっぱなしである。待機電力も電気代を気にするほど大きくないようだ。そこで目覚ましとしても使うことにした。
sudo crontab -e で cron を編集する。下記のように mpc コマンドを追記した。

```
# Everyday
10 5 * * * /usr/bin/mpc volume 100
15 5 * * * /usr/bin/mpc clear
20 5 * * 1-5,7 /usr/bin/mpc load NHK-R1
20 5 * * 6 /usr/bin/mpc load NHK-FM
#
#
# For Weekday
30 5 * * 1-5 /usr/bin/mpc play
#
#
# For Saturday Weekend Sunshine
20 7 * * 6 /usr/bin/mpc play
#
#
# For Sunday Ongakuno Izumi
55 7 * * 7 /usr/bin/mpc play
```

mpc コマンドの使い方は、mpc help で表示される。一応下記リストに解説する。cron のスケジュールについては、「cron スクリプト 書き方」などで検索すると親切なサイトが多くある。

- mpc volume 100↵
   > 私の場合は、mpd.conf でソフトウェア・ボリュームに設定しているので、ボリュームを絞っている場合は、100% に戻す
- mpc clear↵
   > Playlist をすべてクリアする
- mpc load NHK-R1↵
   > ユーザが作成した Playlist "NHK-R1" を読み込む。私の場合は、NHK-R1.m3u というファイルに NHKラジオ第一放送のストリーミング・アドレスを入れている。具体的な中身は、下記参照。リッピングした音楽データで作成した Playlist でも良い。

  ```
  mms://a33.l12993146032.c129931.g.lm.akamaistream.net/D/33/129931/v0001/reflector:46032
  ```
- mpc play↵
   > 現在のプレイリストを再生する

以上、思ったよりも快適に使えている。仕事場のリスニング環境は、デスクトップ Win7 + foobar2000 + TEAC/A-H01 + 自作スピーカー（長岡鉄男/BS-84、Fostex/FF105WK）であることは以前の記事「[foobar2000 で NHK ネットラジオを聴く](https://www.hyodo-arch.com/buryoshaki/archives/760)」で書いたとおりだが、こちらの更に安価なシステムの方が音質も良い。
関連記事 > 「[Raspberry Pi で格安ミュージックサーバを作る～その１～](https://www.hyodo-arch.com/buryoshaki/archives/787)」
