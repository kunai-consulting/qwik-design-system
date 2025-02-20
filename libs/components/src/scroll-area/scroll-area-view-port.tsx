import {
  $,
  type PropFunction,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useOnDocument,
  sync$
} from "@qwik.dev/core";
import { scrollAreaContextId } from "./scroll-area-context";
type PublicViewPortProps = PropsOf<"div"> & {
  /** Event handler for scroll events */
  onScroll$?: PropFunction<(e: Event) => void>;
};
/** A viewport component that contains the scrollable content and manages overflow detection */
export const ScrollAreaViewport = component$<PublicViewPortProps>((props) => {
  const context = useContext(scrollAreaContextId);
  const a11yTabIndex = 0;
  const updateOverflow = $((viewport: HTMLElement) => {
    const hasVerticalOverflow = viewport.scrollHeight > viewport.clientHeight;
    const hasHorizontalOverflow = viewport.scrollWidth > viewport.clientWidth;
    context.hasOverflow.value = hasVerticalOverflow || hasHorizontalOverflow;
  });
  const onScroll$ = $((e: Event) => {
    const viewport = e.target as HTMLElement;
    const verticalScrollbar = context.verticalScrollbarRef.value;
    const horizontalScrollbar = context.horizontalScrollbarRef.value;
    updateOverflow(viewport);
    if (context.type === "scroll") {
      context.isScrolling.value = true;
      clearTimeout(context.scrollTimeout.value);
      context.scrollTimeout.value = setTimeout(() => {
        context.isScrolling.value = false;
      }, context.hideDelay) as unknown as number;
    }
    if (verticalScrollbar) {
      const verticalThumb = verticalScrollbar.querySelector(
        "[data-qds-scroll-area-thumb]"
      ) as HTMLElement;
      if (verticalThumb) {
        const scrollRatio =
          viewport.scrollTop / (viewport.scrollHeight - viewport.clientHeight);
        const maxTop = verticalScrollbar.clientHeight - verticalThumb.clientHeight;
        verticalThumb.style.transform = `translateY(${scrollRatio * maxTop}px)`;
      }
    }
    if (horizontalScrollbar) {
      const horizontalThumb = horizontalScrollbar.querySelector(
        "[data-qds-scroll-area-thumb]"
      ) as HTMLElement;
      if (horizontalThumb) {
        const scrollRatio =
          viewport.scrollLeft / (viewport.scrollWidth - viewport.clientWidth);
        const maxLeft = horizontalScrollbar.clientWidth - horizontalThumb.clientWidth;
        horizontalThumb.style.transform = `translateX(${scrollRatio * maxLeft}px)`;
      }
    }
    // Call the provided onScroll$ handler if it exists
    props.onScroll$?.(e);
  });
  useOnDocument(
    "resize",
    $((e) => {
      const viewport = context.viewportRef.value;
      if (viewport) {
        updateOverflow(viewport);
      }
    })
  );
  useOnDocument(
    "wheel",
    $((e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const viewport = context.viewportRef.value;
        if (viewport) {
          updateOverflow(viewport);
        }
      }
    })
  );
  useOnDocument(
    "keydown",
    $((e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "=" || e.key === "-" || e.key === "0")
      ) {
        const viewport = context.viewportRef.value;
        if (viewport) {
          const overflowEvent = new CustomEvent("qdsoverflowcheck");
          setTimeout(() => {
            viewport.dispatchEvent(overflowEvent);
          }, 50);
        }
      }
    })
  );
  return (
    <div
      {...props}
      // The viewport container that wraps the scrollable content
      data-qds-scroll-area-viewport
      onScroll$={[onScroll$, props.onScroll$]}
      onQdsoverflowcheck$={$(() => {
        const viewport = context.viewportRef.value;
        if (viewport) {
          updateOverflow(viewport);
        }
      })}
      window:onLoad$={
        context.type !== "scroll"
          ? sync$(() => {
              const viewport = document.querySelector("[data-qds-scroll-area-viewport]");
              if (viewport) {
                const event = new CustomEvent("qdsoverflowcheck");
                viewport.dispatchEvent(event);
              }
            })
          : undefined
      }
      ref={(el) => {
        context.viewportRef.value = el;
        if (el) {
          updateOverflow(el);
        }
      }}
      tabIndex={a11yTabIndex}
      role="region"
      aria-label="Scrollable content"
    >
      <Slot />
    </div>
  );
});
