import { createResolver } from "@kunai-consulting/qwik-utils";

export const { resolve: resolver } = createResolver(import.meta.url);

export interface QwikIconConfig {
  /**
   * Enable debug logging
   */
  debug: boolean;

  /**
   * Limit number of icons to process per collection (for testing). Change in package.json script
   */
  iconLimit?: number;
}

export const debug = (message: string) => {
  if (config.debug) console.log(message);
};

export const config: QwikIconConfig = {
  debug: true,
  iconLimit: process.env.ICON_LIMIT ? Number.parseInt(process.env.ICON_LIMIT) : undefined
};
