import { type PropsOf, Slot, component$, useContext, $, useSignal } from "@builder.io/qwik";
import { sliderContextId } from "./slider-context";
import { useSliderUtils } from "./use-slider-utils";

export const SliderTrack = component$((props: PropsOf<"div">) => {
  const context = useContext(sliderContextId);
  const trackRef = useSignal<HTMLDivElement>();
  const { calculateValue, setValue } = useSliderUtils(context);

  const onPointerDown$ = $(async (event: PointerEvent) => {
    if (context.disabled.value) return;
    event.preventDefault();

    const rect = trackRef.value?.getBoundingClientRect();
    if (rect) {
      const newValue = await calculateValue(event.clientX, rect);
      if (context.mode.value === 'range') {
        const startDistance = Math.abs(newValue - context.startValue.value);
        const endDistance = Math.abs(newValue - context.endValue.value);
        const type = startDistance < endDistance ? 'start' : 'end';
        await setValue(newValue, type, true);
      } else {
        await setValue(newValue, undefined, true);
      }
    }
  });

  return (
    <div
      {...props}
      ref={trackRef}
      data-qds-slider-track
      onPointerDown$={onPointerDown$}
    >
      <Slot />
    </div>
  );
});
