/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="node" />

/**
 * La View Transitions API todavía no está en la librería DOM de TypeScript 5.3.
 * Se declara de forma mínima para poder tipar la onda circular del tema.
 */
interface ViewTransition {
  readonly ready: Promise<void>
  readonly finished: Promise<void>
  readonly updateCallbackDone: Promise<void>
  skipTransition(): void
}

interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition
}

