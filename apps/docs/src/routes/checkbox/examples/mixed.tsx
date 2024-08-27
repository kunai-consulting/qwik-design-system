import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { Checkbox } from '@kunai-consulting/qwik-components';

export default component$(() => {
  const checkboxes = useSignal([
    { id: 1, checked: useSignal(false) },
    { id: 2, checked: useSignal(false) },
    { id: 3, checked: useSignal(false) },
  ]);

  const allChecked = useSignal(false);
  const mixedState = useSignal(false);
  const checked = useSignal(false);

  useTask$(({ track }) => {
    track(() => {
      for (const checkbox of checkboxes.value) {
        checkbox.checked.value;
      }
    });
    const allCheckedValues = checkboxes.value.map((c) => c.checked.value);
    allChecked.value = allCheckedValues.every(Boolean);
    mixedState.value =
      allCheckedValues.some(Boolean) && !allCheckedValues.every(Boolean);
  });
  console.log('allChecked', allChecked.value);
  console.log('mixedState', mixedState.value);
  const toggleCheckbox$ = $((index: number) => {
    checkboxes.value[index].checked.value =
      !checkboxes.value[index].checked.value;
  });
  const toggleAllCheckboxes$ = $(() => {
    const newState = checked.value; // Determine the new state based on the current state of `allChecked`
    allChecked.value = newState;

    for (const checkbox of checkboxes.value) {
      checkbox.checked.value = newState;
    }
  });

  return (
    <>
      <Checkbox.Root
        // bind:checked={checked}
        id="test"
        checklist // This tells CheckboxRoot to render MixedStateCheckbox
        class="flex items-center gap-3 border-2 border-black p-2"
        onClick$={toggleAllCheckboxes$} // This is the event that will trigger the toggle
      >
        <Checkbox.Indicator class="flex h-[25px] w-[25px] items-center justify-center bg-slate-600">
          ✅
        </Checkbox.Indicator>
        Toggle All
      </Checkbox.Root>
      {checkboxes.value.map((checkbox, index) => (
        <div key={checkbox.id}>
          <Checkbox.Root
            checklist
            bind:checked={checkbox.checked}
            id={`checkbox-${checkbox.id}`}
            class="flex items-center gap-3 border-2 border-black p-2"
          >
            <Checkbox.Indicator class="flex h-[25px] w-[25px] items-center justify-center bg-slate-600">
              {checkbox.checked.value ? '✅' : ''}
            </Checkbox.Indicator>
            Checkbox {checkbox.id}
          </Checkbox.Root>
        </div>
      ))}
    </>
  );
});
