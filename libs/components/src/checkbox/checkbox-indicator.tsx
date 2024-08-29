import { component$, useContext, type PropsOf, Slot } from '@builder.io/qwik';
import { CheckboxContext } from './checkbox-context';

export type CheckboxIndicatorProps = PropsOf<'div'>;

export const CheckboxIndicator = component$<CheckboxIndicatorProps>((props) => {
  const checkSig = useContext(CheckboxContext);
  return (
    <div>
      <div hidden={!checkSig.value} aria-hidden="true" {...props}>
        <Slot />
      </div>
    </div>
  );
});
