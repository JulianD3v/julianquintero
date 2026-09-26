import { q, qa } from "../lib/dom"
import { prefersReducedMotion } from "../motion-lite"

/**
 * Entrada del hero en el bundle crítico y sin GSAP.
 *
 * El hero contiene el elemento LCP, así que su animación no puede esperar al
 * paquete diferido de movimiento (~146 kB): con Web Animations API aparece en
 * el primer pintado. Las animaciones ligadas al scroll (parallax, cursores,
 * triggers) siguen living en `hero.ts`.
 */

/** `expo.out` y `power2.out` de GSAP, expresados como `cubic-bezier`. */
const EXPO_OUT = "cubic-bezier(0.16, 1, 0.3, 1)"
const POWER2_OUT = "cubic-bezier(0.215, 0.61, 0.355, 1)"

const REDUCED = () => prefersReducedMotion()

/** Fija el estado inicial del hero. Corre antes del primer pintado. */
export function prepareHeroIntro() {
  const hero = q<HTMLElement>("[data-hero]")
  if (!hero || REDUCED()) return

  qa<HTMLElement>('[data-split="intro"] [data-split-inner]', hero).forEach(
    (line) => {
      line.style.transform = "translateY(112%)"
    },
  )

  qa<HTMLElement>("[data-hero-item]", hero).forEach((item) => {
    item.style.transform = "translateY(28px)"
    item.style.opacity = "0"
  })

  const glow = q<HTMLElement>("[data-hero-glow]", hero)
  if (glow) {
    glow.style.transform = "translate(-50%, -50%) scale(0.6)"
    glow.style.opacity = "0"
  }

  const portrait = q<HTMLElement>("[data-hero-portrait]", hero)
  if (portrait) {
    portrait.style.transform = "translateY(40px)"
    portrait.style.clipPath = "inset(0% 0% 100% 0%)"
  }

  const cue = q<HTMLElement>("[data-hero-cue]", hero)
  if (cue) {
    cue.style.transform = "translateY(-10px)"
    cue.style.opacity = "0"
  }
}

/** Reproduce la entrada. Todo el hero queda visible al terminar. */
export function playHeroIntro() {
  const hero = q<HTMLElement>("[data-hero]")
  if (!hero) return

  const lines = qa<HTMLElement>('[data-split="intro"] [data-split-inner]', hero)
  const items = qa<HTMLElement>("[data-hero-item]", hero)
  const portrait = q<HTMLElement>("[data-hero-portrait]", hero)
  const glow = q<HTMLElement>("[data-hero-glow]", hero)
  const cue = q<HTMLElement>("[data-hero-cue]", hero)

  if (REDUCED()) {
    // Sin animación: se limpia el estado inicial y el hero se ve estático.
    for (const node of [...lines, ...items, portrait, glow, cue]) {
      if (!node) continue
      node.style.transform = ""
      node.style.opacity = ""
      node.style.clipPath = ""
    }
    return
  }

  const animations: Animation[] = []

  const animate = (
    node: HTMLElement | null | undefined,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
  ) => {
    if (!node) return
    const animation = node.animate(keyframes, {
      fill: "backwards",
      easing: EXPO_OUT,
      ...options,
    })
    animations.push(animation)
  }

  lines.forEach((line, index) => {
    animate(
      line,
      [{ transform: "translateY(112%)" }, { transform: "translateY(0)" }],
      { duration: 1400, delay: 100 + index * 90 },
    )
  })

  animate(
    portrait,
    [
      {
        transform: "translateY(40px)",
        clipPath: "inset(0% 0% 100% 0%)",
      },
      { transform: "translateY(0)", clipPath: "inset(0% 0% 0% 0%)" },
    ],
    { duration: 1500, delay: 150 },
  )

  items.forEach((item, index) => {
    animate(
      item,
      [
        { transform: "translateY(28px)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ],
      { duration: 1000, delay: 450 + index * 80 },
    )
  })

  animate(
    glow,
    [
      { transform: "translate(-50%, -50%) scale(0.6)", opacity: 0 },
      { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
    ],
    { duration: 1800, delay: 0, easing: POWER2_OUT },
  )

  animate(
    cue,
    [
      { transform: "translateY(-10px)", opacity: 0 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    { duration: 800, delay: 1100 },
  )

  // Al terminar se borran los estilos inline para no dejar el hero "sucio"
  // (el parallax de `hero.ts` vuelve a escribir `transform` después).
  Promise.allSettled(
    animations.map((animation) => animation.finished),
  ).then(() => {
    for (const node of [...lines, ...items, portrait, glow, cue]) {
      if (!node) continue
      node.style.transform = ""
      node.style.opacity = ""
      node.style.clipPath = ""
    }
  })
}
