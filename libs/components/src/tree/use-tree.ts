export function useTree() {
  // default level is 1, if there's a parent, increment its level
  function getCurrentLevel(level: number | undefined) {
    if (!level) {
      return 1;
    }

    return level;
  }

  return {
    getCurrentLevel
  };
}
