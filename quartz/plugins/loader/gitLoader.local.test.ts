import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

test("build loader installs local directories without privileged Windows symlinks", async () => {
  const site = process.cwd()
  fs.mkdirSync(path.join(site, ".quartz-cache"), { recursive: true })
  const fixture = fs.mkdtempSync(path.join(site, ".quartz-cache/build-local-link-"))
  const target = path.join(fixture, "source")
  fs.mkdirSync(target)
  fs.writeFileSync(path.join(target, "package.json"), JSON.stringify({ name: "local-check" }))
  fs.writeFileSync(path.join(target, "marker.txt"), "local plugin")
  process.chdir(fixture)
  const original = fs.symlinkSync
  let attempts = 0
  const spy = test.mock.method(
    fs,
    "symlinkSync",
    (source: fs.PathLike, destination: fs.PathLike, type?: fs.symlink.Type) => {
      attempts++
      // Simulate the user's non-elevated Windows session even if tests run elevated.
      if (process.platform === "win32" && type === "dir") {
        throw Object.assign(new Error("Directory symlink requires elevation"), { code: "EPERM" })
      }
      assert.equal(type, process.platform === "win32" ? "junction" : "dir")
      original(source, destination, type)
    },
  )
  try {
    const { installPlugin } = await import("./gitLoader")
    const spec = { name: "local-check", repo: target, local: true }
    const installed = await installPlugin(spec)
    assert.equal(fs.realpathSync(installed.pluginDir), fs.realpathSync(target))
    assert.equal(
      fs.readFileSync(path.join(installed.pluginDir, "marker.txt"), "utf8"),
      "local plugin",
    )
    await installPlugin(spec)
    assert.equal(attempts, 1, "second load reuses the existing link")
  } finally {
    spy.mock.restore()
    process.chdir(site)
  }
})
