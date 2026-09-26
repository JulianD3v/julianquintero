/** Enlaces derivados de la configuración del sitio. Sin efectos: se testea directo. */

/**
 * Enlace del botón de agenda: usa la URL de calendario configurada (Cal.com, Calendly)
 * y, si no existe, dirige directamente a la sección de contacto (#contacto) para
 * garantizar una interacción web fluida en cualquier dispositivo y navegador.
 */
export const bookingHref = (bookingUrl: string | null, _email?: string) =>
  bookingUrl ?? "/#contacto"

/** `true` si el enlace abre una pestaña externa (y por tanto necesita `rel`). */
export const isExternalBooking = (bookingUrl: string | null) =>
  Boolean(bookingUrl && /^https?:\/\//i.test(bookingUrl))
