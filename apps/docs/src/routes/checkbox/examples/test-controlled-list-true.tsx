import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Checkbox, Checklist } from '@kunai-consulting/qwik-components';
// this test basically ensures that the sig passed to the checklist controlls trumps all its children
export default component$(() => {
  // const checklistSig = useSignal(true);
  return (
    <Checklist.Root initialStates={[true, true, true]}>
      <Checklist.SelectAll>
        <Checklist.Item>
          <Checklist.ItemIndicator index={0}>
            <p id="true-img">✅</p>
          </Checklist.ItemIndicator>
        </Checklist.Item>
      </Checklist.SelectAll>
      <Checklist.Item>
        <Checklist.ItemIndicator index={1}>✅</Checklist.ItemIndicator> first
        item
      </Checklist.Item>
      <Checklist.Item>
        <Checklist.ItemIndicator index={2}>✅</Checklist.ItemIndicator> second
        item
      </Checklist.Item>
    </Checklist.Root>
  );
});
