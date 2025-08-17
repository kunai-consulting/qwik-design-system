import { $, type PropsOf, Slot, component$, useContext, useSignal } from "@qwik.dev/core";
import { modalContextId } from "./modal-root";

export const ModalContent = component$((props: PropsOf<"dialog">) => {
  const context = useContext(modalContextId);
  const isDownOnBackdrop = useSignal(false);

  /**
   * Determines if the backdrop of the Modal has been clicked.
   */
  const isBackdropEvent$ = $(
    (dialogEl: HTMLDialogElement | undefined, event: PointerEvent): boolean => {
      if (!dialogEl) return false;
      if (event.pointerId === -1) return false;

      const modal = dialogEl.getBoundingClientRect();

      const { clientX: x, clientY: y } = event;

      const isInsideModal =
        x >= modal.left && x <= modal.right && y >= modal.top && y <= modal.bottom;

      if (isInsideModal) {
        return false;
      }

      return true;
    }
  );

  const handleBackdropDown$ = $(async (event: PointerEvent) => {
    if (!context.contentRef.value) {
      isDownOnBackdrop.value = false;
      return;
    }
    isDownOnBackdrop.value = await isBackdropEvent$(context.contentRef.value, event);
  });

  const handleBackdropSlide$ = $(async (event: PointerEvent) => {
    if (!isDownOnBackdrop.value) {
      isDownOnBackdrop.value = false;
      return;
    }

    if (!context.closeOnOutsideClick) {
      isDownOnBackdrop.value = false;
      return;
    }

    if (!context.contentRef.value) {
      isDownOnBackdrop.value = false;
      return;
    }

    const isBackdrop = await isBackdropEvent$(context.contentRef.value, event);

    if (isBackdrop) {
      context.isOpen.value = false;
    }

    isDownOnBackdrop.value = false;
  });

  return (
    <dialog
      {...props}
      ref={context.contentRef}
      onPointerDown$={[handleBackdropDown$, props.onPointerDown$]}
      onPointerUp$={[handleBackdropSlide$, props.onPointerUp$]}
    >
      <Slot />
    </dialog>
  );
});
