# OTP Implementation

For sure need:

- [ ] Initial value
- [ ] Reactive
- [ ] Programmatic
- [ ] onChange$
- [ ] onComplete$ (when finished)
- [ ] Disabled


## Existing playwright tests

https://github.com/guilhermerodz/input-otp/tree/master/apps/test/src/tests

Not sure:

- [ ] value (e.g "on" vs "off")

Data attributes:

Possible values:

Keyboard interaction:

Down Arrow 

- Goes to last fake selection

Up Arrow

- Goes to first fake selection 

Right arrow

- Goes to next fake selection

Left arrow

- Goes to previous fake selection

Ctrl + A

Highlight all fake selections

Paste

Allow pasting from all devices and password managers

All common text input behaviors should be supported


Anatomy:

<Otp.Root>
  <Otp.NativeInput />
  <Otp.Item>
    <Otp.Caret />
  </Otp.Item>
</Otp.Root>


API's:

More advanced:

pushPasswordManagerStrategy - 'increase-width' | 'none'
https://github.com/guilhermerodz/input-otp/blob/master/packages/input-otp/src/types.ts#L24

Handling different password manager providers:
https://github.com/guilhermerodz/input-otp/blob/master/packages/input-otp/src/use-pwm-badge.tsx


