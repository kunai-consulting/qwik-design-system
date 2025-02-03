import {
  $,
  type PropsOf,
  type QRL,
  Slot,
  component$,
  useContext
} from "@builder.io/qwik";
import { scrollAreaContextId } from "./scroll-area-context";

type ScrollBarType = PropsOf<"div"> & {
  orientation?: "vertical" | "horizontal";
  onScroll$?: QRL<(e: Event) => void>;
};

export const ScrollAreaScrollbar = component$<ScrollBarType>((props) => {
  const context = useContext(scrollAreaContextId);
  const { orientation = "vertical" } = props;

  const onTrackClick$ = $((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const clickedOrientation = target.getAttribute("data-orientation");
    const scrollbar =
      orientation === "vertical"
        ? context.verticalScrollbarRef.value
        : context.horizontalScrollbarRef.value;

    if (!scrollbar) return;

    const viewport = context.viewportRef.value;
    const thumb = context.thumbRef.value;

    if (!thumb || e.target === thumb) return;
    if (!viewport) return;

    const rect = target.getBoundingClientRect();

    if (clickedOrientation === "vertical") {
      const clickPos = e.clientY - rect.top;
      // Calculate click position as a ratio of the scrollbar height
      const scrollRatio = clickPos / rect.height;
      // Calculate the maximum scroll position
      const maxScroll = viewport.scrollHeight - viewport.clientHeight;
      // Set scroll position directly based on ratio
      viewport.scrollTop = scrollRatio * maxScroll;
    } else {
      const clickPos = e.clientX - rect.left;
      // Calculate click position as a ratio of the scrollbar width
      const scrollRatio = clickPos / rect.width;
      // Calculate the maximum scroll position
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      // Set scroll position directly based on ratio
      viewport.scrollLeft = scrollRatio * maxScroll;
    }
  });

  const shouldShow = () => {
    const hasOverflow = context.hasOverflow.value;

    switch (context.type) {
      case "always":
        return hasOverflow;
      case "hover":
        return context.isHovering.value && hasOverflow;
      case "scroll":
        return context.isScrolling.value && hasOverflow;
      case "auto":
        return hasOverflow;
      default:
        return false;
    }
  };

  return (
    <div
      {...props}
      ref={
        orientation === "vertical"
          ? context.verticalScrollbarRef
          : context.horizontalScrollbarRef
      }
      data-qds-scroll-area-scrollbar
      data-orientation={orientation}
      data-state={shouldShow() ? "visible" : "hidden"}
      onClick$={onTrackClick$}
    >
      <Slot />
    </div>
  );
});
