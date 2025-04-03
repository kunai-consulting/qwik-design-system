/* eslint-disable @typescript-eslint/no-explicit-any */

// The below `/src/routes/docs/**/**/examples/*.tsx` patterns are here so that import.meta.glob works both for styled and headless routes.
// For example:
// /src/routes/docs/components/styled/modal/examples/hero.tsx
// /src/routes/docs/components/headless/modal/examples/hero.tsx

async function createMetaGlobComponents() {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const metaGlobComponents: Record<string, any> = await import.meta.glob(
    "../../../docs/src/routes/**/**/examples/*.tsx",
    {
      import: "default",
      eager: false
    }
  );

  const componentsMap: Record<string, unknown> = {};

  for (const key in metaGlobComponents) {
    const component = await metaGlobComponents[key];

    if (component) {
      const componentName = key.split("routes/")[1];
      if (componentName) {
        componentsMap[componentName] = await component;
      }
    }
  }

  return componentsMap;
}

export const metaGlobComponents = await createMetaGlobComponents();
