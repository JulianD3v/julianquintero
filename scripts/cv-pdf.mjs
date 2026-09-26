/**
 * Genera `public/cv-julian-quintero.pdf` a partir de la página `/cv`.
 *
 * Flujo (lo que hace `npm run cv`):
 *   1. Compila el sitio para tener `dist/cv/index.html`.
 *   2. Sirve `dist/` con un servidor http estático mínimo.
 *   3. Lanza Chrome/Edge en modo headless con `--print-to-pdf`.
 *   4. Copia el PDF a `public/` y vuelve a compilar para publicarlo.
 *
 * Las rutas del navegador se pueden forzar con CHROME_PATH.
 */
import { spawn } from "node:child_process"
import { createReadStream, createWriteStream, existsSync, statSync } from "node:fs"
import { mkdir, rm, stat } from "node:fs/promises"
import { createServer } from "node:http"
import { dirname, extname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const dist = join(root, "dist")
const target = join(root, "public", "cv-julian-quintero.pdf")
const PORT = 4399

const BROWSERS = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean)

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
}

const run = (command, args) =>
  new Promise((done, fail) => {
    const child = spawn(command, args, { stdio: "inherit", shell: false })
    child.on("error", fail)
    child.on("exit", (code) =>
      code === 0 ? done() : fail(new Error(`${command} salió con ${code}`)),
    )
  })

/** Se invoca el CLI de Astro con el mismo Node para no depender de npx/cmd. */
const build = () =>
  run(process.execPath, [join(root, "node_modules", "astro", "astro.js"), "build"])

const isFile = (path) => {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}

const serve = () =>
  new Promise((done) => {
    const server = createServer((request, response) => {
      const url = new URL(request.url ?? "/", `http://localhost:${PORT}`)
      let path = join(dist, decodeURIComponent(url.pathname))

      if (!isFile(path)) {
        const index = join(path, "index.html")
        if (!isFile(index)) {
          response.writeHead(404).end("not found")
          return
        }
        path = index
      }

      response.writeHead(200, {
        "content-type": MIME[extname(path)] ?? "application/octet-stream",
        "cache-control": "no-store",
      })
      createReadStream(path).pipe(response)
    })

    server.listen(PORT, () => done(server))
  })

const printToPdf = async (browser) => {
  const temporary = join(root, ".cv-tmp.pdf")
  await rm(temporary, { force: true })

  await run(browser, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--disable-extensions",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=10000",
    "--no-pdf-header-footer",
    `--print-to-pdf=${temporary}`,
    `http://localhost:${PORT}/cv/`,
  ])

  return temporary
}

const main = async () => {
  const browser = BROWSERS.find((path) => existsSync(path))
  if (!browser) {
    throw new Error(
      "No se encontró Chrome ni Edge. Define CHROME_PATH con la ruta del navegador.",
    )
  }

  console.log("→ compilando el sitio")
  await build()

  console.log("→ generando el PDF con", browser)
  const server = await serve()

  try {
    const temporary = await printToPdf(browser)
    const { size } = await stat(temporary)

    if (size < 5_000) {
      throw new Error(`El PDF salió sospechosamente pequeño (${size} bytes)`)
    }

    await mkdir(dirname(target), { recursive: true })

    await new Promise((done, fail) => {
      createReadStream(temporary)
        .pipe(createWriteStream(target))
        .on("finish", done)
        .on("error", fail)
    })

    await rm(temporary, { force: true })
    console.log(`✓ public/cv-julian-quintero.pdf (${(size / 1024).toFixed(0)} kB)`)
  } finally {
    server.close()
  }

  console.log("→ recompilando para publicar el PDF")
  await build()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
