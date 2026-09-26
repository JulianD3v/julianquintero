import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

import { prefersReducedMotion } from "./motion-lite"

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: "power3.out", duration: 0.9 })

export const EASE = {
  swift: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
} as const

export { gsap, ScrollTrigger, prefersReducedMotion }
