type RGB = readonly [number, number, number]

type Blob = {
  x: number
  y: number
  radius: number
  alpha: number
  speed: number
  phase: number
  drift: number
}

type Palette = Record<"light" | "dark", readonly RGB[]>

const COLORS: Palette = {
  light: [
    [225, 29, 72],
    [244, 63, 94],
    [239, 68, 68],
  ],
  dark: [
    [255, 69, 84],
    [244, 63, 94],
    [225, 29, 72],
  ],
}

const IDLE_MS = 4000

/**
 * Aurora mesh en Canvas 2D (Guía §4.3): sustituye a los círculos de desenfoque
 * pesados. El `requestAnimationFrame` se pausa solo cuando el canvas no está a
 * la vista, cuando la pestaña está oculta o cuando el usuario lleva rato inactivo.
 */
export function initAurora() {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-aurora]")
  if (!canvas) return

  const context = canvas.getContext("2d", { alpha: true })
  if (!context) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const fine = window.matchMedia("(pointer: fine)").matches
  const cap = fine ? 0.6 : 0.4

  let width = 0
  let height = 0
  let dpr = 1
  let frame = 0
  let running = false
  let visible = true
  let onScreen = true
  let lastInteraction = performance.now()

  const blobs: Blob[] = COLORS.light.map((_color, index) => ({
    x: 0.3 + index * 0.22,
    y: 0.25 + index * 0.18,
    radius: 0.55 - index * 0.06,
    alpha: 0.5 - index * 0.08,
    speed: 0.00006 + index * 0.00002,
    phase: index * 2.1,
    drift: 0.6 + index * 0.35,
  }))

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    width = Math.max(1, Math.round(rect.width))
    height = Math.max(1, Math.round(rect.height))
    dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = Math.round(width * dpr * cap)
    canvas.height = Math.round(height * dpr * cap)
    context.setTransform(cap * dpr, 0, 0, cap * dpr, 0, 0)

    if (reduced) draw(0)
  }

  const draw = (time: number) => {
    const dark = document.documentElement.classList.contains("dark")
    const palette = dark ? COLORS.dark : COLORS.light

    context.clearRect(0, 0, width, height)
    context.globalCompositeOperation = "lighter"

    blobs.forEach((blob, index) => {
      const t = time * blob.speed
      const x =
        (blob.x + Math.sin(t + blob.phase) * 0.14 * blob.drift) * width
      const y =
        (blob.y + Math.cos(t * 0.8 + blob.phase) * 0.1 * blob.drift) * height
      const r = blob.radius * Math.max(width, height)

      const [r8, g8, b8] = palette[index]
      const gradient = context.createRadialGradient(x, y, 0, x, y, r)
      gradient.addColorStop(0, `rgba(${r8}, ${g8}, ${b8}, ${blob.alpha})`)
      gradient.addColorStop(0.55, `rgba(${r8}, ${g8}, ${b8}, ${blob.alpha * 0.28})`)
      gradient.addColorStop(1, `rgba(${r8}, ${g8}, ${b8}, 0)`)

      context.fillStyle = gradient
      context.beginPath()
      context.arc(x, y, r, 0, Math.PI * 2)
      context.fill()
    })

    context.globalCompositeOperation = "source-over"
  }

  const loop = (time: number) => {
    draw(time)
    frame = requestAnimationFrame(loop)
  }

  const start = () => {
    if (running || reduced) return
    running = true
    frame = requestAnimationFrame(loop)
  }

  const stop = () => {
    if (!running) return
    running = false
    cancelAnimationFrame(frame)
  }

  const sync = () => {
    const idle = performance.now() - lastInteraction > IDLE_MS
    if (visible && onScreen && (!idle || reduced)) start()
    else stop()
  }

  // Pausa automática cuando el canvas no está a la vista (Guía §4.3).
  const observer = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    },
    { threshold: 0 },
  )
  observer.observe(canvas)

  document.addEventListener("visibilitychange", () => {
    visible = document.visibilityState === "visible"
    sync()
  })

  const wake = () => {
    lastInteraction = performance.now()
    sync()
  }

  window.addEventListener("pointermove", wake, { passive: true })
  window.addEventListener("scroll", wake, { passive: true })
  window.addEventListener("resize", () => {
    resize()
    if (reduced) sync()
  })

  resize()
  sync()
}
