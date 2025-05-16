import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { resetIndexes } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type TabsRootProps = PropsOf<"div">;

type TriggerRef = Signal<HTMLButtonElement | undefined>;

export const tabsContextId = createContextId<TabsContext>("qds-tabs");

type TabsContext = {
  triggerRefs: Signal<TriggerRef[]>;
};

export const TabsRootBase = component$((props: TabsRootProps) => {
  const triggerRefs = useSignal<TriggerRef[]>([]);

  const context: TabsContext = {
    triggerRefs
  };

  useContextProvider(tabsContextId, context);

  return (
    <Render data-qds-tabs-root fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TabsRoot = withAsChild(TabsRootBase, (props) => {
  resetIndexes("tabs-trigger");
  resetIndexes("tabs-content");

  return props;
});
