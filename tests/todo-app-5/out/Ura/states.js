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
            () => curr.store.get(key), // Getter function
            (newValue) => {
                if (!deepEqual(newValue, curr.store.get(key))) {
                    curr.store.set(key, newValue);
                    if (curr.vdom) {
                        //@ts-ignore
                        Mino.reconciliate(curr.vdom, curr.render()); // Trigger re-render on state change
                    }
                    else {
                        console.error("Render function is not defined.");
                    }
                }
            },
        ];
    };
    // Return object with state and render
    return {
        state: curr.state,
        render: (newRender) => {
            curr.render = newRender;
            curr.vdom = newRender();
            return curr.vdom;
        },
    };
}
