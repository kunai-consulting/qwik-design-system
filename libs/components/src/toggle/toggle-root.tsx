import {
  $,
  component$,
  createContextId,
  type PropsOf,
  type Signal,
  Slot,
  useContextProvider
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";

type ToggleRootProps = PropsOf<"button"> &
  BindableProps<{ pressed: boolean; disabled: boolean }>;

type ToggleContext = {
  isPressedSig: Signal<boolean>;
  isDisabledSig: Signal<boolean>;
};

export const toggleContextId = createContextId<ToggleContext>("toggle");

export const ToggleRootBase = component$((props: ToggleRootProps) => {
  const { pressedSig: isPressedSig, disabledSig: isDisabledSig } = useBindings(props, {
    pressed: false,
    disabled: false
  });

  const context: ToggleContext = {
    isPressedSig,
    isDisabledSig
  };

  useContextProvider(toggleContextId, context);

  const handlePress$ = $(() => {
    isPressedSig.value = !isPressedSig.value;
  });

  return (
    <Render
      {...props}
      fallback="button"
      onClick$={[handlePress$, props.onClick$]}
      disabled={isDisabledSig.value}
      data-disabled={isDisabledSig.value}
      data-pressed={isPressedSig.value}
      aria-pressed={isPressedSig.value}
    >
      <Slot />
    </Render>
  );
});

export const ToggleRoot = withAsChild(ToggleRootBase);
