/**
 * Simple namespace-based counter.
 *
 * In v1, we need to get the index in an inline component for it to be in order on the client.
 * In v2 this is solved with the **scheduler**. In v1, you need to use the reset and next functions to get the index.
 */

const counters: Record<string, number> = {};
const instanceCounts: Record<string, number> = {};
const currentInstance: Record<string, number> = {};
const itemsConsumed: Record<string, number> = {};

export function resetIndexes(name: string): void {
  console.log(`🔄 resetIndexes(${name}) called`);

  // If this is the first reset in a while, clear everything
  if (!instanceCounts[name] || itemsConsumed[name] > 0) {
    instanceCounts[name] = 0;
    currentInstance[name] = 0;
    itemsConsumed[name] = 0;
    console.log(`  🧹 Cleared state for ${name}`);
  }

  instanceCounts[name]++;
  counters[`${name}_${instanceCounts[name] - 1}`] = 0;

  console.log(
    `  📚 Created instance ${instanceCounts[name] - 1} for ${name}. Total instances: ${instanceCounts[name]}`
  );
}

export function getNextIndex(name: string): number {
  console.log(`🔢 getNextIndex(${name}) called`);

  if (!instanceCounts[name]) {
    console.log(`  ⚠️ No instances for ${name}, creating one`);
    resetIndexes(name);
  }

  const instanceKey = `${name}_${currentInstance[name]}`;

  if (counters[instanceKey] === undefined) {
    counters[instanceKey] = 0;
  }

  const value = counters[instanceKey];
  counters[instanceKey]++;
  itemsConsumed[name]++;

  if (counters[instanceKey] >= 5 && currentInstance[name] + 1 < instanceCounts[name]) {
    currentInstance[name]++;
  }

  return value;
}
