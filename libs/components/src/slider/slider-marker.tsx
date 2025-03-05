import {
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext
} from "@builder.io/qwik";
import { sliderContextId } from "./slider-context";
interface PublicMarkerProps extends PropsOf<"div"> {
  /** The value at which to place the marker on the slider track */
  value: number;
}
/** A marker component that displays a specific value point on the slider */
export const SliderMarker = component$((props: PublicMarkerProps) => {
  const { value, ...rest } = props;
  const context = useContext(sliderContextId);

  const markerPosition = useComputed$(() => {
    return ((value - context.min.value) / (context.max.value - context.min.value)) * 100;
  });

  return (
    <div
      {...rest}
      // Individual marker element representing a specific value on the slider
      data-qds-slider-marker
      style={{ left: `${markerPosition.value}%` }}
    >
      <Slot />
    </div>
  );
});
