import { useBindings } from "@kunai-consulting/qwik-utils";
import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal
} from "@qwik.dev/core";
import { Render } from "../render/render";
import { type FileInfo, fileUploadContextId } from "./file-upload-context";
export interface PublicFileUploadProps {
  /** Whether multiple files can be selected or uploaded at once */
  multiple?: boolean;
  // File type filter (e.g. "image/*")
  accept?: string;
  // Disable file upload
  disabled?: boolean;
  // File change callback
  onChange$?: (files: FileInfo[]) => void;
}
type PublicRootProps = Omit<PropsOf<"div">, "onChange$"> & PublicFileUploadProps;

/** Root component for file upload functionality
 * Provides context and state management for child components */
export const FileUploadRoot = component$<PublicRootProps>((props) => {
  const { multiple, accept, disabled, onChange$, ...rest } = props;

  const inputRef = useSignal<HTMLInputElement>();
  const files = useSignal<FileInfo[]>([]);

  const { disabledSig: isDisabled } = useBindings(props, {
    disabled: false
  });

  const context = {
    inputRef,
    files,
    multiple: props.multiple ?? false,
    accept: props.accept,
    isDisabled,
    onChange$
  };

  useContextProvider(fileUploadContextId, context);

  return (
    // The root container element for the entire file upload component
    <Render
      fallback="div"
      {...rest}
      data-file-upload-root
      data-disabled={isDisabled.value ? "" : undefined}
    >
      <Slot />
    </Render>
  );
});
