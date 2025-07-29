import { FileUpload } from "@kunai-consulting/qwik";
import { component$ } from "@qwik.dev/core";

export default component$(() => {
  return (
    <FileUpload.Root
      disabled
      onFilesChange$={(files) => {
        console.log("Files changed:", files);
        // @ts-ignore - for tests
        window.onFilesChange?.(files);
      }}
    >
      <FileUpload.Input />
      <FileUpload.Dropzone>
        <p>Upload disabled</p>
        <FileUpload.Trigger>Browse Files</FileUpload.Trigger>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
});
