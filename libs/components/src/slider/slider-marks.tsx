import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { sliderContextId } from "./slider-context";

interface MarksProps extends PropsOf<"div"> {
  indicatorClass?: string;
  labelClass?: string;
}

export const SliderMarks = component$((props: MarksProps) => {
  const { indicatorClass, labelClass, ...rest } = props;
  const context = useContext(sliderContextId);

  const getMarkPosition = (value: number) => {
    return ((value - context.min.value) /
      (context.max.value - context.min.value)) * 100;
  };

  return (
    <div {...rest} data-qds-slider-marks>
      {context.marks.value.map((mark) => (
        <div
          key={mark.value}
          data-qds-slider-mark
          style={{ left: `${getMarkPosition(mark.value)}%` }}
        >
          <div data-qds-slider-mark-indicator class={indicatorClass} />
          {mark.label && (
            <div data-qds-slider-mark-label class={labelClass}>
              {mark.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});
