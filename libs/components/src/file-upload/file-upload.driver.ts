import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-file-upload-root]");
  };

  const getDropzone = () => {
    return rootLocator.locator("[data-file-upload-dropzone]");
  };

  const getInput = () => {
    return rootLocator.locator("[data-file-upload-input]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-file-upload-trigger]");
  };

  const isDragging = async () => {
    const dropzone = getDropzone();
    return (await dropzone.getAttribute("data-dragging")) !== null;
  };

  const isDisabled = async () => {
    const root = getRoot();
    return (await root.getAttribute("data-disabled")) !== null;
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getDropzone,
    getInput,
    getTrigger,
    isDragging,
    isDisabled
  };
}
