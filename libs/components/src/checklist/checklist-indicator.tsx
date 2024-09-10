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

interface ChecklistItemIndicatorProps extends PropsOf<'div'> {}

export const ChecklistItemIndicator = component$(
  (props: ChecklistItemIndicatorProps) => {
    return (
      <CheckboxIndicator>
        <Slot />
      </CheckboxIndicator>
    );
  }
);
