import {
  $,
  component$,
  type PropsOf,
  type QRL,
  Slot,
  useContext,
  useSignal
} from "@builder.io/qwik";
import { scrollAreaContextId } from "./scroll-area-context";

type ScrollBarType = PropsOf<"div"> & {
  orientation?: "vertical" | "horizontal";
  onScroll$?: QRL<(e: Event) => void>;
};

export const ScrollAreaScrollbar = component$<ScrollBarType>((props) => {
  const context = useContext(scrollAreaContextId);
  const { orientation = "vertical" } = props;
  const scrollbarRef = useSignal<HTMLDivElement>();

  const onTrackClick$ = $((e: MouseEvent) => {
    const scrollbar = scrollbarRef.value;
    if (!scrollbar) return;

    const viewport = context.viewportRef.value;
    const thumb = context.thumbRef.value;

    if (!thumb || e.target === thumb) return;
    if (!viewport) return;

    const rect = scrollbar.getBoundingClientRect();

    if (orientation === "vertical") {
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

  return (
    <div
      {...props}
      ref={context.scrollbarRef}
      data-scroll-area-scrollbar
      data-orientation={orientation}
      onClick$={onTrackClick$}
    >
      <Slot />
    </div>
  );
});
