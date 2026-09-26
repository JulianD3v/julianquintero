import { q, qa } from "../lib/dom"
import { site } from "@/data/site"

const OPEN_METEO =
  "https://api.open-meteo.com/v1/forecast?latitude=6.2442&longitude=-75.5812" +
  "&current=temperature_2m,weather_code&timezone=America%2FBogota"

const REFRESH = 10 * 60 * 1000

const ICONS: Record<string, string> = {
  sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>',
  "cloud-sun":
    '<circle cx="8" cy="8" r="3"/><path d="M8 2.6v1.4M2.6 8h1.4M4.2 4.2l1 1M11.8 4.2l-1 1"/><path d="M9.5 19h7.8a3.2 3.2 0 0 0 .2-6.4 4.6 4.6 0 0 0-8.8-1.1A3.8 3.8 0 0 0 9.5 19Z"/>',
  cloud: '<path d="M7 18h10.2a3.4 3.4 0 0 0 .2-6.8 4.9 4.9 0 0 0-9.3-1.2A4 4 0 0 0 7 18Z"/>',
  rain: '<path d="M7 15h10.2a3.4 3.4 0 0 0 .2-6.8 4.9 4.9 0 0 0-9.3-1.2A4 4 0 0 0 7 15Z"/><path d="M8.5 18.2l-.8 2.3M12.4 18.2l-.8 2.3M16.3 18.2l-.8 2.3"/>',
  drizzle:
    '<path d="M7 15h10.2a3.4 3.4 0 0 0 .2-6.8 4.9 4.9 0 0 0-9.3-1.2A4 4 0 0 0 7 15Z"/><path d="M9 18.4h.01M12 19.6h.01M15 18.4h.01"/>',
  snow: '<path d="M7 15h10.2a3.4 3.4 0 0 0 .2-6.8 4.9 4.9 0 0 0-9.3-1.2A4 4 0 0 0 7 15Z"/><path d="M9 19h.01M12 20.2h.01M15 19h.01"/>',
  fog: '<path d="M7 14h10.2a3.4 3.4 0 0 0 .2-6.8 4.9 4.9 0 0 0-9.3-1.2A4 4 0 0 0 7 14Z"/><path d="M5 17.5h14M7 20.5h10"/>',
  storm:
    '<path d="M7 14h10.2a3.4 3.4 0 0 0 .2-6.8 4.9 4.9 0 0 0-9.3-1.2A4 4 0 0 0 7 14Z"/><path d="m13 16-3 4h3l-1 3 4-5h-3l1.5-2Z"/>',
}

const CONDITIONS: Record<string, string> = {
  "0": "Despejado",
  "1": "Mayormente despejado",
  "2": "Parcialmente nublado",
  "3": "Nublado",
  "45": "Niebla",
  "48": "Niebla con escarcha",
  "51": "Llovizna ligera",
  "53": "Llovizna",
  "55": "Llovizna intensa",
  "61": "Lluvia ligera",
  "63": "Lluvia",
  "65": "Lluvia intensa",
  "71": "Nevada ligera",
  "73": "Nevada",
  "75": "Nevada intensa",
  "80": "Chubascos",
  "81": "Chubascos",
  "82": "Chubascos violentos",
  "95": "Tormenta",
  "96": "Tormenta con granizo",
  "99": "Tormenta con granizo",
}

const CACHE_KEY = "bento:weather"
const CACHE_TTL = REFRESH * 2

const readCache = (): { temp: string; code: string; label: string } | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { temp: string; code: string; at: number }
    if (Date.now() - parsed.at > CACHE_TTL) return null
    return { temp: parsed.temp, code: parsed.code, label: CONDITIONS[parsed.code] ?? "—" }
  } catch {
    return null
  }
}

