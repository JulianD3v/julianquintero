import { q, qa } from "../lib/dom"

import { gsap } from "../motion"

const DOT = "[data-cursor-dot]"
const RING = "[data-cursor-ring]"

/**
 * Etiqueta contextual del cursor (Guía §5.1):
 * - enlace externo → flecha ↗
 * - proyecto / imagen → "Ver"
 * - cualquier otro control interactivo → sin etiqueta
 */
function contextualLabel(element: HTMLElement): string {
  const explicit = element.dataset.cursor
  if (explicit) return explicit

  if (element.matches("[data-project-detail], [data-cursor-view]")) return "Ver"

  if (element instanceof HTMLAnchorElement) {
    const href = element.getAttribute("href") ?? ""
    const external =
      element.target === "_blank" || /^https?:\/\//i.test(href)
    if (external && !href.startsWith("mailto:")) return "↗"
  }

  return ""
}

export function initCursor() {
  const dot = q<HTMLElement>(DOT)
  const ring = q<HTMLElement>(RING)
  const fine = window.matchMedia("(pointer: fine)").matches

  if (!dot || !ring || !fine) {
    dot?.remove()
    ring?.remove()
    document.documentElement.classList.remove("has-cursor")
    return
  }

  document.documentElement.classList.add("has-cursor")

  const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" })
  const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" })
  const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" })
  const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" })

  const move = (event: MouseEvent) => {
    dotX(event.clientX)
    dotY(event.clientY)
    ringX(event.clientX)
    ringY(event.clientY)
    gsap.to(dot, { opacity: 1, duration: 0.2 })
    gsap.to(ring, { opacity: 1, duration: 0.3 })
  }

  const over = (event: Event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      "a, button, [data-cursor]",
    )
    if (!target) return
    const size = Number(target.dataset.cursorSize ?? 72)
    const label = contextualLabel(target)
    ring.dataset.label = label
    gsap.to(ring, {
      width: size,
      height: size,
      borderWidth: label ? 0 : 1,
      backgroundColor: label
        ? "rgb(var(--c-accent) / 1)"
        : "rgb(var(--c-accent) / 0)",
      duration: 0.4,
      ease: "power3.out",
    })
    gsap.to(dot, { scale: 0.35, duration: 0.3 })
  }

  const out = (event: Event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      "a, button, [data-cursor]",
    )
    if (!target) return
    ring.dataset.label = ""
    gsap.to(ring, {
      width: 40,
      height: 40,
      backgroundColor: "rgb(var(--c-accent) / 0)",
      borderWidth: 1,
      duration: 0.4,
      ease: "power3.out",
    })
    gsap.to(dot, { scale: 1, duration: 0.3 })
  }

  const leave = () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
  }

  const enter = () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
  }

  window.addEventListener("mousemove", move, { passive: true })
  document.addEventListener("mouseover", over)
  document.addEventListener("mouseout", out)
  document.documentElement.addEventListener("mouseleave", leave)
  document.documentElement.addEventListener("mouseenter", enter)

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 })
  gsap.set([dot, ring], { opacity: 0 })
}

export function initMagnetic(scope: ParentNode = document) {
  if (!window.matchMedia("(pointer: fine)").matches) return

  qa<HTMLElement>("[data-magnetic]", scope).forEach((element) => {
    const strength = Number(element.dataset.magnetic ?? 0.35)
    const target = (element.dataset.magneticTarget && q(element.dataset.magneticTarget)) ?? element

    const xTo = gsap.quickTo(target, "x", { duration: 0.5, ease: "power3.out" })
    const yTo = gsap.quickTo(target, "y", { duration: 0.5, ease: "power3.out" })

    const enter = () =>
      gsap.to(element, { scale: 1.06, duration: 0.4, ease: "power3.out" })
    const leave = () => {
      xTo(0)
      yTo(0)
      gsap.to(element, { scale: 1, duration: 0.5, ease: "power3.out" })
    }

    const move = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength)
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength)
    }

    element.addEventListener("mouseenter", enter)
    element.addEventListener("mouseleave", leave)
    element.addEventListener("mousemove", move)
  })
}
