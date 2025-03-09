import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { isServer } from "@qwik.dev/core/build";
import { Popover, usePopover } from "@qwik-ui/headless";
import { calendarContextId } from "./calendar-context";

export type PopoverRootProps = {
  /** Controls whether the popover opens automatically or manually */
  popover?: "manual" | "auto";
  /** Whether the popover should be manually controlled */
  manual?: boolean;
  ref?: Signal<HTMLElement | undefined>;
  /** Enable floating positioning with optional placement */
  floating?: boolean | TPlacement;
  /** @deprecated Use the tooltip instead, which adheres to the WAI-ARIA design pattern. */
  hover?: boolean;
  id?: string;
  /** Reactive reference to the anchor element */
  "bind:anchor"?: Signal<HTMLElement | undefined>;
  /** Reactive reference to the panel element */
  "bind:panel"?: Signal<HTMLElement | undefined>;
};

export type FloatingProps = {
  ancestorScroll?: boolean;
  ancestorResize?: boolean;
  elementResize?: boolean;
  layoutShift?: boolean;
  animationFrame?: boolean;
  gutter?: number;
  shift?: boolean;
  flip?: boolean;
  size?: boolean;
  hide?: "referenceHidden" | "escaped";
  inline?: boolean;
  transform?: string;
  arrow?: boolean;
};

export type TPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";
export type PublicPopoverProps = PopoverRootProps & {
  floating?: boolean | TPlacement;
} & FloatingProps &
  PropsOf<"div">;
export const CalendarPopover = component$((props: PublicPopoverProps) => {
  const context = useContext(calendarContextId);
  const { showPopover, hidePopover } = usePopover(context.localId);
  const initialLoadSig = useSignal<boolean>(true);
  const { floating, flip, hover, gutter, ...rest } = props;

  useTask$(async ({ track }) => {
    track(() => context.isPopoverOpenSig.value);

    if (isServer) return;

    if (!initialLoadSig.value) {
      if (context.isPopoverOpenSig.value) {
        showPopover();
      } else {
        hidePopover();
      }
    }
  });

  const listboxId = `${context.localId}-panel`;
  const isOutside = $((rect: DOMRect, x: number, y: number) => {
    return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
  });
  //   const handleDismiss$ = $(async (e: PointerEvent) => {
  //     if (!context.isPopoverOpenSig.value) {
  //       return;
  //     }

  //     if (!panelRef.value || !context.controlRef.value) {
  //       return;
  //     }

  //     const listboxRect = panelRef.value.getBoundingClientRect();
  //     const boxRect = context.controlRef.value.getBoundingClientRect();
  //     const { clientX, clientY } = e;

  //     const isOutsideListbox = await isOutside(listboxRect, clientX, clientY);
  //     const isOutsideBox = await isOutside(boxRect, clientX, clientY);

  //     if (isOutsideListbox && isOutsideBox) {
  //       context.isPopoverOpenSig.value = false;
  //     }
  //   });

  // Dismiss code should only matter when the listbox is open
  //   useTask$(({ track, cleanup }) => {
  //     track(() => context.isPopoverOpenSig.value);

  //     if (isServer) return;

  //     if (context.isPopoverOpenSig.value) {
  //       window.addEventListener('pointerdown', handleDismiss$);
  //     }

  //     cleanup(() => {
  //       window.removeEventListener('pointerdown', handleDismiss$);
  //     });
  //   });

  useTask$(() => {
    initialLoadSig.value = false;
  });

  return (
    <Popover.Root
      floating={floating}
      flip={flip}
      hover={hover}
      gutter={gutter}
      //   bind:anchor={props['bind:anchor'] ?? context.controlRef}
      //   bind:panel={panelRef}
      manual
      id={context.localId}
    >
      <Popover.Panel
        id={listboxId}
        // Indicates if the popover is currently open
        data-open={context.isPopoverOpenSig.value ? "" : undefined}
        // Indicates if the popover is currently closed
        data-closed={!context.isPopoverOpenSig.value ? "" : undefined}
        role="listbox"
        aria-expanded={context.isPopoverOpenSig.value ? "true" : "false"}
        onMouseEnter$={[props.onMouseEnter$]}
        {...rest}
      >
        <Slot />
      </Popover.Panel>
    </Popover.Root>
  );
});
