import Lenis from "lenis"

import { gsap, ScrollTrigger, prefersReducedMotion } from "./motion"

let lenis: Lenis | null = null

export function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion()) {
    ScrollTrigger.refresh()
    return null
  }

  lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.7,
    infinite: false,
  })

  lenis.on("scroll", ScrollTrigger.update)

  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  /**
   * El drawer de proyectos vive en el bundle crítico, así que no puede llamar
   * a `stopScroll()` directamente: avisa con este evento.
   */
  const lock = (event: Event) => {
    const { locked } = (event as CustomEvent).detail as { locked: boolean }
    if (locked) stopScroll()
    else startScroll()
  }

  document.addEventListener("portfolio:scroll-lock", lock)

  return lenis
}

export function scrollTo(
  target: string | HTMLElement,
  options: { offset?: number; immediate?: boolean } = {},
) {
  const { offset = -96, immediate = false } = options

  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.35, immediate })
    return
  }

  const element = typeof target === "string" ? q(target) : target
  if (!element) return

  const top =
    element.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" })
}

export function stopScroll() {
  lenis?.stop()
}

export function startScroll() {
  lenis?.start()
}

export function destroyScroll() {
  lenis?.destroy()
  lenis = null
}

function q(selector: string) {
  return document.querySelector(selector)
}

/** Intercepta los anchors internos para usar el scroll suave. */
export function initAnchorLinks() {
  const handler = (event: MouseEvent) => {
    const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
      "a[href]",
    )
    if (!link) return

    const href = link.getAttribute("href") ?? ""
    if (link.target === "_blank" || event.metaKey || event.ctrlKey) return

    const [path, hash] = href.split("#")
    if (hash && (!path || path === window.location.pathname)) {
      event.preventDefault()
      const target = document.getElementById(hash)
      if (target) {
        history.replaceState(null, "", `#${hash}`)
        scrollTo(target, { offset: -88 })
      }
    }
  }

  document.addEventListener("click", handler)

  /**
   * Puente con el bundle crítico: la paleta de comandos y el drawer piden
   * navegar a una sección sin importar si Lenis ya está listo.
   */
  const bridge = (event: Event) => {
    const detail = (event as CustomEvent).detail as
      | { id: string; handled: boolean }
      | undefined
    if (!detail?.id) return

    const target = document.getElementById(detail.id)
    if (!target) return

    detail.handled = true
    scrollTo(target, { offset: -88 })
  }

  document.addEventListener("portfolio:scroll", bridge)

  return () => {
    document.removeEventListener("click", handler)
    document.removeEventListener("portfolio:scroll", bridge)
  }
}
