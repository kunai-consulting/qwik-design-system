import type { Signal } from "@builder.io/qwik";

type ItemWithPotentialDisabledRef<E extends { disabled?: boolean } = HTMLButtonElement> =
  | Signal<E | undefined>
  | { value?: E | undefined };

function getElementValue<E extends { disabled?: boolean } = HTMLButtonElement>(
  item: ItemWithPotentialDisabledRef<E>
): E | undefined {
  return item.value;
}

interface GetEnabledItemIndexOptions<
  E extends { disabled?: boolean } = HTMLButtonElement
> {
  items: ItemWithPotentialDisabledRef<E>[];
  currentIndex: number;
  loop?: boolean;
}

/**
 * Get the next enabled item index
 * @param options - The options object
 * @param options.items - The list of items (by default button elements)
 * @param options.currentIndex - The current index
 * @param options.loop - Whether to loop through the list (defaults to true)
 * @returns The next enabled item index
 */
export function getNextEnabledIndex<E extends { disabled?: boolean } = HTMLButtonElement>(
  options: GetEnabledItemIndexOptions<E>
): number {
  const items = options.items;
  const loop = options.loop === undefined ? true : options.loop;
  let currIndex = options.currentIndex;

  const len = items.length;
  if (len === 0) return -1;

  if (currIndex < -1 || currIndex >= len) {
    currIndex = -1;
  }

  const findNext = (startIndex: number): number => {
    for (let i = 0; i < len; i++) {
      const itemIndex = (startIndex + i) % len;
      const element =
        getElementValue(items[itemIndex]) || getElementValue(items[itemIndex]);
      if (element && !element.disabled) {
        return itemIndex;
      }
    }
    return -1;
  };

  if (currIndex === -1) {
    return findNext(0);
  }

  const nextEnabledCandidate = findNext((currIndex + 1) % len);
  if (nextEnabledCandidate === -1) {
    const currentElement = getElementValue(items[currIndex]);
    if (currentElement && !currentElement.disabled) {
      return currIndex;
    }
    return -1;
  }

  if (loop) {
    return nextEnabledCandidate;
  }

  if (nextEnabledCandidate > currIndex) {
    return nextEnabledCandidate;
  }

  const currentElement = getElementValue(items[currIndex]);
  if (currentElement && !currentElement.disabled) {
    return currIndex;
  }

  return -1;
}

/**
 * Get the previous enabled item index
 * @param options - The options object
 * @param options.items - The list of items (by default button elements)
 * @param options.currentIndex - The current index
 * @param options.loop - Whether to loop through the list (defaults to true)
 * @returns The previous enabled item index
 */
export function getPrevEnabledIndex<E extends { disabled?: boolean } = HTMLButtonElement>(
  options: GetEnabledItemIndexOptions<E>
): number {
  const items = options.items;
  const loop = options.loop === undefined ? true : options.loop;
  let currIndex = options.currentIndex;

  const len = items.length;
  if (len === 0) return -1;

  if (currIndex < 0 || currIndex >= len) {
    currIndex = len;
  }

  const findPrev = (startIndex: number): number => {
    for (let i = 0; i < len; i++) {
      const itemIndex = (startIndex - i + len) % len;
      const element = getElementValue(items[itemIndex]);
      if (element && !element.disabled) {
        return itemIndex;
      }
    }
    return -1;
  };

  if (currIndex === len) {
    return findPrev(len - 1);
  }

  const prevEnabledCandidate = findPrev((currIndex - 1 + len) % len);

  if (prevEnabledCandidate === -1) {
    const currentElement = getElementValue(items[currIndex]);
    if (currentElement && !currentElement.disabled) {
      return currIndex;
    }
    return -1;
  }

  if (loop) {
    return prevEnabledCandidate;
  }

  if (prevEnabledCandidate < currIndex) {
    return prevEnabledCandidate;
  }

  const currentElement = getElementValue(items[currIndex]);
  if (currentElement && !currentElement.disabled) {
    return currIndex;
  }

  return -1;
}
