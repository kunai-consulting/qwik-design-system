import { component$, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@kunai-consulting/qwik-components';

export default component$(() => {
  const items = Array.from({ length: 4 }, (_, i) => `Item ${i + 1}`);

  return (
    <RadioGroup.Root class="radio-group-root" defaultValue="Item 2">
      <RadioGroup.Label>Radio Group Label</RadioGroup.Label>
      {items.map((item) => (
        <RadioGroup.Item value={item} key={item}>
          <RadioGroup.Label>{item} </RadioGroup.Label>
          <RadioGroup.Input class="input" name="hero" value={item} />
          <RadioGroup.ItemIndicator class="indicator" />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});
