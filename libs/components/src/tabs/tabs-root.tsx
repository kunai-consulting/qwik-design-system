import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import {
  type BindableProps,
  resetIndexes,
  useBindings
} from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type TabsRootProps = Omit<PropsOf<"div">, "align"> &
  BindableProps<{ selectedValue: string }>;

type TriggerRef = Signal<HTMLButtonElement | undefined>;

export const tabsContextId = createContextId<TabsContext>("qds-tabs");

type TabsContext = {
  triggerRefs: Signal<TriggerRef[]>;
  selectedValueSig: Signal<string>;
};

export const TabsRootBase = component$((props: TabsRootProps) => {
  const triggerRefs = useSignal<TriggerRef[]>([]);

  /**
   *  If the consumer does not pass a distinct value, then we set the value to the index as a string, to handle types and conditional logic easier
   */
  const { selectedValueSig } = useBindings(props, {
    selectedValue: "0"
  });

  const context: TabsContext = {
    triggerRefs,
    selectedValueSig
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
