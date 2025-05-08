import {
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import {
  type BindableProps,
  getComponentFlags,
  useBindings
} from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type CheckboxContext, checkboxContextId } from "./checkbox-context";
import { CheckboxDescription } from "./checkbox-description";
import { CheckboxLabel } from "./checkbox-label";

export type PublicCheckboxRootProps<T extends boolean | "mixed" = boolean> = {
  /** Event handler called when the checkbox state changes */
  onChange$?: (checked: T) => void;
  /** Whether the checkbox has a description */
  description?: boolean;
  /** Name attribute for the hidden input element */
  name?: string;
  /** Whether the checkbox is required */
  required?: boolean;
  /** Value attribute for the hidden input element */
  value?: string;
} & Omit<PropsOf<"div">, "onChange$"> &
  BindableProps<CheckboxBinds>;

type CheckboxBinds = {
  /* Determines whether the checkbox is checked */
  checked: boolean | "mixed";
  /** Whether the checkbox is disabled */
  disabled: boolean;
};

/** Root component that provides context and state management for the checkbox */
export const CheckboxRootBase = component$((props: PublicCheckboxRootProps) => {
  const { onChange$, description, name, required, value, ...rest } = props;

  const { checkedSig, disabledSig: isDisabledSig } = useBindings<CheckboxBinds>(props, {
    checked: false,
    disabled: false
  });

  const isInitialLoadSig = useSignal(true);
  const isErrorSig = useSignal(false);
  const localId = useId();
  const triggerRef = useSignal<HTMLButtonElement>();

  const isCheckedSig = useComputed$(() => {
    return checkedSig.value === true;
  });

  const dataAttributes = useComputed$(() => {
    return {
      "data-checked": isCheckedSig.value ? "" : undefined,
      "data-mixed": checkedSig.value === "mixed" ? "" : undefined,
      "data-disabled": isDisabledSig.value ? "" : undefined
    };
  });

  const context: CheckboxContext = {
    checkedSig,
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
    track(() => checkedSig.value);

    if (!isInitialLoadSig.value) {
      await onChange$?.(checkedSig.value as boolean);
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

export const CheckboxRoot = withAsChild(CheckboxRootBase, (props) => {
  const componentFlagMap = {
    hasDescription: CheckboxDescription,
    hasLabel: CheckboxLabel
  };

  console.log(props);

  const componentFlags = getComponentFlags(props.children, componentFlagMap, {
    debug: true
  });

  props.componentFlags = componentFlags;

  return props;
});
