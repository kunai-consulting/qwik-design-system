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
type PublicScrollbarVisibility = "hover" | "scroll" | "auto" | "always";
type PublicRootProps = PropsOf<"div"> & {
  /** Controls when the scrollbars are visible: 'hover', 'scroll', 'auto', or 'always' */
  type?: ScrollbarVisibility;
  /** Delay in milliseconds before hiding the scrollbars when type is 'scroll' */
  hideDelay?: number;
};
/** A root component for scrollable content areas with customizable scrollbar behavior */
export const ScrollAreaRoot = component$<PublicRootProps>((props) => {
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
      // The root container element for the scroll area component
      data-qds-scroll-area-root
      // Defines the scrollbar visibility behavior (hover, scroll, auto, or always)
      data-type={type}
      // Indicates whether the content exceeds the viewport dimensions
      data-has-overflow={hasOverflow.value ? "" : undefined}
      onMouseEnter$={onMouseEnter$}
      onMouseLeave$={onMouseLeave$}
    >
      <Slot />
    </div>
  );
});
