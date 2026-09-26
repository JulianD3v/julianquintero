import { duplicateTrack, qa } from "../lib/dom"

import { gsap, ScrollTrigger } from "../motion"

export function initMarquees(scope: ParentNode = document) {
  qa<HTMLElement>("[data-marquee]", scope).forEach((element) => {
    const track = element.querySelector<HTMLElement>("[data-marquee-track]")
    if (!track || track.dataset.ready === "true") return
    track.dataset.ready = "true"

    const copies = Number(element.dataset.copies ?? 3)
    const duration = Number(element.dataset.duration ?? 26)
    const direction = (Number(element.dataset.direction ?? 1) as 1 | -1) || 1
    const scrollSpeed = element.dataset.scrollSpeed !== "false"

    duplicateTrack(track, copies)

    const step = 100 / copies

    const tween =
      direction === -1
        ? gsap.fromTo(
            track,
            { xPercent: -step },
            {
              xPercent: 0,
              duration,
              ease: "none",
              repeat: -1,
            },
          )
        : gsap.fromTo(
            track,
            { xPercent: 0 },
            {
              xPercent: -step,
              duration,
              ease: "none",
              repeat: -1,
            },
          )

    // Ralentizar suavemente al pasar el mouse para inspeccionar logos
    element.addEventListener("mouseenter", () => {
      gsap.to(tween, { timeScale: 0.3, duration: 0.4, overwrite: "auto" })
    })
    element.addEventListener("mouseleave", () => {
      gsap.to(tween, { timeScale: 1, duration: 0.4, overwrite: "auto" })
    })

    if (scrollSpeed) {
      ScrollTrigger.create({
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = Math.min(3.5, 1 + Math.abs(self.getVelocity()) / 850)
          gsap.to(tween, { timeScale: boost, duration: 0.35, overwrite: "auto" })
        },
      })
    }
  })
}
