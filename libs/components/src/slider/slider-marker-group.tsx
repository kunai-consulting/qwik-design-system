import { type PropsOf, component$, Slot } from "@builder.io/qwik";

export const SliderMarkerGroup = component$((props: PropsOf<"div">) => {
  return (
    <div {...props} data-qds-slider-marker-group>
      <Slot />
    </div>
  );
});
