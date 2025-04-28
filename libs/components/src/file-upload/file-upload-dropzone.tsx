import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useTask$
} from "@builder.io/qwik";
import { type FileInfo, fileUploadContextId } from "./file-upload-context";
import { useFileUpload } from "./use-file-upload";

type PublicDropzoneProps = PropsOf<"div">;

/** Component that handles drag and drop file upload functionality */
export const FileUploadDropzone = component$<PublicDropzoneProps>((props) => {
  const context = useContext(fileUploadContextId);
  const { dropzoneRef, isDragging, handlers, processFiles } = useFileUpload({
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

  useTask$(({ track }) => {
    const dragging = track(() => isDragging.value);
    context.isDragging.value = dragging;
  });

  const onQdsfiledrop$ = $((e: CustomEvent<{ fileInfos: FileInfo[] }>) => {
    if (context.isDisabledSig.value) return;

    const files = e.detail.fileInfos.map((info) => info.file);
    if (files.length) {
      processFiles(files as unknown as File[]);
    }
  });

  return (
    <div
      {...props}
      ref={dropzoneRef}
      onQdsfiledrop$={onQdsfiledrop$}
      window:onDragOver$={[handlers.onWindowDragOver$, props.onDragOver$]}
      preventdefault:dragenter
      preventdefault:dragover
      preventdefault:dragleave
      preventdefault:drop
      onDragEnter$={[handlers.onDragEnter$, props.onDragEnter$]}
      onDragOver$={[handlers.onDragOver$, props.onDragOver$]}
      onDragLeave$={[handlers.onDragLeave$, props.onDragLeave$]}
      onDrop$={[handlers.onDrop$, props.onDrop$]}
      data-file-upload-dropzone
      data-dragging={isDragging.value ? "" : undefined}
      data-disabled={context.isDisabledSig.value ? "" : undefined}
    >
      <Slot />
    </div>
  );
});
