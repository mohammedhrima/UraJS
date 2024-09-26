import Ura from "./code.js";
import { deepEqual } from "./utils.js";
export const maps = new Map();
let index = 0;
export function init() {
    // if (!maps.has(index )) {
    // }
    index++;
    maps.set(index, {
        store: new Map(),
        vdom: null,
        name: null,
        // props: null,
    });
    const curr = maps.get(index);
    console.log("call init:", index);
    curr.state = (initialValue) => {
        let key = -1;
        key++;
        if (!curr.store.has(key)) {
            curr.store.set(key, initialValue);
            console.log(curr.name, "new: call state with:", initialValue, "in pos", key, "in map", index);
            // console.log(maps);
        }
        else {
            console.error(curr.name, "has: call state with:", initialValue, "in pos", key, "in map", index);
            console.log(maps.get(index));
        }
        return [
            () => curr.store.get(key),
            (newValue) => {
                console.log(curr.name, "set state with:", newValue, "in pos", key, "in map:", index);
                if (!deepEqual(newValue, curr.store.get(key))) {
                    curr.store.set(key, newValue);
                    // console.log("helloooo", curr.store);
                    if (curr.vdom) {
                        let new_vdom = curr.render();
                        // @ts-ignore
                        Ura.reconciliate(curr.vdom, new_vdom);
                    }
                    else {
                        console.error("Render function is not defined.");
                    }
                }
                else {
                    console.error("return nothing");
                }
            },
        ];
    };
    // Return object with state and render
    return {
        state: curr.state,
        render: (newRender, name) => {
            curr.render = newRender;
            curr.name = name;
            // curr.props = props;
            // if (curr.vdom) console.error("already has vdom");
            //@ts-ignore
            curr.vdom = newRender();
            // console.log("first rendering", curr.vdom);
            // curr.vdom.isfunc = true;
            return curr.vdom;
        },
    };
}
