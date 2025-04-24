import {
  $,
  type PropsOf,
  Slot,
  component$,
  createSignal,
  sync$,
  useConstant,
  useContextProvider,
  useOnWindow,
  useSignal,
  useStyles$,
  useVisibleTask$
} from "@builder.io/qwik";
import { useBindings } from "../../utils/bindings";
import { resetIndexes } from "../../utils/indexer";
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
  /** When true, prevents resizing of panels */
  disabled?: boolean;
  storageKey?: string;
} & PropsOf<"div">;

/** Root container component that manages the resizable panels and handles */
export const ResizableRootBase = component$<PublicResizableRootProps>((props) => {
  const rootRef = useSignal<HTMLElement>();
  useStyles$(`
    [data-qds-resizable-root]:not([data-hydrated="true"]) {
      visibility: hidden;
    }
  `);
  useStyles$(styles);
  const { orientation = "horizontal", storageKey } = props;

  const { disabledSig } = useBindings(props, {
    disabled: false
  });

  const storedSizes = useConstant(() =>
    createSignal<{
      [key: number]: number;
    }>({})
  );

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

  const saveState = $(
    (sizes: {
      [key: number]: number;
    }) => {
      if (!storageKey) return;
      try {
        localStorage.setItem(`resizable-${storageKey}`, JSON.stringify(sizes));
        storedSizes.value = sizes;
      } catch (e) {
        console.warn("Failed to save layout:", e);
      }
    }
  );

  useVisibleTask$(({ track }) => {
    track(() => storageKey);

    if (typeof window !== "undefined" && storageKey) {
      try {
        const saved = localStorage.getItem(`resizable-${storageKey}`);
        if (saved) {
          storedSizes.value = JSON.parse(saved);
        }
      } catch (e) {
        console.warn("Failed to load saved layout:", e);
      }
    }
    if (rootRef.value) {
      rootRef.value.setAttribute("data-hydrated", "true");
    }
  });

  const context: ResizableContext = {
    orientation: useSignal(orientation),
    disabled: disabledSig,
    startPosition,
    isDragging,
    initialSizes: storedSizes,
    panels,
    storageKey: useSignal(storageKey),
    saveState
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
