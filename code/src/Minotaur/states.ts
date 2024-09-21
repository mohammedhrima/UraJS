// STATES
type StateMap<T> = Map<number, T>;
type Handler = () => void;

interface StateEntry<T> {
  state: StateMap<T>;
  handler: Handler;
}

export const maps = new Map<number, StateEntry<any>>();
let index = 1;

export function initState(): [
  number,
  <T>(initialValue: T) => [() => T | undefined, (newValue: T) => void]
] {
  maps.set(index, {
    state: new Map<number, any>(),
    handler: () => {},
  });

  const map = maps.get(index)!; // Access the state map for the current index
  index++;

  return [
    index - 1,
    <T>(initialValue: T) => {
      const key = map.state.size + 1;
      map.state.set(key, initialValue);

      return [
        (): T | undefined => map.state.get(key),
        (newValue: T) => {
          map.state.set(key, newValue);
          if (map.handler) map.handler();
        },
      ];
    },
  ];
}
