import { component$, useContext, $, noSerialize, PropsOf } from "@builder.io/qwik";
import { FileInfo, fileUploadContextId } from "./file-upload-context";

type InputProps = PropsOf<"input">;

/**
 * Hidden file input component that handles file selection via system dialog
 */
export const FileUploadInput = component$<InputProps>((props) => {
  const context = useContext(fileUploadContextId);

  /**
   * Handle file selection change event
   * Processes selected files and updates context
   */
  const onChange$ = $((e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;

    const newFiles: FileInfo[] = Array.from(input.files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      file: noSerialize(file)
    }));

    console.log(
      "Processing files:",
      newFiles.map((f) => f.name)
    );

    if (context.multiple) {
      context.files.value = [...context.files.value, ...newFiles];
    } else {
      context.files.value = newFiles.slice(0, 1);
    }

    // Notify parent component about file changes
    context.onFilesChange$?.(context.files.value);
  });

  return (
    <input
      {...props}
      type="file"
      ref={context.inputRef}
      hidden
      onChange$={onChange$}
      multiple={context.multiple}
      accept={context.accept}
      disabled={context.disabled}
      data-file-upload-input
    />
  );
});
