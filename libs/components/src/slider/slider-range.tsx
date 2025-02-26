import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { sliderContextId } from "./slider-context";

export const SliderRange = component$((props: PropsOf<"div">) => {
  const context = useContext(sliderContextId);

  const getStyles = () => {
    if (context.mode.value === 'single') {
      const percentage = ((context.value.value - context.min.value) /
        (context.max.value - context.min.value)) * 100;
      return { left: "0%", width: `${percentage}%` };
    } else {
      const startPercentage = ((context.startValue.value - context.min.value) /
        (context.max.value - context.min.value)) * 100;
      const endPercentage = ((context.endValue.value - context.min.value) /
        (context.max.value - context.min.value)) * 100;
      return { left: `${startPercentage}%`, width: `${endPercentage - startPercentage}%` };
    }
  };

  return (
    <div
      {...props}
      data-qds-slider-range
      style={getStyles()}
    />
  );
});
