import assert from "node:assert/strict"
import { createServer } from "node:http"
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"
import handler from "serve-handler"
import { render } from "preact-render-to-string"
import { ArticleEndAd } from "../plugins/article-end-ad/index.js"

// All external requests are intercepted: never load real ads or send GA events.
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright"
)
const output = path.resolve("public")
const artifacts = path.resolve(".quartz-cache/adsense-validation")
await mkdir(artifacts, { recursive: true })

const component = ArticleEndAd()
function renderAd(slug, frontmatter = {}, pageTypes = []) {
  return render(
    component({
      cfg: {},
      ctx: {
        cfg: {
          plugins: {
            pageTypes: [{ priority: 0, match: () => true, layout: "content" }, ...pageTypes],
          },
        },
      },
      fileData: { slug, relativePath: `${slug}.md`, frontmatter },
    }),
  )
}
assert.match(renderAd("notes/article"), /data-ad-slot="3442528230"/)
for (const slug of [
  "index",
  "about",
  "profile",
  "myfavorite",
  "privacy",
  "About",
  "404",
  "tags",
  "tags/a",
  "notes/index",
]) {
  assert.equal(renderAd(slug), "", slug)
}
for (const frontmatter of [{ ads: false }, { password: "test" }, { draft: true }]) {
  assert.equal(renderAd("notes/article", frontmatter), "")
}
assert.equal(renderAd("special", {}, [{ priority: 100, match: () => true, layout: "canvas" }]), "")

const htmlFiles = (await readdir(output, { recursive: true })).filter((file) =>
  file.endsWith(".html"),
)
const articles = []
const counts = []
for (const file of htmlFiles) {
  const html = await readFile(path.join(output, file), "utf8")
  const count = (html.match(/<ins\b[^>]*class="adsbygoogle"/g) ?? []).length
  assert.ok(count <= 1, `Duplicate unit: ${file}`)
  counts.push({ file, count })
  if (count) articles.push(file)
  if (
    /^(index|about|profile|myfavorite|404)\.html$/i.test(file) ||
    /^(tags|canvas|excalidraw)[\\/]/.test(file) ||
    /[\\/]index\.html$/.test(file)
  ) {
    assert.equal(count, 0, `Excluded page: ${file}`)
  }
}
assert.ok(articles.length > 2, "No article units in build output")
assert.equal(
  (await readFile(path.join(output, "ads.txt"), "utf8")).trim(),
  "google.com, pub-0569052513940110, DIRECT, f08c47fec0942fa0",
)

const server = createServer((req, res) => handler(req, res, { public: output }))
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
const origin = `http://127.0.0.1:${server.address().port}`
const toUrl = (file) =>
  `${origin}/${file
    .replaceAll("\\", "/")
    .split("/")
    .map(encodeURIComponent)
    .join("/")
    .replace(/\.html$/, "")}`
// Prefer two ordinary text notes for layout screenshots.
const chosen = articles.filter((file) => file.startsWith("コンピュータ") && !file.includes("index"))
const articleA = toUrl(chosen[0] ?? articles[0])
const articleB = toUrl(chosen[1] ?? articles[1])
const selector = ".center > .page-footer > .article-end-ad > ins.adsbygoogle"
const mockAdSense = `
  window.__adRequests = [];
  window.adsbygoogle = {
    loaded: true,
    push() {
      const slots = [...document.querySelectorAll('${selector}')].filter(el => !el.hasAttribute('data-adsbygoogle-status'));
      if (slots.length !== 1) throw new Error('Expected one fresh slot, got ' + slots.length);
      const ad = slots[0];
      ad.setAttribute('data-adsbygoogle-status', 'done');
      const frame = document.createElement('iframe');
      frame.title = '検証用広告';
      frame.style.cssText = 'display:block;width:100%;height:280px;border:0';
      frame.srcdoc = '<body style="margin:0;background:#e7e7e7;color:#555;font:14px sans-serif;display:grid;place-items:center;height:100vh">検証用広告（配信なし）</body>';
      ad.append(frame);
      window.__adRequests.push(location.pathname);
    }
  };
`

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
})
const report = {
  htmlPages: counts.length,
  articlePagesWithOneAd: articles.length,
  checks: [],
  layouts: [],
}
async function newContext({
  width = 1440,
  height = 1000,
  delayed = false,
  blocked = false,
  optOut = false,
} = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
  if (optOut) {
    await context.addInitScript(() => localStorage.setItem("buryoshaki-analytics-optout", "1"))
  }
  let release
  const gate = delayed ? new Promise((resolve) => (release = resolve)) : Promise.resolve()
  const state = { loaderRequests: 0, gaRequests: 0, errors: [], release: () => release?.() }
  await context.route("**/*", async (route) => {
    const url = route.request().url()
    if (url.startsWith(origin) || url.startsWith("data:")) return route.continue()
    if (url.includes("/pagead/js/adsbygoogle.js")) {
      state.loaderRequests++
      await gate
      if (blocked) return route.abort()
      return route.fulfill({ contentType: "text/javascript", body: mockAdSense })
    }
    if (url.includes("googletagmanager.com/gtag/js")) {
      state.gaRequests++
      return route.fulfill({ contentType: "text/javascript", body: "/* GA network stub */" })
    }
    return route.abort()
  })
  const page = await context.newPage()
  page.on("pageerror", (error) => state.errors.push(error.message))
  return { context, page, state }
}

