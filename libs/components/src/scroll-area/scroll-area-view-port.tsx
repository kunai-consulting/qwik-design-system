import {
  $,
  type PropFunction,
  type PropsOf,
  Slot,
  component$,
  useContext
} from "@builder.io/qwik";
import { scrollAreaContextId } from "./scroll-area-context";

type ViewPortProps = PropsOf<"div"> & {
  onScroll$?: PropFunction<(e: Event) => void>;
};

export const ScrollAreaViewport = component$<ViewPortProps>((props) => {
  const context = useContext(scrollAreaContextId);
  const onScroll$ = $((e: Event) => {
    const viewport = e.target as HTMLElement;
    const root = viewport.parentElement;
    if (!root) return;

    const verticalScrollbar = root.querySelector(
      '[data-qds-scroll-area-scrollbar][data-orientation="vertical"]'
    ) as HTMLElement;
    const horizontalScrollbar = root.querySelector(
      '[data-qds-scroll-area-scrollbar][data-orientation="horizontal"]'
    ) as HTMLElement;

    if (verticalScrollbar) {
      const verticalThumb = verticalScrollbar.querySelector("[data-qds-scroll-area-thumb]") as HTMLElement;
      if (verticalThumb) {
        const scrollRatio =
          viewport.scrollTop / (viewport.scrollHeight - viewport.clientHeight);
        const maxTop = verticalScrollbar.clientHeight - verticalThumb.clientHeight;
        verticalThumb.style.transform = `translateY(${scrollRatio * maxTop}px)`;
      }
    }

    if (horizontalScrollbar) {
      const horizontalThumb = horizontalScrollbar.querySelector("[data-qds-scroll-area-thumb]") as HTMLElement;
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

  return (
    <div
      {...props}
      data-qds-scroll-area-viewport
      onScroll$={[onScroll$, props.onScroll$]}
      ref={context.viewportRef}
      tabIndex={0} //don't remove this line; it's needed to avoid a11y issues
      role="region"
      aria-label="Scrollable content"
    >
      <Slot />
    </div>
  );
});
