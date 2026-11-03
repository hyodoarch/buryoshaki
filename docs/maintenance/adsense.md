# 無聊写記：記事末尾の AdSense 保守記録

実装日：2026-11-03。対象は `hyodoarch/buryoshaki` の `v5`、公開先は
`https://blog.hyodo-arch.com/`。ローカルの実体は `buryoshaki` であり、以前の
`quartz-blog` というフォルダーは存在しなかった。

## 調査した構成

- `package.json` の Quartz バージョンは **5.0.0**。Node.js 22 以上が必要。
- `quartz.config.yaml` と `quartz.ts` で構成。Quartz 4 の `quartz.layout.ts` 方式ではない。
- v5 の `PageTypeDispatcher` が優先度順にページ種別を選び、`content`、`folder`、
  `tag`、`canvas`、`bases` などのレイアウトを組み立てる。
- `DefaultFrame.tsx` の中央列はヘッダー → 本文 → 区切り線 → `.page-footer`。
  `.page-footer` 内に `afterBody` のコンポーネントが優先度順で入る。
- 既存の `afterBody` はトップ・404用の最近のノート（10）、モバイルのグラフ（40）、
  モバイルのバックリンク（50）。広告は **5** とし、それらの順序・設定を維持する。
- `enableSPA: true`。`spa.inline.ts` が `prenav` → `window.addCleanup` →
  micromorphによるDOM更新 → `nav` の順で処理する。初回も `nav` が発火する。
- 検索は独立したURLではなくオーバーレイ。検索プレビューが複製する `.popover-hint`
  の外側に広告を置く。検索結果・検索プレビュー内には広告を生成しない。
- GA4 は `G-E1H0K9050J`。`componentResources.ts` 内にSPA計測と
  `buryoshaki-analytics-optout` による端末ごとの除外機能がある。変更していない。
- 既存のAdSenseコード・広告設定は確認されなかった。
- GitHub Pages は `.github/workflows/deploy.yml` が `v5` へのpushで公開する。
  実装・プレビュー段階では公開せず、ユーザーの公開承認後にcommit・pushする。

## 追加・変更ファイル

| ファイル                              | 目的                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `quartz.config.yaml`                  | ローカルプラグインを `afterBody`、優先度5で有効化                       |
| `plugins/article-end-ad/package.json` | Quartz5のcomponentプラグイン宣言。追加のnpm依存・コンパイル工程なし     |
| `plugins/article-end-ad/index.js`     | 表示対象の判定、提供された広告枠のHTML、CSS・ブラウザースクリプトの登録 |
| `plugins/article-end-ad/adsense.js`   | ライブラリの一度だけの読込、SPA初期化・破棄、遅延読込時の競合防止       |
| `plugins/article-end-ad/style.css`    | 中央揃え、小さな「広告」、本文・後続機能との余白                        |
| `content/ads.txt`                     | ブログの `/ads.txt` としてAssets emitterがコピーする正規販売者情報      |
| `scripts/test-adsense.mjs`            | 実広告・実計測を送信せずに行う生成物・ブラウザー検証                    |
| `docs/maintenance/adsense.md`         | この保守記録                                                            |

`.quartz/plugins/article-end-ad` はQuartzが作るローカルプラグインのリンク。
編集するのは追跡対象の `plugins/article-end-ad`。生成物の `public` や
`.quartz` に直接広告コードを追加しない。

## 広告ユニットと表示条件

ユーザー提供コードの値を使用する。

```text
publisher: ca-pub-0569052513940110
slot:      3442528230
name:      無聊写記・記事末尾
format:    auto
full-width-responsive: true
```

管理画面では「スクエア」を選択したとのことだが、提供HTMLは固定サイズではなく
レスポンシブ形式。`auto` と `true` を維持し、固定の高さや正方形への切り取りは加えない。
外側の最大幅は336px、利用可能な本文幅まで縮小する。実際のサイズと縦横比はGoogleが
決めるため、正方形の配信を保証する設定ではない。

