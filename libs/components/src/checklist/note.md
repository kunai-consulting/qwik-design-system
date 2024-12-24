e# Checkbox Documentation Updates

For sure need:

- [ ] Initial value
- [ ] Reactive
- [ ] Programmatic
- [ ] onChange$
- [ ] Disabled
- [ ] SelectAll
- [ ] Name
- [ ] Required
- [ ] validation example

Item data attributes:

- [ ] data-checked
- [ ] data-disabled
- [ ] data-invalid
- [ ] data-mixed

Possible values:
- true
- false
- "mixed"

Keyboard interaction:

- [ ] Space (toggles)

Anatomy:

<Checklist.Root>
  <Checklist.Item>
    <Checklist.ItemLabel />
    <Checklist.ItemTrigger />
    <Checklist.ItemDescription />
  </Checklist.Item>
  <Checklist.HiddenInput />
  <Checklist.ErrorMessage />
</Checklist.Root>

API's:

checked (boolean)
bind:checked (Signal)
mixed (boolean)
onChange$ (QRL)
disabled (boolean)
required (boolean)
name (string)
value (string)