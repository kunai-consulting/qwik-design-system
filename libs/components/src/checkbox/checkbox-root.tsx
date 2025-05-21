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
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type CheckboxContext, checkboxContextId } from "./checkbox-context";

export type PublicCheckboxRootProps<T extends boolean | "mixed" = boolean> = {
  /** Event handler called when the checkbox state changes */
  onChange$?: (checked: T) => void;
  /**
   * @deprecated This prop will be ignored if _staticHasDescription is provided by the build process.
   * Manually indicates whether the checkbox has an associated description.
   */
  description?: boolean;
  /** Name attribute for the hidden input element */
  name?: string;
  /** Whether the checkbox is required */
  required?: boolean;
  /** Value attribute for the hidden input element */
  value?: string;
  /** @internal Static analysis result indicating if a description is structurally present. Should be injected by a Vite plugin. */
  _staticHasDescription?: boolean;
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
  // Destructure _staticHasDescription. The manual `description` prop is kept for now as a fallback.
  const {
    onChange$,
    description,
    name,
    required,
    value,
    _staticHasDescription,
    ...rest
  } = props;

  console.log("Checkbox.Root", props);

  if (typeof _staticHasDescription === "boolean") {
    console.log(
      `[Checkbox.Root] Received _staticHasDescription: ${_staticHasDescription}. Original description prop was: ${description}`
    );
  }

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

  // Determine the effective description status
  const effectiveDescription = useComputed$(() => {
    // Prioritize the static analysis result if it was provided by the plugin
    if (typeof _staticHasDescription === "boolean") {
      return _staticHasDescription;
    }
    // Otherwise, fallback to the manually provided description prop
    return description;
  });

  const context: CheckboxContext = {
    checkedSig,
    isDisabledSig,
    localId,
    description: effectiveDescription.value, // Use the computed effective description
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
      data-has-description={props._staticHasDescription ? "true" : undefined}
      {...context.dataAttributes.value}
    >
      <Slot />
    </Render>
  );
});

export const CheckboxRoot = withAsChild(CheckboxRootBase);