async function navigate(page, url) {
  await page.evaluate(async (destination) => window.spaNavigate(new URL(destination)), url)
}
async function expectRequests(page, count) {
  await page.waitForFunction((n) => (window.__adRequests?.length ?? 0) === n, count)
}

try {
  const { context, page, state } = await newContext()
  await page.goto(origin, { waitUntil: "networkidle" })
  const initialPageViews = await page.evaluate(
    () =>
      [...(window.dataLayer ?? [])].filter(
        (entry) => entry[0] === "event" && entry[1] === "page_view",
      ).length,
  )
  assert.equal(await page.locator("ins.adsbygoogle").count(), 0)
  assert.equal(state.loaderRequests, 0)
  await navigate(page, articleA)
  await expectRequests(page, 1)
  await page.evaluate(() =>
    document.dispatchEvent(new CustomEvent("nav", { detail: { url: document.body.dataset.slug } })),
  )
  await expectRequests(page, 1)
  assert.equal(await page.locator(selector).count(), 1)
  await navigate(page, articleB)
  await expectRequests(page, 2)
  assert.equal(await page.locator("ins.adsbygoogle iframe").count(), 1)
  await page.goBack()
  await expectRequests(page, 3)
  await page.goForward()
  await expectRequests(page, 4)

  // Search overlays only clone .popover-hint, not the afterBody advertising region.
  await page.locator(".search-button").first().click()
  await page.locator(".search-container.active").waitFor()
  const input = page.locator(".search-container.active input").first()
  await input.fill("Obsidian")
  await page.locator(".search-container.active .result-card").first().waitFor()
  assert.equal(await page.locator(".search-container ins.adsbygoogle").count(), 0)
  await page.keyboard.press("Escape")
  await expectRequests(page, 4)

  const excluded = ["index.html", "about.html", "profile.html", "404.html", "tags.html"]
  excluded.push(
    ...counts
      .filter(({ file }) => /^(tags[\\/])|([\\/]index\.html$)/.test(file))
      .slice(0, 8)
      .map(({ file }) => file),
  )
  for (const file of excluded) {
    await navigate(page, file === "index.html" ? origin : toUrl(file))
    assert.equal(await page.locator("ins.adsbygoogle").count(), 0, file)
  }
  assert.equal(state.loaderRequests, 1)
  assert.equal(await page.locator('script[src*="/pagead/js/adsbygoogle.js"]').count(), 1)
  assert.equal(state.gaRequests, 1)
  const pageViews = await page.evaluate(
    () =>
      [...(window.dataLayer ?? [])].filter(
        (entry) => entry[0] === "event" && entry[1] === "page_view",
      ).length,
  )
  assert.equal(pageViews, initialPageViews + 5 + excluded.length)
  assert.deepEqual(state.errors, [])
  report.checks.push(
    "SPA: home → articles → Back/Forward → search → excluded pages; one loader, one request per article, no uncaught errors",
    `GA: ${pageViews} page_view events with stubbed transport; one gtag load`,
  )
  await context.close()

  for (const width of [1440, 768, 390, 320]) {
    const { context, page, state } = await newContext({ width, height: 900 })
    await page.goto(articleA, { waitUntil: "networkidle" })
    await expectRequests(page, 1)
    assert.equal(await page.locator(".page-footer .graph").count(), 1)
    assert.equal(await page.locator(".page-footer .backlinks").count(), 1)
    assert.equal(await page.locator(".sidebar ins.adsbygoogle").count(), 0)
    const geometry = await page.evaluate(() => {
      const ad = document.querySelector(".article-end-ad").getBoundingClientRect()
      const ins = document.querySelector(".article-end-ad ins").getBoundingClientRect()
      const article = document.querySelector(".center > article").getBoundingClientRect()
      const center = document.querySelector(".center").getBoundingClientRect()
      const following = [
        ...document.querySelectorAll(".page-footer .graph, .page-footer .backlinks"),
      ]
        .map((element) => element.getBoundingClientRect())
        .find((rect) => rect.height > 0)
      return {
        width: innerWidth,
        adLeft: ad.left,
        adRight: ad.right,
        adWidth: ad.width,
        centerOffset: (ad.left + ad.right - center.left - center.right) / 2,
        gap: ad.top - article.bottom,
        followingGap: following ? following.top - ad.bottom : null,
        frameHeight: ins.height,
        scrollWidth: document.documentElement.scrollWidth,
      }
    })
    assert.ok(geometry.adLeft >= -1 && geometry.adRight <= width + 1)
    assert.ok(Math.abs(geometry.centerOffset) < 1)
    assert.ok(geometry.gap >= 64, JSON.stringify(geometry))
    assert.ok(geometry.scrollWidth <= width + 1, JSON.stringify(geometry))
    assert.ok(
      geometry.followingGap === null || geometry.followingGap >= 64,
      JSON.stringify(geometry),
    )
    assert.equal(geometry.frameHeight, 280)
    await page.locator(".article-end-ad").scrollIntoViewIfNeeded()
    await page.screenshot({ path: path.join(artifacts, `article-${width}.png`) })
    if (width === 1440) {
      await page.locator(".readermode").first().click()
      await page.locator(".darkmode").first().click()
      assert.equal(await page.locator(selector).count(), 1)
      assert.ok(await page.locator(selector).isVisible())
      await page.locator(".article-end-ad").scrollIntoViewIfNeeded()
      await page.screenshot({ path: path.join(artifacts, "article-dark-reader.png") })
    }
    await page.setViewportSize({ width: width === 1440 ? 1200 : width + 10, height: 900 })
    await expectRequests(page, 1)
    assert.deepEqual(state.errors, [])
    report.layouts.push(geometry)
    await context.close()
  }

  for (const destination of [origin, articleB]) {
    const { context, page, state } = await newContext({ delayed: true })
    await page.goto(articleA, { waitUntil: "domcontentloaded" })
    await page.waitForFunction(() => typeof window.spaNavigate === "function")
    await navigate(page, destination)
    state.release()
    if (destination === origin) {
      await page.waitForFunction(() => window.adsbygoogle?.loaded)
      assert.equal(await page.evaluate(() => window.__adRequests.length), 0)
      await navigate(page, articleB)
    }
    await expectRequests(page, 1)
    assert.equal(await page.evaluate(() => window.__adRequests[0]), new URL(articleB).pathname)
    assert.equal(state.loaderRequests, 1)
    assert.deepEqual(state.errors, [])
    await context.close()
  }
  report.checks.push(
    "Slow loader: leaving for home or another article before load never queues stale ad requests",
  )

  {
    const { context, page, state } = await newContext({ delayed: true })
    await page.goto(articleA, { waitUntil: "domcontentloaded" })
    await page.waitForFunction(() => typeof window.spaNavigate === "function")
    await page.locator(".search-button").first().click()
    state.release()
    await page.waitForFunction(() => window.adsbygoogle?.loaded)
    assert.equal(await page.evaluate(() => window.__adRequests.length), 0)
    await page.keyboard.press("Escape")
    await expectRequests(page, 1)
    assert.deepEqual(state.errors, [])
    await context.close()
  }
  report.checks.push("Pending ad request waits while search is open and runs once after it closes")

  {
    const { context, page, state } = await newContext({ blocked: true, optOut: true })
    await page.goto(articleA, { waitUntil: "networkidle" })
    await navigate(page, articleB)
    assert.equal(state.gaRequests, 0)
    assert.equal(state.loaderRequests, 1)
    assert.equal(await page.locator(selector).count(), 1)
    assert.deepEqual(state.errors, [])
    await context.close()
  }
  report.checks.push("Blocked AdSense does not break SPA; existing GA opt-out is preserved")
  {
    // This existing page performs a full meta-refresh to the recommended tag list.
    const { context, page, state } = await newContext()
    await page.goto(toUrl("myfavorite.html"), { waitUntil: "networkidle" })
    await page.waitForURL("**/tags/**")
    await page.waitForFunction(() => typeof window.spaNavigate === "function")
    assert.equal(await page.locator("ins.adsbygoogle").count(), 0)
    assert.equal(state.loaderRequests, 0)
    assert.deepEqual(state.errors, [])
    await context.close()
  }
  report.checks.push(
    "Existing recommended-notes redirect remains ad-free; graph/backlink positions and dark/reader modes preserved",
  )
  await writeFile(path.join(artifacts, "report.json"), JSON.stringify(report, null, 2) + "\n")
  console.log(JSON.stringify(report, null, 2))
} finally {
  await browser.close()
  await new Promise((resolve) => server.close(resolve))
}
