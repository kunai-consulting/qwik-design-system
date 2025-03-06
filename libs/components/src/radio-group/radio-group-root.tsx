import {
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useTask$,
  $, useVisibleTask$
} from "@builder.io/qwik";
import { type RadioGroupContext, radioGroupContextId } from "./radio-group-context";

export type PublicRadioGroupRootProps = {
  "bind:value"?: Signal<string | undefined>;
  /** Event handler for when the radio group selection changes */
  onChange$?: QRL<(checked: string) => void>;
  /** Initial value of the radio group when first rendered */
  defaultValue?: string;
  /** Whether the radio group is disabled */
  disabled?: boolean;
  /** Whether the radio group has a description */
  isDescription?: boolean;
  /** Name attribute for the hidden radio input */
  name?: string;
  /** Whether the radio group is required */
  required?: boolean;
  /** The current value of the radio group */
  value?: string;
  orientation?: 'horizontal' | 'vertical';
} & PropsOf<"div">;
/** Root component that manages the radio group's state and behavior */
export const RadioGroupRoot = component$((props: PublicRadioGroupRootProps) => {
  const {
    "bind:value": givenValueSig,
    onClick$,
    onChange$,
    isDescription,
    required,
    value,
    orientation = 'vertical',
    ...rest
  } = props;

  const selectedValueSig = useSignal<string | undefined>(props.defaultValue);
  const selectedIndexSig = useSignal<number | null>(null);
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => props.disabled);
  const isErrorSig = useSignal(false);
  const localId = useId();
  const triggerRef = useSignal<HTMLButtonElement>();
  const formRef = useSignal<HTMLFormElement>();
  const rootRef = useSignal<HTMLDivElement>();
  const hasFocusWithinSig = useSignal(false);

  const context: RadioGroupContext = {
    selectedValueSig,
    selectedIndexSig,
    isDisabledSig,
    localId,
    isDescription,
    required,
    value,
    isErrorSig,
    triggerRef,
    formRef,
    orientation
  };

  useContextProvider(radioGroupContextId, context);

  const handleKeyDown$ = $((event: KeyboardEvent) => {
    if (isDisabledSig.value || !rootRef.value) return;

    const triggers = Array.from(
      rootRef.value.querySelectorAll('[data-qds-radio-group-trigger]:not([disabled])')
    );
    if (!triggers.length) return;

    const currentIndex = triggers.findIndex(item => item === document.activeElement);
    const startIndex = currentIndex === -1 ? 0 : currentIndex;
    const moveToIndex = (index: number) => {
      event.preventDefault();
      const normalizedIndex = (index + triggers.length) % triggers.length;
      const targetElement = triggers[normalizedIndex] as HTMLElement;
      if (targetElement) {
        targetElement.focus();
        const newValue = targetElement.getAttribute('value');
        if (newValue) {
          selectedValueSig.value = newValue;
          selectedIndexSig.value = normalizedIndex;
        }
        targetElement.click();
      }
    };

    const isHorizontal = orientation === 'horizontal';

    switch (event.key) {
      case isHorizontal ? 'ArrowRight' : 'ArrowDown':
        moveToIndex(startIndex + 1);
        break;
      case isHorizontal ? 'ArrowLeft' : 'ArrowUp':
        moveToIndex(startIndex - 1);
        break;
      case 'Home':
        moveToIndex(0);
        break;
      case 'End':
        moveToIndex(triggers.length - 1);
        break;
    }
  });

  useTask$(({ track }) => {
    track(() => value);
    if (value !== undefined) {
      selectedValueSig.value = value;
    }
  });

  useTask$(async function handleChange({ track }) {
    track(() => selectedValueSig.value);

    if (isInitialLoadSig.value) {
      return;
    }

    await onChange$?.(selectedValueSig.value as string);
  });

  useTask$(() => {
    isInitialLoadSig.value = false;
  });

  useTask$(({ track }) => {
    track(() => selectedValueSig.value);
    context.isErrorSig.value = !!(context.required && selectedValueSig.value === undefined);
  });

  useTask$(({ track }) => {
    if (givenValueSig) {
      track(() => selectedValueSig.value);
      track(() => givenValueSig.value);

      if (selectedValueSig.value !== givenValueSig.value) {
        if (givenValueSig.value !== undefined) {
          selectedValueSig.value = givenValueSig.value;
        } else {
          givenValueSig.value = selectedValueSig.value;
        }
      }
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedValueSig.value);

    if (!selectedValueSig.value) {
      const firstTrigger = document.querySelector('[data-qds-radio-group-trigger]:not([disabled])') as HTMLElement;
      if (firstTrigger) {
        firstTrigger.setAttribute('tabindex', '0');
      }
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedValueSig.value);
    track(() => hasFocusWithinSig.value);

    if (!rootRef.value) return;

    const triggers = Array.from(
      rootRef.value.querySelectorAll('[data-qds-radio-group-trigger]:not([disabled])')
    );

    if (!hasFocusWithinSig.value && !selectedValueSig.value && triggers.length > 0) {
      (triggers[0] as HTMLElement).setAttribute('tabindex', '0');
    }
  });

  const handleFocusIn$ = $(() => {
    hasFocusWithinSig.value = true;
  });

  const handleFocusOut$ = $(() => {
    hasFocusWithinSig.value = false;
  });

  return (
    <div
      {...rest}
      ref={rootRef}
      role="radiogroup"
      // Identifier for the root radio group container
      data-qds-radio-group-root
      // Indicates whether the radio group is disabled
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      data-orientation={orientation}
      aria-disabled={context.isDisabledSig.value ? "true" : "false"}
      aria-labelledby={`${localId}-label`}
      aria-describedby={context.isDescription ? `${localId}-description` : undefined}
      aria-required={required ? "true" : "false"}
      aria-invalid={isErrorSig.value}
      aria-errormessage={isErrorSig.value ? `${localId}-error` : undefined}
      onKeyDown$={handleKeyDown$}
      onFocusIn$={handleFocusIn$}
      onFocusOut$={handleFocusOut$}
    >
      <Slot />
    </div>
  );
});
