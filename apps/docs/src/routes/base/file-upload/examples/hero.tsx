import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { LuTrash2 } from "@qwikest/icons/lucide";
import { FileUpload } from "@kunai-consulting/qwik";
import styles from "./file-upload.css?inline";

interface FilePreview {
  name: string;
  size: number;
  type: string;
  url: string;
}

export default component$(() => {
  useStyles$(styles);
  const filePreviewsSig = useSignal<FilePreview[]>([]);

  const removeFile$ = $((index: number) => {
    const newFiles = [...filePreviewsSig.value];
    
    // Remove the file from the array
    newFiles.splice(index, 1);
    filePreviewsSig.value = newFiles;
  });

  return (
    <div class="file-upload-container">
      
      <FileUpload.Root
        multiple
        accept="image/*" // Accept only image files
        onFilesChange$={$((files) => {
          const newPreviews: FilePreview[] = [];
          
          // Process each uploaded file and create previews
          for (const fileInfo of files) {
            if (fileInfo.file) {
              // Create URL for preview
              const url = URL.createObjectURL(fileInfo.file);
              
              // Add to previews
              newPreviews.push({
                name: fileInfo.name,
                size: fileInfo.size,
                type: fileInfo.type,
                url
              });
            }
          }
          
          // Update previews signal
          filePreviewsSig.value = newPreviews;
        })}
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
      
      {/* File Preview Section */}
      {filePreviewsSig.value.length > 0 && (
        <div class="file-preview-container">
          <h3>Uploaded Files</h3>
          <div class="file-preview-grid">
            {filePreviewsSig.value.map((file, index) => (
              <div key={`${file.name}-${index}`} class="file-preview-item">
                <img src={file.url} alt={file.name} class="file-preview-image" />
                <div class="file-preview-info">
                  <p class="file-preview-name">{file.name}</p>
                  <p class="file-preview-size">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <button 
                  type="button" 
                  class="file-remove-button" 
                  onClick$={() => removeFile$(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <LuTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

