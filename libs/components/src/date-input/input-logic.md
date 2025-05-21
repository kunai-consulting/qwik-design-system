# Dev notes: strategies for processing user input

## Desired functionality
- Smooth processing of user input
- Prevent invalid input, i.e. non-numeric characters, too many characters
- Update related state when the input value changes, i.e. date value, maximum day-of-month when month or year is changed
- New input is processed in the order it's entered, and is typically treated as added to the end of the existing value
- When the segment is already filled or the new input would push the value over the max, the new input overwrites the existing value
- After filling a segment, focus moves to the next segment

## Qwik tools for processing user input, and their limitations
- sync$ methods for onKeyDown, onInput, onPaste, onFocus, onBlur, onChange
  - sync methods can work with the events directly, i.e. calling preventDefault
  - events are processed synchronously in the order they are received
  - CANNOT access state, nor call async functions
- $ dollar functions for onKeyDown, onInput, onPaste, onFocus, onBlur, onChange
  - dollar functions can access state and call other async functions
  - CANNOT be relied upon to process events in the order they are received

## Initial implementation
- onKeyDownSync$ handles key presses for: preventing non-numeric characters and other extraneous keys
- onKeyDown$ handles key presses for: keyboard shortcuts for incrementing, decrementing, and moving focus to the next/previous segment
- onPaste$ prevents pasting junk, i.e. non-numeric text
- onInput$ handled everything else... but it was not working well enough. 
  - Trying to process each key press in order using `event.data` was failing, even after implementing some queue logic, due to race conditions with the state updates and logic that depended on the state.
  - Processing based on the updated content of the input element via `event.target.value` didn't work either. We couldn't logically parse which character was being inputted and where (at the beginning, middle, or end), only the input value as a whole, resulting in an unstable foundation for further logic.
- We can't simply rely on the native maxlength attribute because it prevents further input in certain cases. For example, when the value has a leading zero, or when what we want is for new input to overwrite the existing value, we need to allow typing even though the input is already technically at max length.

## Current implementation
- onKeyDownSync$ is used more heavily to process key presses
  - Prevents non-numeric characters and other extraneous keys (same as initially implemented)
  - Determines when the current input value should be replaced vs appended to, depending on the segment type and the current value. When the value is replaced, it cancels the default behavior and sets the new value via a new InputEvent.
  - Our replacement logic means we don't have to worry as much about special maxlength handling
- onInput$ now has less input-processing logic, but remains responsible for updating the state based on the updated value, as well as some logic related to leading zeros and focus management
  