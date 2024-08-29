import { component$, type PropsOf, useContext } from '@builder.io/qwik';
import { ChecklistContext } from './checklist-context';

export type ChecklistItemIndicatorProps = PropsOf<'div'>;

export const ChecklistItemIndicator = component$((props: { index: number }) => {
  const { items, toggleItem } = useContext(ChecklistContext);

  return (
    <input
      type="checkbox"
      checked={items.value[props.index]}
      onClick$={() => toggleItem(props.index)}
    />
  );
});
