import { type NoSerialize, type Signal, createContextId } from "@qwik.dev/core";

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file: NoSerialize<File>;
}

export interface FileUploadContext {
  inputRef: Signal<HTMLInputElement | undefined>;
  files: Signal<FileInfo[]>;
  multiple: boolean;
  accept?: string;
  isDisabled: Signal<boolean>;
  onFilesChange$?: (files: FileInfo[]) => void;
}

export const fileUploadContextId =
  createContextId<FileUploadContext>("file-upload-context");
