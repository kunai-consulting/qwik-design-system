/**
 * Simple namespace-based counter.
 *
 * In v1, we need to get the index in an inline component for it to be in order on the client.
 * In v2 this is solved with the **scheduler**. In v1, you need to use the reset and next functions to get the index.
 */

const counters: Record<string, number> = {};

export function resetIndexes(name: string): void {
  counters[name] = 0;
}

export function getNextIndex(name: string): number {
  if (counters[name] === undefined) {
    resetIndexes(name);
  }

  return counters[name]++;
}
