import { component$, createContextId, PropsOf, Signal, Slot, useContextProvider, useId, useSignal } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

type PopoverRootProps = PropsOf<'div'>;

export const popoverContextId = createContextId<PopoverContext>('qds-popover');

type PopoverContext = {
  panelRef: Signal<HTMLDivElement | undefined>;
  triggerRef: Signal<HTMLButtonElement | undefined>;
  localId: string;
}

export const PopoverRootBase = component$((props: PopoverRootProps) => {
  const panelRef = useSignal<HTMLDivElement>();
  const triggerRef = useSignal<HTMLButtonElement>();
  const localId = useId();

  const context: PopoverContext = {
    panelRef,
    triggerRef,
    localId,
  }

  useContextProvider(popoverContextId, context);
  
  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  )
})

export const PopoverRoot = withAsChild(PopoverRootBase);