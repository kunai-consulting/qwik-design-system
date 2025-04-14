import { $, type PropsOf, component$, useContext } from "@builder.io/qwik";
import { type FileInfo, fileUploadContextId } from "./file-upload-context";
import { useFileUpload } from "./use-file-upload";

type PublicInputProps = PropsOf<"input">;
/**
 * Hidden file input component that handles file selection via system dialog
 */
/** Hidden file input component that handles file selection via system dialog */
export const FileUploadInput = component$<PublicInputProps>((props) => {
  const context = useContext(fileUploadContextId);

  const { processFiles$ } = useFileUpload({
    disabled: context.isDisabledSig,
    multiple: context.multiple,
    debug: import.meta.env.DEV,
    onFilesChange$: $((files: FileInfo[]) => {
      if (context.multiple) {
        context.files.value = [...context.files.value, ...files];
      } else {
        context.files.value = files.slice(0, 1);
      }

      if (context.onFilesChange$) {
        context.onFilesChange$(context.files.value);
      }
    })
  });

  /**
   * Handle file selection change event
   */
  const onChange$ = $(async (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;

    await processFiles$(Array.from(input.files));
  });

  return (
    <input
      {...props}
      type="file"
      ref={context.inputRef}
      hidden
      onChange$={[onChange$, props.onChange$]}
      multiple={context.multiple}
      accept={context.accept}
      disabled={context.isDisabledSig.value}
      data-file-upload-input
    />
  );
});
