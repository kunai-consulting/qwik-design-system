import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { tabsContextId } from "./tabs-root";

export type TabsListProps = PropsOf<"div">;

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
