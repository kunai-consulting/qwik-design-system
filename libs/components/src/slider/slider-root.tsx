import {
  type PropsOf,
  type PropFunction,
  type QRL,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useStyles$,
} from "@builder.io/qwik";
import { Mark, SliderMode, sliderContextId, ThumbType } from "./slider-context";
import styles from "./slider.css?inline";

type DivProps = Omit<PropsOf<"div">, "value" | "min" | "max" | "step" | "disabled">;

interface SliderProps {
  mode?: SliderMode;
  value?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  marks?: Mark[];
  onValueChange$?: QRL<(value: number | [number, number]) => void> | PropFunction<(value: number | [number, number]) => void>;
  onValueChangeEnd$?: QRL<(value: number | [number, number]) => void> | PropFunction<(value: number | [number, number]) => void>;
}

type PublicRootProps = DivProps & SliderProps;

export const SliderRoot = component$<PublicRootProps>((props) => {
  useStyles$(styles);

  const {
    mode: initialMode = 'single',
    value: initialValue = initialMode === 'single' ? 0 : [0, 100],
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
  const value = useSignal(initialMode === 'single' ?
    (typeof initialValue === 'number' ? initialValue : 0) :
    50
  );
  const startValue = useSignal(initialMode === 'range' ?
    (Array.isArray(initialValue) ? initialValue[0] : 0) :
    25
  );
  const endValue = useSignal(initialMode === 'range' ?
    (Array.isArray(initialValue) ? initialValue[1] : 100) :
    75
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
      data-qds-slider-root
      role={mode.value === 'single' ? 'slider' : 'group'}
      aria-disabled={disabled.value}
      aria-valuemin={min.value}
      aria-valuemax={max.value}
      aria-valuenow={mode.value === 'single' ? value.value : undefined}
    >
      <Slot />
    </div>
  );
});
