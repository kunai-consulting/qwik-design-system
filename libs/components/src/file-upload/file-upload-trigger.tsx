import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { fileUploadContextId } from "./file-upload-context";
type PublicTriggerProps = PropsOf<"button">;
/**
 * Trigger component that opens the file selection dialog
 * Acts as a styled button that triggers the hidden file input
 */
export const FileUploadTrigger = component$<PublicTriggerProps>((props) => {
  const context = useContext(fileUploadContextId);
  /**
   * Handle click event
   * Programmatically triggers click on the hidden file input
   */
  const onClick$ = $(() => {
    if (context.disabled) return;
    context.inputRef.value?.click();
  });
  return (
    <button
      {...props}
      type="button"
      onClick$={onClick$}
      // The button element that triggers the file selection dialog
      data-file-upload-trigger
      disabled={context.disabled}
    >
      <Slot />
    </button>
  );
});
