import {
  $,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { type SliderValue, type ThumbType, sliderContextId } from "./slider-context";
import "./slider.css";
type DivProps = Omit<PropsOf<"div">, "value" | "min" | "max" | "step" | "disabled">;
interface PublicSliderProps {
  /** Whether the slider should act as a range slider with two thumbs. Default is false */
  isRange?: boolean;
  /** The current value of the slider. For range sliders, this should be a tuple of [start, end] values */
  value?: SliderValue | Signal<SliderValue>;
  /** The minimum value of the slider. Default is 0 */
  min?: number;
  /** The maximum value of the slider. Default is 100 */
  max?: number;
  /** The step interval for the slider value. Default is 1 */
  step?: number;
  /** Whether the slider is disabled. Default is false */
  disabled?: boolean | Signal<boolean>;
  /** Event handler called when the slider value changes */
  onChange$?: QRL<(value: SliderValue) => void> | ((value: SliderValue) => void);
  /** Event handler called when the slider value changes are committed (on drag end or keyboard navigation) */
  onChangeEnd$?: QRL<(value: SliderValue) => void> | ((value: SliderValue) => void);
}

type PublicRootProps = DivProps & PublicSliderProps;
/** Root component that provides slider context and handles core slider functionality */
export const SliderRoot = component$<PublicRootProps>((props) => {
  const {
    isRange = false,
    value: initialValue = isRange ? [0, 100] : 0,
    min: initialMin = 0,
    max: initialMax = 100,
    step: initialStep = 1,
    disabled: initialDisabled = false,
    onChange$,
    onChangeEnd$,
    ...divProps
  } = props;

  const isRangeSignal = useSignal(isRange);

  const valueSignal = useSignal<SliderValue>(
    initialValue instanceof Object && "value" in initialValue
      ? initialValue.value
      : initialValue
  );

  const disabledSignal = (
    typeof props.disabled === "object" && "value" in props.disabled
      ? props.disabled
      : useSignal(props.disabled ?? initialDisabled)
  ) as Signal<boolean>;

  const startValue = useSignal(
    isRange ? (Array.isArray(valueSignal.value) ? valueSignal.value[0] : 0) : 0
  );

  const endValue = useSignal(
    isRange ? (Array.isArray(valueSignal.value) ? valueSignal.value[1] : 100) : 100
  );

  useTask$(({ track }) => {
    if (!isRangeSignal.value) {
      const value = track(() => valueSignal.value);
      if (onChange$) {
        onChange$(value);
      }
    } else {
      const start = track(() => startValue.value);
      const end = track(() => endValue.value);
      if (onChange$) {
        onChange$([start, end]);
      }
    }
  });

  const isDragEnded = useSignal(false);

  useTask$(({ track }) => {
    const dragEnded = track(() => isDragEnded.value);

    if (dragEnded && onChangeEnd$) {
      if (!isRangeSignal.value) {
        onChangeEnd$(valueSignal.value);
      } else {
        onChangeEnd$([startValue.value, endValue.value]);
      }
      isDragEnded.value = false;
    }
  });

  const setValue = $((newValue: number, type?: "start" | "end") => {
    if (!isRangeSignal.value) {
      valueSignal.value = newValue;
    } else if (type === "start" && newValue <= endValue.value) {
      startValue.value = newValue;
    } else if (type === "end" && newValue >= startValue.value) {
      endValue.value = newValue;
    }
  });

  const min = useSignal(initialMin);
  const max = useSignal(initialMax);
  const step = useSignal(initialStep);

  const calculateValue = $((clientX: number, rect: DOMRect) => {
    if (!rect.width) return min.value;
    const position = (clientX - rect.left) / rect.width;
    const range = max.value - min.value;
    let newValue = min.value + range * position;

    if (step.value > 0) {
      newValue = Math.round(newValue / step.value) * step.value;
    }

    return Math.max(min.value, Math.min(max.value, newValue));
  });

  const context = {
    isRange: isRangeSignal,
    value: valueSignal,
    startValue,
    endValue,
    min,
    max,
    step,
    disabled: disabledSignal,
    isDragEnded,
    setValue,
    calculateValue,
    onChange$,
    onChangeEnd$,
    thumbType: useSignal<ThumbType | undefined>(undefined)
  };

  useContextProvider(sliderContextId, context);

  const ariaValueNow = useComputed$(() => {
    if (isRange) return undefined;
    return typeof valueSignal.value === "number" ? valueSignal.value : undefined;
  });

  return (
    <div
      {...divProps}
      // Root container element for the entire slider component
      data-qds-slider-root
      role={isRange ? "group" : "slider"}
      aria-disabled={disabledSignal.value}
      aria-valuemin={min.value}
      aria-valuemax={max.value}
      aria-valuenow={ariaValueNow.value}
    >
      <Slot />
    </div>
  );
});
