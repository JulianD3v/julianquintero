import { gsap } from "../motion"

/**
 * Línea de tiempo SVG viva (Guía §4.4): el trazo que une cada empleo se
 * dibuja con `stroke-dashoffset` en función del scroll.
 */
export function initTimelinePath() {
  const path = document.querySelector<SVGPathElement>("#timeline-path")
  if (!path) return

  const layout = () => {
    const svg = path.ownerSVGElement
    if (!svg) return 0

    const height = svg.getBoundingClientRect().height
    if (!height) return 0

    // viewBox 1:1 con el alto real: las unidades de usuario son píxeles y
    // `getTotalLength()` coincide exactamente con la altura dibujada.
    svg.setAttribute("viewBox", `0 0 16 ${height}`)
    path.setAttribute("d", `M8 0 V ${height}`)
    return path.getTotalLength()
  }

  const length = layout()
  if (!length) return

  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })

  gsap.to(path, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
      trigger: "#experiencia",
      start: "top center",
      end: "bottom bottom",
      scrub: 0.5,
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        const next = layout()
        if (!next) return
        gsap.set(path, {
          strokeDasharray: next,
          strokeDashoffset: next * (1 - self.progress),
        })
      },
    },
  })
}
