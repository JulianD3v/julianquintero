import type { ImageMetadata } from "astro"

import celena from "@/assets/images/projects/celena.webp"
import easyface from "@/assets/images/projects/easyface.webp"
import haroepico from "@/assets/images/projects/haroepico.webp"
import julianquintero from "@/assets/images/projects/julianquintero.webp"

export type ProjectImage = {
  /** Metadatos que consume `<Image>` de `astro:assets`. */
  image: ImageMetadata
}

/**
 * Imágenes de los proyectos indexadas por su título.
 * El mapa es la única fuente de verdad tipada para las imágenes del portafolio.
 */
export const projectImages = {
  EasyFace: {
    image: easyface,
  },
  "Haro Epico": {
    image: haroepico,
  },
  CeleDesign: {
    image: celena,
  },
  "Este portafolio": {
    image: julianquintero,
  },
} as const satisfies Record<string, ProjectImage>

export type ProjectTitle = keyof typeof projectImages
