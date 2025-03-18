import {
  type Signal,
  Slot,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useSignal,
  useTask$
} from "@builder.io/qwik";

export default component$(() => {
  const isRenderedSig = useSignal(false);

  return (
    <>
      <button type="button" onClick$={() => (isRenderedSig.value = true)}>
        render on the client
      </button>
      {isRenderedSig.value && (
        <Root>
          <Item />
          <Item />
          <Item />
          <Item />
        </Root>
      )}
    </>
  );
});

export const dummyContextId = createContextId<RootContext>("dummy-context");

type RootContext = {
  count: number;
};

const Root = component$(() => {
  const count = 0;

  const context: RootContext = {
    count
  };

  useContextProvider(dummyContextId, context);

  return (
    <div>
      <Slot />
    </div>
  );
});

const Item = component$(() => {
  const context = useContext(dummyContextId);

  const index = context.count++;

  return <div>Index: {index}</div>;
});
