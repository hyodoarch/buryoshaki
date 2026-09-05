import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import assert from "node:assert/strict"

const site = path.resolve(import.meta.dirname, "../..")
fs.mkdirSync(path.join(site, ".quartz-cache"), { recursive: true })
const fixture = fs.mkdtempSync(path.join(site, ".quartz-cache/local-link-"))
const target = path.join(fixture, "plugins/local-check")
fs.writeFileSync(
  path.join(fixture, "package.json"),
  JSON.stringify({ name: "local-plugin-verification", version: "0.1.0", type: "module" }),
)
fs.mkdirSync(path.join(target, "dist"), { recursive: true })
fs.writeFileSync(
  path.join(target, "package.json"),
  JSON.stringify({
    name: "local-check",
    version: "0.1.0",
    type: "module",
    main: "dist/index.js",
    quartz: { name: "local-check", category: "transformer" },
  }),
)
fs.writeFileSync(
  path.join(target, "dist/index.js"),
  'export default () => ({ name: "LocalCheck" })',
)
fs.writeFileSync(
  path.join(fixture, "quartz.config.yaml"),
  "plugins:\n  - source: ./plugins/local-check\n    enabled: true\n",
)
fs.writeFileSync(
  path.join(fixture, "quartz.lock.json"),
  JSON.stringify({
    version: "1.0.0",
    plugins: {
      "local-check": {
        source: "./plugins/local-check",
        resolved: "./plugins/local-check",
        commit: "local",
      },
    },
  }),
)
process.chdir(fixture)
const { handlePluginInstallUnified } = await import(
  pathToFileURL(path.join(site, "quartz/cli/plugin-git-handlers.js"))
)
const link = path.join(fixture, ".quartz/plugins/local-check")
await handlePluginInstallUnified({ names: ["local-check"] })
assert.equal(fs.realpathSync(link), fs.realpathSync(target))
await handlePluginInstallUnified({ names: ["local-check"] })
assert.equal(fs.realpathSync(link), fs.realpathSync(target))
assert.ok(fs.lstatSync(link).isSymbolicLink())
fs.unlinkSync(link)
await handlePluginInstallUnified({ names: ["local-check"], clean: true })
assert.equal(fs.realpathSync(link), fs.realpathSync(target))
console.log("PASS: relative lock path supports fresh install, reinstall and restore")
