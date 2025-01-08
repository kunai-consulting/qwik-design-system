import {
  $,
  component$,
  type PropsOf,
  Slot,
  sync$,
  useContext,
} from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';
import { Label } from '../label';

type CheckboxLabelProps = PropsOf<'label'>;

export const RadioGroupLabel = component$((props: CheckboxLabelProps) => {
  const context = useContext(radioGroupContextId);
  const triggerId = `${context.localId}-trigger`;

  return (
    <Label {...props} data-qds-radio-group-label for={triggerId}>
      <Slot />
    </Label>
  );
});
