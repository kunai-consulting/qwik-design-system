import {
  component$,
  Slot,
  useContext,
  useTask$,
  type PropsOf,
} from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';

type RadioGroupErrorMessageProps = PropsOf<'div'>;

export const RadioGroupErrorMessage = component$(
  (props: RadioGroupErrorMessageProps) => {
    const context = useContext(radioGroupContextId);
    const errorId = `${context.localId}-error`;

    useTask$(({ cleanup }) => {
      context.isErrorSig.value = true;

      cleanup(() => {
        context.isErrorSig.value = false;
      });
    });

    return (
      <div id={errorId} data-qds-radio-group-error-message {...props}>
        <Slot />
      </div>
    );
  }
);
