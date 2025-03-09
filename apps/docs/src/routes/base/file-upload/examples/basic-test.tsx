import { component$ } from "@qwik.dev/core";
import { FileUpload } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <FileUpload.Root
      onFilesChange$={(files) => {
        console.log("Files changed:", files);
        // @ts-ignore - for tests
        window.onFilesChange?.(files);
      }}
    >
      <FileUpload.Input />
      <FileUpload.Dropzone>
        <p>Drag and drop files here or</p>
        <FileUpload.Trigger>Browse Files</FileUpload.Trigger>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
});
