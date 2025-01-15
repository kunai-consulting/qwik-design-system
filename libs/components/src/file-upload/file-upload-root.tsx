import {
  component$,
  useContextProvider,
  useSignal,
  type PropFunction,
  Slot,
  PropsOf
} from "@builder.io/qwik";
import { FileInfo, fileUploadContextId } from "./file-upload-context";

type HTMLDivProps = PropsOf<"div">;

/**
 * Props specific to file upload functionality
 */
interface FileUploadProps {
  multiple?: boolean; // Allow multiple file selection
  accept?: string; // File type filter (e.g. "image/*")
  disabled?: boolean; // Disable file upload
  onFilesChange$?: PropFunction<(files: FileInfo[]) => void>; // File change callback
}

type RootProps = HTMLDivProps & FileUploadProps;

/**
 * Root component for file upload functionality
 * Provides context and state management for child components
 */
export const FileUploadRoot = component$<RootProps>((props) => {
  const inputRef = useSignal<HTMLInputElement>();
  const isDragging = useSignal(false);
  const files = useSignal<FileInfo[]>([]);

  const context = {
    inputRef,
    isDragging,
    files,
    multiple: props.multiple ?? false,
    accept: props.accept,
    disabled: props.disabled,
    onFilesChange$: props.onFilesChange$
  };

  useContextProvider(fileUploadContextId, context);

  const { multiple, accept, disabled, onFilesChange$, ...htmlProps } = props;

  return (
    <div {...htmlProps} data-file-upload-root data-disabled={disabled ? "" : undefined}>
      <Slot />
    </div>
  );
});
