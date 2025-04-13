import { fileURLToPath } from "node:url";
import { dirname, resolve } from "pathe";

/**
 * Allows resolving paths relative to the current file easily.
 *
 * @param {string} _base - The location you want to create relative references from. `import.meta.url` is usually what you'll want.
 *
 * @example
 * ```ts
 * const { resolve } = createResolver(import.meta.url);
 * const iconifyPath = resolve("../node_modules/@iconify-json");
 * ```
 *
 * This provides a consistent way to reference paths regardless of where the code is located in the project.
 */
export const createResolver = (_base: string) => {
  let base = _base;
  if (base.startsWith("file://")) {
    base = dirname(fileURLToPath(base));
  }

  return {
    resolve: (...path: Array<string>) => resolve(base, ...path)
  };
};
