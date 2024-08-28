import { component$ } from '@builder.io/qwik';

import { Checklist } from '@kunai-consulting/qwik-components';

export default component$(() => {
  return (
    <Checklist.Root initialStates={[false, false, false]}>
      <Checklist.SelectAll>
        <Checklist.Item>
          <Checklist.ItemIndicator index={0} />
        </Checklist.Item>
      </Checklist.SelectAll>
      <Checklist.Item>
        <Checklist.ItemIndicator index={1} /> first item
      </Checklist.Item>
      <Checklist.Item>
        <Checklist.ItemIndicator index={2} /> second item
      </Checklist.Item>
    </Checklist.Root>
  );
});
