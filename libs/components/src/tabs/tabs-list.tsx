import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { tabsContextId } from "./tabs-root";

export type TabsListProps = PropsOf<"div">;

export const TabsList = component$((props: TabsListProps) => {
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
