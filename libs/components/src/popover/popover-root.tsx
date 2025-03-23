import {
  $,
  component$,
  createContextId,
  isServer,
  type PropsOf,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";
import { useBoundSignal } from "../../utils/bound-signal";
import polyfill from "@oddbird/css-anchor-positioning/fn";

type PopoverRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  "bind:open"?: Signal<boolean>;
  open?: boolean;
  onChange$?: (open: boolean) => void;
};

import styles from "./popover.css?inline";
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
  useStyles$(styles);

  const isInitialRenderSig = useSignal(true);
  const canExternallyChangeSig = useSignal(true);

  const isInitiallyOpenSig = useComputed$(() => {
    if (isInitialRenderSig.value && isOpenSig.value) {
      return true;
    }

    return false;
  });

  const context: PopoverContext = {
    panelRef,
    triggerRef,
    localId,
    isOpenSig,
    canExternallyChangeSig
  };

  useContextProvider(popoverContextId, context);

  const handleExternalToggle$ = $(async () => {
    if (!canExternallyChangeSig.value) return;
    if (!panelRef.value) return;

    if (isOpenSig.value) {
      await panelRef.value.showPopover();
    } else {
      await panelRef.value.hidePopover();
    }
  });

  // useOnWindow(
  //   "DOMContentLoaded",
  //   sync$(() => {
  //     if (!("anchorName" in document.documentElement.style)) {
  //       // @ts-expect-error follows polyfill instructions
  //       import("https://unpkg.com/@oddbird/css-anchor-positioning");
  //     }
  //   })
  // );

  const handlePolyfill$ = $(async () => {
    if (isServer) return;

    if (!("anchorName" in document.documentElement.style)) {
      await polyfill();
    }
  });

  useTask$(async function handleChange({ track, cleanup }) {
    track(() => isOpenSig.value);

    if (!isInitialRenderSig.value) {
      await onChange$?.(isOpenSig.value);
    }

    await handlePolyfill$();

    await handleExternalToggle$();

    cleanup(() => {
      if (!isInitialRenderSig.value) return;
      isInitialRenderSig.value = false;
    });
  });

  /**
   *  AVOID THIS UNLESS YOU REALLY KNOW WHAT YOU ARE DOING
   *  qvisible -> conditionally add a visible task
   */
  const handleOpenOnRender$ = isInitiallyOpenSig.value
    ? $(() => {
        context.panelRef.value?.showPopover();
      })
    : undefined;

  return (
    <Render onQVisible$={handleOpenOnRender$} ref={rootRef} fallback="div" {...rest}>
      <Slot />
    </Render>
  );
});

export const PopoverRoot = withAsChild(PopoverRootBase);
