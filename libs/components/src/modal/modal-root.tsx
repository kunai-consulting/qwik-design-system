import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  noSerialize,
  useContextProvider,
  useOnWindow,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { createNoScroll, markScrollable } from "@fluejs/noscroll";
import { initTouchHandler, resetTouchHandler } from "@fluejs/noscroll/touch";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const modalContextId = createContextId<ModalContext>("qds-modal");

type ModalContext = {
  contentRef: Signal<HTMLDialogElement | undefined>;
  isOpenSig: Signal<boolean>;
};

type ModalRootProps = PropsOf<"div"> &
  BindableProps<{
    open: boolean;
  }>;

export const ModalRootBase = component$((props: ModalRootProps) => {
  const contentRef = useSignal<HTMLDialogElement | undefined>();
  const isMarkedSig = useSignal(false);
  const disablePageScrollFn = useSignal<() => void>();
  const enablePageScrollFn = useSignal<() => void>();

  const { openSig: isOpenSig } = useBindings(props, {
    open: false
  });

  useTask$(({ track, cleanup }) => {
    track(() => isOpenSig.value);

    if (!isMarkedSig.value) {
      if (!contentRef.value) return;
      markScrollable(contentRef.value);
      isMarkedSig.value = true;

      const { disablePageScroll, enablePageScroll } = createNoScroll({
        onInitScrollDisable: initTouchHandler,
        onResetScrollDisable: resetTouchHandler
      });

      disablePageScrollFn.value = noSerialize(disablePageScroll);
      enablePageScrollFn.value = noSerialize(enablePageScroll);
    }

    if (isOpenSig.value) {
      contentRef.value?.showModal();
      disablePageScrollFn.value?.();
    } else {
      contentRef.value?.close();
    }

    cleanup(() => {
      enablePageScrollFn.value?.();
    });
  });

  /**
   * Escape key calls the native close method, so we need to update the state in this case.
   */
  useOnWindow(
    "keydown",
    $((event) => {
      if (!isOpenSig.value) return;

      if (event.key === "Escape") {
        isOpenSig.value = false;
      }
    })
  );

  const context: ModalContext = {
    contentRef,
    isOpenSig
  };

  useContextProvider(modalContextId, context);

  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const ModalRoot = withAsChild(ModalRootBase);
