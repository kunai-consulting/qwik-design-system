import {
  type PropFunction,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { useBoundSignal } from "../../utils/bound-signal";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
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
  "bind:disabled"?: Signal<boolean>; // Two-way binding for disabled state
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

  const disabledPropSig = useComputed$(() => props.disabled);
  const isDisabledSig = useBoundSignal(
    // 2-way binding signal
    props["bind:disabled"],
    // initial value
    props["bind:disabled"]?.value ?? disabledPropSig.value ?? false,
    // value-based signal
    disabledPropSig
  );

  const context = {
    inputRef,
    isDragging,
    files,
    multiple: props.multiple ?? false,
    accept: props.accept,
    disabled: isDisabledSig.value,
    isDisabledSig,
    onFilesChange$: props.onFilesChange$
  };
  useContextProvider(fileUploadContextId, context);

  const {
    multiple,
    accept,
    disabled,
    "bind:disabled": bindDisabled,
    onFilesChange$,
    ...rest
  } = props;

  return (
    // The root container element for the entire file upload component
    <Render
      fallback="div"
      data-file-upload-root
      data-disabled={isDisabledSig.value ? "" : undefined}
      {...rest}
    >
      <Slot />
    </Render>
  );
});

export const FileUploadRoot = withAsChild(FileUploadRootBase);
