import {
  type BindableProps,
  resetIndexes,
  useBindings
} from "@kunai-consulting/qwik-utils";
import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal,
  useStyles$,
  useTask$
} from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import tabsStyles from "./tabs.css?inline";

export type TabsRootProps = Omit<PropsOf<"div">, "align" | "onChange$"> &
  BindableProps<{
    value: string;
    orientation: "horizontal" | "vertical";
    loop: boolean;
  }> & {
    onChange$?: (value: string) => void;
    selectOnFocus?: boolean;
  };

type TriggerRef = Signal<HTMLButtonElement | undefined>;

export const tabsContextId = createContextId<TabsContext>("qds-tabs");

type TabsContext = {
  triggerRefs: Signal<TriggerRef[]>;
  selectedValueSig: Signal<string>;
  orientationSig: Signal<string>;
  loopSig: Signal<boolean>;
  selectOnFocus: boolean;
};

export const TabsRootBase = component$((props: TabsRootProps) => {
  const { onChange$, selectOnFocus = true, ...rest } = props;

  useStyles$(tabsStyles);
  const triggerRefs = useSignal<TriggerRef[]>([]);
  const isInitialRenderSig = useSignal(true);

  /**
   *  If the consumer does not pass a distinct value, then we set the value to the index as a string, to handle types and conditional logic easier
   */
  const {
    valueSig: selectedValueSig,
    orientationSig,
    loopSig
  } = useBindings(props, {
    value: "0",
    orientation: "horizontal",
    loop: false,
    selectOnFocus: true
  });

  const context: TabsContext = {
    triggerRefs,
    selectedValueSig,
    orientationSig,
    loopSig,
    selectOnFocus
  };

  useContextProvider(tabsContextId, context);

  useTask$(function handleTabChange({ track, cleanup }) {
    track(() => selectedValueSig.value);

    if (!isInitialRenderSig.value) {
      onChange$?.(selectedValueSig.value);
    }

    cleanup(() => {
      isInitialRenderSig.value = false;
    });
  });

  return (
    <Render
      data-qds-tabs-root
      fallback="div"
      data-orientation={
        context.orientationSig.value === "vertical" ? "vertical" : "horizontal"
      }
      {...rest}
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
