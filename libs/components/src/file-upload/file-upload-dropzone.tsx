import {
  $,
  type PropsOf,
  Slot,
  component$,
  sync$,
  useContext,
  useSignal
} from "@qwik.dev/core";
import { Render } from "../render/render";
import { fileUploadContextId } from "./file-upload-context";

/** Component that handles drag and drop file upload functionality */
export const FileUploadDropzone = component$((props: PropsOf<"div">) => {
  const context = useContext(fileUploadContextId);
  const dropzoneRef = useSignal<HTMLDivElement>();
  const isDragging = useSignal(false);

  const isInsideDropzone = $((e: DragEvent) => {
    const { clientX, clientY } = e;
    const rect = dropzoneRef.value?.getBoundingClientRect();
    if (rect) {
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    }
    return false;
  });

  const onDragEnter$ = $((e: DragEvent) => {
    e.stopPropagation();
    if (context.isDisabled.value) return;
    const dt = e.dataTransfer;
    if (!isDragging.value) {
      if (dt) {
        dt.effectAllowed = "all";
        dt.dropEffect = "copy";
      }
      isDragging.value = true;
    }
  });

  const onDragLeave$ = $(async (e: DragEvent) => {
    e.stopPropagation();
    if (context.isDisabled.value) return;

    const isInDropzone = await isInsideDropzone(e);

    if (!isInDropzone) {
      isDragging.value = false;
    }
  });

  // Drop API is synchronous, so we need to handle the initial drop here
  const handleInitialDropSync$ = sync$((e: DragEvent, el: HTMLElement) => {
    console.log("handleInitialDrop");

    const dt = e.dataTransfer;
    if (!dt) return;

    console.log("dt.files", dt.files);

    const initialDropEvent = new CustomEvent("qdsdrop", {
      detail: dt
    });

    el?.dispatchEvent(initialDropEvent);
  });

  const handleInitialDrop$ = $((e: CustomEvent) => {
    console.log("RECEIVED CUSTOM EVENT", e.detail);
  });

  const onDrop$ = $(async (e: DragEvent) => {
    isDragging.value = false;
    console.log("onDrop");

    const isInDropzone = await isInsideDropzone(e);
    const dt = e.dataTransfer;

    if (!isInDropzone) return;
    if (!dt) return;

    console.log("isInDropzone", isInDropzone);
    console.log("dt", dt);

    console.log("dt.files", dt.files);

    dt.dropEffect = "copy";
  });

  return (
    <Render
      {...props}
      fallback="div"
      ref={dropzoneRef}
      preventdefault:dragenter
      preventdefault:dragover
      preventdefault:dragleave
      preventdefault:drop
      onDragEnter$={[onDragEnter$, props.onDragEnter$]}
      onDragLeave$={[onDragLeave$, props.onDragLeave$]}
      onDrop$={[handleInitialDropSync$, onDrop$, props.onDrop$]}
      onQdsDrop$={handleInitialDrop$}
      data-file-upload-dropzone
      // Indicates whether files are currently being dragged over the dropzone
      data-dragging={isDragging.value ? "" : undefined}
      // Indicates whether the dropzone is currently disabled
      data-disabled={context.isDisabled.value ? "" : undefined}
    >
      <Slot />
    </Render>
  );
});
