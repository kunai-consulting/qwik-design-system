import {
  $,
  type PropFunction,
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
import { radioGroupContextId } from "./radio-group-context";
import styles from "./radio-group.css?inline";
import {useBoundSignal} from "../../utils/bound-signal";
import {Render} from "../render/render";
import {withAsChild} from "../as-child/as-child";

type PublicRootProps = PropsOf<"div"> & {
  value?: string;
  onChange$?: PropFunction<(value: string) => void>;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  form?: string;
  orientation?: "horizontal" | "vertical";
  isDescription?: boolean;
  "bind:value"?: Signal<string | undefined>;
};

export const RadioGroupRootBase = component$((props: PublicRootProps) => {
  useStyles$(styles);

  const rootRef = useSignal<HTMLElement>();
  const {
    "bind:value": givenValueSig,
  } = props;
  const selectedValueSig = useBoundSignal(
    givenValueSig, props.value
  );
  const isDisabledSig = useComputed$(() => !!props.disabled);
  const isErrorSig = useSignal(false);
  const formRef = useSignal<HTMLFormElement>();
  const localId = useId();
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

  const onChange$ = $((value: string) => {
    if (isDisabledSig.value) return;
    selectedValueSig.value = value;
    props.onChange$?.(value);
    isErrorSig.value = false;
  });

  useTask$(() => {
    if (!props.form) return;
    formRef.value = document.getElementById(props.form) as HTMLFormElement;
  });

  useTask$(({ track }) => {
    track(() => selectedValueSig.value);
    isErrorSig.value = !!(props.required && !selectedValueSig.value);
  });

  useTask$(({ track }) => {
    const value = track(() => props.value);
    if (value !== undefined) {
      selectedValueSig.value = value;
    }
  });

  const moveToIndex = $((index: number, enabledTriggers: Element[]) => {
    const normalizedIndex = (index + enabledTriggers.length) % enabledTriggers.length;
    const trigger = enabledTriggers[normalizedIndex] as HTMLElement;
    const value = trigger.getAttribute("value");

    if (value) {
      selectedValueSig.value = value;
      props.onChange$?.(value);
      trigger.focus();
    }
  });

  const handleKeyDown$ = $((e: KeyboardEvent) => {
    if (isDisabledSig.value || !rootRef.value) return;

    if (
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
    )
      return;

    sync$((e: KeyboardEvent) => e.preventDefault())(e);

    const enabledTriggers = triggers
      .filter((item) => !(item.element as HTMLElement).hasAttribute("disabled"))
      .sort((a, b) => a.index - b.index)
      .map((item) => item.element);

    if (!enabledTriggers.length) return;

    const currentIndex = selectedValueSig.value
      ? enabledTriggers.findIndex(
          (trigger) =>
            (trigger as HTMLElement).getAttribute("value") === selectedValueSig.value
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
    isErrorSig,
    localId,
    required: props.required,
    name: props.name,
    formRef,
    orientation: props.orientation || "vertical",
    isDescription: props.isDescription,
    onChange$,
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
      aria-invalid={isErrorSig.value}
      aria-labelledby={`${localId}-label`}
      aria-describedby={props.isDescription ? `${localId}-description` : undefined}
      aria-errormessage={isErrorSig.value ? `${localId}-error` : undefined}
      aria-orientation={props.orientation || "vertical"}
      onKeyDown$={[handleKeyDown$, props.onKeyDown$]}
    >
      <Slot />
    </Render>
  );
});

export const RadioGroupRoot = withAsChild(RadioGroupRootBase);
