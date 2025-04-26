// import { fileURLToPath } from "node:url";
// import { dirname, resolve } from "pathe";

// /**
//  * Allows resolving paths relative to the current file easily.
//  *
//  * @param {string} _base - The location you want to create relative references from. `import.meta.url` is usually what you'll want.
//  *
//  * @example
//  * ```ts
//  * const resolver = createResolver(import.meta.url);
//  * const iconifyPath = resolver("../node_modules/@iconify-json");
//  * ```
//  *
//  * This provides a consistent way to reference paths regardless of where the code is located in the project. (think of it like import aliases but for relative paths!)
//  */
// export const createResolver = (_base: string) => {
//   let base = _base;
//   if (base.startsWith("file://")) {
//     base = dirname(fileURLToPath(base));
//   }

//   const resolver = (...path: Array<string>) => resolve(base, ...path);
//   return resolver;
// };
