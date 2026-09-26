export const q = <T extends Element = HTMLElement>(
  selector: string,
  scope: ParentNode = document,
): T | null => scope.querySelector<T>(selector)

export const qa = <T extends Element = HTMLElement>(
  selector: string,
  scope: ParentNode = document,
): T[] => Array.from(scope.querySelectorAll<T>(selector))

/**
 * Envuelve cada palabra de un elemento en un <span> para poder animarlas
 * una a una, preservando etiquetas inline (<strong>, <em>...).
 */
export function splitWords(element: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = []
  const nodes: Text[] = []

  const collect = (node: Node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        nodes.push(child as Text)
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        collect(child)
      }
    })
  }

  collect(element)

  nodes.forEach((node) => {
    const text = node.textContent ?? ""
    const fragment = document.createDocumentFragment()
    const parts = text.split(/(\s+)/)

    parts.forEach((part) => {
      if (!part) return
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part))
        return
      }
      const word = document.createElement("span")
      word.className = "inline-block will-change-transform"
      word.textContent = part
      fragment.appendChild(word)
      words.push(word)
    })

    node.replaceWith(fragment)
  })

  return words
}

/** Duplica el contenido de un contenedor hasta alcanzar `copies` repeticiones. */
export function duplicateTrack(track: HTMLElement, copies = 3) {
  const original = track.innerHTML
  track.innerHTML = ""
  for (let i = 0; i < copies; i++) {
    const clone = document.createElement("div")
    clone.className = "flex shrink-0 items-center"
    clone.setAttribute("aria-hidden", i === 0 ? "false" : "true")
    clone.innerHTML = original
    track.appendChild(clone)
  }
  track.setAttribute("aria-hidden", "false")
}
