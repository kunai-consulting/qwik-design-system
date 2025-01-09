import {
  createContextId,
  type Signal,
  NoSerialize,
  PropFunction
} from "@builder.io/qwik";

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file: NoSerialize<File>;
}

export interface FileUploadContext {
  inputRef: Signal<HTMLInputElement | undefined>;
  isDragging: Signal<boolean>;
  files: Signal<FileInfo[]>;
  multiple: boolean;
  accept?: string;
  disabled?: boolean;
  onFilesChange$?: PropFunction<(files: FileInfo[]) => void>;
}

export const fileUploadContextId =
  createContextId<FileUploadContext>("file-upload-context");
