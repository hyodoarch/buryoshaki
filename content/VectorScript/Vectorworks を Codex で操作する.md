---
subtitle: vssファイルをincludeすることで Vectorworks でも疑似的な AIプロンプトを実現
description: vssファイルをincludeすることで Vectorworks でも疑似的な AIプロンプトを実現
date: 2026-09-08
draft: false
tags:
  - Vectorworks
  - Codex
---
今、仕事で使っている VectorScript を VS Code の開発環境に移して、GitHub で管理するようにしているのですが、その過程でこの方法を思いつきました。

### 設定

1. Vectorworks で プラグインマネージャからメニュープラグイン `vs_AI` を作る。
   ※プラグインの名前は何でもいいです。
2. スクリプトの内部を、下記のように記述する。
   `{$INCLUDE c:\Users\<username>\vectorscript\vs_AI.vss}`
   ※パスは Codex がアクセスできる場所なら何でもいいです。
3. Vectorworks の環境設定で、「スクリプトを開発者モードで実行」にチェックを入れておく。
4. 「ツール ＞ 作業画面 ＞ 作業画面の編集」から、先ほど作成した `vs_AI` を適当なメニューに登録する。
5. 下記の空ファイルを作成する。
    `c:\Users\<username>\vectorscript\vs_AI.vss`
6. Codex で下記のフォルダアクセスを設定する。
   `C:\Users\<username>\vectorscript`

### 使い方

1. Codex に「やってもらいたいこと」を伝える。
2. しばらくすると、Codex が`vs_AI.vss`にその処理を行うための VectorScript を書き込む。
3. Vectorworks のメニューから `vs_AI` 実行する。

### 仕組み

```mermaid
flowchart TD
    A[自然言語] --> B[Codex]
    B --> C[.vssを書き換える]
    C --> D[Vectorworks / VectorScript]
    D --> E[CAD操作]
```

### ChatGPT に調べてもらった他のCADとの比較表
2026年9月時点で ChatGPT に調べてもらったところ、概ね下表のような違いがあるようです。。

| 比較項目          | AutoCAD 2027 | Archicad 29 | Vectorworks + Codex + VectorScript |
| ------------- | ------------ | ----------- | ---------------------------------- |
| CAD内AIチャット    | ○            | ○           | ×                                  |
| 自然言語で質問       | ○            | ○           | ○ Codex側                           |
| 自然言語でオブジェクト選択 | ○            | ○           | **作れば可能**                          |
| モデル情報問い合わせ    | ○            | ○           | **作れば可能**                          |
| 図形をAI生成       | △ Web版ブロック   | △           | **○ VectorScriptを書かせる**            |
| 任意のCAD処理を追加   | 現状限定的        | 現状限定的       | **かなり自由**                          |
| AIが処理自体をプログラム | 基本×          | 基本×         | **○ Codex**                        |
| 自作機能を継続的に改良   | 限定的          | 限定的         | **○**                              |

しかし、意外に「やってもらいたいこと」って無いんですよね。

便利なプロンプトを思いつきましたら、ここに追記していきたいと思います。

```Codexプロンプト
300×300mm の四角形を長さ 5100mm に隙間約100mmでx方向に割り付けて
```


```Codexプロンプト
全てのシートレイヤの図面の日付を2026-09-08から2026-09-14に変更して
```
