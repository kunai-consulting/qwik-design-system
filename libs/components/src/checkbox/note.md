# Checkbox Documentation Updates

For sure need:

- [ ] Initial value
- [ ] Reactive
- [ ] Programmatic
- [ ] onChange$
- [ ] Disabled
- [ ] Mixed
- [ ] Name
- [ ] Required
- [ ] validation example

Not sure:

- [ ] value (e.g "on" vs "off")

Data attributes:

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

<Checkbox.Root>
  <Checkbox.Control>
      <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Label>
  <Checkbox.HiddenNativeInput />
  <Checkbox.ErrorMessage />
  <Checkbox.Description />
<Checkbox.Root>


API's:

checked (boolean)
bind:checked (Signal)
mixed (boolean)
onChange$ (QRL)
disabled (boolean)
required (boolean)
name (string)
value (string)



## Documentation Structure Updates
- Add a new section for Tri-State Checkbox documentation
- Include clear distinction between Two-State and Tri-State use cases
- Add keyboard interaction section

## Technical Documentation Needs
- Document aria-checked states (true, false, mixed)
- Document accessibility properties:
  - aria-labelledby
  - aria-label 
  - aria-describedby
- Document group role usage for checkbox groups

## Examples to Add
- Add a Tri-State checkbox example
- Add a checkbox group example with proper ARIA labeling
- Add keyboard interaction examples
- Add example with descriptive text using aria-describedby

## API Documentation Updates
- Add new props to Checkbox.Root documentation:
  - aria-label
  - aria-labelledby
  - aria-describedby
- Document the mixed state behavior
- Document group functionality

## Best Practices Section
- Add guidelines for labeling
- Add guidelines for grouping checkboxes
- Add guidelines for when to use Two-State vs Tri-State
- Add keyboard navigation best practices