## 基本情報
- [Welcome to Quartz 5](https://quartz.jzhao.xyz/)
- git
- GitHub
- Node.js
## 最初の ToDo
- ローカルにインストール ≫ [Welcome to Quartz 5](https://quartz.jzhao.xyz/)の前半を読む。コマンドラインでカレントディレクトリにインストールされる。
- GitHub に repository を作成する。
	- *username* = hyodoarch の場合で *repository name* = hyodoarch.github.io に設定すると、公開 url は https://hyodoarch.github.io/ になる。
	- 公開 url を https://hyodoarch.github.io/buryo にしたい場合は、 *repository name* = buryo にする。
	- configration は Public, README → off、Add .gitignore, add license → None
- コマンドラインからリモートホストを確認
   `git remote -v` 
- すると次のようになっている
   `origin  https://github.com/jackyzha0/quartz.git`
- コマンドラインから変更
   `git remote set-url origin https://github.com/hyodoarch/hyodoarch.github.io.git`
- 再度、リモートホストを確認 `git remote -v` 
- 下記のように結果が反映されていれば OK!
  `origin https://github.com/hyodoarch/hyodoarch.github.io.git`
  ※ upstream は jackyzha0 さんのままで OK!
- 次を実行し quartz のプログラムを GitHub に送る `npx quartz sync --no-pull` 
	- うまくいかない場合は下記を実行してみる。
	- `git add .`
	- `git status`
	- `git commit -m "Initial Quartz site"` ≫ 引用符内は Git のコミットメッセージ
	- `git push -u origin v5`
- ローカルに `.github/workflows/deploy.yml` を作る。
	- https://quartz.jzhao.xyz/hosting を見て、コピペし、下記を実行
	- `git status`
	- `git add .github/workflows/deploy.yml`
	- `git commit -m "Add GitHub Pages deploy workflow"`
	- 
- 後は、追加・変更のたびに `npx quartz sync` を実行する。
- `quartz.config.yaml` の `baseUrl` を変更することができる。
- URL を変更する場合：
	- GitHubでリポジトリ名を buryoshaki に変更
	- git の送信先を変更
	 `git remote set-url origin https://github.com/hyodoarch/buryoshaki.git` 
	 確認： `git remote -v`
	- quartz.config.yaml の baseurl を変更 `hyodoarch.github.io/buryoshaki`
	- npx quartz sync
	   
	   

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