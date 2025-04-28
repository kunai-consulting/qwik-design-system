import {
  type PropsOf,
  Slot,
  component$,
  sync$,
  useContextProvider,
  useOnWindow,
  useSignal,
  useStyles$
} from "@builder.io/qwik";
import {
  type BindableProps,
  resetIndexes,
  useBindings
} from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import {
  type PanelRef,
  type ResizableContext,
  resizableContextId
} from "./resizable-context";
import styles from "./resizable.css?inline";

type PublicResizableRootProps = {
  /** Direction in which the panels can be resized */
  orientation?: "horizontal" | "vertical";
} & PropsOf<"div"> &
  BindableProps<{
    /** When true, prevents resizing of panels */
    disabled: boolean;
  }>;

/** Root container component that manages the resizable panels and handles */
export const ResizableRootBase = component$<PublicResizableRootProps>((props) => {
  const rootRef = useSignal<HTMLElement>();
  useStyles$(styles);
  const { orientation = "horizontal" } = props;

  const { disabledSig } = useBindings(props, {
    disabled: false
  });

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
  const startPosition = useSignal<number | null>(null);
  const panels = useSignal<PanelRef[]>([]);

  const context: ResizableContext = {
    orientation: useSignal(orientation),
    disabled: disabledSig,
    startPosition,
    isDragging,
    panels
  };

  useContextProvider(resizableContextId, context);

  return (
    <Render
      fallback="div"
      {...props}
      ref={rootRef}
      data-qds-resizable-root
      // Indicates the orientation of the resizable container (vertical or horizontal)
      data-orientation={orientation}
      // Indicates whether the resizable container is disabled
      data-disabled={disabledSig.value}
    >
      <Slot />
    </Render>
  );
});
export const ResizableRoot = withAsChild(ResizableRootBase, (props) => {
  resetIndexes("resizable");
  return props;
});
