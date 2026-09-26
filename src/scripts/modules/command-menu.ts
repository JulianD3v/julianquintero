import { q, qa } from "../lib/dom"
import { site, socials } from "@/data/site"
import { cycleTheme } from "./theme-transition"

/** Atajos de una sola tecla (Guía §6.1). */
const SHORTCUTS: Record<string, string> = {
  p: "go-proyectos",
  e: "go-experiencia",
  c: "copy-email",
  t: "theme",
}

/** Atajos de dos teclas, para no chocar con "c" (copiar). */
const SEQUENCES: Record<string, string> = {
  cv: "cv-pdf",
}

export const scrollToId = (id: string) => {
  const target = document.getElementById(id)
  if (!target) return false

  const detail = { id, handled: false }
  document.dispatchEvent(new CustomEvent("portfolio:scroll", { detail }))

  if (detail.handled) return true

  target.scrollIntoView({ behavior: "smooth", block: "start" })
  return true
}

export const copyText = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

/** Descarga el PDF del CV disparando un enlace temporal con `download`. */
const downloadCv = () => {
  const link = document.createElement("a")
  link.href = site.cv.pdf
  link.download = `CV-${site.name.replace(/\s+/g, "-")}.pdf`
  link.rel = "noopener"
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function initCommandMenu() {
  const root = q<HTMLElement>("[data-command-menu]")
  if (!root) return

  const input = q<HTMLInputElement>("[data-command-input]", root)
  const backdrop = q<HTMLElement>("[data-command-backdrop]", root)
  const empty = q<HTMLElement>("[data-command-empty]", root)
  const items = qa<HTMLButtonElement>("[data-command]", root)

  const openButtons = qa<HTMLButtonElement>("[data-command-open]")
  const hints = qa<HTMLElement>("[data-command-hint]")

  if (hints.length) {
    const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
    hints.forEach((hint) => {
      hint.textContent = isApple ? "⌘K" : "Ctrl K"
    })
  }

  let open = false
  let cursor = 0
  let visible: HTMLButtonElement[] = items
  let sequence = ""
  let sequenceTimer = 0

  const paint = () => {
    items.forEach((item) => {
      const shown = visible.includes(item)
      item.parentElement?.classList.toggle("hidden", !shown)
      item.setAttribute("aria-selected", "false")
    })

    if (cursor >= visible.length) cursor = Math.max(0, visible.length - 1)
    visible[cursor]?.setAttribute("aria-selected", "true")
    empty?.classList.toggle("hidden", visible.length > 0)
    visible[cursor]?.scrollIntoView({ block: "nearest" })
  }

  const filter = () => {
    const query = input?.value.trim().toLowerCase() ?? ""

    visible = items.filter((item) => {
      if (!query) return true
      const haystack = item.dataset.commandSearch ?? ""
      return query.split(/\s+/).every((term) => haystack.includes(term))
    })

    cursor = 0
    paint()
  }

  const move = (step: number) => {
    if (!visible.length) return
    cursor = (cursor + step + visible.length) % visible.length
    paint()
  }

  const setOpen = (next: boolean) => {
    open = next
    root.classList.toggle("hidden", !open)
    root.classList.toggle("pointer-events-none", !open)
    root.setAttribute("aria-hidden", String(!open))
    openButtons.forEach((button) =>
      button.setAttribute("aria-expanded", String(open)),
    )

    if (open) {
      filter()
      input?.focus()
      input?.select()
    } else {
      if (input) input.value = ""
      filter()
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }

    // El panel y el fondo se animan con el unveil, no con JS.
    root.classList.toggle("is-open", open)
  }

  const run = (id: string) => {
    setOpen(false)

    if (id.startsWith("go-")) {
      scrollToId(id.replace("go-", ""))
      return
    }

    switch (id) {
      case "cv-pdf":
        downloadCv()
        return
      case "cv-web":
        window.location.href = site.cv.page
        return
      case "copy-email":
        scrollToId("contacto")
        void copyText(site.email)
        return
      case "mail":
        window.location.href = `mailto:${site.email}`
        return
      case "theme":
        cycleTheme(
          new MouseEvent("click", {
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2,
          }),
        )
        return
      default:
        break
    }

    if (id.startsWith("project-")) {
      const title = id.replace("project-", "")
      const trigger = document.querySelector<HTMLElement>(
        `[data-project-detail="${title}"]`,
      )
      scrollToId("proyectos")
      window.setTimeout(() => trigger?.click(), 420)
      return
    }

    if (id.startsWith("social-")) {
      const social = socials.find(
        (item) => item.icon === id.replace("social-", ""),
      )
      if (!social) return

      if (social.href.startsWith("mailto:")) {
        window.location.href = social.href
      } else {
        window.open(social.href, "_blank", "noopener,noreferrer")
      }
    }
  }

  openButtons.forEach((button) =>
    button.addEventListener("click", () => setOpen(!open)),
  )

  backdrop?.addEventListener("click", () => setOpen(false))

  input?.addEventListener("input", filter)

  input?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(-1)
    } else if (event.key === "Enter") {
      event.preventDefault()
      const target = visible[cursor]
      if (target) run(target.dataset.command ?? "")
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
    }
  })

  items.forEach((item) => {
    item.addEventListener("click", () => run(item.dataset.command ?? ""))
    item.addEventListener("mousemove", () => {
      cursor = visible.indexOf(item)
      paint()
    })
  })

  document.addEventListener("keydown", (event) => {
    const meta = event.metaKey || event.ctrlKey

    if (meta && event.key.toLowerCase() === "k") {
      event.preventDefault()
      setOpen(!open)
      return
    }

    if (!open) return

    const target = event.target as HTMLElement | null
    const isSearchInput = event.target instanceof HTMLInputElement
    const isOtherField =
      event.target instanceof HTMLTextAreaElement ||
      Boolean(target?.isContentEditable)
    const query = isSearchInput ? event.target.value.trim() : ""

    /**
     * Con texto en el buscador manda el texto; con el buscador vacío, las teclas
     * son atajos. Así `⌘K` + `p` navega y `⌘K` + "curriculum" filtra.
     */
    if (isOtherField || (isSearchInput && query !== "")) return
    if (event.metaKey || event.ctrlKey || event.altKey) return

    const key = event.key.toLowerCase()
    if (key.length !== 1) return

    window.clearTimeout(sequenceTimer)
    sequence = (sequence + key).slice(-2)

    // Las secuencias (`cv`) ganan siempre: son inequívocas.
    const sequenceCommand = SEQUENCES[sequence]
    if (sequenceCommand) {
      event.preventDefault()
      sequence = ""
      run(sequenceCommand)
      return
    }

    const command = SHORTCUTS[key]
    if (!command) {
      sequence = ""
      return
    }

    event.preventDefault()

    // Los atajos simples se retrasan unos milisegundos para que "c" no se
    // ejecute antes de que llegue la "v" de "cv".
    sequenceTimer = window.setTimeout(() => {
      sequence = ""
      run(command)
    }, 200)
  })

  // Bloquea el scroll de fondo mientras la paleta está abierta.
  document.documentElement.classList.toggle("overflow-hidden", open)

  setOpen(false)
}
