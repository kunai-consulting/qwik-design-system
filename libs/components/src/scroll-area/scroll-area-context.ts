import { type Signal, createContextId } from "@builder.io/qwik";

export const scrollAreaContextId =
  createContextId<ScrollAreaContext>("scroll-area-context");

export interface ScrollAreaContext {
  thumbRef: Signal<HTMLDivElement | undefined>;
  viewportRef: Signal<HTMLDivElement | undefined>;
  verticalScrollbarRef: Signal<HTMLDivElement | undefined>;
  horizontalScrollbarRef: Signal<HTMLDivElement | undefined>;
}

