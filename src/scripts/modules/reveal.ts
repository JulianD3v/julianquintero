import { qa } from "../lib/dom"

import { gsap, ScrollTrigger } from "../motion"

const SELECTOR =
  '[data-reveal], [data-reveal-item], [data-parallax], [data-counter], [data-split="scroll"]'

type RevealOptions = {
  y?: number
  x?: number
  scale?: number
  rotate?: number
  duration?: number
  delay?: number
  stagger?: number
  start?: string
  ease?: string
}

function animateReveal(scope: ParentNode, options: RevealOptions = {}) {
  const {
    y = 36,
    x = 0,
    scale = 1,
    rotate = 0,
    duration = 1,
    delay = 0,
    stagger,
    start = "top 88%",
    ease = "power3.out",
  } = options

  const groups = new Map<Element, HTMLElement[]>()

  qa("[data-reveal-item]", scope).forEach((item) => {
    const group = item.closest<HTMLElement>("[data-reveal-group]") ?? item.parentElement
    if (!group) return
    const list = groups.get(group) ?? []
    list.push(item)
    groups.set(group, list)
  })

  groups.forEach((items, group) => {
    gsap.from(items, {
      y,
      x,
      scale,
      rotate,
      opacity: 0,
      duration,
      delay,
      stagger: stagger ?? Math.min(0.09, 0.5 / items.length),
      ease,
      scrollTrigger: { trigger: group, start, once: true },
    })
  })

  qa("[data-reveal]", scope).forEach((element) => {
    if (element.hasAttribute("data-reveal-item")) return
    gsap.from(element, {
      y,
      x,
      scale,
      rotate,
      opacity: 0,
      duration,
      delay,
      ease,
      scrollTrigger: { trigger: element, start, once: true },
    })
  })
}

function animateParallax(scope: ParentNode) {
  qa<HTMLElement>("[data-parallax]", scope).forEach((element) => {
    const strength = Number(element.dataset.parallax ?? 12)
    const trigger = element.closest<HTMLElement>("[data-parallax-scope]") ?? element.parentElement

    gsap.fromTo(
      element,
      { yPercent: -strength },
      {
        yPercent: strength,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    )
  })
}

function animateCounters(scope: ParentNode) {
  qa<HTMLElement>("[data-counter]", scope).forEach((element) => {
    if (element.dataset.counterReady === "true") return
    element.dataset.counterReady = "true"

    const raw = element.dataset.counter ?? "0"
    // Separa prefijos y sufijos: "+1", "15+", "~3.5", "24/7".
    const parts = raw.match(/^([^\d]*)([\d.,]+)(.*)$/)
    const prefix = parts?.[1] ?? ""
    const suffix = parts?.[3] ?? ""
    const target = Number((parts?.[2] ?? "").replace(/[^\d.]/g, ""))
    const decimals = (raw.split(".")[1] ?? "").length

    if (!parts || Number.isNaN(target)) return

    const state = { value: 0 }
    const decimalsSuffix = decimals ? `.${"0".repeat(decimals)}` : ""
    element.textContent = `${prefix}0${decimalsSuffix}${suffix}`

    gsap.to(state, {
      value: target,
      duration: 1.8,
      ease: "power2.out",
      snap: decimals ? { value: 1 / 10 ** decimals } : undefined,
      onUpdate: () => {
        element.textContent = `${prefix}${state.value.toFixed(decimals)}${suffix}`
      },
      scrollTrigger: { trigger: element, start: "top bottom", once: true },
    })
  })
}

/** Flotación sutil y continua para los acentos (Guía §5.1). */
function animateFloat(scope: ParentNode) {
  qa<HTMLElement>("[data-float]", scope).forEach((element) => {
    if (element.dataset.floatReady === "true") return
    element.dataset.floatReady = "true"

    const strength = Number(element.dataset.float ?? 0.4)

    gsap.to(element, {
      y: -strength * 6,
      duration: 2.2 + strength * 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    })
  })
}

export function initReveals(scope: ParentNode = document) {
  prepareSplitLines(scope)

  if (!qa(SELECTOR, scope).length) return

  animateReveal(scope)
  animateParallax(scope)
  animateCounters(scope)
  animateSplitLines(scope)
  animateFloat(scope)
}

/** Oculta las líneas enmascaradas para que el reveal sea fluido. */
export function prepareSplitLines(scope: ParentNode = document) {
  qa<HTMLElement>('[data-split="scroll"] [data-split-inner]', scope).forEach(
    (inner) => {
      if (inner.dataset.splitReady === "true") return
      inner.dataset.splitReady = "true"
      gsap.set(inner, { yPercent: 112 })
    },
  )
}

function animateSplitLines(scope: ParentNode) {
  qa<HTMLElement>('[data-split="scroll"]', scope).forEach((line) => {
    const inner = line.querySelector<HTMLElement>("[data-split-inner]")
    if (!inner) return

    gsap.to(inner, {
      yPercent: 0,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: line, start: "top 92%", once: true },
    })
  })
}

export function refreshReveals() {
  ScrollTrigger.refresh()
}
