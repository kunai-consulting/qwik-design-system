import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  isServer,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import polyfill from "@oddbird/css-anchor-positioning/fn";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

type PopoverRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  "bind:open"?: Signal<boolean>;
  open?: boolean;
  onChange$?: (open: boolean) => void;
};

import anchorStyles from "./anchor-logic.css?inline";
import { useBindings } from "../../utils/bindings";

export const popoverContextId = createContextId<PopoverContext>("qds-popover");

type PopoverContext = {
  contentRef: Signal<HTMLDivElement | undefined>;
  anchorRef: Signal<HTMLButtonElement | undefined>;
  localId: string;
  isOpenSig: Signal<boolean>;
  canExternallyChangeSig: Signal<boolean>;
  isHiddenSig: Signal<boolean>;
};

export const PopoverRootBase = component$((props: PopoverRootProps) => {
  const { "bind:open": givenOpenSig, onChange$, ...rest } = props;

  useStyles$(anchorStyles);

  const contentRef = useSignal<HTMLDivElement>();
  const anchorRef = useSignal<HTMLButtonElement>();
  const rootRef = useSignal<HTMLDivElement>();
  const localId = useId();
  const { openSig: isOpenSig } = useBindings(props, {
    open: false
  });

  const isInitialRenderSig = useSignal(true);
  const canExternallyChangeSig = useSignal(true);
  const isPolyfillExecutedSig = useSignal(false);
  const isHiddenSig = useSignal(true);

  const isInitiallyOpenSig = useComputed$(() => {
    if (isInitialRenderSig.value && isOpenSig.value) {
      return true;
    }

    return false;
  });

  const context: PopoverContext = {
    contentRef,
    anchorRef,
    localId,
    isOpenSig,
    canExternallyChangeSig,
    isHiddenSig
  };

  useContextProvider(popoverContextId, context);

  const handleExternalToggle$ = $(async () => {
    if (!canExternallyChangeSig.value) return;
    if (!contentRef.value) return;

    if (isOpenSig.value) {
      await contentRef.value.showPopover();
    } else {
      await contentRef.value.hidePopover();
    }
  });

  const handlePolyfill$ = $(async () => {
    if (isServer) return;
    if (isPolyfillExecutedSig.value) return;

    const isPolyfill = !("anchorName" in document.documentElement.style);

    if (isPolyfill) {
      await polyfill();
      isPolyfillExecutedSig.value = true;
    }

    isHiddenSig.value = false;
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
    ? $(async () => {
        await handlePolyfill$();
        context.contentRef.value?.showPopover();
      })
    : undefined;

  return (
    <Render
      data-open={isOpenSig.value}
      data-closed={!isOpenSig.value}
      onQVisible$={handleOpenOnRender$}
      data-qds-popover-root
      internalRef={rootRef}
      fallback="div"
      {...rest}
    >
      <Slot />
    </Render>
  );
});

export const PopoverRoot = withAsChild(PopoverRootBase);
