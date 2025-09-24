// if the pressed key is Tab key
export function isTab(event: KeyboardEvent) {
  return !event.shiftKey && event.key === "Tab";
}

// if the pressed key is Shift + Tab key
export function isShiftTab(event: KeyboardEvent) {
  return event.shiftKey && event.key === "Tab";
}

// Tab or Shift+Tab
export function isTabKey(key: string) {
  return key === "Tab";
}
