import {
  type PropsOf,
  Slot,
  component$,
  useStyles$,
  useSignal,
  useContextProvider, useOnWindow, sync$,
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type ResizableContext, resizableContextId } from "./resizable-context";
import styles from "./resizable.css?inline";

type ResizableRootProps = {
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  // onChange$?: (sizes: PanelSize[]) => void;
} & PropsOf<"div">;

export const ResizableRootBase = component$<ResizableRootProps>((props) => {
  useStyles$(styles);
  const { orientation = "horizontal", disabled = false } = props;

  useOnWindow(
    "keydown",
    sync$((event: KeyboardEvent) => {
      const activeElement = document.activeElement;
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
  const initialSizes = useSignal<{ [key: string]: number }>({});
  const startPosition = useSignal<number | null>(null);

  const context: ResizableContext = {
    orientation: useSignal(orientation),
    disabled: useSignal(disabled),
    startPosition,
    isDragging,
    initialSizes,
  };

  useContextProvider(resizableContextId, context);

  return (
    <Render
      fallback="div"
      {...props}
      data-qds-resizable-root
      data-orientation={orientation}
      data-disabled={disabled}
    >
      <Slot />
    </Render>
  );
});

export const ResizableRoot = withAsChild(ResizableRootBase);
