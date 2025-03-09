import {
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  component$,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@qwik.dev/core";

import { createContextId } from "@qwik.dev/core";
import { useBoundSignal } from "../../utils/bound-signal";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const collapsibleContextId = createContextId<CollapsibleContext>("Collapsible");

export interface CollapsibleContext {
  itemId: string;
  isOpenSig: Signal<boolean>;
  triggerRef: Signal<HTMLButtonElement | undefined>;
  contentRef: Signal<HTMLElement | undefined>;
  disabled: boolean | undefined;
  collapsible?: boolean;
}

export type CollapsibleRootProps = PropsOf<"div"> & {
  id?: string;
  open?: boolean | undefined;
  "bind:open"?: Signal<boolean>;
  onChange$?: QRL<(open: boolean) => void>;
  disabled?: boolean;
  collapsible?: boolean;
};

export const CollapsibleRootBase = component$((props: CollapsibleRootProps) => {
  const {
    disabled,
    onChange$,
    "bind:open": givenIsOpenSig,
    id,
    collapsible = true,
    // todo, make open value based -> useComputed$ and combined source of truth
    open,
    ...rest
  } = props;

  const isOpenSig = useBoundSignal(givenIsOpenSig, open ?? false);

  const triggerRef = useSignal<HTMLButtonElement>();
  const contentRef = useSignal<HTMLElement>();

  const localId = useId();
  const itemId = id ?? localId;
  const isInitialLoadSig = useSignal(true);

  useTask$(function onChangeTask({ track, cleanup }) {
    track(() => isOpenSig.value);

    if (!isInitialLoadSig.value) {
      onChange$?.(isOpenSig.value);
    }

    cleanup(() => (isInitialLoadSig.value = false));
  });

  const context: CollapsibleContext = {
    isOpenSig,
    itemId,
    triggerRef,
    contentRef,
    disabled,
    collapsible
  };

  useContextProvider(collapsibleContextId, context);

  return (
    <Render
      id={itemId}
      fallback="div"
      data-collapsible
      data-disabled={context.disabled ? "" : undefined}
      data-open={context.isOpenSig.value ? "" : undefined}
      data-closed={!context.isOpenSig.value ? "" : undefined}
      aria-live="polite"
      {...rest}
    >
      <Slot />
    </Render>
  );
});

export const CollapsibleRoot = withAsChild(CollapsibleRootBase);
