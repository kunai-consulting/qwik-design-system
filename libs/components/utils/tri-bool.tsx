export type TriBool = boolean | "indeterminate";
export function getTriBool(boolArr: boolean[]): TriBool {
  if (boolArr.length === 0) {
    return "indeterminate";
  }
  if (boolArr.every((e) => e === true)) {
    return true;
  }

  if (boolArr.every((e) => e === false)) {
    return false;
  }

  return "indeterminate";
}
