import { type PropsOf, Slot, component$ } from "@qwik.dev/core";

/** A container component for slider markers */
export const SliderMarkerGroup = component$((props: PropsOf<"div">) => {
  return (
    // Container element for grouping slider markers
    <div {...props} data-qds-slider-marker-group>
      <Slot />
    </div>
  );
});
