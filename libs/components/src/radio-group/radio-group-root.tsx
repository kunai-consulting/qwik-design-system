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
  useStore,
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

export const RadioGroupRootBase = component$((props: PublicRootProps) => {
  useStyles$(styles);

  const rootRef = useSignal<HTMLElement>();
  const { "bind:value": givenValueSig } = props;
  const selectedValueSig = useBoundSignal(givenValueSig, props.value);
  const isDisabledSig = useComputed$(() => !!props.disabled);
  const localId = useId();
  const selectedFromOnChange = useSignal<string | undefined>();
  const computedIsError = useComputed$(() => !!props.isError);
  const triggers = useStore<Array<{ element: Element; index: number }>>([]);

  const registerTrigger$ = $((element: Element, index?: number) => {
    triggers.push({ element, index: index ?? 0 });
  });

  const unregisterTrigger$ = $((element: Element) => {
    const index = triggers.findIndex((t) => t.element === element);
    if (index !== -1) {
      triggers.splice(index, 1);
    }
  });

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

  const moveToIndex = $((index: number, enabledTriggers: Element[]) => {
    const normalizedIndex = (index + enabledTriggers.length) % enabledTriggers.length;
    const trigger = enabledTriggers[normalizedIndex] as HTMLElement;
    const value = (trigger as HTMLButtonElement).value;

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

  const handleKeyDown$ = $((e: KeyboardEvent) => {
    if (isDisabledSig.value || !rootRef.value) return;

    const enabledTriggers = triggers
      .filter((item) => !(item.element as HTMLElement).hasAttribute("disabled"))
      .sort((a, b) => a.index - b.index)
      .map((item) => item.element);

    if (!enabledTriggers.length) return;

    const currentIndex = selectedValueSig.value
      ? enabledTriggers.findIndex(
          (trigger) => (trigger as HTMLButtonElement).value === selectedValueSig.value
        )
      : 0;

    const isHorizontal = props.orientation === "horizontal";

    switch (e.key) {
      case isHorizontal ? "ArrowRight" : "ArrowDown":
        moveToIndex(currentIndex + 1, enabledTriggers);
        break;
      case isHorizontal ? "ArrowLeft" : "ArrowUp":
        moveToIndex(
          currentIndex === 0 ? enabledTriggers.length - 1 : currentIndex - 1,
          enabledTriggers
        );
        break;
      case "Home":
        moveToIndex(0, enabledTriggers);
        break;
      case "End":
        moveToIndex(enabledTriggers.length - 1, enabledTriggers);
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
    registerTrigger$,
    unregisterTrigger$
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
