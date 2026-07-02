---
title: Photoshop Element から Paint.NET への移行メモ
date: '2010-10-26'
modified: '2014-08-19'
draft: false
categories:
- コンピュータ
- 写真
tags:
- AutoHotkey
- Paint.NET
old_url: https://www.hyodo-arch.com/buryoshaki/archives/259
wordpress_id: 259
---

ペイント＆画像処理アプリケーションでフリーのものは無いか？との相談を受けた。僕は、EPSON のプリンタ PX-5500 を買ったときにバンドルされていた Photoshop Elements 3 を使っている。必要な機能は全て揃っているので、バージョンが古くても、特に困らない。そこで、相談を受けた方には、「Photoshop を使ったことがあるのなら、Elements が安くておススメです。GIMP はフリーだけど学習に時間が掛かるような気がします」 と回答したのだが、もうちょっと調べてみて、[Paint.NET](http://www.getpaint.net/ "Paint.NET") というフリーソフトのことを知った。
ちょっと使ってみると、特に Photoshop Elements と比較して機能的に困ることも無いので、この際、移行を前提に使ってみることにした。現時点での Paint.NET 長所・短所をまとめてみると、
**長所**

- 起動が早い＞Elements 3は、かなり遅い。
- 単位の指定ができる＞Elements は、デフォルトが「mm」でいちいち「ピクセル」に直すのが面倒だった。
- ショートカット・キーがほとんどのコマンドに設定されている＞Elements は少なすぎる。例えば「解像度変更」や「回転」にも無い。AutoHotkey をつかってファンクション・キーに割付けているが、例えば「カンバスサイズ変更」などは下記のように記述する必要があった。

  ```
  F4::Send,{vk1d}!ir{down}{enter}	;カンバスサイズ変更、{vk1d}はIM を OFF にする
  ```
- フローティングパレットが半透明なので、邪魔にならない
- psdファイルを開くことができるので、Photoshop で作成した過去の資産を活用できる。＞ [Paint.NET PSD Plugin](http://psdplugin.codeplex.com/)をPaint.NET プログラムファイル内のFileTypes フォルダにインストールする。

**短所**

- アンシャープマスクが無い＞[Tanel's Photo and Color Plugins](http://forums.getpaint.net/index.php?showtopic=11619)というプラグイン集の中の "Sharpen+" をインストールすることにより解決
- 「WEB 用に保存」コマンドが無い＞画像の圧縮率による画像の劣化を比較しずらい。今のところ、「名前を付けてで保存」で代用
- テキストがピクセル展開されてしまうため、再編集ができない。＞外部プラグインの[テキスト＋](http://paintnet.web.fc2.com/plugin/dpy/textplus.htm)や [EditableText](http://forums.getpaint.net/index.php?/topic/10056-) で直前のテキスト編集は可能になるが、根本的にアプリケーションの問題なので、解決にはならない。でも、プラグイン作者の方には大感謝です。

**情報サイト**

- [Paint.NET Forum](http://forums.getpaint.net/index.php?/index) ＞公式フォーラムです。ディスカッションが活発で、チュートリアル、プラグインの情報が入手できます。
- [Paint.NET 不完全マニュアル](http://paintnet.web.fc2.com/) ＞本当に知りたいTips、プラグイン情報が満載の素晴らしいサイトです。私見ですが、出版社の方は、管理人のだっぺ屋さんに執筆をご依頼されてはいかがでしょうか？
その他、気が付いたら追記したいと思います。
移行するついでに、画面移動を Vectorworks に合わせて、ホイールでズーム、ホイールボタンでパンできるように AutoHotkey のスクリプトを書きました。

```
;■■■■■■■■■ Paint.NET ■■■■■■■■■
#IfWinActive ahk_class WindowsForms10.Window.8.app.0.378734a
WheelUp::^WheelUp		;Zoom
WheelDown::^WheelDown

MButton::
{
	Send, {space down}
	MouseClick, left, , , 1, 0, D  ; Hold down the left mouse button.
	Loop
	{
		Sleep, 10
		GetKeyState, state, MButton, P
		if state = U  ; The key has been released, so break out of the loop.
		break
		; ... insert here any other actions you want repeated.
	}
	MouseClick, left, , , 1, 0, U  ; Release the mouse button.
	Send, {space up}
	return
}
```

やはりフリーなので、それなりのカスタマイズは必要です。
