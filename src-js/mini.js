import validTags from "./validTags.js";
var TYPE;
(function (TYPE) {
    TYPE[TYPE["ELEMENT"] = 1] = "ELEMENT";
    TYPE[TYPE["FRAGMENT"] = 2] = "FRAGMENT";
    TYPE[TYPE["TEXT"] = 3] = "TEXT";
    TYPE[TYPE["SELECTOR"] = 4] = "SELECTOR";
    TYPE[TYPE["STATE"] = 5] = "STATE";
    TYPE[TYPE["FUNCTION"] = 6] = "FUNCTION";
})(TYPE || (TYPE = {}));
class State {
    constructor() {
        this.map = new Map();
        this.render = null;
    }
    setRender(func) {
        this.render = func;
    }
    setItem(key, value) {
        console.log("set item", key, value);
        this.map.set(key, value);
        if (this.render)
            this.render();
    }
    getItem(key) {
        const value = this.map.get(key);
        if (value === undefined)
            throw `State ${key} not found`;
        return value;
    }
    removeItem(key) {
        this.map.delete(key);
    }
    clear() {
        this.map.clear();
    }
}
let state = [];
let index = 0;
const watchedArray = createArrayWatcher(state, (index, oldValue, newValue) => {
    console.log(`Array element at index ${index} changed from ${oldValue} to ${newValue}`);
    // Only update state array, Proxy will handle watchedArray
    state[index] = newValue;
    // console.log("Updated state: ", state);
    // console.log("Watched array: ", watchedArray);
});
function logState() {
    console.log(">", state);
    console.log(">", watchedArray);
}
const handlers = [];
function useState(initialState) {
    // Freeze the index to maintain state
    const localIndex = index;
    // Initialize if value at the current index is not set
    if (typeof watchedArray[localIndex] === "undefined") {
        watchedArray[localIndex] = initialState;
    }
    index++;
    // Return the state value and setter function
    return [
        localIndex,
        () => watchedArray[localIndex],
        (newState) => {
            watchedArray[localIndex] = newState;
            if (handlers[localIndex])
                handlers[localIndex]();
        },
    ];
}
function createArrayWatcher(array, onChange) {
    return new Proxy(array, {
        set(target, property, value) {
            const oldValue = target[property];
            const result = Reflect.set(target, property, value);
            // Only trigger change if the value actually changed
            if (oldValue !== value) {
                onChange(property, oldValue, value);
            }
            return result;
        },
    });
}
// function check(child: VDOM): VDOM {
//   if (child === null) throw "check found NULL";
//   if (typeof child === "string" || typeof child === "number") {
//     return {
//       type: TYPE.TEXT,
//       value: child,
//       events: {},
//     };
//   }
//   return child;
// }
function check(children) {
    let i = 0;
    return children.map((child) => {
        if (child === null)
            throw "check found NULL";
        if (typeof child === "string" || typeof child === "number") {
            return {
                type: TYPE.TEXT,
                index: i,
                value: child,
                events: {},
            };
        }
        else {
            child.index = i;
            return child;
        }
        i++;
    });
}
function Element(tag, props, ...children) {
    if (typeof tag === "function") {
        let funcTag = tag(props || {});
        if (funcTag && funcTag.length == 0) {
            return {
                type: TYPE.FRAGMENT,
                props: props,
                children: check(children || []),
                parent: {},
                events: {},
                func: tag,
            };
        }
        else if (funcTag && funcTag.type == TYPE.SELECTOR) {
            return funcTag;
        }
        else if (funcTag) {
            let tmp = tag;
            tag = funcTag.tag;
            props = funcTag.props;
            children = funcTag.children;
            let elem = Element(tag, props, ...children);
            elem.func = tmp;
            return elem;
        }
        throw "Element: function tag must return JSX component";
        // return {
        //   type: TYPE.FUNCTION,
        //   events: {},
        //   func: tag,
        //   children: check(children || []),
        // };
    }
    return {
        tag: tag,
        type: tag == "get" ? TYPE.SELECTOR : tag == "state" ? TYPE.STATE : TYPE.ELEMENT,
        props: props,
        children: check(children || []),
        parent: {},
        events: {},
    };
}
function Fragment(props, ...children) {
    return children || [];
}
function destroyDOM(vdom) {
    // console.log("destroy", vdom);
    if (vdom.element && vdom.events) {
        for (const eventType in vdom.events) {
            if (vdom.events.hasOwnProperty(eventType)) {
                const callback = vdom.events[eventType];
                vdom.element.removeEventListener(eventType, callback);
            }
        }
        vdom.events = {};
    }
    if (vdom.element)
        vdom.element.remove();
    switch (vdom.type) {
        case TYPE.TEXT: {
            if (!vdom.element)
                throw "Can only destroy DOM nodes that have been mounted";
            vdom.element.remove();
            break;
        }
        case TYPE.SELECTOR:
        case TYPE.ELEMENT: {
            if (!vdom.element)
                throw "Can only destroy DOM nodes that have been mounted";
            vdom.children.map(destroyDOM);
            vdom.element.remove();
            break;
        }
        case TYPE.STATE:
        case TYPE.FRAGMENT: {
            vdom.children.map(destroyDOM);
            break;
        }
        default: {
            break;
        }
    }
}
function insertAtIndex(parent, elem, index) {
    const child = parent.children[index];
    if (child)
        parent.insertBefore(elem, child);
    else
        parent.appendChild(elem);
}
function mountDOM(vdom, parent) {
    vdom.parent = parent;
    switch (vdom.type) {
        case TYPE.ELEMENT: {
            const { tag, props, parent } = vdom;
            if (!(tag in validTags)) {
                console.warn(`Invalid tag '${tag}',\n` +
                    `if it's a function, first character should be uppercase`);
                return;
            }
            vdom.element = document.createElement(tag);
            const style = {};
            Object.keys(props || {}).forEach((key) => {
                if (validTags[vdom === null || vdom === void 0 ? void 0 : vdom.tag].includes(key)) {
                    if (key.startsWith("on")) {
                        const eventType = key.slice(2).toLowerCase();
                        vdom.element.addEventListener(eventType, props[key]);
                        vdom.events[eventType] = vdom.props[key];
                    }
                    else if (key === "style")
                        Object.assign(style, props[key]);
                    else {
                        vdom.element.setAttribute(key, props[key]);
                    }
                }
                else
                    console.warn(`Invalid attribute "${key}" ignored.`);
            });
            if (Object.keys(style).length > 0) {
                vdom.element.style.cssText = Object.keys(style)
                    .map((styleProp) => {
                    const Camelkey = styleProp.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
                    return Camelkey + ":" + style[styleProp];
                })
                    .join(";");
            }
            // insertAtIndex(parentDOM, vdom.element, vdom.index);
            parent.element.appendChild(vdom.element);
            vdom.children.forEach((child) => {
                // @ts-ignore
                mountDOM(child, vdom);
            });
            break;
        }
        case TYPE.FUNCTION: {
            console.log("found function");
            vdom = vdom.func();
            mountDOM(vdom, parent);
            break;
        }
        case TYPE.FRAGMENT: {
            console.log(vdom);
            vdom.children.forEach((child) => {
                // @ts-ignore
                mountDOM(child, parent);
            });
            break;
        }
        case TYPE.SELECTOR: {
            console.log("mount selector");
            console.log(vdom);
            vdom.element = document.querySelector(vdom.props["find"]);
            vdom.children.forEach((child) => {
                // @ts-ignore
                mountDOM(child, vdom);
            });
            break;
        }
        case TYPE.STATE: {
            console.log("mount state", vdom);
            console.log("watch ", vdom.props["watch"]);
            handlers[vdom.props["watch"]] = () => {
                destroyDOM(vdom);
                console.log(vdom);
                let i = 0;
                vdom.children.forEach((child) => {
                    console.log("destroy child", child);
                    // @ts-ignore
                    destroyDOM(child);
                    // @ts-ignore
                    if (child.func) {
                        // @ts-ignore
                        let f = child.func;
                        // @ts-ignore
                        child = child.func();
                        //@ts-ignore
                        child.func = f;
                    }
                    vdom.children[i] = child;
                    // @ts-ignore
                    mountDOM(child, vdom.parent);
                    i++;
                });
            };
            vdom.children.forEach((child) => {
                // @ts-ignore
                mountDOM(child, parent);
            });
            break;
        }
        case TYPE.TEXT: {
            const { value } = vdom;
            // @ts-ignore
            vdom.element = document.createTextNode(value);
            parent.element.append(vdom.element);
            break;
        }
        default:
            break;
    }
    return vdom;
}
// function render(viewfunc: any): any {
//   let vdom: VDOM = null;
//   let view: any = viewfunc;
//   function renderApp(parentDOM: HTMLElement) {
//     if (vdom) destroyDOM(vdom);
//     vdom = view;
//     vdom.parent.element = parentDOM;
//     mountDOM(vdom, vdom.parent.element);
//     console.log(vdom);
//   }
//   return {
//     mount(parentDOM: HTMLElement) {
//       renderApp(parentDOM);
//       return vdom;
//     },
//     unmount() {
//       destroyDOM(vdom);
//       vdom = null;
//     },
//   };
// }
function display(viewfunc) {
    let vdom = viewfunc;
    return {
        mount() {
            mountDOM(vdom, vdom.parent);
            return vdom;
        },
        unmount() {
            destroyDOM(vdom);
            vdom = null;
        },
    };
}
const Mini = {
    Element,
    Fragment,
    // render,
    State,
    useState,
    display,
    logState,
};
export default Mini;
