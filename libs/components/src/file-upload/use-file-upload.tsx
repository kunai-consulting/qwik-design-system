import {
  $,
  type NoSerialize,
  type Signal,
  noSerialize,
  useComputed$,
  useSignal,
  useVisibleTask$
} from "@builder.io/qwik";

export interface FileInfo {
  id: string;
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
  const processedFiles = useSignal<Record<string, boolean>>({});

  const isDisabled = useComputed$(() => {
    if (typeof options.disabled === "boolean") {
      return options.disabled;
    }
    return options.disabled?.value ?? false;
  });

  const processFiles = $((newFiles: File[]) => {
    if (isDisabled.value) return;

    const fileInfos: FileInfo[] = [];

    for (const file of newFiles) {
      const fileKey = `${file.name}-${file.size}`;

      if (processedFiles.value[fileKey] && options.multiple) {
        if (options.debug) {
          console.log(`Skipping duplicate file: ${file.name}`);
        }
        continue;
      }

      processedFiles.value = {
        ...processedFiles.value,
        [fileKey]: true
      };

      const id = `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      fileInfos.push({
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        file: noSerialize(file)
      });
    }

    if (fileInfos.length === 0) {
      return;
    }

    if (options.multiple) {
      files.value = [...files.value, ...fileInfos];
    } else {
      processedFiles.value = {};

      for (const fileInfo of fileInfos) {
        const fileKey = `${fileInfo.name}-${fileInfo.size}`;
        processedFiles.value[fileKey] = true;
      }

      files.value = fileInfos;
    }

    if (options.onFilesChange$) {
      options.onFilesChange$(files.value);
    }
  });

  const removeFile$ = $((fileId: string) => {
    const fileIndex = files.value.findIndex((f) => f.id === fileId);
    if (fileIndex === -1) return;

    const fileToRemove = files.value[fileIndex];

    const fileKey = `${fileToRemove.name}-${fileToRemove.size}`;
    const newProcessed = { ...processedFiles.value };
    delete newProcessed[fileKey];
    processedFiles.value = newProcessed;

    const newFiles = [...files.value];
    newFiles.splice(fileIndex, 1);
    files.value = newFiles;

    if (options.onFilesChange$) {
      options.onFilesChange$(files.value);
    }
  });

  // Setup drag and drop event handlers after hydration
  useVisibleTask$(({ cleanup }) => {
    const dropzone = dropzoneRef.value;
    if (!dropzone) return;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isDisabled.value) return;

      isDragging.value = true;

      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "all";
        e.dataTransfer.dropEffect = "copy";
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isDisabled.value) return;

      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isDisabled.value) return;

      const rect = dropzone.getBoundingClientRect();
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
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isDisabled.value) return;

      isDragging.value = false;

      const dt = e.dataTransfer;
      if (!dt) return;

      if (dt.files?.length) {
        const droppedFiles = Array.from(dt.files);
        processFiles(droppedFiles);
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
    };

    // Add event listeners
    dropzone.addEventListener("dragenter", handleDragEnter);
    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", (e) => e.preventDefault());

    // Clean up event listeners
    cleanup(() => {
      dropzone.removeEventListener("dragenter", handleDragEnter);
      dropzone.removeEventListener("dragover", handleDragOver);
      dropzone.removeEventListener("dragleave", handleDragLeave);
      dropzone.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", (e) => e.preventDefault());
    });
  });

  // Return handlers for direct binding in case needed
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

    if (dt.files?.length) {
      const droppedFiles = Array.from(dt.files);
      processFiles(droppedFiles);
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
    processFiles,
    removeFile$
  };
}
