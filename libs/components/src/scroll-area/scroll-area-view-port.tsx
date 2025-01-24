import {
  $,
  type PropFunction,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useOnDocument
} from "@builder.io/qwik";
import { scrollAreaContextId } from "./scroll-area-context";

type ViewPortProps = PropsOf<"div"> & {
  onScroll$?: PropFunction<(e: Event) => void>;
};

export const ScrollAreaViewport = component$<ViewPortProps>((props) => {
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
    "load",
    $((e) => {
      const viewport = context.viewportRef.value;
      if (viewport) {
        updateOverflow(viewport);
      }
    })
  );

  useOnDocument(
    "resize",
    $((e) => {
      const viewport = context.viewportRef.value;
      if (viewport) {
        updateOverflow(viewport);
      }
    })
  );

  return (
    <div
      {...props}
      data-qds-scroll-area-viewport
      onScroll$={[onScroll$, props.onScroll$]}
      ref={(el) => {
        context.viewportRef.value = el;
        if (el) {
          updateOverflow(el);
        }
      }}
      tabIndex={a11yTabIndex} //don't remove this line; it's needed to avoid a11y issues
      role="region"
      aria-label="Scrollable content"
    >
      <Slot />
    </div>
  );
});
