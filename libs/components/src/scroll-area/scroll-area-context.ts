import { type Signal, createContextId } from "@builder.io/qwik";

export type ScrollbarVisibility = "hover" | "scroll" | "auto" | "always";

export interface ScrollAreaContext {
  thumbRef: Signal<HTMLDivElement | undefined>;
  viewportRef: Signal<HTMLDivElement | undefined>;
  verticalScrollbarRef: Signal<HTMLDivElement | undefined>;
  horizontalScrollbarRef: Signal<HTMLDivElement | undefined>;
  type: ScrollbarVisibility;
  hideDelay: number;
  isScrolling: Signal<boolean>;
  isHovering: Signal<boolean>;
  scrollTimeout: Signal<number>;
  hasOverflow: Signal<boolean>;
}

export const scrollAreaContextId =
  createContextId<ScrollAreaContext>("scroll-area-context");
