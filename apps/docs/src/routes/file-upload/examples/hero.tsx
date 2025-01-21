import { component$, useStyles$ } from "@builder.io/qwik";
import { FileUpload } from "@kunai-consulting/qwik";
import styles from "./file-upload.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <FileUpload.Root
      multiple
      accept="image/*" // Accept only image files
      onFilesChange$={(files) => {
        // Process each uploaded file
        for (const fileInfo of files) {
          // Create FormData for potential server upload
          const formData = new FormData();
          if (fileInfo.file) {
            // Append file to FormData
            formData.append("file", fileInfo.file);
            // Server upload would go here
            // Example:
            // fetch('/api/upload', {
            //   method: 'POST',
            //   body: formData
            // });
          }
        }
      }}
      class="file-upload-root"
    >
      <FileUpload.Input />
      <FileUpload.Dropzone class="file-upload-dropzone">
        <div class="file-upload-content">
          <p class="file-upload-text">Drag and drop files here or</p>
          <FileUpload.Trigger class="file-upload-trigger">
            Browse Files
          </FileUpload.Trigger>
        </div>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
});