広告の上に「広告」（0.75rem）を表示し、外側に上下4remの余白を取る。
既存の本文後の区切り線・余白も残る。iframeの高さ制限、`overflow:hidden`、
クリックを促す文言、独自のリフレッシュ処理は追加しない。

通常のMarkdown記事で、実際のv5ページ種別の `layout` が `content` の場合だけ1枠を生成する。
トップ、404、フォルダー一覧、タグ一覧、Canvas、Excalidraw、Basesは対象外。
`about`、`profile`、`myfavorite`、`privacy` も対象外。
QuartzのURL小文字化に合わせて、個別除外slugは大文字・小文字を区別しない。
`myfavorite` は元からタグ一覧へのmeta refreshを持つ。
`password` または `draft` が設定されたノートも対象外。

個別の記事を広告対象外にする場合はfrontmatterへ以下を追加する。

```yaml
ads: false
```

一覧・案内ページを増やした場合は、プラグインの設定に除外slugを追加できる。

```yaml
- source: ./plugins/article-end-ad
  enabled: true
  options:
    excludeSlugs:
      - new-guide
  layout:
    position: afterBody
    priority: 5
```

`data-full-width-responsive="true"` は、スマートフォンでGoogleが端末幅まで拡張する場合がある。
提供コードを尊重して維持しているが、配信後に本文幅からの拡張が美観に合わない場合は、
承認を得て `false` に変更する案を検討する。固定サイズの別コードへ変更する場合も、
小画面での実幅を確認し、はみ出す広告を切り取るのではなく対応案を先に相談する。
[Googleのレスポンシブパラメーター説明](https://support.google.com/adsense/answer/9183460?hl=ja)

## SPAと重複防止

1. 全ページ共通の軽量な `nav` ハンドラーが、中央列末尾の対象 `ins` だけを探す。
   対象外ページを直接開いた場合はGoogleの広告JSを読み込まない。
2. 初めて記事を表示したときにGoogleのJSを非同期で読み込み、`data-persist` で
   SPAのhead差し替えから保護する。同じドキュメント内の読込Promiseを共有する。
3. ライブラリのload完了、枠の幅が正であること、検索が閉じていることを確認してから
   提供コードと同じ `adsbygoogle.push({})` を1回実行する。
4. WeakSetと枠単位の状態で重複 `nav`・resizeによる二重初期化を防止する。
5. 遷移前のcleanupで監視を停止し、古い `ins` をDOMから取り除く。micromorphで
   古い広告iframeや初期化済み属性を次の記事へ再利用させない。
6. 読込完了前に遷移した場合は古い枠の要求を取り消す。トップへの遷移後に
   キューだけが処理される問題を防ぐ。履歴移動も新しいページ表示として1回初期化する。
7. 広告ブロッカーや通信失敗では読書・SPA・GAを停止させない。同じドキュメント内では
   失敗したJSを繰り返し読み込まず、再試行は通常の再読込時となる。

記事で一度ロードしたライブラリは、その後トップへSPA移動してもheadに残るが、
トップには広告枠・広告要求を生成しない。検索を開いても既存広告をCSSで隠す処理はせず、
通常の検索オーバーレイを維持する。まだ要求していない枠は検索を閉じるまで待機する。

## 公開前に必要な管理画面・開示の確認

**コードだけでは、管理画面の設定や配信承認、ポリシー適合全体を確認できない。**

- AdSenseの対象サイトが配信可能になっていることと、上記slotが対象ユニットであることを確認する。
- 自動広告をオフにする。アンカー、全画面（vignette）、サイドレールなどは導入しない。
  手動広告と共通のライブラリを使うため、コードだけでは管理画面の自動広告を無効化できない。
  自動最適化・実験がこの方針を変えないことも確認する。
  [自動広告の設定](https://support.google.com/adsense/answer/9305577?hl=ja)
- 調査時点で、公開用 `content` と `About.md` にAdSense・広告Cookie・パーソナライズ広告の
  オプトアウトに関する開示が見当たらなかった。公開前にプライバシーポリシーを追加し、
  フッター等から到達できるようにする。GAについての説明も含める。
  必要な内容は、Google等の第三者によるCookie利用、過去の訪問に基づく広告配信、
  パーソナライズ広告を無効化する方法、利用する第三者配信事業者の説明とリンク。
  [AdSenseが要求する開示](https://support.google.com/adsense/answer/1348695?hl=ja)
  / [Googleのデータ利用](https://policies.google.com/technologies/partner-sites?hl=ja)
  / [広告設定](https://myadcenter.google.com/)
- EEA・英国・スイス向けの配信について、AdSenseの「プライバシーとメッセージ」などで
  Google認定CMP・同意取得の設定を確認する。本変更はCMPを新規設定しない。
  [Google CMPの説明](https://support.google.com/adsense/answer/16918505?hl=ja)

## ads.txtの確認結果

2026-11-03に実HTTPアクセスで確認した。

| URL                                   | 結果                                              |
| ------------------------------------- | ------------------------------------------------- |
| `https://hyodo-arch.com/ads.txt`      | `https://www.hyodo-arch.com/ads.txt` へ転送後200  |
| `https://www.hyodo-arch.com/ads.txt`  | 200、下記の販売者情報と一致                       |
| `https://blog.hyodo-arch.com/ads.txt` | 作業前404。今回の生成物には追加済み、本番は未公開 |

```text
google.com, pub-0569052513940110, DIRECT, f08c47fec0942fa0
```

GoogleのFAQでは、親ドメインとサブドメインの販売者・publisher IDが同じなら
親の `subdomain=` 宣言の追加は必須ではない。今回の親ドメインは同じIDである。
親サイトは変更せず、ブログにも同じads.txtを追加して直接確認できるようにした。
公開後にブログの `/ads.txt` が200で返り、AdSense側で「承認済み」となるか確認する。
`content/robots.txt` は `Allow: /` でクロールを妨げていない。
[Google ads.txt FAQ](https://support.google.com/adsense/answer/9785052?hl=ja)

## 停止・撤去

- 一時停止：`quartz.config.yaml` の `./plugins/article-end-ad` を `enabled: false` にし、
  再ビルド・確認後に公開する。Googleライブラリも本プラグインからは読み込まれなくなる。
- 個別停止：対象ノートのfrontmatterに `ads: false` を指定する。
- 撤去：設定エントリーと `plugins/article-end-ad` を削除する。不要になった検証スクリプトも削除可。
- `ads.txt` は広告を表示させるスクリプトではないため、一時停止のために削除する必要はない。
  親サイトでも同じIDを使うため、親サイトのads.txtを削除しない。
- 読者が開いたままの古いページには、次の再読込まで古いコードが残る場合がある。

## Quartz5更新時の確認箇所

- ローカルプラグインの `package.json` / `exports` / `quartz.components` の読込方式。
- `PageTypeDispatcher` の優先度・`match`・`layout`、slug生成の大文字小文字、
  `fileData.relativePath` とfrontmatterの扱い。
- `DefaultFrame` の `.center > .page-footer` と `afterBody` の順序。
- `nav` の発火順序、`window.addCleanup` の実行時期、micromorph、headの `data-persist`。
- コンポーネントの `afterDOMLoaded` が1回だけ登録され、初回navより先に実行されること。
- 検索の `.search-container.active` と `.popover-hint` の複製範囲。
- 既存の `custom.scss`、reader-mode、モバイル余白によって広告を隠したり切り取ったりしないこと。
- GAの既存SPA計測・除外設定、Assets emitterのads.txt出力、GitHub Pagesのプラグイン導入工程。

## 動作確認の方法

```sh
node quartz/bootstrap-cli.mjs build --concurrency 1
node scripts/test-adsense.mjs
```

ブラウザーテストにはPlaywrightとChromiumが必要。ローカルに既にあるものを使える。
`PLAYWRIGHT_MODULE` にPlaywrightの `index.mjs` の絶対パス、必要なら
`PLAYWRIGHT_CHROMIUM_EXECUTABLE` にChromiumの実行ファイルを指定する。
未指定時は通常の `playwright` とその既定Chromiumを使う。

検証は一時的なlocalhostサーバーを起動し、終了時に閉じる。Google広告JSとgtagはモックへ
置換し、それ以外の外部通信も遮断する。実広告のインプレッション・クリック・GA送信は行わない。
結果JSONと画面は `.quartz-cache/adsense-validation/` に保存され、Git追跡対象外。

- 全HTMLの広告枠数が1以下であること、対象外ページが0枠であること、ads.txtの内容。
- 通常記事・個別非表示・機密ノート・カスタムページ種別の判定。
- トップからの記事遷移、記事間移動、戻る・進む、同じnavの重複通知。
- 検索プレビュー、タグ・フォルダー一覧、404・案内ページ。
- 1440 / 768 / 390 / 320pxの画面幅、中央揃え、本文との間隔、横のはみ出し、resize時の重複要求。
- 読込中の移動、検索中に読込が終わる場合、広告ブロック、GAのpage_viewと既存の除外設定。

本番公開後は実機でも確認する。Googleが広告を返さない場合や広告ブロッカー使用時に
空き枠となることがあり、これは枠のコード検証とは分けて評価する。実配信時のサイズ、
モバイルの端末幅拡張、配信承認・同意メッセージ・ads.txtのクロール状態は本番で確認が必要。
自身の広告をクリックして確認しない。

## 今回の検証結果

- Node.js 24.18.0で全既存プラグインを含むビルド成功（297入力、1454出力）。
- `tsc --noEmit` は広告変更前から存在するコードの4件で失敗。
  `quartz.ts` の `ExplorerNode.slugSegment` とRecentNotesコールバックの型、
  `quartz/i18n/index.ts` / `quartz/i18n/locales/ja-JP.ts` の404翻訳 `home` 欠落。
  広告と無関係なため、この変更では修正しない。
- 生成HTML704ページを検査。広告対象271記事に各1枠、全ページで重複枠なし。
  トップ・タグ・フォルダー一覧・案内ページ・404・特殊ページに広告枠なし。
- Chromiumの画面幅1440 / 768 / 390 / 320pxで中央揃え、横のはみ出しなし。
  対象記事では本文領域の末尾から広告領域まで97px。320px画面では枠幅304pxへ縮小。
  モック広告の高さ280pxが切り取られていないこととスクリーンショットを確認。
- SPA、戻る・進む、検索、遅延読込中の移動、広告ブロックの検証に成功。
  Google広告JSは同じドキュメントで1回、各記事表示で初期化1回、未処理例外なし。
- GAスクリプトの読込とSPAごとのpage_view、既存の計測除外をモックで確認。
  元のGA実装は初期loadと初回navのタイミングにより初回page_viewが重複する可能性があり、
  即時応答するモックでは2回になった。広告による変更はなく、検証では初期値からの
  増分を確認した。この既存の計測挙動を変える修正は今回に含めていない。
- 外部通信遮断のため検証画面のGoogle Fontsやグラフ用CDNは実読込しない。
  広告前後のグラフ・バックリンクのDOM配置は確認するが、CDN経由のグラフ描画自体は
  今回のブラウザーテストの対象外。
- 実広告配信・AdSense管理画面・GAサーバーでの受信は未確認。

## 公開承認と運用記録

- 2026-11-03：ローカルプレビューでユーザーが配置を確認し、公開とcommit・syncを承認。
- 公開対象は上記8ファイル。`v5` を `origin/v5` にpushし、既存のGitHub Pagesワークフローで公開する。
- ユーザー確認用プレビューはリポジトリ外の一時サーバーで提供した。
  ダミー広告・画面幅切替・GA停止のプレビュー用コードは本番へ含めない。
- 公開後はActionsの成功、記事の広告枠1つ、トップ・一覧の広告枠0、
  ブログの `/ads.txt` が200で取得できることを確認する。
- プライバシー開示の追加とAdSense管理画面の自動広告・同意設定の確認は、
  上記「公開前に必要な管理画面・開示の確認」に記載した運用上の残件として引き継ぐ。
