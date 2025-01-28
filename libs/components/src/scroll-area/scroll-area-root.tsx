import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useStyles$
} from "@builder.io/qwik";
import { scrollAreaContextId } from "./scroll-area-context";
import styles from "./scroll-area.css?inline";

type ScrollbarVisibility = "hover" | "scroll" | "auto" | "always";

type RootProps = PropsOf<"div"> & {
  type?: ScrollbarVisibility;
  hideDelay?: number;
};

export const ScrollAreaRoot = component$<RootProps>((props) => {
  useStyles$(styles);
  const viewportRef = useSignal<HTMLDivElement>();
  const verticalScrollbarRef = useSignal<HTMLDivElement>();
  const horizontalScrollbarRef = useSignal<HTMLDivElement>();
  const rootRef = useSignal<HTMLDivElement>();
  const thumbRef = useSignal<HTMLDivElement>();
  const isScrolling = useSignal(false);
  const isHovering = useSignal(false);
  const scrollTimeout = useSignal<number>();
  const hasOverflow = useSignal(false);

  const { type = "hover", hideDelay = 600, ...restProps } = props;

  const onMouseEnter$ = $(() => {
    if (type === "hover") {
      isHovering.value = true;
    }
  });

  const onMouseLeave$ = $(() => {
    if (type === "hover") {
      isHovering.value = false;
    }
  });

  const context = {
    viewportRef,
    verticalScrollbarRef,
    horizontalScrollbarRef,
    thumbRef,
    rootRef,
    type,
    hideDelay,
    isScrolling,
    isHovering,
    scrollTimeout,
    hasOverflow
  };

  useContextProvider(scrollAreaContextId, context);

  return (
    <div
      {...restProps}
      ref={rootRef}
      data-qds-scroll-area-root
      data-type={type}
      data-has-overflow={hasOverflow.value ? "" : undefined}
      onMouseEnter$={onMouseEnter$}
      onMouseLeave$={onMouseLeave$}
    >
      <Slot />
    </div>
  );
});
