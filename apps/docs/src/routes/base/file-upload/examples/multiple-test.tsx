import { component$ } from "@builder.io/qwik";
import { FileUpload } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <FileUpload.Root
      multiple
      onFilesChange$={(files) => {
        console.log("Files changed:", files);
        // @ts-ignore - for tests
        window.onFilesChange?.(files);
      }}
    >
      <FileUpload.Input />
      <FileUpload.Dropzone>
        <p>Drag and drop multiple files here or</p>
        <FileUpload.Trigger>Browse Files</FileUpload.Trigger>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
});
