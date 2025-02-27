import { $ } from "@builder.io/qwik";
import type { SliderContext } from "./slider-context";

export const useSliderUtils = (context: SliderContext) => {
  const calculateValue = $((clientX: number, rect: DOMRect) => {
    if (!rect.width) return context.min.value;
    const position = (clientX - rect.left) / rect.width;
    const range = context.max.value - context.min.value;
    let newValue = context.min.value + range * position;

    if (context.step.value > 0) {
      newValue = Math.round(newValue / context.step.value) * context.step.value;
    }

    return Math.max(context.min.value, Math.min(context.max.value, newValue));
  });

  const setValue = $(
    async (newValue: number, type?: "start" | "end", isEnd: boolean = false) => {
      if (context.mode.value === "single") {
        const valueChanged = context.value.value !== newValue;
        context.value.value = newValue;

        if (valueChanged && context.onValueChange$) {
          await context.onValueChange$(newValue);
        }
        if (isEnd && context.onValueChangeEnd$) {
          await context.onValueChangeEnd$(newValue);
        }
      } else {
        const currentStart = context.startValue.value;
        const currentEnd = context.endValue.value;

        if (type === "start") {
          if (newValue <= currentEnd) {
            const valueChanged = currentStart !== newValue;
            context.startValue.value = newValue;

            if (valueChanged && context.onValueChange$) {
              await context.onValueChange$([newValue, currentEnd]);
            }
            if (isEnd && context.onValueChangeEnd$) {
              await context.onValueChangeEnd$([newValue, currentEnd]);
            }
          }
        } else if (type === "end") {
          if (newValue >= currentStart) {
            const valueChanged = currentEnd !== newValue;
            context.endValue.value = newValue;

            if (valueChanged && context.onValueChange$) {
              await context.onValueChange$([currentStart, newValue]);
            }
            if (isEnd && context.onValueChangeEnd$) {
              await context.onValueChangeEnd$([currentStart, newValue]);
            }
          }
        }
      }
    }
  );

  return {
    calculateValue,
    setValue
  };
};
