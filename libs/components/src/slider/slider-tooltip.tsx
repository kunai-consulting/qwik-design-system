import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { sliderContextId } from "./slider-context";

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps extends PropsOf<"div"> {
  placement?: TooltipPlacement;
}

export const SliderTooltip = component$((props: TooltipProps) => {
  const context = useContext(sliderContextId);
  const { placement = 'top', ...rest } = props;

  const getValue = () => {
    if (context.mode.value === 'single') {
      return context.value.value;
    } else {
      return context.thumbType?.value === 'start'
        ? context.startValue.value
        : context.endValue.value;
    }
  };

  return (
    <div
      {...rest}
      data-qds-slider-tooltip
      data-placement={placement}
      role="tooltip"
    >
      {getValue()}
    </div>
  );
});
