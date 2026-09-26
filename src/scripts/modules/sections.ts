import { q, qa, splitWords } from "../lib/dom"

import { gsap, ScrollTrigger } from "../motion"

/* ------------------------------------------------------------------ Sobre mí */
export function initAbout() {
  qa<HTMLElement>("[data-words]").forEach((element) => {
    if (element.dataset.wordsReady === "true") return
    element.dataset.wordsReady = "true"

    const words = splitWords(element)
    if (!words.length) return

    gsap.from(words, {
      yPercent: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.008,
      scrollTrigger: { trigger: element, start: "top 92%", once: true },
    })
  })

  const image = q<HTMLElement>("[data-about-image]")
  if (image) {
    gsap.from(image, {
      yPercent: 12,
      rotate: 4,
      scale: 0.94,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: image, start: "top 90%", once: true },
    })
  }
}

/* --------------------------------------------------------------- Experiencia */
export function initExperience() {
  const list = q<HTMLElement>("[data-timeline]")
  if (!list) return

  qa<HTMLElement>("[data-timeline-item]", list).forEach((item) => {
    const dot = q<HTMLElement>("[data-timeline-dot]", item)

    ScrollTrigger.create({
      trigger: item,
      start: "top 75%",
      end: "bottom 45%",
      onToggle: (self) => {
        if (!dot) return
        gsap.to(dot, {
          scale: self.isActive ? 1.2 : 0.75,
          opacity: self.isActive ? 1 : 0.5,
          borderColor: self.isActive ? "rgb(var(--c-accent))" : "rgb(var(--c-muted) / 0.3)",
          duration: 0.4,
          ease: "power3.out",
        })
      },
    })
  })
}

/* --------------------------------------------------------------------- Stack */
export function initStack() {
  qa<HTMLElement>("[data-icon-grid]").forEach((grid) => {
    const icons = qa("[data-icon]", grid)
    if (!icons.length) return

    gsap.from(icons, {
      scale: 0.6,
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "back.out(1.6)",
      stagger: { each: 0.035, from: "start" },
      scrollTrigger: { trigger: grid, start: "top 90%", once: true },
    })
  })

  qa<HTMLElement>("[data-float]").forEach((element) => {
    gsap.to(element, {
      y: -8,
      duration: 2.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: Number(element.dataset.float ?? 0),
    })
  })

  qa<HTMLElement>("[data-spotlight]").forEach((card) => {
    const move = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`)
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`)
    }
    card.addEventListener("mousemove", move, { passive: true })
  })
}

/* ------------------------------------------------------------------ Contacto */
export function initContact() {
  const section = q<HTMLElement>("#contacto")
  if (!section) return

  const items = qa("[data-reveal]", section)
  if (!items.length) return

  gsap.from(items, {
    y: 35,
    opacity: 0,
    duration: 0.85,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: { trigger: section, start: "top 88%", once: true },
  })
}
