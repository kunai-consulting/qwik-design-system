import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Checkbox } from '@kunai-consulting/qwik-components';
export default component$(() => {
  const isCheckedSig = useSignal(false);

  return (
    <>
      <Checkbox.Root
        bind:checked={isCheckedSig}
        id="test"
        class="flex items-center gap-3 border-2 border-black p-2"
      >
        <div class="flex h-[25px] w-[25px] items-center justify-center bg-slate-600">
          <Checkbox.Indicator>✅</Checkbox.Indicator>
        </div>
        <p> I have read the README</p>
      </Checkbox.Root>
      <button
        type="button"
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        onClick$={() => (isCheckedSig.value = !isCheckedSig.value)}
      >
        Check the checkbox above
      </button>
    </>
  );
});
