import { $, component$, PropsOf, QRL, Slot, useSignal } from "@builder.io/qwik";

type ScrollBarType = PropsOf<'div'> & {
  orientation?: 'vertical' | 'horizontal';
  onScroll$?: QRL<(e: Event) => void>;
};

export const ScrollAreaScrollbar = component$<ScrollBarType>((props) => {
  const { orientation = 'vertical' } = props;
  const scrollbarRef = useSignal<HTMLDivElement>();

  const onTrackClick$ = $((e: MouseEvent) => {
    const scrollbar = scrollbarRef.value;
    if (!scrollbar) return;

    const root = scrollbar.closest('[data-scroll-area-root]');
    const viewport = root?.querySelector('[data-scroll-area-viewport]') as HTMLElement;
    const thumb = scrollbar.querySelector('[data-scroll-area-thumb]') as HTMLElement;

    if (!thumb || !viewport || e.target === thumb) return;

    const rect = scrollbar.getBoundingClientRect();

    if (orientation === 'vertical') {
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
      ref={scrollbarRef}
      data-scroll-area-scrollbar
      data-orientation={orientation}
      onClick$={onTrackClick$}
    >
      <Slot />
    </div>
  );
});
