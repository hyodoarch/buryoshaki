// src/shared/parser.ts
var LANGUAGE = "image-grid-captions";
var PREFIX = "Image Grid Captions Error:\n";
function errorText(error) {
  return PREFIX + (error instanceof Error ? error.message : String(error));
}
function parseGrid(source) {
  const params = /* @__PURE__ */ new Map();
  const images = [];
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("![[") && line.endsWith("]]")) {
      const parts = line.slice(3, -2).split("|");
      if (parts.length > 2) throw new Error("Additional image parameters are not supported.");
      const path = parts[0].trim();
      const caption = parts[1]?.trim() ?? "";
      if (!path || /[:#?\[\]\\]/.test(path) || path.startsWith("/") || !/\.(png|jpe?g|webp|gif|bmp|avif|svg)$/i.test(path)) {
        throw new Error(`Unsupported local image path: ${path}`);
      }
      images.push({ path, caption, alt: caption || path.split("/").pop() });
      continue;
    }
    const colon = line.indexOf(":");
    if (colon < 0) throw new Error(`Invalid line: ${line}`);
    const key = line.slice(0, colon).trim();
    if (key !== "columns" && key !== "gap") throw new Error(`Unknown parameter: ${key}`);
    if (params.has(key)) throw new Error(`Duplicate parameter: ${key}`);
    params.set(key, line.slice(colon + 1).trim());
  }
  if (!params.has("columns")) throw new Error("columns is required.");
  const columns = params.get("columns");
  if (!/^[234]$/.test(columns)) throw new Error("columns must be 2, 3, or 4.");
  const gap = params.get("gap") ?? "8";
  if (!/^\d+$/.test(gap) || !Number.isSafeInteger(Number(gap))) throw new Error("gap must be a non-negative safe integer.");
  if (images.length !== Number(columns)) throw new Error(`columns is ${columns}, but ${images.length} images were found.`);
  return { columns: Number(columns), gap: Number(gap), images };
}

// src/resolve.ts
import { resolveRelative, transformLink } from "@quartz-community/utils/path";
function resolveImage(source, target, allSlugs) {
  const src = transformLink(source, target, { strategy: "shortest", allSlugs });
  const effectiveSource = !source.endsWith("index") && allSlugs.includes(`${source}/index`) ? `${source}/index` : source;
  const canonical = (value) => new URL(value, "https://quartz.invalid/").pathname;
  const exists = allSlugs.some((slug) => canonical(resolveRelative(effectiveSource, slug)) === canonical(src));
  if (!exists) throw new Error(`Image not found: ${target}`);
  return src;
}

// src/compat.ts
function restoreProtectedCaptions(source) {
  return source.replace(/\|__QIC_CAPTION_([A-Za-z0-9_-]+)_END__\]\]/g, (original, encoded) => {
    const caption = Buffer.from(encoded, "base64url").toString("utf8");
    if (Buffer.from(caption).toString("base64url") !== encoded || !/[\[\]]/.test(caption)) return original;
    return `|${caption}]]`;
  });
}

// src/styles.css
var styles_default = ".image-grid-captions {\n  display: flex;\n  flex-wrap: nowrap;\n  align-items: flex-start;\n  width: 100%;\n  padding: 0;\n  border: 0;\n  box-sizing: border-box;\n}\n.image-grid-captions > .image-grid-captions__item {\n  flex: 0 0 auto;\n  min-width: 0;\n  max-width: none;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  float: none;\n  box-sizing: border-box;\n}\n.image-grid-captions:not([data-ready]) > .image-grid-captions__item { visibility: hidden; width: 0; }\n.image-grid-captions .image-grid-captions__image {\n  display: block;\n  width: 100%;\n  max-width: none;\n  max-height: none;\n  min-width: 0;\n  min-height: 0;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  object-fit: contain;\n  box-sizing: border-box;\n}\n.image-grid-captions .image-grid-captions__caption {\n  display: block;\n  margin: 0.35em 0 0;\n  padding: 0;\n  font: inherit;\n  color: inherit;\n  overflow-wrap: anywhere;\n  white-space: pre-wrap;\n}\n.image-grid-captions__error { white-space: pre-wrap; overflow-wrap: anywhere; }\n.image-grid-captions > [hidden] { display: none; }\n";

