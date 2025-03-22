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
  isExternalToggleSig: Signal<boolean>;
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
  const isExternalToggleSig = useSignal(false);

  const context: PopoverContext = {
    panelRef,
    triggerRef,
    localId,
    isOpenSig,
    isExternalToggleSig
  };

  useContextProvider(popoverContextId, context);

  useTask$(async function handleChange({ track, cleanup }) {
    track(() => isOpenSig.value);

    if (!isInitialRenderSig.value) {
      await onChange$?.(isOpenSig.value);
    }

    cleanup(() => {
      if (!isInitialRenderSig.value) return;
      isInitialRenderSig.value = false;
    });
  });

  useTask$(({ track }) => {
    track(() => givenOpenSig?.value);

    if (isInitialRenderSig.value) return;

    isExternalToggleSig.value = true;

    const event = new CustomEvent("external", {
      bubbles: true,
      detail: {
        external: true
      }
    });
    rootRef.value?.dispatchEvent(event);
  });

  return (
    <Render
      onExternal$={$(() => {
        panelRef.value?.togglePopover();
      })}
      ref={rootRef}
      fallback="div"
      {...rest}
    >
      <Slot />
    </Render>
  );
});

export const PopoverRoot = withAsChild(PopoverRootBase);
