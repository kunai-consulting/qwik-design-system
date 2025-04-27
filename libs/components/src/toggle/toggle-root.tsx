import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

type ToggleRootProps = Omit<PropsOf<"button">, "onChange$"> &
  BindableProps<{ pressed: boolean; disabled: boolean }> & {
    onChange$?: (pressed: boolean) => void;
  };

type ToggleContext = {
  isPressedSig: Signal<boolean>;
  isDisabledSig: Signal<boolean>;
};

export const toggleContextId = createContextId<ToggleContext>("toggle");

export const ToggleRootBase = component$((props: ToggleRootProps) => {
  const { onChange$, ...rest } = props;

  const isInitialRenderSig = useSignal(true);

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

  useTask$(async function handleChange({ track, cleanup }) {
    track(() => context.isPressedSig.value);

    if (!isInitialRenderSig.value) {
      if (!onChange$) return;

      await onChange$(context.isPressedSig.value);
    }

    cleanup(() => {
      isInitialRenderSig.value = false;
    });
  });

  return (
    <Render
      {...rest}
      type="button"
      fallback="button"
      onClick$={[handlePress$, props.onClick$]}
      disabled={isDisabledSig.value}
      data-disabled={isDisabledSig.value}
      aria-disabled={`${isDisabledSig.value}`}
      data-pressed={isPressedSig.value}
      aria-pressed={`${isPressedSig.value}`}
      data-qds-toggle-root
    >
      <Slot />
    </Render>
  );
});

export const ToggleRoot = withAsChild(ToggleRootBase);
