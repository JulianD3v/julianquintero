import { q, qa } from "../lib/dom"

const THEME_KEY = "theme"

type Theme = "light" | "dark" | "system"

const THEMES: Theme[] = ["light", "dark", "system"]

const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches

export const getTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_KEY)
  return THEMES.includes(stored as Theme) ? (stored as Theme) : "system"
}

const isDark = (theme: Theme) =>
  theme === "dark" || (theme === "system" && prefersDark())

/** Aplica el tema al documento y sincroniza los iconos / opciones del menú. */
export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", isDark(theme))

  qa<HTMLElement>("[data-theme]").forEach((icon) => {
    icon.classList.toggle("is-active", icon.dataset.theme === theme)
  })

  qa<HTMLElement>("[data-theme-option]").forEach((option) => {
    const active = option.dataset.themeOption === theme
    option.setAttribute("aria-checked", String(active))
    option.classList.toggle("text-fg", active)
    option
      .querySelector<HTMLElement>("[data-theme-check]")
      ?.classList.toggle("opacity-0", !active)
  })
}

const commit = (theme: Theme) => {
  localStorage.setItem(THEME_KEY, theme)
  applyTheme(theme)
}

/**
 * Transición circular de tema con View Transitions API (Guía §6.2).
 * La onda se expande desde el punto exacto del clic hasta cubrir la pantalla.
 */
export function toggleThemeWithTransition(event: MouseEvent, theme: Theme) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (!document.startViewTransition || reduced) {
    commit(theme)
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )

  const transition = document.startViewTransition(() => {
    commit(theme)
  })

  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      )
    })
    .catch(() => {
      /* La transición ya fue aplicada: no hay nada que recuperar. */
    })
}

/** Alterna entre claro y oscuro respetando la preferencia actual. */
export function cycleTheme(event: MouseEvent) {
  const current = isDark(getTheme()) ? "light" : "dark"
  toggleThemeWithTransition(event, current)
}

/** Menú de selección de tema (Claro / Oscuro / Sistema) + botón del header. */
export function initThemeToggle() {
  const button = q<HTMLButtonElement>("#theme-toggle-btn")
  const menu = q<HTMLElement>("#themes-menu")

  applyTheme(getTheme())
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getTheme() === "system") applyTheme("system")
  })

  if (!button || !menu) return

  const close = () => {
    menu.classList.remove("open")
    button.setAttribute("aria-expanded", "false")
  }

  const open = () => {
    menu.classList.add("open")
    button.setAttribute("aria-expanded", "true")
  }

  button.addEventListener("click", (event) => {
    event.stopPropagation()
    menu.classList.contains("open") ? close() : open()
  })

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target as Node)) close()
  })

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close()
  })

  // Cada cambio de tema lanza la onda circular desde el propio botón.
  const fromButton = () => {
    const rect = button.getBoundingClientRect()
    return {
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    } as MouseEvent
  }

  qa<HTMLButtonElement>("[data-theme-option]").forEach((option) => {
    option.addEventListener("click", () => {
      toggleThemeWithTransition(
        fromButton(),
        (option.dataset.themeOption ?? "system") as Theme,
      )
      close()
    })
  })
}
