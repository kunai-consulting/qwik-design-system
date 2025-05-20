import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal,
  useStyles$
} from "@builder.io/qwik";
import {
  type BindableProps,
  resetIndexes,
  useBindings
} from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import tabsStyles from "./tabs.css?inline";

export type TabsRootProps = Omit<PropsOf<"div">, "align"> &
  BindableProps<{
    selectedValue: string;
    orientation: "horizontal" | "vertical";
    loop: boolean;
  }>;

type TriggerRef = Signal<HTMLButtonElement | undefined>;

export const tabsContextId = createContextId<TabsContext>("qds-tabs");

type TabsContext = {
  triggerRefs: Signal<TriggerRef[]>;
  selectedValueSig: Signal<string>;
  orientationSig: Signal<string>;
  loopSig: Signal<boolean>;
};

export const TabsRootBase = component$((props: TabsRootProps) => {
  useStyles$(tabsStyles);
  const triggerRefs = useSignal<TriggerRef[]>([]);

  /**
   *  If the consumer does not pass a distinct value, then we set the value to the index as a string, to handle types and conditional logic easier
   */
  const { selectedValueSig, orientationSig, loopSig } = useBindings(props, {
    selectedValue: "0",
    orientation: "horizontal",
    loop: false
  });

  const context: TabsContext = {
    triggerRefs,
    selectedValueSig,
    orientationSig,
    loopSig
  };

  useContextProvider(tabsContextId, context);

  return (
    <Render
      data-qds-tabs-root
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

export const TabsRoot = withAsChild(TabsRootBase, (props) => {
  resetIndexes("tabs-trigger");
  resetIndexes("tabs-content");

  return props;
});
