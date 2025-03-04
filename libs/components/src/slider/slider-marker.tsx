import { type PropsOf, component$, useContext, Slot, useComputed$ } from "@builder.io/qwik";
import { sliderContextId } from "./slider-context";

interface MarkerProps extends PropsOf<"div"> {
  value: number;
}

export const SliderMarker = component$((props: MarkerProps) => {
  const { value, ...rest } = props;
  const context = useContext(sliderContextId);

  const markerPosition = useComputed$(() => {
    return ((value - context.min.value) /
      (context.max.value - context.min.value)) * 100;
  });

  return (
    <div
      {...rest}
      data-qds-slider-marker
      style={{ left: `${markerPosition.value}%` }}
    >
      <Slot />
    </div>
  );
});
