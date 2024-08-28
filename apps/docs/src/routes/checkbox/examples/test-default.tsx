import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Checkbox } from '@kunai-consulting/qwik-components';
export default component$(() => {
  const bindChecked = useSignal(false);
  return (
    <>
      <p>I'm the default checkbox!!!</p>
      <Checkbox.Root class=" text-white" bindChecked={bindChecked}>
        <div class="flex items-center gap-3">
          <Checkbox.Indicator class="w-fit bg-slate-600">
            <p id="indicator">✅</p>
          </Checkbox.Indicator>
          <p>No other stuff is needed here</p>
        </div>
      </Checkbox.Root>
    </>
  );
});
