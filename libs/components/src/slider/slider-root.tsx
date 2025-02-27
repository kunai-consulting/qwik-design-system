import {
  type PropsOf,
  type PropFunction,
  type QRL,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useStyles$
} from "@builder.io/qwik";
import { Mark, SliderMode, sliderContextId, ThumbType } from "./slider-context";
import styles from "./slider.css?inline";
type DivProps = Omit<PropsOf<"div">, "value" | "min" | "max" | "step" | "disabled">;
interface PublicSliderProps {
  /** The mode of the slider - either 'single' or 'range'. Default is 'single' */
  mode?: SliderMode;
  /** The initial value of the slider. For single mode, use a number. For range mode, use a tuple of numbers */
  value?: number | [number, number];
  /** The minimum value of the slider. Default is 0 */
  min?: number;
  /** The maximum value of the slider. Default is 100 */
  max?: number;
  /** The step interval for the slider value. Default is 1 */
  step?: number;
  /** Whether the slider is disabled. Default is false */
  disabled?: boolean;
  /** Array of marks to display on the slider */
  marks?: Mark[];
  /** Event handler for value change events */
  onValueChange$?:
    | QRL<(value: number | [number, number]) => void>
    | PropFunction<(value: number | [number, number]) => void>;
  /** Event handler for value change end events (when interaction ends) */
  onValueChangeEnd$?:
    | QRL<(value: number | [number, number]) => void>
    | PropFunction<(value: number | [number, number]) => void>;
}
type PublicRootProps = DivProps & PublicSliderProps;
/** Root component that provides slider context and handles core slider functionality */
export const SliderRoot = component$<PublicRootProps>((props) => {
  useStyles$(styles);
  const {
    mode: initialMode = "single",
    value: initialValue = initialMode === "single" ? 0 : [0, 100],
    min: initialMin,
    max: initialMax,
    step: initialStep,
    disabled: initialDisabled,
    marks: initialMarks,
    onValueChange$,
    onValueChangeEnd$,
    ...divProps
  } = props;
  const mode = useSignal<SliderMode>(initialMode);
  const value = useSignal(
    initialMode === "single" ? (typeof initialValue === "number" ? initialValue : 0) : 50
  );
  const startValue = useSignal(
    initialMode === "range" ? (Array.isArray(initialValue) ? initialValue[0] : 0) : 25
  );
  const endValue = useSignal(
    initialMode === "range" ? (Array.isArray(initialValue) ? initialValue[1] : 100) : 75
  );
  const min = useSignal(initialMin ?? 0);
  const max = useSignal(initialMax ?? 100);
  const step = useSignal(initialStep ?? 1);
  const disabled = useSignal(initialDisabled ?? false);
  const marks = useSignal(initialMarks ?? []);
  const context = {
    mode,
    value,
    startValue,
    endValue,
    min,
    max,
    step,
    disabled,
    marks,
    onValueChange$,
    onValueChangeEnd$,
    thumbType: useSignal<ThumbType | undefined>(undefined)
  };
  useContextProvider(sliderContextId, context);
  return (
    <div
      {...divProps}
      // Root container element for the entire slider component
      data-qds-slider-root
      role={mode.value === "single" ? "slider" : "group"}
      aria-disabled={disabled.value}
      aria-valuemin={min.value}
      aria-valuemax={max.value}
      aria-valuenow={mode.value === "single" ? value.value : undefined}
    >
      <Slot />
    </div>
  );
});
