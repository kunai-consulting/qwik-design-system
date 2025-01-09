import {
  component$,
  useContext,
  $,
  Slot,
  PropsOf,
  noSerialize,
  useSignal
} from "@builder.io/qwik";
import { FileInfo, fileUploadContextId } from "./file-upload-context";

type DropzoneProps = PropsOf<"div">;

export const FileUploadDropzone = component$<DropzoneProps>((props) => {
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

  // Handle file drop event
  const onDrop$ = $(async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (context.disabled) return;

    // Reset dragging state
    isDragging.value = false;
    context.isDragging.value = false;

    const dt = e.dataTransfer;
    // console.log('Drop event:', {
    //   hasDataTransfer: !!dt,
    //   types: dt?.types ? Array.from(dt.types) : [],
    //   items: dt?.items?.length || 0,
    //   files: dt?.files?.length || 0
    // });

    if (!dt) return;

    let files: File[] = [];

    // Try to get files using the Files API first
    if (dt.files?.length) {
      // console.log('Using files API');
      files = Array.from(dt.files);
    }
    // Fall back to Items API if Files API didn't work
    else if (dt.items?.length) {
      // console.log('Using items API');
      const itemFiles = Array.from(dt.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (itemFiles.length) {
        files = itemFiles;
      }
    }

    if (!files.length) {
      console.log("No valid files found");
      return;
    }

    // Convert Files to FileInfo objects
    const fileInfos: FileInfo[] = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      file: noSerialize(file)
    }));

    console.log(
      "Processing files:",
      fileInfos.map((f) => f.name)
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
  });

  return (
    <div
      {...props}
      ref={dropzoneRef}
      // Prevent default file handling at window level
      window:onDragOver$={onWindowDragOver$}
      // Prevent default browser behavior for all drag events
      preventdefault:dragenter
      preventdefault:dragover
      preventdefault:dragleave
      preventdefault:drop
      // Attach drag and drop event handlers
      onDragEnter$={onDragEnter$}
      onDragOver$={onDragOver$}
      onDragLeave$={onDragLeave$}
      onDrop$={onDrop$}
      data-file-upload-dropzone
      data-dragging={isDragging.value ? "" : undefined}
      data-disabled={context.disabled ? "" : undefined}
    >
      <Slot />
    </div>
  );
});
