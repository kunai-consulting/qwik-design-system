import {
    component$,
    useContext,
    Slot,
    useTask$,
    PropsOf,
    $,
    useSignal,
    Signal,
  } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { usePopover, Popover } from '@qwik-ui/headless';
import { calendarContextId } from './calendar-context';

export type PopoverRootProps = {
    popover?: 'manual' | 'auto';
    manual?: boolean;
    ref?: Signal<HTMLElement | undefined>;
    floating?: boolean | TPlacement;
    /** @deprecated Use the tooltip instead, which adheres to the WAI-ARIA design pattern. */
    hover?: boolean;
    id?: string;
    'bind:anchor'?: Signal<HTMLElement | undefined>;
    'bind:panel'?: Signal<HTMLElement | undefined>;
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
    hide?: 'referenceHidden' | 'escaped';
    inline?: boolean;
    transform?: string;
    arrow?: boolean;
  };
  
  export type TPlacement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
  
  export type PopoverProps = PopoverRootProps & {
    floating?: boolean | TPlacement;
  } & FloatingProps &
    PropsOf<'div'>; 

export const CalendarPopover = component$((props: PopoverProps) => {
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
      id={context.localId}>
        <Popover.Panel
        id={listboxId}
        data-open={context.isPopoverOpenSig.value ? '' : undefined}
        data-closed={!context.isPopoverOpenSig.value ? '' : undefined}
        role="listbox"
        aria-expanded={context.isPopoverOpenSig.value ? 'true' : 'false'}
        onMouseEnter$={[props.onMouseEnter$]}
        {...rest}>
            <Slot />
        </Popover.Panel>
    </Popover.Root>
  );
});
