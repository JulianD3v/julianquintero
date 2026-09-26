import { q, qa } from "../lib/dom"

import { gsap } from "../motion"

const DEFAULT_MAX = 8

/**
 * Tilt 3D con reflejo especular y físicas elásticas (Guía §4.2 y §5.1).
 * `will-change: transform` se aplica solo mientras la tarjeta está activa
 * para no reserving memoria de vídeo de forma permanente.
 */
export function initTilt(scope: ParentNode = document) {
  if (!window.matchMedia("(pointer: fine)").matches) return

  qa<HTMLElement>("[data-tilt]", scope).forEach((card) => {
    if (card.dataset.tiltReady === "true") return
    card.dataset.tiltReady = "true"

    const max = Number(card.dataset.tiltMax ?? DEFAULT_MAX)
    const glow = q<HTMLElement>("[data-tilt-glow]", card)

    const rotateX = gsap.quickTo(card, "rotationX", {
      duration: 0.5,
      ease: "power3.out",
    })
    const rotateY = gsap.quickTo(card, "rotationY", {
      duration: 0.5,
      ease: "power3.out",
    })
    const lift = gsap.quickTo(card, "z", { duration: 0.5, ease: "power3.out" })

    const move = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height

      card.style.setProperty("--mouse-x", `${x * 100}%`)
      card.style.setProperty("--mouse-y", `${y * 100}%`)

      rotateY((x - 0.5) * max * 2)
      rotateX((0.5 - y) * max * 2)
    }

    const enter = () => {
      card.classList.add("will-change-transform")
      glow?.classList.add("opacity-100")
      lift(28)
    }

    const leave = () => {
      card.classList.remove("will-change-transform")
      glow?.classList.remove("opacity-100")
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.55)",
        overwrite: true,
      })
    }

    card.addEventListener("mouseenter", enter)
    card.addEventListener("mousemove", move, { passive: true })
    card.addEventListener("mouseleave", leave)
    card.addEventListener("blur", leave, true)
  })
}
