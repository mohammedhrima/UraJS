import Mino from "./code.js";
import { deepEqual } from "./utils.js";
export const maps = new Map();
let index = 1;
export function init() {
    maps.set(index, {
        store: new Map(),
        vdom: null,
    });
    const curr = maps.get(index);
    curr.state = (initialValue) => {
        const key = curr.store.size + 1;
        curr.store.set(key, initialValue);
        return [
            () => curr.store.get(key),
            (newValue) => {
                if (!deepEqual(newValue, curr.store.get(key))) {
                    curr.store.set(key, newValue);
                    if (curr.vdom) {
                        //@ts-ignore
                        Mino.reconciliate(curr.vdom, curr.render());
                    }
                    else {
                        console.error("Render function is not defined.");
                    }
                }
            },
        ];
    };
    index++;
    return curr;
}
