import {
  type NoSerialize,
  type PropFunction,
  type Signal,
  createContextId
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
  isDisabledSig: Signal<boolean>;
  onFilesChange$?: PropFunction<(files: FileInfo[]) => void>;
}

export const fileUploadContextId =
  createContextId<FileUploadContext>("file-upload-context");
