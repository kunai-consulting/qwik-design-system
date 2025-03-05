import { type Signal, type PropFunction, createContextId, QRL } from "@builder.io/qwik";

export type ThumbType = "start" | "end";
export type SliderValue = number | [number, number];

export interface SliderContext {
  isRange: Signal<boolean>;
  value: Signal<SliderValue>;
  startValue: Signal<number>;
  endValue: Signal<number>;
  min: Signal<number>;
  max: Signal<number>;
  step: Signal<number>;
  disabled: Signal<boolean>;
  isDragEnded: Signal<boolean>;
  setValue: QRL<(newValue: number, type?: ThumbType) => void>;
  calculateValue: QRL<(clientX: number, rect: DOMRect) => number>;
  thumbType: Signal<ThumbType | undefined>;
  onChange$?: PropFunction<(value: SliderValue) => void>;
  onChangeEnd$?: PropFunction<(value: SliderValue) => void>;
}

export const sliderContextId = createContextId<SliderContext>("slider-context");
