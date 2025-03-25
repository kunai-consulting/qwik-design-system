import {
  type PropsOf,
  Slot,
  component$,
  useStyles$,
  useSignal,
  useContextProvider,
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
