import {
  type PropsOf,
  Slot,
  component$,
  createContextId,
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
  disabled?: boolean;
};

type RootProps = PropsOf<"div"> & ExampleContext;

const Root = component$((props: RootProps) => {
  const { disabled } = props;

  const context: ExampleContext = {
    disabled
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
    <button disabled={context.disabled} {...props}>
      <Slot />
    </button>
  );
});
