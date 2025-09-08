// Runtime exports for icon namespaces
// These are dummy exports that provide TypeScript with runtime values
// The actual functionality comes from the Vite plugin transformation at build time

import type { Component, PropsOf } from "@qwik.dev/core";
import type * as GeneratedTypes from "../lib-types/virtual-qds-icons";

type IconComponent = Component<PropsOf<"svg">>;

const proxyHandler = {
  get(target: any, prop: string | symbol) {
    // This will never be called at runtime - the Vite plugin transforms the JSX
    throw new Error(`Icon components should be transformed by the Vite plugin. Tried to access: ${String(prop)}`);
  }
};

// Use the generated types from the .d.ts file
export const Lucide: typeof GeneratedTypes.Lucide = new Proxy({} as any, proxyHandler) as any;
export const Heroicons: typeof GeneratedTypes.Heroicons = new Proxy({} as any, proxyHandler) as any;
export const Tabler: typeof GeneratedTypes.Tabler = new Proxy({} as any, proxyHandler) as any;
