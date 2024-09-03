import { component$ } from '@builder.io/qwik';

import { Checklist } from '@kunai-consulting/qwik-components';

export default component$(() => {
  return (
    <Checklist.Root initialStates={[false, false, false]}>
      <Checklist.SelectAll class="flex h-[25px] w-[25px] items-center justify-center bg-slate-600 border-2 border-black p-2">
        <div class="flex h-[25px] w-[25px] items-center justify-centerbg-slate-600 border-2 border-black p-2">
          <Checklist.ItemIndicator>✅</Checklist.ItemIndicator>
        </div>
      </Checklist.SelectAll>
      Select All
      <Checklist.Item>
        <div class="flex h-[25px] w-[25px] items-center justify-centerbg-slate-600 border-2 border-black p-2">
          <Checklist.ItemIndicator>✅</Checklist.ItemIndicator>
        </div>
        first item
      </Checklist.Item>
      <Checklist.Item>
        <div class="flex h-[25px] w-[25px] items-center justify-centerbg-slate-600 border-2 border-black p-2">
          <Checklist.ItemIndicator>✅</Checklist.ItemIndicator>
        </div>
        second item
      </Checklist.Item>
    </Checklist.Root>
  );
});
