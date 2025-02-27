import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { sliderContextId } from "./slider-context";
type PublicTooltipPlacement = "top" | "bottom" | "left" | "right";
interface PublicTooltipProps extends PropsOf<"div"> {
  /** The placement of the tooltip relative to the thumb. Default is 'top' */
  placement?: PublicTooltipPlacement;
}
/** Component that displays the current value in a tooltip */
export const SliderTooltip = component$((props: PublicTooltipProps) => {
  const context = useContext(sliderContextId);
  const { placement = "top", ...rest } = props;
  const getValue = () => {
    if (context.mode.value === "single") {
      return context.value.value;
    } else {
      return context.thumbType?.value === "start"
        ? context.startValue.value
        : context.endValue.value;
    }
  };
  return (
    <div
      {...rest}
      // Tooltip element displaying the current value of the associated thumb
      data-qds-slider-tooltip
      // Specifies the placement position of the tooltip relative to the thumb
      data-placement={placement}
      role="tooltip"
    >
      {getValue()}
    </div>
  );
});
