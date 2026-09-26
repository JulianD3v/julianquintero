import { q, qa } from "../lib/dom"

import { gsap } from "../motion"

export function initProjects() {
  const section = q<HTMLElement>("[data-horizontal]")
  const track = q<HTMLElement>("[data-horizontal-track]", section ?? undefined)
  if (!section || !track) return
  const progress = q<HTMLElement>("[data-horizontal-progress]", section)
  const counter = q<HTMLElement>("[data-horizontal-counter]", section)
  const total = qa("[data-horizontal-card]", section).length

  const updateMeta = (value: number) => {
    if (progress) gsap.set(progress, { scaleX: Math.max(0.001, value) })
    if (counter) {
      const index = Math.min(total, Math.max(1, Math.ceil(value * total) || 1))
      counter.textContent = `${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
    }
  }

  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

  const mm = gsap.matchMedia()

  mm.add(
    {
      desktop: "(min-width: 1024px)",
      wide: "(min-width: 1400px)",
    },
    (context) => {
      const { desktop } = context.conditions as { desktop: boolean }

      gsap.set(track, { x: 0 })

      if (!desktop) {
        // Vista vertical en móvil / tablet: revelados simples.
        qa<HTMLElement>("[data-horizontal-card]", section).forEach((card) => {
          gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          })
        })
        return
      }

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // `will-change` solo mientras la pista se está desplazando.
          onToggle: (self) =>
            track.classList.toggle("will-change-transform", self.isActive),
          onUpdate: (self) => updateMeta(self.progress),
          onRefresh: (self) => updateMeta(self.progress),
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
  )

  // Parallax interno de las imágenes
  qa<HTMLElement>("[data-horizontal-card] img", section).forEach((image) => {
    gsap.fromTo(
      image,
      { xPercent: -6 },
      {
        xPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: true,
        },
      },
    )
  })
}
