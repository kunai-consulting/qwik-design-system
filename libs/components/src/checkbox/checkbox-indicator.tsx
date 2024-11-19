import {
  component$,
  useContext,
  type PropsOf,
  Slot,
  useTask$,
  useStyles$,
} from '@builder.io/qwik';
import { CheckboxContext, checkboxContextId } from './checkbox-context';
import './checkbox.css';
import styles from './checkbox.css?inline';

export type CheckboxIndicatorProps = PropsOf<'div'>;

export const CheckboxIndicator = component$<CheckboxIndicatorProps>((props) => {
  useStyles$(styles);
  const context = useContext(checkboxContextId);

  return (
    <div
      {...props}
      data-hidden={!context.isCheckedSig.value}
      data-qds-indicator
      aria-hidden="true"
    >
      <Slot />
    </div>
  );
});
