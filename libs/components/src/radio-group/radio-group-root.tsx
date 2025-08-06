import { useBoundSignal } from "@kunai-consulting/qwik-utils";
import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useStyles$,
  useTask$
} from "@qwik.dev/core";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";
import styles from "./radio-group.css?inline";

type PublicRootProps = {
  value?: string;
  onChange$?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  orientation?: "horizontal" | "vertical";
  isDescription?: boolean;
  isError?: boolean;
  "bind:value"?: Signal<string | undefined>;
} & Omit<PropsOf<"div">, "onChange$">;

interface TriggerRef {
  ref: Signal;
  value: string;
}

export const RadioGroupRoot = component$((props: PublicRootProps) => {
  useStyles$(styles);

  const {
    "bind:value": givenValueSig,
    onChange$,
    disabled,
    name,
    required,
    orientation,
    isDescription,
    isError,
    onKeyDown$,
    ...rest
  } = props;

  const rootRef = useSignal<HTMLElement>();
  const valuePropSig = useComputed$(() => props.value);
  const selectedValueSig = useBoundSignal<string | undefined>(
    givenValueSig,
    givenValueSig?.value ?? valuePropSig.value,
    valuePropSig
  );
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => !!props.disabled);
  const localId = useId();
  const computedIsError = useComputed$(() => !!props.isError);
  const triggerRefsArray = useSignal<TriggerRef[]>([]);
  const currItemIndex = 0;
  const descriptionId = `${localId}-description`;
  const labelId = `${localId}-label`;

  useTask$(function handleChange({ track }) {
    track(() => selectedValueSig.value);
    if (isInitialLoadSig.value) {
      return;
    }
    if (selectedValueSig.value) {
      props.onChange$?.(selectedValueSig.value);
    }
  });

  useTask$(() => {
    isInitialLoadSig.value = false;
  });

  const getEnabledTriggerIndexes = $((triggerRefs: TriggerRef[]) => {
    return triggerRefs
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.ref.value?.disabled)
      .map(({ index }) => index);
  });

  const activateItemAt = $((index: number, enabledTriggers: number[]) => {
    const triggerData = triggerRefsArray.value[enabledTriggers[index]];
    const trigger = triggerData.ref.value;
    const value = triggerData.value;

    if (value) {
      selectedValueSig.value = value;
      trigger.focus();
    }
  });

  const handleKeyDown$ = $(async (e: KeyboardEvent) => {
    if (isDisabledSig.value || !rootRef.value) return;

    const isHorizontal = props.orientation === "horizontal";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

    const enabledTriggerIndexes = await getEnabledTriggerIndexes(triggerRefsArray.value);

    if (!enabledTriggerIndexes.length) return;

    let currentIndex = 0;

    if (selectedValueSig.value) {
      currentIndex = enabledTriggerIndexes.findIndex(
        (index) => triggerRefsArray.value[index].value === selectedValueSig.value
      );
    }

    let nextIndex: number;

    if (e.key === nextKey) {
      nextIndex = currentIndex + 1;
    } else if (e.key === prevKey) {
      nextIndex = currentIndex - 1;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = enabledTriggerIndexes.length - 1;
    } else {
      return;
    }

    // Ensure circular navigation
    if (nextIndex < 0) {
      nextIndex = enabledTriggerIndexes.length - 1;
    } else if (nextIndex >= enabledTriggerIndexes.length) {
      nextIndex = 0;
    }

    activateItemAt(nextIndex, enabledTriggerIndexes);
  });

  useContextProvider(radioGroupContextId, {
    selectedValueSig,
    isDisabledSig,
    isErrorSig: computedIsError,
    localId,
    required: props.required,
    name: props.name,
    orientation: props.orientation || "vertical",
    isDescription: props.isDescription,
    triggerRefsArray,
    currItemIndex
  });

  return (
    <Render
      {...rest}
      fallback="div"
      internalRef={rootRef}
      role="radiogroup"
      data-qds-radio-group-root
      data-orientation={props.orientation || "vertical"}
      data-disabled={isDisabledSig.value ? "" : undefined}
      aria-disabled={isDisabledSig.value}
      aria-required={props.required}
      aria-invalid={computedIsError.value}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      aria-errormessage={computedIsError.value ? `${localId}-error` : undefined}
      aria-orientation={props.orientation || "vertical"}
      onKeyDown$={[handleKeyDown$, props.onKeyDown$]}
    >
      <Slot />
    </Render>
  );
});
