import {
  JSXNode,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { useBoundSignal } from "../../utils/bound-signal";
import { type CheckboxContext, checkboxContextId } from "./checkbox-context";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export type PublicCheckboxRootProps<T extends boolean | "mixed" = boolean> = {
  "bind:checked"?: Signal<boolean | "mixed">;
  /** Initial checked state of the checkbox */
  checked?: T;
  /** Event handler called when the checkbox state changes */
  onChange$?: QRL<(checked: T) => void>;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Whether the checkbox has a description */
  description?: boolean;
  /** Name attribute for the hidden input element */
  name?: string;
  /** Whether the checkbox is required */
  required?: boolean;
  /** Value attribute for the hidden input element */
  value?: string;
} & PropsOf<"div">;

// changing checkbox root

/** Root component that provides context and state management for the checkbox */
export const CheckboxRootBase = component$((props: PublicCheckboxRootProps) => {
  const {
    "bind:checked": givenCheckedSig,
    checked,
    onClick$,
    onChange$,
    description,
    name,
    required,
    value,
    ...rest
  } = props;
  const isCheckedSig = useBoundSignal<boolean | "mixed">(
    givenCheckedSig,
    checked ?? false
  );
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => props.disabled);
  const isErrorSig = useSignal(false);
  const localId = useId();
  const triggerRef = useSignal<HTMLButtonElement>();
  const context: CheckboxContext = {
    isCheckedSig,
    isDisabledSig,
    localId,
    description,
    name,
    required,
    value,
    isErrorSig,
    triggerRef
  };
  useContextProvider(checkboxContextId, context);
  useTask$(async function handleChange({ track }) {
    track(() => isCheckedSig.value);
    if (isInitialLoadSig.value) {
      return;
    }
    await onChange$?.(isCheckedSig.value as boolean);
  });
  useTask$(() => {
    isInitialLoadSig.value = false;
  });
  return (
    <Render
      {...rest}
      fallback="div"
      // Identifier for the root checkbox container
      data-qds-checkbox-root
      // Indicates whether the checkbox is disabled
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      aria-disabled={context.isDisabledSig.value ? "true" : "false"}
      // Indicates whether the checkbox is checked
      data-checked={context.isCheckedSig.value ? "" : undefined}
      // Indicates whether the checkbox is in an indeterminate state
      data-mixed={context.isCheckedSig.value === "mixed" ? "" : undefined}
    >
      <Slot />
    </Render>
  );
});

export const CheckboxRoot = withAsChild(CheckboxRootBase);
