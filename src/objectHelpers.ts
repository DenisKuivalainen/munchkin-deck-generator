export const _Object = {
  keys: <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[],
  values: <T extends object>(obj: T) => Object.values(obj) as T[keyof T][],
  entries: <T extends object>(obj: T) =>
    Object.entries(obj) as [keyof T, T[keyof T]][],
  fromEntries: <K extends string | number | symbol, V>(arr: [K, V][]) =>
    Object.fromEntries(arr) as Record<K, V>,
};
