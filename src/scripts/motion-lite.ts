/** Utilidades sin dependencias: este módulo vive en el bundle crítico. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
