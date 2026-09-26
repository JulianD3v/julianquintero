import { describe, expect, it } from "vitest"
import { site } from "@/data/site"
import { bookingHref, isExternalBooking } from "@/lib/links"

const email = "julian@example.com"

describe("enlace de agenda", () => {
  it("usa la URL configurada cuando existe", () => {
    const url = "https://cal.com/julian/30min"

    expect(bookingHref(url, email)).toBe(url)
    expect(isExternalBooking(url)).toBe(true)
  })

  it("cae a la sección de contacto cuando no hay URL", () => {
    const href = bookingHref(null, email)

    expect(href).toBe("/#contacto")
    expect(isExternalBooking(null)).toBe(false)
  })

  it("usa la URL real del sitio si ya está configurada o cae a contacto", () => {
    if (site.bookingUrl) {
      expect(bookingHref(site.bookingUrl, site.email)).toBe(site.bookingUrl)
      expect(isExternalBooking(site.bookingUrl)).toBe(true)
    } else {
      expect(bookingHref(site.bookingUrl, site.email)).toBe("/#contacto")
      expect(isExternalBooking(site.bookingUrl)).toBe(false)
    }
  })
})
