import { type HTMLElementAttrs, component$, useComputed$, useContext } from "@qwik.dev/core";
import { sliderContextId } from "./slider-context";
type PublicTooltipPlacement = "top" | "bottom" | "left" | "right";
interface PublicTooltipProps extends HTMLElementAttrs<"div"> {
  /** The placement of the tooltip relative to the thumb. Default is 'top' */
  placement?: PublicTooltipPlacement;
}
/** Component that displays the current value in a tooltip */
export const SliderTooltip = component$((props: PublicTooltipProps) => {
  const context = useContext(sliderContextId);
  const { placement = "top", ...rest } = props;
  const tooltipValue = useComputed$(() => {
    if (!context.isRange.value) {
      return context.value.value;
    }
    return context.thumbType?.value === "start"
      ? context.startValue.value
      : context.endValue.value;
  });

  return (
    <div
      {...rest}
      // Tooltip element displaying the current value of the associated thumb
      data-qds-slider-tooltip
      // Specifies the placement position of the tooltip relative to the thumb
      data-placement={placement}
      role="tooltip"
    >
      {tooltipValue.value}
    </div>
  );
});
