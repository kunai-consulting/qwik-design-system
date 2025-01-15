import { component$, useContext, $, Slot, PropsOf } from "@builder.io/qwik";
import { fileUploadContextId } from "./file-upload-context";

type TriggerProps = PropsOf<"button">;

/**
 * Trigger component that opens the file selection dialog
 * Acts as a styled button that triggers the hidden file input
 */
export const FileUploadTrigger = component$<TriggerProps>((props) => {
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
      data-file-upload-trigger
      disabled={context.disabled}
    >
      <Slot />
    </button>
  );
});
