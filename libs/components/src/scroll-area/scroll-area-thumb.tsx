import {
  $,
  type HTMLElementAttrs,
  type Signal,
  component$,
  useContext,
  useOnDocument,
  useSignal
} from "@qwik.dev/core";
import type { QRL } from "@qwik.dev/core";
import { scrollAreaContextId } from "./scroll-area-context";
type PublicScrollAreaThumb = {
  /** Reference to the thumb element */
  ref?: Signal<HTMLDivElement | undefined>;
  /** Event handler for when thumb dragging starts */
  onDragStart$?: QRL<(e: MouseEvent) => void>;
  /** Event handler for when thumb is being dragged */
  onDragMove$?: QRL<(e: MouseEvent) => void>;
  /** Event handler for when thumb dragging ends */
  onDragEnd$?: QRL<() => void>;
} & HTMLElementAttrs<"div">;
/** A draggable thumb component for the scrollbar that handles scroll position */
export const ScrollAreaThumb = component$<PublicScrollAreaThumb>((props) => {
  const context = useContext(scrollAreaContextId);
  const isDragging = useSignal(false);
  const dragData = useSignal({
    startClientY: 0,
    startClientX: 0,
    startScrollTop: 0,
    startScrollLeft: 0,
    activeThumb: null as HTMLElement | null,
    activeScrollbar: null as HTMLElement | null
  });
  const onDragStart$ = $((e: MouseEvent) => {
    const thumb = e.target as HTMLElement;
    const scrollbar = thumb.parentElement;
    const viewport = context.viewportRef.value;
    if (!scrollbar) return;
    if (!viewport) return;
    if (!thumb) return;
    e.preventDefault();
    isDragging.value = true;
    dragData.value = {
      startClientY: e.clientY,
      startClientX: e.clientX,
      startScrollTop: viewport.scrollTop,
      startScrollLeft: viewport.scrollLeft,
      activeThumb: thumb,
      activeScrollbar: scrollbar
    };
  });
  const onDragMove$ = $((e: MouseEvent) => {
    if (!isDragging.value) return;
    const thumb = dragData.value.activeThumb;
    const scrollbar = dragData.value.activeScrollbar;
    const viewport = context.viewportRef.value;
    if (!scrollbar) return;
    if (!viewport) return;
    if (!thumb) return;
    const isVertical = scrollbar.getAttribute("data-orientation") === "vertical";
    e.preventDefault();
    if (isVertical) {
      const deltaY = e.clientY - dragData.value.startClientY;
      const scrollbarHeight = scrollbar.clientHeight;
      const thumbHeight = thumb.clientHeight;
      const scrollRatio =
        (viewport.scrollHeight - viewport.clientHeight) / (scrollbarHeight - thumbHeight);
      viewport.scrollTop = dragData.value.startScrollTop + deltaY * scrollRatio;
    } else {
      const deltaX = e.clientX - dragData.value.startClientX;
      const scrollbarWidth = scrollbar.clientWidth;
      const thumbWidth = thumb.clientWidth;
      const scrollRatio =
        (viewport.scrollWidth - viewport.clientWidth) / (scrollbarWidth - thumbWidth);
      viewport.scrollLeft = dragData.value.startScrollLeft + deltaX * scrollRatio;
    }
  });
  const onDragEnd$ = $(() => {
    isDragging.value = false;
  });
  useOnDocument("mousemove", onDragMove$);
  useOnDocument("mouseup", onDragEnd$);
  return (
    <div
      {...props}
      ref={context.thumbRef}
      // The draggable thumb element within the scrollbar
      data-qds-scroll-area-thumb
      // Indicates whether the thumb is currently being dragged
      data-dragging={isDragging.value ? "" : undefined}
      onMouseDown$={onDragStart$}
    />
  );
});
