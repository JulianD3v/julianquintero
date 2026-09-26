import { q, qa } from "../lib/dom"

import { gsap } from "../motion"

/**
 * Efectos del hero ligados al scroll y al tiempo. La entrada del hero vive en
 * `hero-intro.ts` (bundle crítico, sin GSAP) para no retrasar el LCP.
 */
export function initHeroExtras() {
  const hero = q<HTMLElement>("[data-hero]")
  if (!hero) return

  initHeroScroll(hero)
  initRotating(hero)
  initClock()
}

function initHeroScroll(hero: HTMLElement) {
  const cue = q<HTMLElement>("[data-hero-cue]", hero)
  const portrait = q("[data-hero-portrait]", hero)
  const content = q<HTMLElement>("[data-hero-content]", hero)

  gsap.to(content, {
    yPercent: -12,
    opacity: 0.2,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  })

  if (portrait) {
    gsap.to(portrait, {
      yPercent: -16,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    })
  }

  if (cue) {
    gsap.to(cue, {
      yPercent: 60,
      autoAlpha: 0,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "40% top", scrub: true },
    })
  }
}

function initRotating(scope: HTMLElement) {
  qa<HTMLElement>("[data-rotate]", scope).forEach((element) => {
    const duration = Number(element.dataset.rotate ?? 24)
    gsap.to(element, {
      rotation: 360,
      duration,
      ease: "none",
      repeat: -1,
    })
  })
}

function initClock() {
  qa<HTMLElement>("[data-clock]").forEach((clock) => {
    const timeZone = clock.dataset.timezone ?? "America/Bogota"
    const formatter = new Intl.DateTimeFormat("es-CO", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    const tick = () => {
      clock.textContent = formatter.format(new Date())
    }

    tick()
    setInterval(tick, 20_000)
  })
}
