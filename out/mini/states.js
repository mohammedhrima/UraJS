// STATES
export const maps = new Map();
let index = 1;
export function initState() {
    maps.set(index, {
        state: new Map(),
        handler: () => { },
    });
    const map = maps.get(index);
    index++;
    let key = 1;
    return [
        index - 1,
        (initialValue) => {
            key++;
            map.state.set(key, initialValue);
            return [
                () => {
                    return map.state.get(key);
                },
                (newValue) => {
                    map.state.set(key, newValue);
                    if (map.handler)
                        map.handler();
                },
            ];
        },
    ];
}
