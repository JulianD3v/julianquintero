import { prefersReducedMotion } from "./motion-lite"

import { initBento } from "./modules/bento"
import { copyText, initCommandMenu } from "./modules/command-menu"
import { playHeroIntro, prepareHeroIntro } from "./modules/hero-intro"
import { initLoader } from "./modules/loader"
import { initProjectDetail } from "./modules/project-detail"
import { initThemeToggle } from "./modules/theme-transition"

let started = false

/**
 * Bundle crítico: todo lo que el usuario puede necesitar antes de que termine
 * de cargar el motor de movimiento (GSAP + Lenis, ~145 kB).
 */
function initCritical() {
  initThemeToggle()
  initCommandMenu()
  initProjectDetail()
  initBento()
  initCopyButtons()
}

/** Copia al portapapeles con Web APIs, sin depender de GSAP. */
function initCopyButtons() {
  document
    .querySelectorAll<HTMLButtonElement>("[data-copy]")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        await copyText(button.dataset.copy ?? "")

        const label = button.querySelector<HTMLElement>("[data-copy-label]")
        if (!label) return

        const original = label.dataset.original ?? label.textContent ?? ""
        label.dataset.original = original
        label.textContent = "¡Copiado!"

        button.animate(
          [
            { transform: "scale(0.96)" },
            { transform: "scale(1)" },
          ],
          { duration: 500, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
        )

        window.setTimeout(() => {
          label.textContent = original
        }, 2200)
      })
    })
}

export function init() {
  if (started) return
  started = true

  // El hero es el LCP: su entrada va con WAAPI en este bundle para que no
  // dependa del paquete de movimiento.
  prepareHeroIntro()
  playHeroIntro()

  initCritical()

  if (prefersReducedMotion()) {
    // Sin animaciones: todo el contenido queda visible y estático.
    document.querySelector("[data-loader]")?.remove()
    document.documentElement.classList.remove("is-loading")
    return
  }

  // El motor de movimiento se descarga y ejecuta después del primer pintado.
  void import("./scroll").then(({ initScroll }) => {
    initScroll()
  })

  // El loader ya no espera a GSAP: solo a las tipografías, porque nada de lo
  // visible depende del bundle diferido.
  void initLoader()
}
