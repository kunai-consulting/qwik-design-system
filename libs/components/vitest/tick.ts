export function nextTick(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      queueMicrotask(resolve);
    });
  });
}
