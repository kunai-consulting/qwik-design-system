import {
  type Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useId,
  useSignal,
  useStyles$
} from "@builder.io/qwik";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { PopoverRootBase } from "../popover/popover-root";
import anchorLogic from "./anchor-logic.css?inline";

export type TooltipState = "open" | "closed" | "closing" | "opening";

export interface TooltipContext {
  open: Signal<boolean>;
  disabled: Signal<boolean>;
  triggerRef: Signal<HTMLElement | undefined>;
  contentRef: Signal<HTMLElement | undefined>;
  delayDuration: number;
  onOpenChange$?: (open: boolean) => void;
  id: string;
  state: Signal<TooltipState>;
  side?: string;
  align?: string;
}

export const tooltipContextId = createContextId<TooltipContext>("qds-tooltip");

type TooltipRootProps = {
  delayDuration?: number;
  onOpenChange$?: (open: boolean) => void;
  id?: string;
} & BindableProps<{ open: boolean; disabled: boolean }>;

const TooltipRootBase = component$<TooltipRootProps>((props) => {
  useStyles$(anchorLogic);
  const { open: _o, "bind:open": _bo, delayDuration, onOpenChange$, id, ...rest } = props;

  const { openSig: isOpenSig, disabledSig: isDisabledSig } = useBindings(props, {
    open: false,
    disabled: false
  });

  const triggerRef = useSignal<HTMLElement>();
  const contentRef = useSignal<HTMLElement>();
  const rootRef = useSignal<HTMLElement>();
  const localId = useId();
  const compId = id ?? localId;
  const tooltipState = useSignal<TooltipState>("closed");

  const context: TooltipContext = {
    open: isOpenSig,
    disabled: isDisabledSig,
    triggerRef,
    contentRef,
    delayDuration: delayDuration ?? 0,
    onOpenChange$,
    id: compId,
    state: tooltipState
  };

  useContextProvider(tooltipContextId, context);

  return (
    <PopoverRootBase
      bind:open={isOpenSig}
      data-qds-tooltip-root
      ref={rootRef}
      id={compId}
      {...rest}
    >
      <Slot />
    </PopoverRootBase>
  );
});

export const TooltipRoot = withAsChild(TooltipRootBase);
