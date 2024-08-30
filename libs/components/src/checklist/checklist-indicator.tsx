import {
  component$,
  type PropsOf,
  Slot,
  useContext,
  useSignal,
} from '@builder.io/qwik';
import { ChecklistContext } from './checklist-context';
import { CheckboxRoot } from '../checkbox/checkbox-root';
import { CheckboxIndicator } from '../checkbox/checkbox-indicator';

interface ChecklistItemIndicatorProps extends PropsOf<'div'> {
  index: number;
}

export const ChecklistItemIndicator = component$(
  (props: ChecklistItemIndicatorProps) => {
    const { items } = useContext(ChecklistContext);
    const itemSignal = useSignal(items.value[props.index]);
    console.log('checklistitemindicator ', items.value[props.index]);

    return (
      <CheckboxRoot bind:checked={itemSignal} {...props}>
        <CheckboxIndicator />
      </CheckboxRoot>
    );
  }
);
