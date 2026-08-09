import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

// Explorerの表示順を変更
ExternalPlugin.Explorer({
  sortFn: (a, b) => {
    // 最上部に固定するファイル
    const pinned = new Map([
      ["無聊写記について", 0],
      ["プロフィール", 1],
    ])

    const aPinned = !a.isFolder
      ? pinned.get(a.displayName)
      : undefined

    const bPinned = !b.isFolder
      ? pinned.get(b.displayName)
      : undefined

    // About・プロフィールを最優先
    if (aPinned !== undefined || bPinned !== undefined) {
      if (aPinned === undefined) return 1
      if (bPinned === undefined) return -1
      return aPinned - bPinned
    }

    // それ以外は、フォルダをファイルより先にする
    if (a.isFolder !== b.isFolder) {
      return a.isFolder ? -1 : 1
    }

    // フォルダ同士・ファイル同士は名前順
    return a.displayName.localeCompare(b.displayName, "ja", {
      numeric: true,
      sensitivity: "base",
    })
  },
})

// 最近のノートから「プロフィール」を除外
ExternalPlugin.RecentNotes({
  filter: (f) => !["プロフィール", "無聊写記について", "About"].includes(f.slug),
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()