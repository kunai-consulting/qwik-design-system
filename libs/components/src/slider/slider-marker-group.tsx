import { type HTMLElementAttrs, Slot, component$ } from "@qwik.dev/core";

/** A container component for slider markers */
export const SliderMarkerGroup = component$((props: HTMLElementAttrs<"div">) => {
  return (
    // Container element for grouping slider markers
    <div {...props} data-qds-slider-marker-group>
      <Slot />
    </div>
  );
});
