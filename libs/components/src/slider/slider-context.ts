import { type Signal, type PropFunction, createContextId } from "@builder.io/qwik";

export interface Mark {
  value: number;
  label?: string;
}

export type SliderMode = "single" | "range";
export type ThumbType = "start" | "end";

export interface SliderContext {
  mode: Signal<SliderMode>;
  value: Signal<number>;
  startValue: Signal<number>;
  endValue: Signal<number>;
  min: Signal<number>;
  max: Signal<number>;
  step: Signal<number>;
  disabled: Signal<boolean>;
  marks: Signal<Mark[]>;
  thumbType: Signal<ThumbType | undefined>;
  onValueChange$?: PropFunction<(value: number | [number, number]) => void>;
  onValueChangeEnd$?: PropFunction<(value: number | [number, number]) => void>;
}

export const sliderContextId = createContextId<SliderContext>("slider-context");
