import { StateMap } from "./types.js";

// STATES
export const maps = new Map<number, StateMap>();

let index = 1;
export function initState<T>() {
  maps.set(index, {
    state: new Map<number, any>(),
    handler: () => {},
  });
  const map = maps.get(index);
  index++;
  let key = 1;
  return [
    index - 1,
    <T>(initialValue: T) => {
      key++;
      map.state.set(key, initialValue);

      return [
        (): T => {
          return map.state.get(key) as T;
        },
        (newValue: T) => {
          map.state.set(key, newValue);
          if (map.handler) map.handler();
        },
      ] as [() => T, (newValue: T) => void];
    },
  ] as [number, <T>(value: T) => [() => T, (newValue: T) => void]];
}
