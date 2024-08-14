import { isDev } from "@builder.io/qwik/build";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const metaGlobComponents: Record<string, any> = import.meta.glob(
  "/src/routes/**/examples/*.tsx",
  {
    import: "default",
    eager: false,
  }
);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const rawComponents: Record<string, any> = import.meta.glob(
  "/src/routes/**/examples/*.tsx",
  {
    query: "raw",
    import: "default",
    eager: false,
  }
);
