import { StateMap } from "./types.js";
import { deepEqual } from "./utils.js";

export const maps = new Map<number, StateMap>();
let index = 1;

export function initState() {
  maps.set(index, {
    state: new Map<number, any>(),
    handler: () => {},
  });

  const map = maps.get(index)!;
  index++;

  return [
    index - 1,
    (initialValue) => {
      const key = map.state.size + 1;
      map.state.set(key, initialValue);

      return [
        () => map.state.get(key),
        (newValue) => {
          if (!deepEqual(newValue, map.state.get(key))) {
            map.state.set(key, newValue);
            if (map.handler) map.handler();
          }
        },
      ];
    },
  ];
}
