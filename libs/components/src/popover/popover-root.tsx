import {
  $,
  component$,
  createContextId,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";
import { useBoundSignal } from "../../utils/bound-signal";

// Define interface for HTMLElement with Popover AP

type PopoverRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  "bind:open"?: Signal<boolean>;
  open?: boolean;
  onChange$?: QRL<(open: boolean) => void>;
};

export const popoverContextId = createContextId<PopoverContext>("qds-popover");

type PopoverContext = {
  panelRef: Signal<HTMLDivElement | undefined>;
  triggerRef: Signal<HTMLButtonElement | undefined>;
  localId: string;
  isOpenSig: Signal<boolean>;
  canExternallyChangeSig: Signal<boolean>;
};

export const PopoverRootBase = component$((props: PopoverRootProps) => {
  const { "bind:open": givenOpenSig, onChange$, ...rest } = props;
  const panelRef = useSignal<HTMLDivElement>();
  const triggerRef = useSignal<HTMLButtonElement>();
  const rootRef = useSignal<HTMLDivElement>();
  const localId = useId();
  const openPropSig = useComputed$(() => props.open);
  const isOpenSig = useBoundSignal(
    givenOpenSig,
    openPropSig.value ?? givenOpenSig?.value ?? false,
    openPropSig
  );

  const isInitialRenderSig = useSignal(true);
  const canExternallyChangeSig = useSignal(true);

  const context: PopoverContext = {
    panelRef,
    triggerRef,
    localId,
    isOpenSig,
    canExternallyChangeSig
  };

  useContextProvider(popoverContextId, context);

  const handleExternalToggle$ = $(() => {
    if (!canExternallyChangeSig.value) return;
    if (!panelRef.value) return;

    if (isOpenSig.value) {
      panelRef.value.showPopover();
    } else {
      panelRef.value.hidePopover();
    }
  });

  useTask$(async function handleChange({ track, cleanup }) {
    track(() => isOpenSig.value);

    if (!isInitialRenderSig.value) {
      await onChange$?.(isOpenSig.value);
    }

    await handleExternalToggle$();

    cleanup(() => {
      if (!isInitialRenderSig.value) return;
      isInitialRenderSig.value = false;
    });
  });

  return (
    <Render ref={rootRef} fallback="div" {...rest}>
      <Slot />
    </Render>
  );
});

export const PopoverRoot = withAsChild(PopoverRootBase);
