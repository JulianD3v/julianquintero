import { q } from "../lib/dom"

/**
 * Duración mínima del.loader. Es una marca de agua deliberadamente corta: cada
 * milisegundo aquí retrasa el LCP del hero, que no cuenta como pintado hasta que
 * la cortina se levanta.
 */
const MIN_DURATION = 700
const MAX_WAIT = 2200

const STATUS = [
  { at: 0, text: "Iniciando" },
  { at: 35, text: "Cargando tipografías" },
  { at: 70, text: "Listo" },
]

interface Options {
  /** Promesa adicional que deba resolverse antes de levantar el loader. */
  ready?: Promise<unknown>
}

/**
 * Loader de arranque sin GSAP: solo Web Animations API y rAF.
 * Vive en el bundle crítico para que la pantalla pueda pintarse y el sitio
 * ser navegable sin esperar al paquete de animación (Guía §1.3).
 */
export function initLoader({ ready }: Options = {}): Promise<void> {
  const loader = q<HTMLElement>("[data-loader]")
  if (!loader) return Promise.resolve()

  document.documentElement.classList.add("is-loading")

  const count = q<HTMLElement>("[data-loader-count]", loader)
  const status = q<HTMLElement>("[data-loader-status]", loader)
  const bar = q<HTMLElement>("[data-loader-bar]", loader)

  return new Promise<void>((resolve) => {
    const start = performance.now()
    let settled = false
    let frame = 0

    const cleanup = () => {
      if (settled) return
      settled = true
      cancelAnimationFrame(frame)
      loader.remove()
      document.documentElement.classList.remove("is-loading")
      resolve()
    }

    const exit = loader.animate(
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: "translate3d(0, -100%, 0)" },
      ],
      { duration: 1000, easing: "cubic-bezier(0.76, 0, 0.24, 1)", fill: "forwards" },
    )

    exit.pause()
    exit.finished.then(cleanup).catch(cleanup)

    // Red de seguridad: nunca dejar el scroll bloqueado.
    window.setTimeout(cleanup, MAX_WAIT * 1000 + 2500)

    const tick = () => {
      const value = Math.min(100, ((performance.now() - start) / MIN_DURATION) * 100)

      if (count) count.textContent = String(Math.round(value)).padStart(3, "0")
      if (bar) bar.style.transform = `scaleX(${value / 100})`

      if (status) {
        const current = [...STATUS].reverse().find((step) => value >= step.at)
        if (current && status.textContent !== current.text) status.textContent = current.text
      }

      frame = requestAnimationFrame(tick)
    }

    const leave = () => {
      if (settled) return
      exit.play()
    }

    frame = requestAnimationFrame(tick)

    const fonts = document.fonts?.ready ?? Promise.resolve()
    const gate = Promise.race([
      Promise.all([fonts, ready ?? Promise.resolve()]),
      new Promise((resolve) => window.setTimeout(resolve, MAX_WAIT)),
    ])

    gate.then(() => {
      const wait = () => {
        if (settled) return
        performance.now() - start < MIN_DURATION
          ? window.setTimeout(wait, 60)
          : leave()
      }
      wait()
    })
  })
}
