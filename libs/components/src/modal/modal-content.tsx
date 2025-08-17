import { $, type PropsOf, Slot, component$, useContext, useSignal } from "@qwik.dev/core";
import { modalContextId } from "./modal-root";

export const ModalContent = component$((props: PropsOf<"dialog">) => {
  const context = useContext(modalContextId);
  const pointerDownOnBackdrop = useSignal(false);

  /**
   * Determines if the backdrop of the Modal has been clicked.
   */
  const wasModalBackdropClicked = $(
    (modal: HTMLDialogElement | undefined, clickEvent: PointerEvent): boolean => {
      if (!modal) {
        return false;
      }

      const rect = modal.getBoundingClientRect();

      const wasBackdropClicked =
        rect.left > clickEvent.clientX ||
        rect.right < clickEvent.clientX ||
        rect.top > clickEvent.clientY ||
        rect.bottom < clickEvent.clientY;

      /**
       * If the inside focusable elements are not prevented, such as a button it will also fire a click event.
       *
       * Hitting the enter or space keys on a button inside of the dialog for example, will fire a "pointer" event. In reality, it fires our onClick$ handler because we have not prevented the default behavior.
       *
       * This is why we check if the pointerId is -1.
       **/
      return clickEvent.pointerId === -1 ? false : wasBackdropClicked;
    }
  );

  const handleBackdropInit$ = $(async (event: PointerEvent) => {
    // Track if pointer down started on backdrop
    const wasBackdropClicked = await wasModalBackdropClicked(
      context.contentRef.value,
      event
    );
    pointerDownOnBackdrop.value = wasBackdropClicked;
  });

  const handleBackdropSlide$ = $(async (event: PointerEvent) => {
    // Only close if both pointer down and up happened on backdrop (not a drag operation)
    if (pointerDownOnBackdrop.value && context.closeOnOutsideClick) {
      const wasBackdropClicked = await wasModalBackdropClicked(
        context.contentRef.value,
        event
      );
      if (wasBackdropClicked) {
        context.isOpen.value = false;
      }
    }
    pointerDownOnBackdrop.value = false;
  });

  return (
    <dialog
      ref={context.contentRef}
      onPointerDown$={[handleBackdropInit$, props.onPointerDown$]}
      onPointerUp$={[handleBackdropSlide$, props.onPointerUp$]}
      {...props}
    >
      <Slot />
    </dialog>
  );
});
