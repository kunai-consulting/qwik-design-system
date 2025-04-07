// no-bound-signal
import {
  type PropsOf,
  Slot,
  component$,
  sync$,
  useContextProvider,
  useOnWindow,
  useSignal,
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type ResizableContext, resizableContextId } from "./resizable-context";
import styles from "./resizable.css?inline";
type PublicResizableRootProps = {
  /** Direction in which the panels can be resized */
  orientation?: "horizontal" | "vertical";
  /** When true, prevents resizing of panels */
  disabled?: boolean;
} & PropsOf<"div">;
/** Root container component that manages the resizable panels and handles */
export const ResizableRootBase = component$<PublicResizableRootProps>((props) => {
  useStyles$(styles);
  const { orientation = "horizontal", disabled = false } = props;
  useOnWindow(
    "keydown",
    sync$((event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      // The identifier for the root resizable container
      const isWithinResizable = activeElement?.closest("[data-qds-resizable-root]");
      if (!isWithinResizable) return;
      const preventKeys = [
        "Home",
        "End",
        "ArrowRight",
        "ArrowLeft",
        "ArrowUp",
        "ArrowDown"
      ];
      if (preventKeys.includes(event.key)) {
        event.preventDefault();
      }
    })
  );
  const isDragging = useSignal(false);
  const initialSizes = useSignal<{
    [key: string]: number;
  }>({});
  const startPosition = useSignal<number | null>(null);
  const context: ResizableContext = {
    orientation: useSignal(orientation),
    disabled: useSignal(disabled),
    startPosition,
    isDragging,
    initialSizes
  };
  useContextProvider(resizableContextId, context);
  useTask$(({ track }) => {
    const isDisabled = track(() => props.disabled);
    context.disabled.value = isDisabled ?? false;
  });
  return (
    <Render
      fallback="div"
      {...props}
      data-qds-resizable-root
      // Indicates the orientation of the resizable container (vertical or horizontal)
      data-orientation={orientation}
      // Indicates whether the resizable container is disabled
      data-disabled={disabled}
    >
      <Slot />
    </Render>
  );
});
export const ResizableRoot = withAsChild(ResizableRootBase);
