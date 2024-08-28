import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Checkbox } from '@kunai-consulting/qwik-components';

export default component$(() => {
  const bindChecked = useSignal(false);
  return (
    <>
      <p>default checkbox</p>
      <Checkbox.Root class="bg-slate-900 text-white" bindChecked={bindChecked}>
        <div class="flex items-center gap-3">
          <Checkbox.Indicator class="w-fit bg-slate-600">
            <p id="indicator">✅</p>
          </Checkbox.Indicator>
        </div>
      </Checkbox.Root>
    </>
  );
});
