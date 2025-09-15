import { createNoScroll, markScrollable } from "@fluejs/noscroll";
import { initTouchHandler, resetTouchHandler } from "@fluejs/noscroll/touch";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  noSerialize,
  useContextProvider,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { Render } from "../render/render";

export const modalContextId = createContextId<ModalContext>("qds-modal");

type ModalContext = {
  contentRef: Signal<HTMLDialogElement | undefined>;
  isOpen: Signal<boolean>;
  closeOnOutsideClick: boolean;
};

type ModalRootProps = PropsOf<"div"> &
  BindableProps<{
    open: boolean;
  }> & {
    closeOnOutsideClick?: boolean;
  };

export const ModalRoot = component$((props: ModalRootProps) => {
  const contentRef = useSignal<HTMLDialogElement | undefined>();
  const isInitialized = useSignal(false);
  const disablePageScrollFn = useSignal<() => void>();
  const enablePageScrollFn = useSignal<() => void>();

  const { closeOnOutsideClick = true, ...restProps } = props;

  const { openSig: isOpen } = useBindings(restProps, {
    open: false
  });

  useTask$(({ track, cleanup }) => {
    track(isOpen);

    if (!isInitialized.value) {
      if (!contentRef.value) return;
      markScrollable(contentRef.value);
      isInitialized.value = true;

      const { disablePageScroll, enablePageScroll } = createNoScroll({
        onInitScrollDisable: initTouchHandler,
        onResetScrollDisable: resetTouchHandler
      });

      disablePageScrollFn.value = noSerialize(disablePageScroll);
      enablePageScrollFn.value = noSerialize(enablePageScroll);
    }

    if (isOpen.value) {
      contentRef.value?.showModal();
      disablePageScrollFn.value?.();
    } else {
      contentRef.value?.close();
    }

    cleanup(() => {
      enablePageScrollFn.value?.();
    });
  });

  const context: ModalContext = {
    contentRef,
    isOpen,
    closeOnOutsideClick
  };

  useContextProvider(modalContextId, context);

  return (
    <Render fallback="div" {...restProps}>
      <Slot />
    </Render>
  );
});
