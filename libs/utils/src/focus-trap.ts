/**
 * Focus trapping utilities for accessibility
 *
 * Based on the implementation from "A Primer on Focus Trapping" by Zell Liew
 * Published on CSS-Tricks: https://css-tricks.com/a-primer-on-focus-trapping/
 *
 * Adapted for TypeScript with proper type safety and accessibility features.
 */

import { type Focusables, getFocusableElements } from "./focusable";
import { isShiftTab, isTab } from "./keyboard";

/**
 * Keeps focus cycling within a group of elements.
 * @param event - Keyboard event
 * @param focusables - Focusable elements
 */
export function trapFocus({
  event,
  focusables
}: { event: KeyboardEvent; focusables: Focusables }) {
  if (event.key !== "Tab") return;
  if (isTab(event) && document.activeElement === focusables.last) {
    event.preventDefault();
    focusables.first?.focus();
  }

  if (isShiftTab(event) && document.activeElement === focusables.first) {
    event.preventDefault();
    focusables.last?.focus();
  }
}

/**
 * Handles focus when tabbing in/out of content.
 * @param event - Keyboard event
 * @param triggerNode - Element that triggered trap
 * @param contentNode - Focusable container
 * @param focusables - Focusable elements
 * @param tabOutFocus - Focus 'next' or 'trigger' on exit
 * @param onLeave - Callback on exit ('forward'|'back')
 */
export function manageFocus({
  event,
  triggerNode,
  contentNode,
  focusables,
  tabOutFocus = "next", // 'trigger'
  onLeave = () => {}
}: {
  event: KeyboardEvent;
  triggerNode: HTMLElement;
  contentNode: HTMLElement;
  focusables: Focusables;
  tabOutFocus?: "next" | "trigger";
  onLeave?: (direction: "forward" | "back") => void;
}) {
  const activeEl = document.activeElement;

  if (activeEl === contentNode && isShiftTab(event)) return backFocus();
  if (activeEl === contentNode && focusables.length === 0 && isTab(event))
    return nextFocus();

  if (activeEl === focusables.last && isTab(event)) return nextFocus();
  if (activeEl === focusables.first && isShiftTab(event)) return backFocus();

  function backFocus() {
    event.preventDefault();
    triggerNode.focus();
    onLeave("back");
  }

  function nextFocus() {
    if (tabOutFocus === "trigger") triggerNode.focus();
    if (tabOutFocus === "next") {
      event.preventDefault();
      const DOMFocusables = getFocusableElements().keyboard;
      const index = DOMFocusables.findIndex((e) => e === triggerNode);
      const next = DOMFocusables[index + 1];
      if (next) next.focus();
      else triggerNode.focus();
    }
    onLeave("forward");
  }
}
