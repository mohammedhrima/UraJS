export const maps = new Map();
let index = 1;
function isEqual(value1, value2) {
    if (value1 === value2)
        return true;
    if (value1 == null || value2 == null)
        return false;
    const type1 = typeof value1;
    const type2 = typeof value2;
    if (type1 !== type2)
        return false;
    if (Array.isArray(value1) && Array.isArray(value2)) {
        if (value1.length !== value2.length)
            return false;
        for (let i = 0; i < value1.length; i++) {
            if (!isEqual(value1[i], value2[i]))
                return false;
        }
        return true;
    }
    if (type1 === "object" && type2 === "object") {
        const keys1 = Object.keys(value1);
        const keys2 = Object.keys(value2);
        if (keys1.length !== keys2.length)
            return false;
        for (const key of keys1) {
            if (!keys2.includes(key) || !isEqual(value1[key], value2[key]))
                return false;
        }
        return true;
    }
    return false;
}
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
                    if (!isEqual(newValue, map.state.get(key))) {
                        map.state.set(key, newValue);
                        if (map.handler) {
                            // console.log("render");
                            map.handler();
                        }
                    }
                    // if (newValue != map.state.get(key)) {
                    // }
                },
            ];
        },
    ];
}
