import {
  component$,
  $,
  useSignal,
  useOnDocument,
  type Signal,
  type PropsOf
} from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";

type ScrollAreaThumb = {
  ref?: Signal<HTMLDivElement | undefined>;
  onDragStart$?: PropFunction<(e: MouseEvent) => void>;
  onDragMove$?: PropFunction<(e: MouseEvent) => void>;
  onDragEnd$?: PropFunction<() => void>;
} & PropsOf<"div">;

export const ScrollAreaThumb = component$<ScrollAreaThumb>((props) => {
  const thumbRef = useSignal<HTMLDivElement>();
  const isDragging = useSignal(false);
  const dragData = useSignal({
    startClientY: 0,
    startClientX: 0,
    startScrollTop: 0,
    startScrollLeft: 0
  });

  const onDragStart$ = $((e: MouseEvent) => {
    const thumb = thumbRef.value;
    if (!thumb) return;

    const scrollbar = thumb.closest("[data-scroll-area-scrollbar]");
    const root = scrollbar?.closest("[data-scroll-area-root]");
    const viewport = root?.querySelector("[data-scroll-area-viewport]") as HTMLElement;

    if (!scrollbar || !viewport) return;

    e.preventDefault();
    isDragging.value = true;

    dragData.value = {
      startClientY: e.clientY,
      startClientX: e.clientX,
      startScrollTop: viewport.scrollTop,
      startScrollLeft: viewport.scrollLeft
    };
  });

  const onDragMove$ = $((e: MouseEvent) => {
    if (!isDragging.value) return;

    const thumb = thumbRef.value;
    if (!thumb) return;

    const scrollbar = thumb.closest("[data-scroll-area-scrollbar]");
    const root = scrollbar?.closest("[data-scroll-area-root]");
    const viewport = root?.querySelector("[data-scroll-area-viewport]") as HTMLElement;

    if (!scrollbar || !viewport) return;

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
      ref={thumbRef}
      data-scroll-area-thumb
      data-dragging={isDragging.value ? "" : undefined}
      onMouseDown$={onDragStart$}
    />
  );
});
