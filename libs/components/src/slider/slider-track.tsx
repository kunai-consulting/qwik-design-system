import { $, type PropsOf, Slot, component$, useContext, useSignal } from "@qwik.dev/core";
import { sliderContextId } from "./slider-context";

/** Component that renders the track along which the thumb slides */
export const SliderTrack = component$((props: PropsOf<"div">) => {
  const context = useContext(sliderContextId);
  const trackRef = useSignal<HTMLDivElement>();

  const onPointerDown$ = $(async (event: PointerEvent) => {
    if (context.disabled.value) return;

    const clickedThumb = (event.target as HTMLElement).closest("[data-qds-slider-thumb]");
    if (clickedThumb) return;

    const rect = trackRef.value?.getBoundingClientRect();
    if (rect) {
      const newValue = await context.calculateValue(event.clientX, rect);
      if (context.isRange.value) {
        const startDistance = Math.abs(newValue - context.startValue.value);
        const endDistance = Math.abs(newValue - context.endValue.value);
        const type = startDistance < endDistance ? "start" : "end";
        await context.setValue(newValue, type);
      } else {
        await context.setValue(newValue);
      }
      context.isDragEnded.value = true;
    }
  });

  return (
    <div
      {...props}
      ref={trackRef}
      // Track element representing the full range of possible values
      data-qds-slider-track
      preventdefault:pointerdown
      onPointerDown$={onPointerDown$}
    >
      <Slot />
    </div>
  );
});
