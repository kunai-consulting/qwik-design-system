import { $, type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { fileUploadContextId } from "./file-upload-context";

/** Trigger component that opens the file selection dialog
 * Acts as a styled button that triggers the hidden file input */
export const FileUploadTrigger = component$((props: PropsOf<"button">) => {
  const context = useContext(fileUploadContextId);

  const handleClick$ = $(async () => {
    if (context.isDisabled.value) return;
    await context.inputRef.value?.showPicker();
  });

  return (
    <Render
      {...props}
      type="button"
      fallback="button"
      onClick$={handleClick$}
      data-file-upload-trigger
      disabled={context.isDisabled.value ?? false}
    >
      <Slot />
    </Render>
  );
});
