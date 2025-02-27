import {
  type PropsOf,
  component$,
  useContext,
  $,
  useSignal,
  useVisibleTask$,
  useContextProvider,
  Slot
} from "@builder.io/qwik";
import { type ThumbType, sliderContextId, SliderContext } from "./slider-context";
import { useSliderUtils } from "./use-slider-utils";
interface PublicThumbProps extends PropsOf<"div"> {
  /** The type of thumb - either 'start' or 'end' for range sliders */
  type?: ThumbType;
}
/** Draggable thumb component that users interact with to change slider values */
export const SliderThumb = component$((props: PublicThumbProps) => {
  const { type, ...rest } = props;
  const parentContext = useContext(sliderContextId);
  const isDragging = useSignal(false);
  const thumbRef = useSignal<HTMLDivElement>();
  const trackRef = useSignal<HTMLDivElement>();
  const thumbType = useSignal<ThumbType | undefined>(type);
  const { calculateValue, setValue } = useSliderUtils(parentContext);
  const context: SliderContext = {
    ...parentContext,
    thumbType
  };
  useContextProvider(sliderContextId, context);
  const percentage =
    parentContext.mode.value === "single"
      ? ((parentContext.value.value - parentContext.min.value) /
          (parentContext.max.value - parentContext.min.value)) *
        100
      : ((type === "start"
          ? parentContext.startValue.value
          : parentContext.endValue.value - parentContext.min.value) /
          (parentContext.max.value - parentContext.min.value)) *
        100;
  useVisibleTask$(() => {
    if (thumbRef.value) {
      trackRef.value = thumbRef.value.parentElement as HTMLDivElement;
    }
  });
  const onPointerDown$ = $(async (event: PointerEvent) => {
    if (parentContext.disabled.value || !thumbRef.value) return;
    event.preventDefault();
    event.stopPropagation();
    thumbRef.value.setPointerCapture(event.pointerId);
    isDragging.value = true;
    const rect = trackRef.value?.getBoundingClientRect();
    if (rect) {
      const newValue = await calculateValue(event.clientX, rect);
      await setValue(newValue, parentContext.mode.value === "range" ? type : undefined);
    }
  });
  const onPointerMove$ = $(async (event: PointerEvent) => {
    if (!isDragging.value) return;
    if (parentContext.disabled.value || !thumbRef.value) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = trackRef.value?.getBoundingClientRect();
    if (rect) {
      const newValue = await calculateValue(event.clientX, rect);
      await setValue(newValue, parentContext.mode.value === "range" ? type : undefined);
    }
  });
  const onPointerUp$ = $(async (event: PointerEvent) => {
    if (!isDragging.value || !thumbRef.value) return;
    event.stopPropagation();
    isDragging.value = false;
    thumbRef.value.releasePointerCapture(event.pointerId);
    const rect = trackRef.value?.getBoundingClientRect();
    if (rect) {
      const newValue = await calculateValue(event.clientX, rect);
      await setValue(
        newValue,
        parentContext.mode.value === "range" ? type : undefined,
        true
      );
    }
  });
  const onKeyDown$ = $(async (event: KeyboardEvent) => {
    if (parentContext.disabled.value) return;
    event.preventDefault();
    const step = event.shiftKey
      ? parentContext.step.value * 10
      : parentContext.step.value;
    let newValue: number;
    if (parentContext.mode.value === "single") {
      newValue = parentContext.value.value;
    } else {
      newValue =
        type === "start" ? parentContext.startValue.value : parentContext.endValue.value;
    }
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp": {
        const maxValue =
          parentContext.mode.value === "range" && type === "start"
            ? parentContext.endValue.value
            : parentContext.max.value;
        newValue = Math.min(maxValue, newValue + step);
        break;
      }
      case "ArrowLeft":
      case "ArrowDown": {
        const minValue =
          parentContext.mode.value === "range" && type === "end"
            ? parentContext.startValue.value
            : parentContext.min.value;
        newValue = Math.max(minValue, newValue - step);
        break;
      }
      case "Home":
        newValue =
          parentContext.mode.value === "range" && type === "end"
            ? parentContext.startValue.value
            : parentContext.min.value;
        break;
      case "End":
        newValue =
          parentContext.mode.value === "range" && type === "start"
            ? parentContext.endValue.value
            : parentContext.max.value;
        break;
      default:
        return;
    }
    await setValue(
      newValue,
      parentContext.mode.value === "range" ? type : undefined,
      true
    );
  });
  return (
    <div
      {...rest}
      ref={thumbRef}
      // Draggable thumb element used to select values on the slider
      data-qds-slider-thumb
      // Identifies whether the thumb is for the start or end value in range mode
      data-thumb-type={parentContext.mode.value === "range" ? type : undefined}
      style={{ left: `${percentage}%` }}
      onPointerDown$={onPointerDown$}
      onPointerUp$={onPointerUp$}
      document:onPointerMove$={onPointerMove$}
      onKeyDown$={onKeyDown$}
      role="slider"
      tabIndex={parentContext.disabled.value ? -1 : 0}
      aria-valuemin={
        parentContext.mode.value === "range" && type === "start"
          ? parentContext.min.value
          : parentContext.startValue.value
      }
      aria-valuemax={
        parentContext.mode.value === "range" && type === "end"
          ? parentContext.max.value
          : parentContext.endValue.value
      }
      aria-valuenow={
        parentContext.mode.value === "single"
          ? parentContext.value.value
          : type === "start"
            ? parentContext.startValue.value
            : parentContext.endValue.value
      }
      aria-disabled={parentContext.disabled.value}
    >
      <Slot />
    </div>
  );
});