// src/transformer.ts
var element = (tagName, properties, children = []) => ({ type: "element", tagName, properties, children });
var text = (value) => ({ type: "text", value });
var ImageGridCaptions = () => ({
  name: "ImageGridCaptions",
  markdownPlugins() {
    return [() => (tree) => {
      const walk = (parent) => {
        parent.children.forEach((node, i) => {
          if (node.type === "code" && node.lang === LANGUAGE) {
            parent.children[i] = { type: "paragraph", children: [], data: { hName: "div", hProperties: { "data-image-grid-source": node.value } } };
          } else if ("children" in node) walk(node);
        });
      };
      walk(tree);
    }];
  },
  htmlPlugins(ctx) {
    return [() => (tree, file) => {
      const walk = (parent) => {
        parent.children.forEach((node, i) => {
          if (node.type !== "element") return;
          const source = node.properties["data-image-grid-source"] ?? node.properties.dataImageGridSource;
          if (typeof source !== "string") {
            walk(node);
            return;
          }
          try {
            const grid = parseGrid(restoreProtectedCaptions(source));
            if (!file.data.slug) throw new Error("Quartz page slug is missing.");
            const slug = file.data.slug;
            const items = grid.images.map((image) => {
              const src = resolveImage(slug, image.path, ctx.allSlugs);
              return element("figure", { className: ["image-grid-captions__item"] }, [
                element("img", { className: ["image-grid-captions__image"], src, alt: image.alt, "data-image-path": image.path }),
                ...image.caption ? [element("figcaption", { className: ["image-grid-captions__caption"] }, [text(image.caption)])] : []
              ]);
            });
            parent.children[i] = element("div", { className: ["image-grid-captions"], "data-columns": grid.columns, "data-gap": grid.gap }, items);
          } catch (error) {
            parent.children[i] = element("div", { className: ["image-grid-captions__error"], role: "alert" }, [text(errorText(error))]);
          }
        });
      };
      walk(tree);
    }];
  },
  externalResources() {
    return { css: [{ content: styles_default, inline: true }], js: [{ script: '"use strict";\n(() => {\n  // src/shared/parser.ts\n  var PREFIX = "Image Grid Captions Error:\\n";\n  function errorText(error) {\n    return PREFIX + (error instanceof Error ? error.message : String(error));\n  }\n\n  // src/shared/layout.ts\n  function calculateLayout(width, gap, ratios) {\n    if (!Number.isFinite(width) || width < 0 || !Number.isSafeInteger(gap) || gap < 0 || !ratios.length || ratios.some((r) => !Number.isFinite(r) || r <= 0)) {\n      throw new Error("Invalid layout dimensions.");\n    }\n    const available = width - gap * (ratios.length - 1);\n    if (available <= 0) throw new Error("Container is too narrow for the specified gap.");\n    const height = available / ratios.reduce((a, b) => a + b, 0);\n    return { height, widths: ratios.map((r) => height * r) };\n  }\n\n  // src/shared/renderer.ts\n  function showError(element, error) {\n    element.className = "image-grid-captions__error";\n    element.setAttribute("role", "alert");\n    element.textContent = errorText(error);\n  }\n  function mountGrid(row) {\n    const win = row.ownerDocument.defaultView;\n    const images = Array.from(row.querySelectorAll(".image-grid-captions__image"));\n    const figures = images.map((img) => img.parentElement);\n    const message = row.ownerDocument.createElement("div");\n    message.className = "image-grid-captions__error";\n    message.setAttribute("role", "alert");\n    message.hidden = true;\n    row.append(message);\n    let disposed = false;\n    let failed = false;\n    const gap = Number(row.dataset.gap);\n    const update = () => {\n      if (disposed || failed || images.some((img) => !img.complete || !img.naturalWidth || !img.naturalHeight)) return;\n      const width = row.getBoundingClientRect().width;\n      if (width <= 0) return;\n      try {\n        const layout = calculateLayout(width, gap, images.map((img) => img.naturalWidth / img.naturalHeight));\n        message.hidden = true;\n        row.style.gap = `${gap}px`;\n        figures.forEach((figure, i) => {\n          figure.hidden = false;\n          figure.style.width = `${layout.widths[i]}px`;\n          images[i].style.height = `${layout.height}px`;\n        });\n        row.dataset.ready = "true";\n      } catch (error) {\n        figures.forEach((figure) => {\n          figure.hidden = true;\n        });\n        message.hidden = false;\n        message.textContent = errorText(error);\n      }\n    };\n    const onError = (event) => {\n      if (disposed || failed) return;\n      failed = true;\n      const img = event.target;\n      showError(row, new Error(`Image not found or unreadable: ${img.dataset.imagePath}`));\n      observer2.disconnect();\n    };\n    const observer2 = new win.ResizeObserver(update);\n    images.forEach((img) => {\n      img.addEventListener("load", update);\n      img.addEventListener("error", onError);\n    });\n    observer2.observe(row);\n    for (const img of images) {\n      if (img.complete && !img.naturalWidth) onError({ target: img });\n    }\n    update();\n    return () => {\n      disposed = true;\n      observer2.disconnect();\n      images.forEach((img) => {\n        img.removeEventListener("load", update);\n        img.removeEventListener("error", onError);\n      });\n    };\n  }\n\n  // src/client.ts\n  var active = /* @__PURE__ */ new Map();\n  function scan() {\n    for (const [row, cleanup] of active) {\n      if (!row.isConnected) {\n        cleanup();\n        active.delete(row);\n      }\n    }\n    document.querySelectorAll(".image-grid-captions").forEach((row) => {\n      if (!active.has(row)) active.set(row, mountGrid(row));\n    });\n  }\n  var observer = new MutationObserver(scan);\n  observer.observe(document.documentElement, { childList: true, subtree: true });\n  document.addEventListener("nav", scan);\n  scan();\n})();\n', contentType: "inline", loadTime: "afterDOMReady", spaPreserve: true }] };
  }
});
export {
  ImageGridCaptions,
  ImageGridCaptions as default
};
