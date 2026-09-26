import { initCursor, initMagnetic } from "./modules/cursor"
import { initHeader } from "./modules/header"
import { initHeroExtras } from "./modules/hero"
import { initMarquees } from "./modules/marquee"
import { initProjects } from "./modules/projects"
import { initReveals } from "./modules/reveal"
import {
  initAbout,
  initContact,
  initExperience,
  initStack,
} from "./modules/sections"
import { initAurora } from "./modules/aurora"
import { initTimelinePath } from "./modules/timeline-path"
import { initTilt } from "./modules/tilt"
import { ScrollTrigger } from "./motion"
import { initAnchorLinks, initSmoothScroll } from "./smooth-scroll"

let started = false

/**
 * Motor de movimiento: GSAP + ScrollTrigger + Lenis.
 * Se carga con `import()` diferido desde el bundle crítico, de modo que el
 * primer pintado y la interacción no dependen de este paquete (Guía §1.3).
 */
export function initScroll() {
  if (started) return
  started = true

  initSmoothScroll()
  initAnchorLinks()
  initAurora()
  initCursor()
  initHeader()
  initMarquees()

  // Se inicializa primero el contenedor fijado (pinning) de proyectos
  // para que el cálculo de posiciones de las secciones inferiores sea exacto.
  initProjects()

  // Inicialización de secciones y trazados
  initReveals()
  initAbout()
  initExperience()
  initTimelinePath()
  initStack()
  initContact()

  initTilt()
  initMagnetic()
  initHeroExtras()

  // Actualizaciones de cálculo de ScrollTrigger tras renderizado completo
  window.addEventListener("load", () => ScrollTrigger.refresh())
  document.fonts?.ready?.then(() => ScrollTrigger.refresh())

  setTimeout(() => ScrollTrigger.refresh(), 150)
  setTimeout(() => ScrollTrigger.refresh(), 600)

  ScrollTrigger.refresh()
}
