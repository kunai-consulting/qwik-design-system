import { createNoScroll, markScrollable } from "@fluejs/noscroll";
import { initTouchHandler, resetTouchHandler } from "@fluejs/noscroll/touch";
import {
  type BindableProps,
  type Focusables,
  getFocusableElements,
  trapFocus,
  useBindings
} from "@kunai-consulting/qwik-utils";
import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  noSerialize,
  useConstant,
  useContext,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { Render } from "../render/render";

export const modalContextId = createContextId<ModalContext>("qds-modal");

type ModalContext = {
  contentRef: Signal<HTMLDialogElement | undefined>;
  isOpen: Signal<boolean>;
  closeOnOutsideClick: boolean;
  level: number;
  isTitle: Signal<boolean>;
  isDescription: Signal<boolean>;
  localId: string;
  focusables: Signal<Focusables | undefined>;
  isActiveFocusTrap: Signal<boolean>;
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
  const isTitle = useSignal(false);
  const isDescription = useSignal(false);
  const localId = useId();
  const focusables = useSignal<Focusables | undefined>();
  const isActiveFocusTrap = useSignal(false);

  const parentContext = useContext(modalContextId, null);
  const level = useConstant(() => {
    return (parentContext?.level ?? 0) + 1;
  });

  const { closeOnOutsideClick = true, ...restProps } = props;

  const { openSig: isOpen } = useBindings(restProps, {
    open: false
  });

  const handlePageScroll = $(() => {
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
  });

  useTask$(async ({ track, cleanup }) => {
    track(isOpen);

    console.log("isOpen", isOpen.value);

    await handlePageScroll();

    if (!isInitialized.value || !contentRef.value) {
      return;
    }

    const cleanupEnableScroll = () => {
      if (level > 1) return;
      enablePageScrollFn.value?.();
    };

    if (isOpen.value) {
      contentRef.value.showModal();
      disablePageScrollFn.value?.();

      focusables.value = getFocusableElements(contentRef.value);

      if (parentContext) {
        parentContext.isActiveFocusTrap.value = false;
      }

      isActiveFocusTrap.value = true;
      cleanup(cleanupEnableScroll);
      return;
    }

    contentRef.value.close();

    focusables.value = undefined;
    isActiveFocusTrap.value = false;

    if (parentContext) {
      parentContext.isActiveFocusTrap.value = true;
    }

    cleanup(cleanupEnableScroll);
  });

  useTask$(({ track, cleanup }) => {
    track(isActiveFocusTrap);
    track(focusables);

    if (!isActiveFocusTrap.value || !focusables.value) {
      return;
    }

    const handleKeyDown = $((event: KeyboardEvent) => {
      if (!isActiveFocusTrap.value || !focusables.value) {
        return;
      }

      console.log("key handler");

      trapFocus({
        event,
        focusables: focusables.value
      });
    });

    document.addEventListener("keydown", handleKeyDown);

    cleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  const context: ModalContext = {
    contentRef,
    isOpen,
    closeOnOutsideClick,
    level,
    isTitle,
    isDescription,
    localId,
    focusables,
    isActiveFocusTrap
  };

  useContextProvider(modalContextId, context);

  return (
    <Render fallback="div" {...restProps}>
      <Slot />
    </Render>
  );
});
