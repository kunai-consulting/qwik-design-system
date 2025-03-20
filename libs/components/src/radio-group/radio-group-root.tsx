import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  sync$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import { useBoundSignal } from "../../utils/bound-signal";
import { resetIndexes } from "../../utils/indexer";
import { syncFixedInV2, withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";
import styles from "./radio-group.css?inline";

type PublicRootProps = PropsOf<"div"> & {
  value?: string;
  onValueChange$?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  form?: string;
  orientation?: "horizontal" | "vertical";
  isDescription?: boolean;
  isError?: boolean;
  "bind:value"?: Signal<string | undefined>;
};

interface TriggerRef {
  ref: Signal;
  value: string;
}

export const RadioGroupRootBase = component$((props: PublicRootProps) => {
  useStyles$(styles);

  const rootRef = useSignal<HTMLElement>();
  const { "bind:value": givenValueSig } = props;
  const selectedValueSig = useBoundSignal(givenValueSig, props.value);
  const isDisabledSig = useComputed$(() => !!props.disabled);
  const localId = useId();
  const selectedFromOnChange = useSignal<string | undefined>();
  const computedIsError = useComputed$(() => !!props.isError);
  const triggerRefsArray = useSignal<TriggerRef[]>([]);

  useTask$(({ track }) => {
    const value = track(() => selectedFromOnChange.value);
    if (value === undefined) return;

    if (!isDisabledSig.value) {
      selectedValueSig.value = value;
    }
  });

  const onValueChange$ = $((value: string) => {
    if (isDisabledSig.value) return;
    selectedFromOnChange.value = value;
  });

  useTask$(({ track }) => {
    const value = track(() => selectedValueSig.value);
    if (value !== undefined) {
      props.onValueChange$?.(value);
    }
  });

  const selectAndFocusTrigger = $((index: number) => {
    const normalizedIndex =
      (index + triggerRefsArray.value.length) % triggerRefsArray.value.length;
    const triggerData = triggerRefsArray.value[normalizedIndex];
    const trigger = triggerData.ref.value;
    const value = triggerData.value;

    if (value) {
      selectedValueSig.value = value;
      trigger.focus();
    }
  });

  const preventKeyDown = syncFixedInV2(
    sync$((event: KeyboardEvent) => {
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
    })
  );

  const getEnabledTriggerIndexes = $((triggerRefs: TriggerRef[]) => {
    return triggerRefs
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.ref.value?.disabled)
      .map(({ index }) => index);
  });

  const handleKeyDown$ = $(async (e: KeyboardEvent) => {
    if (isDisabledSig.value || !rootRef.value) return;

    const enabledTriggerIndexes = await getEnabledTriggerIndexes(triggerRefsArray.value);

    if (!enabledTriggerIndexes.length) return;

    const currentEnabledIndex = selectedValueSig.value
      ? enabledTriggerIndexes.findIndex(
          (index) => triggerRefsArray.value[index].value === selectedValueSig.value
        )
      : 0;

    const isHorizontal = props.orientation === "horizontal";

    switch (e.key) {
      case isHorizontal ? "ArrowRight" : "ArrowDown": {
        const nextIndex = currentEnabledIndex + 1;
        const targetIndex =
          enabledTriggerIndexes[
            nextIndex >= enabledTriggerIndexes.length ? 0 : nextIndex
          ];
        selectAndFocusTrigger(targetIndex);
        break;
      }
      case isHorizontal ? "ArrowLeft" : "ArrowUp": {
        const prevIndex = currentEnabledIndex - 1;
        const targetIndex =
          enabledTriggerIndexes[
            prevIndex < 0 ? enabledTriggerIndexes.length - 1 : prevIndex
          ];
        selectAndFocusTrigger(targetIndex);
        break;
      }
      case "Home":
        selectAndFocusTrigger(enabledTriggerIndexes[0]);
        break;
      case "End":
        selectAndFocusTrigger(enabledTriggerIndexes[enabledTriggerIndexes.length - 1]);
        break;
    }
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
    onValueChange$,
    itemValue: undefined,
    triggerRefsArray
  });

  return (
    <Render
      fallback="div"
      {...props}
      ref={rootRef}
      role="radiogroup"
      data-qds-radio-group-root
      data-orientation={props.orientation || "vertical"}
      data-disabled={isDisabledSig.value ? "" : undefined}
      aria-disabled={isDisabledSig.value}
      aria-required={props.required}
      aria-invalid={computedIsError.value}
      aria-labelledby={`${localId}-label`}
      aria-describedby={props.isDescription ? `${localId}-description` : undefined}
      aria-errormessage={computedIsError.value ? `${localId}-error` : undefined}
      aria-orientation={props.orientation || "vertical"}
      onKeyDown$={[preventKeyDown, handleKeyDown$, props.onKeyDown$]}
    >
      <Slot />
    </Render>
  );
});

export const RadioGroupRoot = withAsChild(RadioGroupRootBase, (props) => {
  resetIndexes("radioGroup");
  return props;
});
