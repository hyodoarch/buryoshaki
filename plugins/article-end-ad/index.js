import { readFileSync } from "node:fs"
import { h } from "preact"

const script = readFileSync(new URL("./adsense.js", import.meta.url), "utf8")
const style = readFileSync(new URL("./style.css", import.meta.url), "utf8")

export function ArticleEndAd(options = {}) {
  const excludedSlugs = new Set(
    [
      "index",
      "404",
      "about",
      "profile",
      "myfavorite",
      "privacy",
      ...(options.excludeSlugs ?? []),
    ].map((slug) => slug.toLowerCase()),
  )

  function ArticleEndAdComponent({ ctx, cfg, fileData }) {
    const slug = fileData.slug
    if (
      !slug ||
      excludedSlugs.has(slug.toLowerCase()) ||
      slug.endsWith("/index") ||
      slug === "tags" ||
      slug.startsWith("tags/") ||
      !fileData.relativePath?.endsWith(".md") ||
      fileData.frontmatter?.ads === false ||
      fileData.frontmatter?.password ||
      fileData.frontmatter?.draft
    ) {
      return null
    }

    // Match the actual v5 dispatcher, including higher-priority custom page types.
    const pageType = [...(ctx.cfg.plugins.pageTypes ?? [])]
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
      .find((type) => type.match({ slug, fileData, cfg }))
    if (pageType?.layout !== "content") return null

    return h("aside", { class: "article-end-ad", "aria-label": "広告" }, [
      h("div", { class: "article-end-ad__label" }, "広告"),
      // Keep the supplied unit's responsive attributes; Google chooses its final size.
      h("ins", {
        class: "adsbygoogle",
        style: "display:block",
        "data-ad-client": "ca-pub-0569052513940110",
        "data-ad-slot": "3442528230",
        "data-ad-format": "auto",
        "data-full-width-responsive": "true",
      }),
    ])
  }

  ArticleEndAdComponent.css = style
  ArticleEndAdComponent.afterDOMLoaded = script
  return ArticleEndAdComponent
}
