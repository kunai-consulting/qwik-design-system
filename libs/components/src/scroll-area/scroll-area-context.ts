import { createContextId, type Signal } from "@builder.io/qwik";

export const scrollAreaContextId =
  createContextId<ScrollAreaContext>("scroll-area-context");

export interface ScrollAreaContext {
  scrollbarRef: Signal<HTMLDivElement | undefined>;
  thumbRef: Signal<HTMLDivElement | undefined>;
  viewportRef: Signal<HTMLDivElement | undefined>;
}
