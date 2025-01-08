import { component$, useContext, type PropsOf, Slot } from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';
import { Label } from '../label';

type RadioGroupProps = PropsOf<'label'>;

export const RadioGroupLabel = component$((props: RadioGroupProps) => {
  const context = useContext(radioGroupContextId);

  return (
    <Label {...props} data-qds-radio-group-label tabIndex={-1}>
      <Slot />
    </Label>
  );
});
