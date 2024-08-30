import { component$ } from '@builder.io/qwik';

import { Checklist } from '@kunai-consulting/qwik-components';

export default component$(() => {
  return (
    <Checklist.Root initialStates={[false, false, false]}>
      <Checklist.SelectAll class="flex h-[25px] w-[25px] items-center justify-centerbg-slate-600 border-2 border-black p-2">
        <Checklist.ItemIndicator index={0}>✅</Checklist.ItemIndicator>
      </Checklist.SelectAll>
      Select All
      <Checklist.Item>
        <Checklist.ItemIndicator
          index={1}
          class="flex h-[25px] w-[25px] items-center justify-centerbg-slate-600 border-2 border-black p-2"
        >
          ✅
        </Checklist.ItemIndicator>{' '}
        first item
      </Checklist.Item>
      <Checklist.Item>
        <Checklist.ItemIndicator
          index={2}
          class="flex h-[25px] w-[25px] items-center justify-centerbg-slate-600 border-2 border-black p-2"
        >
          ✅
        </Checklist.ItemIndicator>{' '}
        second item
      </Checklist.Item>
    </Checklist.Root>
  );
});
