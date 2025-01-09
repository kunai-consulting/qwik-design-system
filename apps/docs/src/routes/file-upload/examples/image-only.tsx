import { component$ } from "@builder.io/qwik";
import { FileUpload } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <FileUpload.Root
      accept="image/*"
      onFilesChange$={(files) => {
        console.log('Files changed:', files);
        // @ts-ignore - for tests
        window.onFilesChange?.(files);
      }}
    >
      <FileUpload.Input />
      <FileUpload.Dropzone>
        <p>Drop image here or</p>
        <FileUpload.Trigger>
          Select Image
        </FileUpload.Trigger>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
});
