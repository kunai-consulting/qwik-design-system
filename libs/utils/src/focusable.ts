/**
 * Focusable element detection and navigation utilities
 *
 * Based on the implementation from "A Primer on Focus Trapping" by Zell Liew
 * Published on CSS-Tricks: https://css-tricks.com/a-primer-on-focus-trapping/
 *
 * Adapted for TypeScript with proper type safety and accessibility features.
 */

export interface Focusables {
  /** Number of keyboard focusable elements */
  readonly length: number;
  /** All focusable elements that are visible and enabled */
  readonly all: HTMLElement[];
  /** Elements that can be focused via keyboard (tabIndex > -1) */
  readonly keyboard: HTMLElement[];
  /** Alias for keyboard focusable elements */
  readonly keyboardOnly: HTMLElement[];
  /** First keyboard focusable element */
  readonly first: HTMLElement | null;
  /** Last keyboard focusable element */
  readonly last: HTMLElement | null;
  /** Get next focusable element after the given index */
  next(index: number): HTMLElement | null;
  /** Get previous focusable element before the given index */
  prev(index: number): HTMLElement | null;
}

/**
 * Returns focusable elements and navigation helpers within a container.
 * @param container - Element to search in (defaults to document.body)
 * @returns Focusables object
 */
export function getFocusableElements(container: HTMLElement = document.body): Focusables {
  return {
    get length() {
      return this.keyboard.length;
    },
    // Returns all visible, enabled focusable elements in the container.
    get all() {
      const elements = Array.from(
        container.querySelectorAll(
          `a,
            button,
            input,
            textarea,
            select,
            details,
            iframe,
            embed,
            object,
            summary,
            dialog,
            audio[controls],
            video[controls],
            [contenteditable],
            [tabindex]
          `
        )
      ) as HTMLElement[];

      return elements.filter((el) => {
        if (el.hasAttribute("disabled")) return false;
        if (el.hasAttribute("hidden")) return false;
        if (window.getComputedStyle(el).display === "none") return false;
        return true;
      });
    },

    // Keyboard-focusable elements (tabIndex > -1)
    get keyboard() {
      return this.all.filter((el) => el instanceof HTMLElement && el.tabIndex > -1);
    },

    // Alias for keyboard focusable elements.
    get keyboardOnly() {
      return this.keyboard;
    },

    // First keyboard-focusable element.
    get first() {
      return this.keyboard[0] || null;
    },

    // Returns the last keyboard-focusable element.
    get last() {
      return this.keyboard[this.length - 1] || null;
    },

    // Returns the next focusable element after the given index.
    next(index: number) {
      return this.keyboard[index + 1] || null;
    },

    /** Returns the previous focusable element before the given index. */
    prev(index: number) {
      return this.keyboard[index - 1] || null;
    }
  };
}

// Alias of getFocusableElements
export function Focusable(container = document.body) {
  return getFocusableElements(container);
}
