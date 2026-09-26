import { q, qa } from "../lib/dom"

/** Drawer modal de detalle de cada proyecto (Guía §6.3). */
export function initProjectDetail() {
  const root = q<HTMLElement>("[data-project-drawer]")
  if (!root) return

  const panel = q<HTMLElement>("[data-drawer-panel]", root)
  const backdrop = q<HTMLElement>("[data-drawer-backdrop]", root)
  const closeButton = q<HTMLButtonElement>("[data-drawer-close]", root)
  const title = q<HTMLElement>("[data-drawer-title]", root)
  const kicker = q<HTMLElement>("[data-drawer-kicker]", root)
  const contents = qa<HTMLElement>("[data-drawer-panel-item]", root)

  if (!panel || !backdrop) return

  const setOpen = (next: boolean) => {
    root.classList.toggle("hidden", !next)
    root.classList.toggle("pointer-events-none", !next)
    root.setAttribute("aria-hidden", String(!next))

    // El drawer vive en el bundle crítico, así que avisa a Lenis en lugar de
    // importarlo; `overflow-hidden` cubre el caso en que aún no esté listo.
    document.documentElement.classList.toggle("overflow-hidden", next)
    document.dispatchEvent(
      new CustomEvent("portfolio:scroll-lock", { detail: { locked: next } }),
    )

    backdrop.classList.toggle("opacity-0", !next)
    panel.classList.toggle("translate-x-full", !next)

    if (next) {
      const scroller = q<HTMLElement>("[data-lenis-prevent]", panel)
      scroller?.setAttribute("tabindex", "-1")
      scroller?.focus?.()
      document.addEventListener("keydown", onKeydown)
    } else {
      document.removeEventListener("keydown", onKeydown)
      trigger?.focus()
    }
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") setOpen(false)
  }

  const show = (value: string) => {
    const content = contents.find(
      (item) => item.dataset.title === value,
    )
    if (!content) return

    contents.forEach((item) => {
      item.hidden = item !== content
    })

    const project = content.dataset.title ?? ""
    if (title) title.textContent = project
    if (kicker) kicker.textContent = "Detalle del proyecto"

    q<HTMLElement>("[data-lenis-prevent]", panel)?.scrollTo({ top: 0 })
    setOpen(true)
  }

  let trigger: HTMLElement | null = null

  qa<HTMLElement>("[data-project-detail]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault()
      trigger = button
      show(button.dataset.projectDetail ?? "")
    })
  })

  closeButton?.addEventListener("click", () => setOpen(false))
  backdrop.addEventListener("click", () => setOpen(false))
}
