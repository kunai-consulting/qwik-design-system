import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-qr-code-root]");
  };

  const getCanvas = () => {
    return rootLocator.locator("[data-qds-qr-container] canvas").first();
  };

  const getOverlay = () => {
    return rootLocator.locator("[data-qds-qr-overlay]").first();
  };

  const getAllCanvases = () => {
    return rootLocator.locator("[data-qds-qr-container] canvas");
  };

  const getCanvasPixelColor = async (x: number, y: number) => {
    const canvas = getCanvas();
    return await canvas.evaluate(
      (el, coordinates) => {
        const canvas = el as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        const pixel = ctx.getImageData(coordinates.x, coordinates.y, 1, 1).data;
        return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      },
      { x, y }
    );
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getCanvas,
    getOverlay,
    getAllCanvases,
    getCanvasPixelColor
  };
}
