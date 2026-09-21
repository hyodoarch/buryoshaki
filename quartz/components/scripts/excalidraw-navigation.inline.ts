// Excalidraw専用ページのパン・ズーム。記事内の埋め込みには適用しない。
type ExcalidrawPoint = { x: number; y: number }

const MIN_ZOOM = 0.1
const MAX_ZOOM = 5
const ZOOM_STEP = 0.15

function initExcalidrawNavigation() {
  const page = document.querySelector<HTMLElement>('.page[data-frame="excalidraw"]')
  const container = page?.querySelector<HTMLElement>(".excalidraw-container")
  const svg = container?.querySelector<SVGSVGElement>("svg")
  if (!page || !container || !svg) return
  if (container.dataset.siteNavigation === "true") return

  container.dataset.siteNavigation = "true"
  const overlays = page.querySelector<HTMLElement>(".excalidraw-overlays")
  const matrix = new DOMMatrix(getComputedStyle(svg).transform)
  let zoom = matrix.a
  let panX = matrix.e
  let panY = matrix.f

  const pointers = new Map<number, ExcalidrawPoint>()
  const controller = new AbortController()
  const listenerOptions = { capture: true, signal: controller.signal }

  function isInside(event: Event) {
    return event.target instanceof Node && container!.contains(event.target)
  }

  function isInteractive(target: EventTarget | null) {
    return (
      target instanceof Element &&
      target.closest('a, button, input, textarea, select, [contenteditable="true"]') !== null
    )
  }

  function updateOverlays() {
    if (!overlays) return
    const ctm = svg!.getScreenCTM()
    if (!ctm) return

    const rect = container!.getBoundingClientRect()
    const offsetX = Number(overlays.dataset.offsetX) || 0
    const offsetY = Number(overlays.dataset.offsetY) || 0

    overlays.querySelectorAll<HTMLElement>(".excalidraw-overlay").forEach((element) => {
      const x = (Number(element.dataset.x) || 0) + offsetX
      const y = (Number(element.dataset.y) || 0) + offsetY
      const width = Number(element.dataset.w) || 0
      const height = Number(element.dataset.h) || 0

      element.style.left = `${x * ctm.a + ctm.e - rect.left}px`
      element.style.top = `${y * ctm.d + ctm.f - rect.top}px`
      element.style.width = `${width * ctm.a}px`
      element.style.height = `${height * ctm.d}px`
      element.style.display = "flex"
    })
  }

  function render() {
    svg!.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`
    updateOverlays()
  }

  // 指定した画面上の点を動かさずにズームする。
  function zoomAt(nextZoom: number, clientX: number, clientY: number) {
    const rect = container!.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom))
    const ratio = clamped / zoom

    panX = x - (x - panX) * ratio
    panY = y - (y - panY) * ratio
    zoom = clamped
  }

  // ホイールはポインタ位置を中心にする。
  document.addEventListener(
    "wheel",
    (event) => {
      if (!isInside(event)) return
      event.preventDefault()
      event.stopImmediatePropagation()
      if (event.deltaY === 0) return

      const step = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      zoomAt(zoom + step, event.clientX, event.clientY)
      render()
    },
    { ...listenerOptions, passive: false },
  )

  // ボタンは表示領域の中心を基準にする。
  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return
      const button = event.target.closest<HTMLButtonElement>(".excalidraw-controls > button")
      if (!button || !page.contains(button)) return

      const isZoomIn = button.matches(".excalidraw-zoom-in")
      const isZoomOut = button.matches(".excalidraw-zoom-out")
      const isReset = button.matches(".excalidraw-reset")
      if (!isZoomIn && !isZoomOut && !isReset) return

      event.preventDefault()
      event.stopImmediatePropagation()
      if (isReset) {
        zoom = 1
        panX = 0
        panY = 0
      } else {
        const rect = container.getBoundingClientRect()
        zoomAt(
          zoom + (isZoomIn ? ZOOM_STEP : -ZOOM_STEP),
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
        )
      }
      render()
    },
    listenerOptions,
  )

  // 既存処理との二重実行を防ぎ、Pointer Eventsで操作状態をまとめて管理する。
  for (const type of ["mousedown", "touchstart", "touchmove", "touchend"]) {
    document.addEventListener(
      type,
      (event) => {
        if (isInside(event)) event.stopImmediatePropagation()
      },
      listenerOptions,
    )
  }

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (!isInside(event) || isInteractive(event.target)) return
      if (event.pointerType === "mouse" && event.button !== 0) return
      if (pointers.size >= 2) return

      event.preventDefault()
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
      container.setPointerCapture(event.pointerId)
      container.style.cursor = "grabbing"
    },
    listenerOptions,
  )

  document.addEventListener(
    "pointermove",
    (event) => {
      const previous = pointers.get(event.pointerId)
      if (!previous) return
      event.preventDefault()

      const before = [...pointers.values()]
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
      const after = [...pointers.values()]

      if (after.length === 1) {
        panX += event.clientX - previous.x
        panY += event.clientY - previous.y
      } else {
        // 2本指の中点を中心にズームし、中点の移動にも追従する。
        const midpoint = (points: ExcalidrawPoint[]): ExcalidrawPoint => ({
          x: (points[0].x + points[1].x) / 2,
          y: (points[0].y + points[1].y) / 2,
        })
        const distance = (points: ExcalidrawPoint[]) =>
          Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y)

        const oldMidpoint = midpoint(before)
        const newMidpoint = midpoint(after)
        const oldDistance = distance(before)
        if (oldDistance > 0) {
          zoomAt(zoom * (distance(after) / oldDistance), oldMidpoint.x, oldMidpoint.y)
        }
        panX += newMidpoint.x - oldMidpoint.x
        panY += newMidpoint.y - oldMidpoint.y
      }
      render()
    },
    listenerOptions,
  )

  function endPointer(event: PointerEvent) {
    pointers.delete(event.pointerId)
    if (pointers.size === 0) container!.style.cursor = "grab"
  }

  document.addEventListener("pointerup", endPointer, listenerOptions)
  document.addEventListener("pointercancel", endPointer, listenerOptions)
  container.addEventListener("lostpointercapture", endPointer, { signal: controller.signal })
  window.addEventListener("resize", updateOverlays, { signal: controller.signal })

  // Quartzのページ遷移時に解除し、イベントの重複登録を防ぐ。
  window.addCleanup(() => {
    controller.abort()
    for (const id of pointers.keys()) {
      if (container.hasPointerCapture(id)) container.releasePointerCapture(id)
    }
    pointers.clear()
    container.style.cursor = ""
    delete container.dataset.siteNavigation
  })
}

document.addEventListener("nav", initExcalidrawNavigation)
