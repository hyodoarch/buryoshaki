---
title: Welcome to Quartz
publish:
---
### エラーが出る場合
1. ".quartz-cache" の削除
   ```
   dir /a .quartz-cache
   rmdir /s /q .quartz-cache
   ```
   2. git push の実行
   3. git status で確認
## 疑問点
- ファイル名を記事タイトルとする OR 文面内にh1 もしくはプロパティでタイトルをつける
	- ファイル名を記事タイトルとした場合、検索できるのか？
	- プロパティでタイトルが必要な場合、テンプレートでファイル名をプロパティタイトルに自動入力できるのか？
- WXR の xml のファイルから新URL対応表を作る
	- 対応表 ≫ 303ページの作り方
