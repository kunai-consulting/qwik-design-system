import {
  $,
  type PropsOf,
  Slot,
  component$,
  noSerialize,
  sync$,
  useContext,
  useOn,
  useSignal
} from "@builder.io/qwik";
import { type FileInfo, fileUploadContextId } from "./file-upload-context";
type PublicDropzoneProps = PropsOf<"div">;
interface PublicRawFileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file: File;
}
/** Component that handles drag and drop file upload functionality */
export const FileUploadDropzone = component$<PublicDropzoneProps>((props) => {
  const context = useContext(fileUploadContextId);
  const dropzoneRef = useSignal<HTMLDivElement>();
  const isDragging = useSignal(false);
  // Prevent default browser handling of file drops at window level
  const onWindowDragOver$ = $((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  });
  // Handle drag enter event
  const onDragEnter$ = $((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (context.disabled) return;
    const dt = e.dataTransfer;
    // Only set dragging state once when drag starts
    if (!isDragging.value) {
      // console.log('Drag Enter:', {
      //   hasDataTransfer: !!dt,
      //   types: dt?.types ? Array.from(dt.types) : [],
      //   items: dt?.items?.length || 0,
      //   files: dt?.files?.length || 0
      // });
      if (dt) {
        // Set drag effect to show copy is allowed
        dt.effectAllowed = "all";
        dt.dropEffect = "copy";
      }
      isDragging.value = true;
      context.isDragging.value = true;
    }
  });
  // Handle drag over event to show copy effect
  const onDragOver$ = $((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (context.disabled) return;
    const dt = e.dataTransfer;
    if (dt) {
      dt.dropEffect = "copy";
    }
  });
  // Handle drag leave event
  const onDragLeave$ = $((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (context.disabled) return;
    // Check if cursor actually left the dropzone
    const rect = dropzoneRef.value?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX <= rect.left ||
        clientX >= rect.right ||
        clientY <= rect.top ||
        clientY >= rect.bottom
      ) {
        // Reset dragging state when cursor leaves dropzone
        isDragging.value = false;
        context.isDragging.value = false;
      }
    }
  });
  useOn(
    "drop",
    sync$((e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const dt = e.dataTransfer;
      if (!dt) return;
      let files: File[] = [];
      // Try to get files using the Files API first
      if (dt.files?.length) {
        files = Array.from(dt.files);
      }
      if (!files.length) {
        console.log("No valid files found");
        return;
      }
      // Convert Files to FileInfo objects
      const fileInfos = files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        file
      }));
      const event = new CustomEvent("qdsfiledrop", {
        detail: { fileInfos }
      });
      const dropzoneElement = (e.target as Element).closest(
        // The main container element for the file upload dropzone area
        "[data-file-upload-dropzone]"
      );
      dropzoneElement?.dispatchEvent(event);
    })
  );
  return (
    <>
      <div
        {...props}
        ref={dropzoneRef}
        onQdsfiledrop$={$(
          (
            e: CustomEvent<{
              fileInfos: PublicRawFileInfo[];
            }>
          ) => {
            if (context.disabled) return;
            // Reset dragging state
            isDragging.value = false;
            context.isDragging.value = false;
            const fileInfos = e.detail.fileInfos.map((fileInfo: PublicRawFileInfo) => ({
              ...fileInfo,
              file: noSerialize(fileInfo.file)
            }));
            console.log(
              "Processing files:",
              fileInfos.map((f: FileInfo) => f.name)
            );
            if (context.multiple) {
              context.files.value = [...context.files.value, ...fileInfos];
            } else {
              context.files.value = fileInfos.slice(0, 1);
            }
            // Notify parent component about new files
            if (context.onFilesChange$) {
              context.onFilesChange$(context.files.value);
            }
          }
        )}
        // Prevent default file handling at window level
        window:onDragOver$={onWindowDragOver$}
        // Prevent default browser behavior for all drag events
        preventdefault:dragenter
        preventdefault:dragover
        preventdefault:dragleave
        preventdefault:drop
        // Attach drag and drop event handlers
        onDragEnter$={[onDragEnter$, props.onDragEnter$]}
        onDragOver$={onDragOver$}
        onDragLeave$={onDragLeave$}
        data-file-upload-dropzone
        // Indicates whether files are currently being dragged over the dropzone
        data-dragging={isDragging.value ? "" : undefined}
        // Indicates whether the dropzone is currently disabled
        data-disabled={context.disabled ? "" : undefined}
      >
        <Slot />
      </div>
    </>
  );
});
