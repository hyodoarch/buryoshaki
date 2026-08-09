---
title: おすすめのノート
---
### 無聊写記の中から、おすすめのノートをまとめています。
 ≫ [おすすめのノート](https://blog.hyodo-arch.com/tags/おすすめのノート)

![[tags/おすすめ]]


%%
### 最近のノートから除外する
- [ ] quartz.ts で除外できる。
```TypeScript
// 最近のノートから固定ページを除外
ExternalPlugin.RecentNotes({
  filter: (f) => !["プロフィール", "about", "おすすめのノート"].includes(f.slug),
})
```

### 最近のノートをページの下部にリスト表示しない
%%
