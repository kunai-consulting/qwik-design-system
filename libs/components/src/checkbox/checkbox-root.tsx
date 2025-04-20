import {
  type PropsOf,
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
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type CheckboxContext, checkboxContextId } from "./checkbox-context";

export type PublicCheckboxRootProps<T extends boolean | "mixed" = boolean> = {
  "bind:checked"?: Signal<boolean | "mixed">;
  /** Initial checked state of the checkbox */
  checked?: T;
  /** Event handler called when the checkbox state changes */
  onChange$?: (checked: T) => void;
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
} & Omit<PropsOf<"div">, "onChange$">;

// changing checkbox root

/** Root component that provides context and state management for the checkbox */
export const CheckboxRootBase = component$((props: PublicCheckboxRootProps) => {
  const {
    "bind:checked": givenCheckedSig,
    onClick$,
    onChange$,
    description,
    name,
    required,
    value,
    ...rest
  } = props;

  const checkedPropSig = useComputed$(() => props.checked);
  const checkedStateSig = useBoundSignal<boolean | "mixed">(
    // 2 way binding
    givenCheckedSig,
    // initial value
    givenCheckedSig?.value ?? checkedPropSig.value ?? false,
    // value based signal
    checkedPropSig
  );

  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => props.disabled);
  const isErrorSig = useSignal(false);
  const localId = useId();
  const triggerRef = useSignal<HTMLButtonElement>();

  const isCheckedSig = useComputed$(() => {
    return checkedStateSig.value === true;
  });

  const dataAttributes = useComputed$(() => {
    return {
      "data-checked": isCheckedSig.value ? "" : undefined,
      "data-mixed": checkedStateSig.value === "mixed" ? "" : undefined,
      "data-disabled": isDisabledSig.value ? "" : undefined
    };
  });

  const context: CheckboxContext = {
    checkedStateSig,
    isDisabledSig,
    localId,
    description,
    name,
    required,
    value,
    isErrorSig,
    triggerRef,
    dataAttributes
  };

  useContextProvider(checkboxContextId, context);

  useTask$(async function handleChange({ track, cleanup }) {
    track(() => checkedStateSig.value);

    if (!isInitialLoadSig.value) {
      await onChange$?.(checkedStateSig.value as boolean);
    }

    cleanup(() => {
      isInitialLoadSig.value = false;
    });
  });

  return (
    <Render
      {...rest}
      fallback="div"
      // Identifier for the root checkbox container
      data-qds-checkbox-root
      // Indicates whether the checkbox is disabled
      aria-disabled={context.isDisabledSig.value ? "true" : "false"}
      {...context.dataAttributes.value}
    >
      <Slot />
    </Render>
  );
});

export const CheckboxRoot = withAsChild(CheckboxRootBase);
