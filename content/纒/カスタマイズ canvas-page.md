---
draft: true
---
## さらなる変更まとめ
- Advanced Canvas への対応を試みる
	- ノード
		- 枠線の非表示
		- 背景の色
	- グループ
		- 背景の色（透明）
		- タイトルを左上枠内に表示
	- エッジ
		- 文字の背景

## 変更内容まとめ

| 項目                       | 実装場所                        | 方針                              |
| ------------------------ | --------------------------- | ------------------------------- |
| ① 引用バー除去・`.center` 幅いっぱい | `custom.scss`               | Quartz本文レイアウト側の問題               |
| ② Canvasタイトルをh2相当サイズ     | `custom.scss`               | サイト全体のデザイン                      |
| ③ 方眼ドット非表示               | **fork `canvas.scss`**      | Canvas固有の表示設定                   |
| ④ 埋込Canvasにボーダー          | `custom.scss`               | 無聊写記での埋込デザイン                    |
| ⑤ 埋込Canvasを正方形           | `custom.scss`               | 無聊写記固有のレイアウト                    |
| ⑥ **横幅基準ズーム**            | **fork `canvas.inline.ts`** | 描画計算なのでSCSS不可                   |
| ⑦ 個別Canvasページを全面表示       | **fork側**                   | `CanvasFrame.tsx`＋`canvas.scss` |
| ⑧ 全画面アイコン→元Canvasページ     | **fork `CanvasBody.tsx`**   | ボタンそのものをリンクへ変更                  |
| ⑨ グループ名 1.575rem・太字      | **fork `canvas.scss`**      | Canvas固有デザイン                    |
| ⑩ 不要なスクロールバー解消           | **fork `canvas.scss`**      | `p` margin調整                    |
| ⑪ **矢印の改善**              | **fork `CanvasBody.tsx`**   | SVG経路計算の変更                      |
| ⑫ padding 12→9px         | **fork `canvas.scss`**      | Canvas固有デザイン                    |
**次はまず⑥「横幅基準ズーム」から修正するのがよいと思います。** その後⑧→⑪と進め、最後に③⑨⑩⑫を `custom.scss` から fork の `canvas.scss` へ移す順番が安全です。

一旦、commit and sync します。
Quartz の canvas-page の無聊写記の表示について下記を調べてください。

- グループの文字サイズ ≫ 「現実世界」など    
- カード内の文字サイズ ≫ 「時雄、ときめく」など    
- 
- 矢印のラベルの文字サイズ ≫ 「面識あり」など


## フォーク後のリビルド
### 今回だけ行う作業
まず現在の `canvas-page` を削除します。
```
npx quartz plugin remove canvas-page
```

次に、fork版を追加します。fork が例えば `hyodoarch/canvas-page` なら、
```
npx quartz plugin add github:hyodoarch/canvas-page
```

Quartz v5 には `plugin add` / `plugin remove` が正式に用意されています。

これにより `quartz.config.yaml` は、
```
- source: github:<GitHubユーザー名>/canvas-page
  enabled: true
```

という **fork側を参照する状態**にします。

その後、
```
npx quartz build --serve
```
です。

### WEB（localhost:8080）で確認する

.github\workflows\deploy.yml ≫ を編集する必要がある。 

### 重要：次回からはアンインストール不要です

今回一度 fork版へ切り替えてしまえば、⑦〜⑫などで fork をさらに修正した際は、
```
npx quartz plugin install canvas-page --latest
```

で最新版を取得してから、
```
npx quartz build --serve
```

で大丈夫です。`plugin install --latest` が現在のQuartz v5で推奨されている更新方法です。

### WEB（リモート）で確認する
[chatGPTの解説](https://chatgpt.com/share/6a81057e-e3b4-83ee-80d7-4591cafbe898)

まず変更ファイルの確認 ≫ "quartz.lock.json" が赤で表示される
```cmd
git status
```

問題なければ、Obsidian Git で commit and sync する。

その後、Actions で Deploy の始まりを確認、終了後に表示を確認