export const maps = new Map();
let index = 1;
export function initState() {
    maps.set(index, {
        state: new Map(),
        handler: () => { },
    });
    const map = maps.get(index); // Access the state map for the current index
    index++;
    return [
        index - 1,
        (initialValue) => {
            const key = map.state.size + 1;
            map.state.set(key, initialValue);
            return [
                () => map.state.get(key),
                (newValue) => {
                    map.state.set(key, newValue);
                    if (map.handler)
                        map.handler();
                },
            ];
        },
    ];
}
