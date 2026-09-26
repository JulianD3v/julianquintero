import { describe, expect, it } from "vitest"
import { projectImages } from "@/data/project-images"
import { projects } from "@/data/site"

const projectTitles = projects.map((project) => project.title)

describe("mapa tipado de imágenes de proyectos", () => {
  it("cubre todos los proyectos", () => {
    for (const title of projectTitles) {
      expect(projectImages[title], `falta la imagen de "${title}"`).toBeDefined()
    }
  })

  it("no deja imágenes huérfanas", () => {
    const orphans = Object.keys(projectImages).filter(
      (key) => !projectTitles.includes(key as (typeof projectTitles)[number]),
    )

    expect(orphans).toEqual([])
  })

  it("conserva el asset de imagen definido", () => {
    for (const [title, entry] of Object.entries(projectImages)) {
      expect(entry.image, `falta la imagen de "${title}"`).toBeDefined()
    }
  })

  /**
   * `image` solo trae metadata real bajo `astro build`/`astro check`; en Node
   * Vitest lo resuelve Vite como una URL, así que aquí se comprueba el contrato
   * que sí es observable: que la clave del mapa es el título del proyecto.
   */
  it("indexa las imágenes por el título exacto del proyecto", () => {
    for (const project of projects) {
      expect(Object.hasOwn(projectImages, project.title)).toBe(true)
    }
  })
})

describe("proyectos", () => {
  it("no quedan rutas fantasma a /projects/*.webp", () => {
    expect(JSON.stringify(projects)).not.toContain("/projects/")
  })

  it("declara alt text para cada proyecto", () => {
    for (const project of projects) {
      expect(project.imageAlt.length).toBeGreaterThan(3)
    }
  })

  it("mantiene el detalle de los proyectos destacados", () => {
    for (const project of projects) {
      if (!project.detail) continue
      expect(project.detail.role).toBeTruthy()
      expect(project.detail.architecture.length).toBeGreaterThan(0)
    }
  })
})
