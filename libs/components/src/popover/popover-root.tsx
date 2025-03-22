import {
  component$,
  createContextId,
  type PropsOf,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
  useSignal
} from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";
import { useBoundSignal } from "../../utils/bound-signal";

type PopoverRootProps = PropsOf<"div"> & {
  "bind:open"?: Signal<boolean>;
  open?: boolean;
};

export const popoverContextId = createContextId<PopoverContext>("qds-popover");

type PopoverContext = {
  panelRef: Signal<HTMLDivElement | undefined>;
  triggerRef: Signal<HTMLButtonElement | undefined>;
  localId: string;
  isOpenSig: Signal<boolean>;
};

export const PopoverRootBase = component$((props: PopoverRootProps) => {
  const { "bind:open": givenOpenSig, ...rest } = props;
  const panelRef = useSignal<HTMLDivElement>();
  const triggerRef = useSignal<HTMLButtonElement>();
  const localId = useId();
  const openPropSig = useComputed$(() => props.open);
  const isOpenSig = useBoundSignal(
    givenOpenSig,
    openPropSig.value ?? givenOpenSig?.value ?? false,
    openPropSig
  );

  const context: PopoverContext = {
    panelRef,
    triggerRef,
    localId,
    isOpenSig
  };

  useContextProvider(popoverContextId, context);

  return (
    <Render fallback="div" {...rest}>
      <Slot />
    </Render>
  );
});

export const PopoverRoot = withAsChild(PopoverRootBase);
