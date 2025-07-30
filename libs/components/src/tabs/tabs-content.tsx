import {
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useConstant,
  useContext
} from "@qwik.dev/core";
import { Render } from "../render/render";
import { tabsContextId } from "./tabs-root";

export type TabsContentProps = PropsOf<"div"> & {
  _index?: number;
  value?: string;
};

export const TabsContent = component$((props: TabsContentProps) => {
  const context = useContext(tabsContextId);

  const currIndex = useConstant(() => {
    const currContentIndex = context.currContentIndex;
    context.currContentIndex++;

    return currContentIndex;
  });

  const isVisibleSig = useComputed$(() => {
    const isIndexBased = Number.parseInt(context.selectedValueSig.value) === currIndex;

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
