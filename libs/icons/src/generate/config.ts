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
  sources: {
    /**
     * Directory containing Iconify JSON collection packages
     * Default: "../node_modules/@iconify-json"
     */
    collectionsDir: string;
  };
}

export const log = (message: string) => {
  if (config.debug) console.log(message);
};

export const config: QwikIconConfig = {
  debug: true,
  iconLimit: process.env.ICON_LIMIT ? Number.parseInt(process.env.ICON_LIMIT) : undefined,
  sources: {
    collectionsDir: "./node_modules/@iconify-json"
  }
};
