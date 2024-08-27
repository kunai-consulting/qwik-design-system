import { component$, useContext, type PropsOf, Slot } from '@builder.io/qwik';
import { CheckboxContext } from './context-id';

export type CheckboxIndicatorProps = PropsOf<'div'>;

export const CheckboxIndicator = component$<CheckboxIndicatorProps>((props) => {
  const checkSig = useContext(CheckboxContext);
  return (
    <div {...props}>
      <div hidden={checkSig.value} aria-hidden="true">
        <Slot />
      </div>
    </div>
  );
});
