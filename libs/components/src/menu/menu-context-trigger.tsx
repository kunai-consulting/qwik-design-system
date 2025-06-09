import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { menuContextId } from "./menu-root";

/**
 * A trigger that opens the menu on right-click (context menu)
 */
export const MenuContextTriggerBase = component$<PropsOf<"div">>((props) => {
  const context = useContext(menuContextId);

  const handleContextMenu = $((event: MouseEvent) => {
    if (context.isContextMenu && context.contextMenuX && context.contextMenuY) {
      context.isContextMenu.value = true;
      context.contextMenuX.value = event.clientX;
      context.contextMenuY.value = event.clientY;
      context.isOpenSig.value = true;
    }
  });

  return (
    <Render
      fallback="div"
      ref={context.triggerRef}
      preventdefault:contextmenu
      onContextMenu$={[handleContextMenu, props.onContextMenu$]}
      data-qds-menu-context-trigger
      aria-haspopup="menu"
      aria-controls={context.isOpenSig.value ? context.contentId : undefined}
      aria-expanded={context.isOpenSig.value}
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const MenuContextTrigger = withAsChild(MenuContextTriggerBase);
