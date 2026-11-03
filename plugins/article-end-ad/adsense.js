;(() => {
  const source =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0569052513940110"
  const selector = ".center > .page-footer > .article-end-ad > ins.adsbygoogle"
  const mounted = new WeakSet()
  let loader

  function loadAdSense() {
    if (loader) return loader
    loader = new Promise((resolve, reject) => {
      let script = document.querySelector(
        'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
      )
      if (window.adsbygoogle?.loaded) {
        if (script) script.dataset.persist = ""
        resolve()
        return
      }
      const isNew = !script
      script ??= document.createElement("script")
      script.dataset.persist = ""
      script.addEventListener("load", () => resolve(), { once: true })
      script.addEventListener("error", () => reject(new Error("AdSense could not load")), {
        once: true,
      })
      if (isNew) {
        script.async = true
        script.src = source
        script.crossOrigin = "anonymous"
        document.head.appendChild(script)
      }
    })
    return loader
  }

  document.addEventListener("nav", () => {
    const ad = document.querySelector(selector)
    if (!ad || mounted.has(ad)) return
    mounted.add(ad)

    let cancelled = false
    let requested = ad.hasAttribute("data-adsbygoogle-status")
    let ready = false
    const resize = new ResizeObserver(requestAd)
    const search = new MutationObserver(requestAd)

    function disconnect() {
      resize.disconnect()
      search.disconnect()
    }

    function requestAd() {
      if (cancelled || requested || !ready || !ad.isConnected) return
      if (document.querySelector(".search-container.active")) return
      if (ad.getBoundingClientRect().width <= 0 || ad.getClientRects().length === 0) return
      // Mark before push: nav, resize and search callbacks must never request twice.
      requested = true
      disconnect()
      if (ad.hasAttribute("data-adsbygoogle-status")) return
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.warn("Article-end ad could not be initialized.", error)
      }
    }

    // Quartz calls cleanup before micromorph. Remove the old ins so its processed
    // iframe/attributes cannot be reused for another article (or browser Back).
    window.addCleanup(() => {
      cancelled = true
      disconnect()
      ad.remove()
    })

    resize.observe(ad)
    document.querySelectorAll(".search-container").forEach((container) => {
      search.observe(container, { attributes: true, attributeFilter: ["class"] })
    })

    // Await the actual library, rather than leaving stale requests in the queue
    // when the reader navigates away during a slow load.
    loadAdSense()
      .then(() => {
        ready = true
        requestAd()
      })
      .catch(() => {
        disconnect()
        // A blocker or network failure must not interrupt navigation or Analytics.
      })
  })
})()
