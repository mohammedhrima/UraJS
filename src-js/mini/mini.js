import { TYPE } from "./types.js";
import validTags from "./validTags.js";
function loadCSS(filename) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = filename;
    document.head.appendChild(link);
}
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
function fragment(props, ...children) {
    return {
        type: TYPE.FRAGMENT,
        children: children || [],
    };
}
let index = 1;
let maps = new Map();
function initState() {
    maps.set(index, {
        state: new Map(),
        handler: () => { },
    });
    const map = maps.get(index);
    index++;
    let key = 0;
    return [
        index - 1,
        (initialValue) => {
            key++;
            map.state.set(key, initialValue);
            return [
                () => {
                    // console.log("call getter", map.state.get(key));
                    return map.state.get(key);
                },
                (newValue) => {
                    // console.log("call setter");
                    map.state.set(key, newValue);
                    if (map.handler)
                        map.handler();
                },
            ];
        },
    ];
}
function element(tag, props, ...children) {
    if (typeof tag === "function") {
        let funcTag = tag(props || {});
        // console.log("function", funcTag);
        if (funcTag.component) {
            // console.log("element", funcTag);
            // console.log("0>", maps);
            // console.log("1>", maps.get(funcTag.key));
            let currTag = funcTag.component();
            if (maps.get(funcTag.key))
                maps.get(funcTag.key).handler = () => {
                    destroyDOM(currTag);
                    let parent = currTag.parent;
                    currTag = funcTag.component();
                    currTag.parent = parent;
                    Mini.display(currTag, parent);
                    parent.dom.appendChild(currTag.dom);
                };
            return currTag;
        }
        else if (funcTag.type) {
            return Object.assign(Object.assign({}, funcTag), { children: check(children || []) });
        }
        else
            throw "function must return JSX";
    }
    return {
        tag: tag,
        type: TYPE.ELEMENT,
        props: props,
        children: check(children || []),
        parent: {},
        events: {},
    };
}
function get(props, ...children) {
    // console.log("get:", props);
    return {
        type: TYPE.SELECTOR,
        dom: document.querySelector(props["by"]),
        children: check(children || []),
    };
}
function destroyDOM(vdom) {
    var _a, _b;
    for (const eventType in vdom.events) {
        if (vdom.events.hasOwnProperty(eventType)) {
            const callback = vdom.events[eventType];
            vdom.dom.removeEventListener(eventType, callback);
        }
        vdom.events = {};
    }
    (_a = vdom.dom) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = vdom.children) === null || _b === void 0 ? void 0 : _b.map(destroyDOM);
}
function isvalid(tag) {
    if (!(tag in validTags)) {
        console.warn(`Invalid tag '${tag}',if it's a function, first character should be uppercase`);
        return false;
    }
    return true;
}
function display(vdom, parent = null) {
    var _a, _b, _c;
    // console.log("display:", vdom);
    switch (vdom.type) {
        case TYPE.ELEMENT: {
            let { tag, props } = vdom;
            if (!isvalid(tag))
                throw `Invalid tag ${tag}`;
            vdom.dom = document.createElement(vdom.tag);
            const style = {};
            Object.keys(props || {}).forEach((key) => {
                if (validTags[tag].includes(key)) {
                    if (key.startsWith("on")) {
                        const eventType = key.slice(2).toLowerCase();
                        vdom.dom.addEventListener(eventType, props[key]);
                        vdom.events[eventType] = vdom.props[key];
                    }
                    else if (key === "style")
                        Object.assign(style, props[key]);
                    else {
                        vdom.dom.setAttribute(key, props[key]);
                    }
                }
                else
                    console.warn(`Invalid attribute "${key}" ignored.`);
            });
            if (Object.keys(style).length > 0) {
                vdom.dom.style.cssText = Object.keys(style)
                    .map((styleProp) => {
                    const Camelkey = styleProp.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
                    return Camelkey + ":" + style[styleProp];
                })
                    .join(";");
            }
            (_a = vdom.children) === null || _a === void 0 ? void 0 : _a.map((child) => {
                display(child);
                //@ts-ignore
                if (child.dom)
                    vdom.dom.appendChild(child.dom);
                //@ts-ignore
                child.parent = vdom;
            });
            break;
        }
        case TYPE.SELECTOR: {
            // console.log("type selector:", vdom);
            (_b = vdom.children) === null || _b === void 0 ? void 0 : _b.map((child) => {
                display(child, vdom);
                //@ts-ignore
                if (child.dom)
                    vdom.dom.appendChild(child.dom);
                //@ts-ignore
                child.parent = vdom;
            });
            break;
        }
        case TYPE.FRAGMENT: {
            (_c = vdom.children) === null || _c === void 0 ? void 0 : _c.map((child) => {
                display(child, vdom);
                //@ts-ignore
                if (child.dom)
                    parent.dom.appendChild(child.dom);
                //@ts-ignore
                child.parent = parent;
            });
            break;
        }
        case TYPE.TEXT: {
            // console.log("type text", vdom);
            const { value } = vdom;
            // @ts-ignore
            vdom.dom = document.createTextNode(value);
            break;
        }
    }
    return vdom;
}
const Mini = {
    element,
    fragment,
    display,
    get,
    initState,
    loadCSS
};
export default Mini;
