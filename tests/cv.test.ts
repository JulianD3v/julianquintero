import { existsSync, readFileSync, statSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { site } from "@/data/site"

const root = resolve(__dirname, "..")
const pdfPath = resolve(root, "public", site.cv.pdf.replace(/^\//, ""))

describe("CV descargable", () => {
  it("existe el archivo referenciado por site.cv.pdf", () => {
    expect(site.cv.pdf.startsWith("/")).toBe(true)
    expect(existsSync(pdfPath), `falta ${pdfPath}; ejecuta "npm run cv"`).toBe(true)
  })

  it("es un PDF real y con contenido", () => {
    const { size } = statSync(pdfPath)
    const header = readFileSync(pdfPath).subarray(0, 5).toString("latin1")

    expect(header).toBe("%PDF-")
    expect(size).toBeGreaterThan(5_000)
  })

  it("la página web del CV sigue en el proyecto", () => {
    expect(site.cv.page).toBe("/cv")
    expect(existsSync(resolve(root, "src/pages/cv.astro"))).toBe(true)
  })
})
