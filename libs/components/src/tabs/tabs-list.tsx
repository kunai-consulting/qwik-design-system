import { type HTMLElementAttrs, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { tabsContextId } from "./tabs-root";

export type TabsListProps = HTMLElementAttrs<"div">;

export const TabsListBase = component$((props: TabsListProps) => {
  const context = useContext(tabsContextId);

  return (
    <Render
      data-qds-tabs-list
      role="tablist"
      fallback="div"
      data-orientation={
        context.orientationSig.value === "vertical" ? "vertical" : "horizontal"
      }
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const TabsList = withAsChild(TabsListBase);
