import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { sliderContextId } from "./slider-context";
interface PublicMarksProps extends PropsOf<"div"> {
  /** CSS class to apply to the mark indicator */
  indicatorClass?: string;
  /** CSS class to apply to the mark label */
  labelClass?: string;
}
/** Component that renders marks/indicators along the slider track */
export const SliderMarks = component$((props: PublicMarksProps) => {
  const { indicatorClass, labelClass, ...rest } = props;
  const context = useContext(sliderContextId);
  const getMarkPosition = (value: number) => {
    return ((value - context.min.value) / (context.max.value - context.min.value)) * 100;
  };
  return (
    // The container element that holds all slider mark indicators and labels
    <div {...rest} data-qds-slider-marks>
      {context.marks.value.map((mark) => (
        <div
          key={mark.value}
          data-qds-slider-mark
          style={{ left: `${getMarkPosition(mark.value)}%` }}
        >
          {/* Visual indicator element for a slider mark*/}
          <div data-qds-slider-mark-indicator class={indicatorClass} />
          {mark.label && (
            // Label element displaying the value or text for a slider mark
            <div data-qds-slider-mark-label class={labelClass}>
              {mark.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});
