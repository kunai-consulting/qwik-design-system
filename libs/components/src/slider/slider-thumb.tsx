import {
  type PropsOf,
  component$,
  useContext,
  $,
  useSignal,
  useVisibleTask$,
  useContextProvider,
  Slot,
  useComputed$,
  sync$,
  useStylesScoped$,
  CSSProperties
} from "@builder.io/qwik";
import { type ThumbType, sliderContextId, SliderContext } from "./slider-context";
interface PublicThumbProps extends PropsOf<"div"> {
  /** The type of thumb - either 'start' or 'end' for range sliders */
  type?: ThumbType;
}
/** Draggable thumb component that users interact with to change slider values */
export const SliderThumb = component$((props: PublicThumbProps) => {
  useStylesScoped$(`
    .thumb {
      position: absolute;
      left: var(--thumb-position);
      transform: translate(-50%, -50%);
    }
  `);

  const { type, ...rest } = props;
  const context = useContext(sliderContextId);
  const isDragging = useSignal(false);
  const thumbRef = useSignal<HTMLDivElement>();
  const trackRef = useSignal<HTMLDivElement>();
  const thumbType = useSignal<ThumbType | undefined>(type);
  const extendedContext: SliderContext = {
    ...context,
    thumbType
  };

  const ariaValueMin = useComputed$(() =>
    context.isRange.value && type === "start"
      ? context.min.value
      : context.startValue.value
  );

  const ariaValueMax = useComputed$(() =>
    context.isRange.value && type === "end" ? context.max.value : context.endValue.value
  );
  const ariaValueNow = useComputed$(() => {
    const value = !context.isRange.value
      ? context.value.value
      : type === "start"
        ? context.startValue.value
        : context.endValue.value;
    return typeof value === "number" ? value : undefined;
  });

  useContextProvider(sliderContextId, extendedContext);

  const percentage = useComputed$(() => {
    const range = context.max.value - context.min.value;
    if (range === 0) return 0;

    if (!context.isRange.value) {
      const value = context.value.value as number;
      return Math.min(100, Math.max(0, ((value - context.min.value) / range) * 100));
    }
    const value = type === "start" ? context.startValue.value : context.endValue.value;
    return Math.min(100, Math.max(0, ((value - context.min.value) / range) * 100));
  });

  useVisibleTask$(({ track }) => {
    const currentPercentage = track(() => percentage.value);

    if (thumbRef.value) {
      thumbRef.value.style.left = `${currentPercentage}%`;
      trackRef.value = thumbRef.value.parentElement as HTMLDivElement;
    }
  });

  const onPointerDown$ = $(async (event: PointerEvent) => {
    if (context.disabled.value || !thumbRef.value) return;
    thumbRef.value.setPointerCapture(event.pointerId);
    isDragging.value = true;
    const rect = trackRef.value?.getBoundingClientRect();
    if (rect) {
      const newValue = await context.calculateValue(event.clientX, rect);
      await context.setValue(newValue, type);
    }
  });

  const onPointerMove$ = $(async (event: PointerEvent) => {
    if (!isDragging.value) return;
    if (context.disabled.value) return;
    const rect = trackRef.value?.getBoundingClientRect();
    if (rect) {
      const newValue = await context.calculateValue(event.clientX, rect);
      await context.setValue(newValue, type);
    }
  });

  const onPointerUp$ = $(async (event: PointerEvent) => {
    if (!isDragging.value || !thumbRef.value) return;
    isDragging.value = false;
    thumbRef.value.releasePointerCapture(event.pointerId);
    const rect = trackRef.value?.getBoundingClientRect();
    if (rect) {
      const newValue = await context.calculateValue(event.clientX, rect);
      await context.setValue(newValue, type);
      context.isDragEnded.value = true;
    }
  });

  type MinMaxValues = {
    min: number;
    max: number;
  };

  const getMinMaxValues = $((thumbType: ThumbType | undefined): MinMaxValues => {
    if (!context.isRange.value) {
      return {
        min: context.min.value,
        max: context.max.value
      };
    }
    return thumbType === "start"
      ? {
          min: context.min.value,
          max: context.endValue.value
        }
      : {
          min: context.startValue.value,
          max: context.max.value
        };
  });

  const onKeyDown$ = $(async (event: KeyboardEvent) => {
    if (context.disabled.value) return;

    const step = event.shiftKey ? context.step.value * 10 : context.step.value;
    let newValue = !context.isRange.value
      ? (context.value.value as number)
      : type === "start"
        ? context.startValue.value
        : context.endValue.value;

    const { min: minValue, max: maxValue } = await getMinMaxValues(type);

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        newValue = Math.min(maxValue, newValue + step);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        newValue = Math.max(minValue, newValue - step);
        break;
      case "Home":
        newValue = minValue;
        break;
      case "End":
        newValue = maxValue;
        break;
      default:
        return;
    }

    await context.setValue(newValue, type);
    context.isDragEnded.value = true;
  });

  const preventKeyDown = sync$((event: KeyboardEvent) => {
    const preventKeys = [
      "ArrowRight",
      "ArrowLeft",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End"
    ];
    if (preventKeys.includes(event.key)) {
      event.preventDefault();
    }
  });

  return (
    <div
      {...rest}
      ref={thumbRef}
      // Draggable thumb element used to select values on the slider
      data-qds-slider-thumb
      // Identifies whether the thumb is for the start or end value in range mode
      data-thumb-type={context.isRange.value ? type : undefined}
      style={{
        ...((rest.style ?? {}) as CSSProperties),
        "--thumb-position": `${percentage}%`
      }}
      preventdefault:pointerdown
      preventdefault:pointermove
      preventdefault:pointerup
      onPointerDown$={[onPointerDown$, props.onPointerDown$]}
      onPointerUp$={onPointerUp$}
      document:onPointerMove$={onPointerMove$}
      onKeyDown$={[preventKeyDown, onKeyDown$]}
      role="slider"
      tabIndex={context.disabled.value ? -1 : 0}
      aria-valuemin={ariaValueMin.value}
      aria-valuemax={ariaValueMax.value}
      aria-valuenow={ariaValueNow.value}
      aria-disabled={context.disabled.value}
    >
      <Slot />
    </div>
  );
});
