import { getImage } from "astro:assets"
import type { ImageMetadata } from "astro"

const cache = new Map<string, Promise<string>>()

/**
 * Genera un blur placeholder (LQIP) optimizado con Astro.
 * Utiliza el servicio de imágenes nativo de Astro sin dependencias directas de módulos nativos de Node.
 */
export function buildLqip(image: ImageMetadata): Promise<string> {
  const key = image.src
  const cached = cache.get(key)
  if (cached) return cached

  const promise = getImage({
    src: image,
    width: 24,
    height: 30,
    format: "webp",
    quality: 30,
  }).then((optimized) => optimized.src)

  cache.set(key, promise)
  return promise
}
