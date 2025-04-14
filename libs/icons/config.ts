import { createResolver } from "@kunai-consulting/qwik-utils";

const { resolve } = createResolver(import.meta.url);

export interface QwikIconConfig {
  /**
   * Enable debug logging
   */
  debug: boolean;

  /**
   * Limit number of icons to process per collection (for testing)
   */
  iconLimit?: number;

  /**
   * Source configuration
   */
  collectionsDir: string;
}

export const log = (message: string) => {
  if (config.debug) console.log(message);
};

export const config: QwikIconConfig = {
  debug: true,
  iconLimit: process.env.ICON_LIMIT ? Number.parseInt(process.env.ICON_LIMIT) : undefined,
  collectionsDir: resolve("node_modules/@iconify/json/json")
};
