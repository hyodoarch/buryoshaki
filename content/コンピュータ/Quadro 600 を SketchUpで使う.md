---
title: Quadro 600 を SketchUpで使う
date: '2011-08-14'
modified: '2014-10-14'
draft: false
categories:
- コンピュータ
- 建築
tags:
- SketchUp
old_url: https://www.hyodo-arch.com/buryoshaki/archives/495
wordpress_id: 495
---

![ELSA NVIDIA Quadro 600](/images/2011/bs-IMGP5317.jpg "bs-IMGP5317")
ここ３ヶ月ほど非常に多忙でして、今日も仕事です。が、世の中はお盆休みなので、少しくらいブログに時間を割いてもよいかと思いまして、久々のブログ更新です。
[ELSA NVIDIA Quadro 600](http://www.elsa-jp.co.jp/products/graphicsboard/quadro_600/index.html)は、エントリー向けOpenGL ビデオカードです。昨年末より [SketchUp](http://sketchup.google.com/intl/ja/download/index.html) を使うようになったのですが、GeForce （9500GT なので低スペックすぎて参考にならないかもしれませんが）やIntel Graphics での安定性が（特にプラグインで）悪く、色々調べてみると GeForce はゲーム用に最適化されているので、OpenGL 対応といっても、OpenGL に最適化はされていないようなんですね。Quadro 600 は GeForce GT430 とチップ性能が同じですが、Quadro 600 が２万円前後に対して、GT430 は５千円強と４倍近くも価格差があり、「なんで同じGPU(GF108)なのにこんなにも値段が違うのか！」と憤慨していたせいで購入を決断するまでに時間が掛かりましたが、決定打は、次の二つの比較動画でした。
@@OBSIDIAN\_IFRAME\_0@@
@@OBSIDIAN\_IFRAME\_1@@
どちらも少し古い製品ですが、GeForce GTX480 はハイエンドモデルです。それに対して、Quadro FX380 はエントリーモデルです。この動画を見る限り、FX380の方がシーンの推移がスムーズです。但し、GTX480の動画は影がONになっているので、その分負荷が結構高くなっているはずで、同じ条件とは言えないのが残念なのですが、参考にはなります。
また[BTO高知](http://www.btopcshop.com/)さんの「[GeForceとQuadro CAD/Adobe](http://www.btopcshop.com/BtoPageInfo.php/cateType/9/evaluateCateId/0/pageId/179)」もかなり参考になりました。
ゲームではなく、OpenGL 系グラフィックアプリを使う場合は、OpenGL に最適化されているビデオカードを使用するかどうかで、全然描画性能が異なるようで、それはグラフィックチップの性能差よりもはるかに大きいようなのです。
もともと SketchUp はハイエンドのグラフィックカードを要求していませんし、予算の都合もあるので、Quadro 600 を購入しました。樹木などのエンティティ数が多いファイルでも、スムーズにオービットができるようになり、10M以上のファイルや多用するプラグイン "[FredoScale](http://forums.sketchucation.com/viewtopic.php?t=17948)"でフリーズすることもほとんどなくなり、快適になりました。
記事トップの画像でわかるように、Quadro 600 はハーフサイズですので、スリムタイプのパソコンでも装着できます。
最後に僕のPCの構成を参考までに
マザーボード： ASRock H67M-GE
CPU : i7-2600
RAM ： DDR3 PC3-10600 4GBx2
OS : Windows 7 64bit Professional SP1
補足：
７月中旬までは、G31 + Core2DuoE8400 + RAM 4GB + XP 32bit Home + Quadro 600 でしたが、それでも快適でした。というのは、SketchUpは 32bit アプリなので、32bit OSの方が同じスペックなら快適なはずです。
新しいPCにしたのは、スペックに問題があったわけではなく、7月になってマザーかハードディスクの不調と思われる起動不良が2回発生し、恐ろしくなって（過去に[このようなこと](https://www.hyodo-arch.com/buryoshaki/archives/151)があったので）新調することにしました。そのあたりは、また落ち着いたら記事にしたいと思います。
**2014.03.13 追記**
[Quadro K600](http://www.elsa-jp.co.jp/products/graphicsboard/quadro_k600/index.html) を購入しました。Pentium Dual-Core G3220 との組合せ（詳しくは「[事務所の PC を新調した（自作のススメ）](https://www.hyodo-arch.com/buryoshaki/archives/906)」を参照してください）マルチディスプレイ（2台）で使用していますが、調子いいです。
