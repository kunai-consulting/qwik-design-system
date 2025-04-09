import {
  type PropFunction,
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { type FileInfo, fileUploadContextId } from "./file-upload-context";
type HTMLDivProps = PropsOf<"div">;
/**
 * Props specific to file upload functionality
 */
interface PublicFileUploadProps {
  /** Whether multiple files can be selected or uploaded at once */
  multiple?: boolean; // Allow multiple file selection
  accept?: string; // File type filter (e.g. "image/*")
  disabled?: boolean; // Disable file upload
  onFilesChange$?: PropFunction<(files: FileInfo[]) => void>; // File change callback
}
type PublicRootProps = HTMLDivProps & PublicFileUploadProps;
/**
 * Root component for file upload functionality
 * Provides context and state management for child components
 */
export const FileUploadRootBase = component$<PublicRootProps>((props) => {
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
  const { multiple, accept, disabled, onFilesChange$, ...rest } = props;
  return (
    // The root container element for the entire file upload component
    <div {...rest} data-file-upload-root data-disabled={disabled ? "" : undefined}>
      <Slot />
    </div>
  );
});

export const FileUploadRoot = withAsChild(FileUploadRootBase);
