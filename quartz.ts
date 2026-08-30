import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"
import { componentRegistry } from "./quartz/components/registry"
import * as ExternalPlugin from "./.quartz/plugins"

// index.md のみに表示する条件
registerCondition("index-only", (props) => props.fileData.slug === "index")

// Explorerの表示順を変更
type ExplorerNode = {
  isFolder: boolean
  displayName?: string
}

componentRegistry.setOptionOverrides("explorer", {
  // canvas / excalidraw をExplorerから非表示
  filterFn: (node: ExplorerNode) => {
    const hiddenFolders = new Set(["canvas", "excalidraw"])
    return !hiddenFolders.has((node.slugSegment ?? "").toLowerCase())
  },

  sortFn: (a: ExplorerNode, b: ExplorerNode) => {
    const pinned = new Map<string, number>([
      ["おすすめのノート", 0],
      ["無聊写記について", 1],
      ["プロフィール", 2],
    ])

    const aName = a.displayName ?? ""
    const bName = b.displayName ?? ""

    const aPinned = !a.isFolder
      ? pinned.get(aName)
      : undefined

    const bPinned = !b.isFolder
      ? pinned.get(bName)
      : undefined

    // 固定ノートを最上部にする
    if (aPinned !== undefined || bPinned !== undefined) {
      if (aPinned === undefined) return 1
      if (bPinned === undefined) return -1
      return aPinned - bPinned
    }

    // それ以外はフォルダをファイルより先にする
    if (a.isFolder !== b.isFolder) {
      return a.isFolder ? -1 : 1
    }

    // フォルダ同士・ファイル同士は名前順
    return aName.localeCompare(bName, "ja", {
      numeric: true,
      sensitivity: "base",
    })
  },
})

// 最近のノートから「プロフィール」を除外
ExternalPlugin.RecentNotes({
  filter: (f) =>
    !["プロフィール", "無聊写記について", "おすすめのノート"].includes(
      f.frontmatter?.title ?? "",
    ),
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()