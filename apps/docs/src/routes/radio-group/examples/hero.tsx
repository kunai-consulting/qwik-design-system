import { component$, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@kunai-consulting/qwik';
import { LuCircle } from '@qwikest/icons/lucide';

export default component$(() => {
  useStyles$(styles);
  const items = Array.from({ length: 4 }, (_, i) => `Item ${i + 1}`);

  return (
    <RadioGroup.Root>
      {/* <RadioGroup.HiddenNativeInput /> */}
      <RadioGroup.Label class="radio-group__label">Items</RadioGroup.Label>
      {items.map((item) => (
        <RadioGroup.Item class="checkbox-root" key={item} value={item}>
          <RadioGroup.Label key={item}>{item} </RadioGroup.Label>
          <RadioGroup.Trigger class="radio-group-trigger" key={item}>
            <RadioGroup.Indicator class="radio-group-indicator">
              <LuCircle />
            </RadioGroup.Indicator>
          </RadioGroup.Trigger>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});

// example styles
import styles from './radio-group.css?inline';
