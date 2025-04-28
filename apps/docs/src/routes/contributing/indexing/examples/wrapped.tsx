import {
  type PropsOf,
  Slot,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { Render, withAsChild } from "@kunai-consulting/qwik";
import { getNextIndex, resetIndexes } from "@kunai-consulting/qwik-utils";

export default component$(() => {
  const isRenderedSig = useSignal(false);

  return (
    <>
      <button type="button" onClick$={() => (isRenderedSig.value = true)}>
        render on the client
      </button>
      {isRenderedSig.value && (
        <Root>
          <UserComp />
          <Item />
          <Item />
        </Root>
      )}
    </>
  );
});

export const UserComp = component$(() => {
  return (
    <>
      <Item />
      <Item />
    </>
  );
});

export const dummyContextId = createContextId<RootContext>("dummy-context");

type RootContext = object;

const RootBase = component$(() => {
  // other context stuff here
  const context: RootContext = {};

  useContextProvider(dummyContextId, context);

  return (
    <Render fallback="div">
      <Slot />
    </Render>
  );
});

export const Root = withAsChild(RootBase, (props) => {
  resetIndexes("dummy-component-name");

  return props;
});

type ItemProps = {
  _index?: number;
} & PropsOf<"div">;

const ItemBase = component$((props: ItemProps) => {
  const context = useContext(dummyContextId);

  // other context stuff

  return <Render fallback="div">Index: {props._index}</Render>;
});

export const Item = withAsChild(ItemBase, (props) => {
  const nextIndex = getNextIndex("dummy-component-name");
  props._index = nextIndex;

  return props;
});
