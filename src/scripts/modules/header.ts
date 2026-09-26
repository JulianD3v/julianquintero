import { q, qa } from "../lib/dom"

import { gsap, ScrollTrigger } from "../motion"
import { startScroll, stopScroll } from "../smooth-scroll"

export function initHeader() {
  const header = q<HTMLElement>("[data-header]")
  const progress = q<HTMLElement>("[data-scroll-progress]")

  /** `will-change: transform` solo mientras hay movimiento (Guía §2.D). */
  const moving = new Set<HTMLElement>()
  let idleTimer = 0

  const markMoving = (...elements: (HTMLElement | null | undefined)[]) => {
    elements.forEach((element) => {
      if (element) moving.add(element)
    })
    elements.forEach((element) => element?.classList.add("will-change-transform"))

    window.clearTimeout(idleTimer)
    idleTimer = window.setTimeout(() => {
      moving.forEach((element) => element.classList.remove("will-change-transform"))
      moving.clear()
    }, 400)
  }

  if (progress) {
    gsap.to(progress, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 0.3,
        onUpdate: () => markMoving(progress),
      },
    })
  }

  if (!header) return

  const bar = q<HTMLElement>("[data-header-bar]", header)
  const indicator = q<HTMLElement>("[data-nav-indicator]", header)
  const sectionLinks = qa<HTMLAnchorElement>("[data-nav-link][data-nav-id]")

  const setScrolled = (scrolled: boolean) =>
    header.classList.toggle("is-scrolled", scrolled)

  ScrollTrigger.create({
    start: 80,
    end: () => ScrollTrigger.maxScroll(window),
    onToggle: (self) => setScrolled(self.isActive),
  })

  // Oculta / muestra la barra según la dirección del scroll.
  const hideOnScroll = (self: ScrollTrigger) => {
    const shouldHide = self.direction === 1 && self.scroll() > 320
    markMoving(bar)
    gsap.to(bar, {
      yPercent: shouldHide ? -140 : 0,
      duration: 0.55,
      ease: "power3.out",
      overwrite: true,
    })
  }

  ScrollTrigger.create({
    start: 0,
    end: () => ScrollTrigger.maxScroll(window),
    onUpdate: hideOnScroll,
  })

  // Sección activa + indicador deslizante
  const activate = (id: string) => {
    const active = sectionLinks.find(
      (link) => link.dataset.navId === id,
    )

    sectionLinks.forEach((link) => {
      const isActive = link === active
      link.classList.toggle("is-active", isActive)
      link.setAttribute("aria-current", isActive ? "true" : "false")
    })

    if (!indicator || !active) return

    gsap.to(indicator, {
      x: active.offsetLeft,
      width: active.offsetWidth,
      duration: 0.6,
      ease: "power3.out",
      overwrite: true,
    })
  }

  qa<HTMLElement>("section[id]").forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 45%",
      end: "bottom 45%",
      onToggle: (self) => {
        if (self.isActive) activate(section.id)
      },
    })
  })

  const onResize = () => {
    const current = sectionLinks.find((link) =>
      link.classList.contains("is-active"),
    )
    if (current) activate(current.dataset.navId ?? "")
  }

  window.addEventListener("resize", onResize)
  onResize()

  initMobileMenu(header)
}

function initMobileMenu(header: HTMLElement) {
  const button = q<HTMLButtonElement>("[data-menu-button]", header)
  const menu = q<HTMLElement>("[data-mobile-menu]", header)
  if (!button || !menu) return

  const items = qa("[data-menu-item]", menu)
  const links = qa<HTMLAnchorElement>("[data-nav-link], [data-menu-item]", header)
  let open = false
  let timeline: gsap.core.Timeline | null = null

  const setOpen = (next: boolean) => {
    open = next
    button.setAttribute("aria-expanded", String(open))
    header.classList.toggle("menu-open", open)
    document.documentElement.classList.toggle("overflow-hidden", open)
    open ? stopScroll() : startScroll()

    timeline?.kill()
    timeline = gsap.timeline()

    if (open) {
      timeline
        .set(menu, { pointerEvents: "auto" })
        .fromTo(
          menu,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
        )
        .fromTo(
          items,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.07,
            ease: "power4.out",
          },
          0.08,
        )
    } else {
      timeline
        .to(items, {
          yPercent: -60,
          opacity: 0,
          duration: 0.3,
          stagger: 0.03,
          ease: "power2.in",
        })
        .to(menu, {
          autoAlpha: 0,
          duration: 0.3,
          onComplete: () => timeline?.set(menu, { pointerEvents: "none" }),
        })
    }
  }

  button.addEventListener("click", () => setOpen(!open))

  links.forEach((link) =>
    link.addEventListener("click", () => open && setOpen(false)),
  )

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && open) setOpen(false)
  })

  gsap.set(menu, { autoAlpha: 0 })
  gsap.set(menu, { pointerEvents: "none" })
  gsap.set(items, { yPercent: 110, opacity: 0 })
}