const paint = (temp: string, code: string) => {
  const tempEl = q<HTMLElement>("[data-bento-temp]")
  const labelEl = q<HTMLElement>("[data-bento-weather-label]")
  const iconEl = q<SVGElement>("[data-bento-weather-icon]")

  if (tempEl) tempEl.textContent = temp
  if (labelEl) labelEl.textContent = CONDITIONS[code] ?? "—"
  if (iconEl) {
    const key =
      code === "0" || code === "1"
        ? "sun"
        : code === "2"
          ? "cloud-sun"
          : code === "3"
            ? "cloud"
            : code === "45" || code === "48"
              ? "fog"
              : code.startsWith("5")
                ? "drizzle"
                : code.startsWith("7")
                  ? "snow"
                  : code.startsWith("9")
                    ? "storm"
                    : "rain"
    iconEl.innerHTML = ICONS[key] ?? ICONS.sun
  }
}

async function loadWeather() {
  const cached = readCache()
  if (cached) paint(cached.temp, cached.code)

  try {
    const response = await fetch(OPEN_METEO, { cache: "no-store" })
    if (!response.ok) throw new Error(String(response.status))

    const data = (await response.json()) as {
      current?: { temperature_2m?: number; weather_code?: number }
    }

    const temp = Math.round(data.current?.temperature_2m ?? 0)
    const code = String(data.current?.weather_code ?? 0)

    paint(String(temp), code)

    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ temp: String(temp), code, at: Date.now() }),
    )
  } catch {
    if (!cached) {
      q<HTMLElement>("[data-bento-weather-label]")?.replaceChildren(
        document.createTextNode("Sin conexión"),
      )
    }
  }
}

/** Widget de clima y hora local en Medellín (Open-Meteo, sin API key). */
function initWeather() {
  if (!q("[data-bento-weather]")) return

  void loadWeather()
  window.setInterval(() => void loadWeather(), REFRESH)
}

function initBentoClock() {
  qa<HTMLElement>("[data-bento-clock]").forEach((clock) => {
    const timeZone = clock.dataset.timezone ?? site.timezone
    const formatter = new Intl.DateTimeFormat("es-CO", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    const tick = () => {
      clock.textContent = formatter.format(new Date())
    }

    tick()
    window.setInterval(tick, 20_000)
  })
}

interface Repo {
  pushed_at: string
  fork: boolean
}

function relativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.round(diff / 60_000)

  if (minutes < 60) return `hace ${Math.max(1, minutes)} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  if (days < 30) return `hace ${days} d`
  return `hace ${Math.round(days / 30)} meses`
}

/** Widget de estado GitHub: repositorios activos y última actividad. */
async function loadGithub() {
  const card = q<HTMLElement>("[data-bento-github]")
  if (!card) return

  const activity = q<HTMLElement>("[data-bento-github-activity]")
  const repos = q<HTMLElement>("[data-bento-github-repos]")
  if (!activity) return

  try {
    const response = await fetch(
      "https://api.github.com/users/JulianD3v/repos?sort=pushed&per_page=100",
      { headers: { Accept: "application/vnd.github+json" } },
    )
    if (!response.ok) throw new Error(String(response.status))

    const list = (await response.json()) as Repo[]
    const own = list.filter((repo) => !repo.fork)
    const latest = own.reduce<string | null>(
      (best, repo) => (!best || repo.pushed_at > best ? repo.pushed_at : best),
      null,
    )

    if (repos) repos.textContent = `${own.length} repositorios públicos`
    activity.textContent = latest
      ? `Último push ${relativeTime(latest)}`
      : "Sin actividad reciente"
  } catch {
    activity.textContent = "Actividad no disponible sin conexión"
  }
}

function initGithub() {
  if (!q("[data-bento-github]")) return
  void loadGithub()
}

/** Onda de "escuchando ahora": barras animadas por CSS, longitudes variadas por JS. */
function initWave() {
  const card = q<HTMLElement>("[data-bento-listening]")
  if (!card) return

  const tracks = [
    "Lofi para programar",
    "Bossa nova para el refactor",
    "Ambient para el deploy",
    "Jazz para revisar código",
  ]
  const label = q<HTMLElement>("[data-bento-listening-track]")
  let index = 0

  window.setInterval(() => {
    index = (index + 1) % tracks.length
    if (label) label.textContent = tracks[index]
  }, 30_000)
}

/** Widgets vivos del Bento Grid de "Sobre mí". */
export function initBento() {
  initWeather()
  initBentoClock()
  initGithub()
  initWave()
}
