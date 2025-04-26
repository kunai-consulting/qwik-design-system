import { createResolver } from "./src/resolver";

export const resolver = createResolver(import.meta.url);

export interface QwikIconConfig {
  /**
   * Enable debug logging
   */
  debug: boolean;

  /**
   * Limit number of icons to process per collection (for testing). Change in package.json script
   */
  iconLimit?: number;
  /**
   *  A path to where the icons get generated, including their exports and barrel files
   */
  iconsDir: string;
}

export const debug = (message: string) => {
  if (config.debug) console.log(message);
};

export const config: QwikIconConfig = {
  debug: true,
  iconLimit: process.env.ICON_LIMIT ? Number.parseInt(process.env.ICON_LIMIT) : undefined,
  iconsDir: resolver("./src/icons")
};
