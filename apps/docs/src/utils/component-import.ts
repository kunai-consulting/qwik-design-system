import { isDev } from "@builder.io/qwik/build";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const metaGlobComponents: Record<string, any> = import.meta.glob(
  "/src/routes/**/examples/*.tsx",
  {
    import: "default",
    eager: isDev ? false : true,
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rawComponents: Record<string, any> = import.meta.glob(
  "/src/routes/**/examples/*.tsx",
  {
    query: "raw",
    import: "default",
    eager: isDev ? false : true,
  }
);
