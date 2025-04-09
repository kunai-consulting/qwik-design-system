import {
  $,
  type NoSerialize,
  type Signal,
  noSerialize,
  useComputed$,
  useSignal
} from "@builder.io/qwik";

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file: NoSerialize<File>;
}

export interface UseFileUploadOptions {
  disabled?: boolean | Signal<boolean>;
  multiple?: boolean;
  debug?: boolean;
  onFilesChange$?: (files: FileInfo[]) => void;
}

/**
 * A hook that handles file upload drag-and-drop functionality
 */
export function useFileUpload(options: UseFileUploadOptions = {}) {
  const dropzoneRef = useSignal<HTMLElement>();
  const isDragging = useSignal(false);
  const files = useSignal<FileInfo[]>([]);

  const isDisabled = useComputed$(() => {
    if (typeof options.disabled === "boolean") {
      return options.disabled;
    }
    return options.disabled?.value ?? false;
  });

  const processFiles$ = $((newFiles: File[]) => {
    if (isDisabled.value) return;

    const fileInfos = newFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      file: noSerialize(file)
    }));

    if (options.multiple) {
      files.value = [...files.value, ...fileInfos];
    } else {
      files.value = fileInfos.slice(0, 1);
    }

    if (options.onFilesChange$) {
      options.onFilesChange$(files.value);
    }
  });

  const onDragEnter$ = $((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled.value) return;

    isDragging.value = true;

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "all";
      e.dataTransfer.dropEffect = "copy";
    }
  });

  const onDragOver$ = $((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled.value) return;

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  });
  // onDragLeave$={[handleDragLeaveSync$, handleDragLeave$, props.onDragLeave$]}
  const onDragLeave$ = $((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled.value) return;

    const rect = dropzoneRef.value?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX <= rect.left ||
        clientX >= rect.right ||
        clientY <= rect.top ||
        clientY >= rect.bottom
      ) {
        isDragging.value = false;
      }
    }
  });

  const onDrop$ = $((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled.value) return;

    isDragging.value = false;

    const dt = e.dataTransfer;
    if (!dt) return;

    let files: File[] = [];

    if (dt.files?.length) {
      files = Array.from(dt.files);
    }

    if (files.length) {
      processFiles$(files);
    }
  });

  const onWindowDragOver$ = $((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  });

  return {
    dropzoneRef,
    isDragging,
    files,
    isDisabled,
    handlers: {
      onDragEnter$,
      onDragOver$,
      onDragLeave$,
      onDrop$,
      onWindowDragOver$
    },
    processFiles$
  };
}
