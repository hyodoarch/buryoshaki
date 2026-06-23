## 基本情報
- [Welcome to Quartz 5](https://quartz.jzhao.xyz/)
- git
- GitHub
- Node.js
## 最初の ToDo
- ローカルにインストール ≫ [Welcome to Quartz 5](https://quartz.jzhao.xyz/)の前半を読む。コマンドラインでカレントディレクトリにインストールされる。
- GitHub に repository を作成する。
- コマンドラインからリモートホストを確認
   `git remote -v` 
- すると次のようになっている
   `origin  https://github.com/jackyzha0/quartz.git`
- コマンドラインから変更
   `git remote set-url origin https://github.com/hyodoarch/hyodoarch.github.io.git`
- 再度、リモートホストを確認 `git remote -v` 
- 結果が反映されていれば OK!
  `origin https://github.com/hyodoarch/hyodoarch.github.io.git`

## Quartz の仕組み
- GitHub ActionsでQuartzを自動実行する方式
```
Obsidian
    ↓
Markdown編集

Git
    ↓
commit

GitHub
    ↓
push

GitHub Actions
    ↓
Quartz実行

HTML生成
    ↓
GitHub Pages
    ↓
公開サイト
```

## Quartz の構成
### GitHub ActionsでQuartzを自動実行する方式
ローカル：
```
C:\Users\hyodo\Documents\GitHub\quartz\
│   
├─ .git\
├─ .github\
├─ .quartz\
├─ content\
├─ dogs\
├─ node_modules\
├─ public\
├─ quartz\
├─ .gitattrbutes
├─ ･･････
├─ package.json
├─ ･･････
└─ tsconfig.json
```

GitHub
```
hyodoarch.github.io
│
├─ .github
├─ content
├─ docs
├─ quartz
│
├─ package.json
├─ quartz.config.yaml
└─ ...
```