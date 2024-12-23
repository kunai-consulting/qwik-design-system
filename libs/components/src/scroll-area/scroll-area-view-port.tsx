import { $, component$, PropFunction, PropsOf, Slot } from "@builder.io/qwik";

type ViewPortProps = PropsOf<'div'> & {
  onScroll$?: PropFunction<(e: Event) => void>;
};

export const ScrollAreaViewPort = component$<ViewPortProps>((props) => {
  const onScroll$ = $((e: Event) => {
    const viewport = e.target as HTMLElement;
    const scrollbars = viewport.parentElement?.querySelectorAll('[data-scroll-area-scrollbar]');

    scrollbars?.forEach(scrollbar => {
      const thumb = scrollbar.querySelector('[data-scroll-area-thumb]') as HTMLElement;
      if (!thumb) return;

      const isVertical = scrollbar.getAttribute('data-orientation') === 'vertical';

      if (isVertical) {
        const scrollRatio = viewport.scrollTop / (viewport.scrollHeight - viewport.clientHeight);
        const maxTop = scrollbar.clientHeight - thumb.clientHeight;
        thumb.style.transform = `translateY(${scrollRatio * maxTop}px)`;
      } else {
        const scrollRatio = viewport.scrollLeft / (viewport.scrollWidth - viewport.clientWidth);
        const maxLeft = scrollbar.clientWidth - thumb.clientWidth;
        thumb.style.transform = `translateX(${scrollRatio * maxLeft}px)`;
      }
    });

    // Call the provided onScroll$ handler if it exists
    props.onScroll$?.(e);
  });

  return (
    <div
      {...props}
      data-scroll-area-viewport
      onScroll$={onScroll$}
    >
      <Slot />
    </div>
  );
});
