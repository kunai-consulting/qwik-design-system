import {
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext
} from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { tabsContextId } from "./tabs-root";

export type TabsContentProps = PropsOf<"div"> & {
  _index?: number;
  value?: string;
};

export const TabsContentBase = component$((props: TabsContentProps) => {
  const context = useContext(tabsContextId);

  const isVisibleSig = useComputed$(() => {
    const isIndexBased = Number.parseInt(context.selectedValueSig.value) === props._index;

    const isValueBased = props.value === context.selectedValueSig.value;

    return isIndexBased || isValueBased;
  });

  return (
    <Render
      data-qds-tabs-content
      role="tabpanel"
      fallback="div"
      hidden={!isVisibleSig.value}
      tabIndex={isVisibleSig.value ? 0 : -1}
      aria-live="off"
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const TabsContent = withAsChild(TabsContentBase, (props) => {
  const index = getNextIndex("tabs-content");
  props._index = index;

  return props;
});
