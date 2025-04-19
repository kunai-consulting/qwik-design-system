import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  useComputed$,
  useContext,
  useContextProvider,
  useSignal,
  useStyles$
} from "@qwik.dev/core";

export default component$(() => {
  const isDisabled = useSignal(true);

  useStyles$(`
        [data-example-state-button]:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }    
    `);

  return (
    <>
      <Root disabled={isDisabled.value}>
        <Child data-example-state-button>I am a button!</Child>
      </Root>

      <button type="button" onClick$={() => (isDisabled.value = !isDisabled.value)}>
        Toggle disabled
      </button>

      <p>User disabled: {isDisabled.value ? "true" : "false"}</p>
    </>
  );
});

export const exampleContextId = createContextId<ExampleContext>("example-context");

type ExampleContext = {
  isDisabledSig: Signal<boolean>;
};

const Root = component$((props: PropsOf<"div"> & { disabled: boolean }) => {
  const isDisabledSig = useComputed$(() => props.disabled);

  const context: ExampleContext = {
    isDisabledSig
  };

  useContextProvider(exampleContextId, context);

  return (
    <div>
      <Slot />
    </div>
  );
});

const Child = component$((props: PropsOf<"button">) => {
  const context = useContext(exampleContextId);

  return (
    <button disabled={context.isDisabledSig.value} {...props}>
      <Slot />
    </button>
  );
});
