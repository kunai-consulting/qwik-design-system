/**
 * Generates a deterministic symbol name from a string input.
 *
 * Qwik uses symbols internally for its qrl system. This utility
 * creates Qwik-compatible symbol names to ensure proper integration
 * with Qwik's lazy-loading and optimization features.
 *
 * @param {string} input - The string to generate a symbol name from
 * @returns {string} A symbol name in the format "s_" followed by 11 hex characters
 *
 * @example
 * ```ts
 * const symbolName = generateSymbolName("MyComponent");
 * // Returns something like "s_a1b2c3d4e5f"
 * ```
 */
export function createSymbolName(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return `s_${Math.abs(hash).toString(16).padStart(11, "0").substring(0, 11)}`;
}
