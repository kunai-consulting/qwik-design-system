import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type TooltipState, tooltipContextId } from "./tooltip-root";

type Timer = NodeJS.Timeout | undefined;

const TooltipTriggerBase = component$<PropsOf<"button">>((props) => {
  const context = useContext(tooltipContextId);
  const { onOpenChange$, triggerRef, open, delayDuration, disabled, id, state } = context;
  const { onBlur$, onFocus$, onPointerLeave$, onPointerOver$, ...rest } = props;

  const openTimer = useSignal<Timer>(undefined);
  const closeTimer = useSignal<Timer>(undefined);

  const clearTimer = $((timer: Signal<Timer>) => {
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = undefined;
    }
  });

  const updateState = $((isOpen: boolean) => {
    open.value = isOpen;
    state.value = isOpen ? "open" : "closed";
    onOpenChange$?.(isOpen);
  });

  const createTimer = $(
    (isOpen: boolean, newState: TooltipState, timer: Signal<Timer>) => {
      state.value = newState;
      if (delayDuration) {
        timer.value = setTimeout(() => {
          updateState(isOpen);
        }, delayDuration);
      } else {
        updateState(isOpen);
      }
    }
  );

  const openTooltip$ = $(() => {
    if (!disabled.value) {
      clearTimer(closeTimer);
      createTimer(true, "opening", openTimer);
    }
  });

  const closeTooltip$ = $(() => {
    if (!disabled.value) {
      clearTimer(openTimer);
      createTimer(false, "closing", closeTimer);
    }
  });

  useTask$(({ cleanup }) => {
    cleanup(() => {
      if (openTimer.value) clearTimeout(openTimer.value);
      if (closeTimer.value) clearTimeout(closeTimer.value);
    });
  });

  return (
    <Render
      ref={triggerRef}
      data-qds-tooltip-trigger
      data-state={state.value}
      aria-describedby={id}
      aria-disabled={disabled.value || undefined}
      onFocus$={[openTooltip$, onFocus$]}
      onBlur$={[closeTooltip$, onBlur$]}
      onPointerOver$={[openTooltip$, onPointerOver$]}
      onPointerLeave$={[closeTooltip$, onPointerLeave$]}
      fallback="button"
      {...rest}
    >
      <Slot />
    </Render>
  );
});

export const TooltipTrigger = withAsChild(TooltipTriggerBase);
