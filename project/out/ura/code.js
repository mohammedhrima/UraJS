import * as UTILS from "./utils.js";
const { ELEMENT, FRAGMENT, TEXT, CREATE, REMOVE, REPLACE, deepEqual, loadCSS } = UTILS;
// JSX
function check(children) {
    //@ts-ignore
    return children.map((child) => {
        if (child == null || typeof child === "string" || typeof child === "number") {
            return {
                type: TEXT,
                value: child,
            };
        }
        return child;
    });
}
function check2(child) {
    if (child == null || typeof child === "string" || typeof child === "number") {
        return {
            type: TEXT,
            value: child,
        };
    }
    return child;
}
function fragment(props, ...children) {
    console.log("call fragment", children);
    return {
        type: FRAGMENT,
        children: (children || []).map(check2)
    };
}
function element(tag, props, ...children) {
    if (typeof tag === "function") {
        let funcTag = tag(props || {});
        console.log("return", funcTag);
        if (funcTag.type === FRAGMENT) {
            console.log("hey", props);
            // funcTag.props = props;
            // funcTag.children = check(children || []);
            // funcTag = {
            //   ...funcTag,
            //   children: check(children || []),
            // };
            // console.log("func is frag:", funcTag, "children", children);
        }
        return funcTag;
    }
    if (tag === "if") {
        return {
            type: FRAGMENT,
            children: check(props?.cond && children ? children : []),
        };
    }
    else if (tag === "loop") {
        let res = (props.on || []).flatMap((elem, id) => 
        // @ts-ignore
        (children || []).map((child) => typeof child === "function" ? child(elem, id) : child));
        return {
            type: FRAGMENT,
            children: check(res || []),
        };
    }
    return {
        tag: tag,
        type: ELEMENT,
        props: props,
        children: (children || []).map(check2)
    };
}
// DOM
function setProps(vdom) {
    const { tag, props } = vdom;
    const style = {};
    Object.keys(props || {}).forEach((key) => {
        // console.log("set prop");
        if (key == "class")
            console.warn("Invalid property 'class' did you mean 'className' ?");
        else if (key.startsWith("on")) {
            const eventType = key.slice(2).toLowerCase();
            vdom.dom.addEventListener(eventType, props[key]);
        }
        else if (key === "style")
            Object.assign(style, props[key]);
        else {
            if (tag == "svg" || vdom.dom instanceof SVGElement /*|| parent?.tag == "svg"*/)
                vdom.dom.setAttribute(key, props[key]);
            else
                vdom.dom[key] = props[key];
        }
    });
    if (Object.keys(style).length > 0) {
        vdom.dom.style.cssText = Object.keys(style)
            .map((styleProp) => {
            const Camelkey = styleProp.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
            return `${Camelkey}:${style[styleProp]}`;
        })
            .join(";");
    }
}
function createDOM(vdom) {
    switch (vdom.type) {
        case ELEMENT: {
            switch (vdom.tag) {
                case "root":
                    vdom.dom = document.getElementById("root");
                    break;
                default:
                    if (vdom.dom)
                        console.error("element already has dom"); // TODO: to be removed
                    vdom.dom = document.createElement(vdom.tag);
                    break;
            }
            setProps(vdom);
            break;
        }
        case FRAGMENT: {
            console.log("createDOM: found fragment", vdom);
            if (vdom.dom)
                console.error("fragment already has dom"); // TODO: to be removed
            vdom.dom = document.createElement("span");
            break;
        }
        case TEXT: {
            vdom.dom = document.createTextNode(vdom.value);
            break;
        }
        default:
            break;
    }
    return vdom;
}
// RENDERING
function execute(mode, prev, next = null) {
    switch (mode) {
        case CREATE: {
            createDOM(prev);
            prev.children?.map(child => {
                execute(mode, child);
                prev.dom.appendChild(child.dom);
            });
            break;
        }
        case REPLACE: {
            execute(CREATE, next);
            prev.dom.replaceWith(next.dom);
            prev.dom = next.dom;
            break;
        }
        default:
            break;
    }
}
function display(vdom) {
    console.log("display ", vdom);
    execute(CREATE, vdom);
}
// RECONCILIATION
function reconciliateProps(oldProps, newProps, vdom) {
    let diff = false;
    // Remove old props that are not present in newProps
    Object.keys(oldProps || {}).forEach((key) => {
        if (!(key in newProps) || !UTILS.deepEqual(oldProps[key], newProps[key])) {
            diff = true;
            if (key.startsWith("on")) {
                const eventType = key.slice(2).toLowerCase();
                vdom.dom.removeEventListener(eventType, oldProps[key]);
            }
            else if (key === "style") {
                Object.keys(oldProps.style || {}).forEach((styleProp) => {
                    vdom.dom.style[styleProp] = "";
                });
            }
            else {
                if (vdom.dom[key] !== undefined)
                    delete vdom.dom[key];
                else
                    vdom.dom.removeAttribute(key);
            }
        }
    });
    // Add or update props that have changed
    Object.keys(newProps || {}).forEach((key) => {
        if (!UTILS.deepEqual(oldProps[key], newProps[key])) {
            diff = true;
            if (key.startsWith("on")) {
                const eventType = key.slice(2).toLowerCase();
                vdom.dom.addEventListener(eventType, newProps[key]);
            }
            else if (key === "style")
                Object.assign(vdom.dom.style, newProps[key]);
            else {
                if (vdom.tag === "svg" || vdom.dom instanceof SVGElement) {
                    vdom.dom.setAttribute(key, newProps[key]); // Use setAttribute for SVG
                }
                else {
                    vdom.dom[key] = newProps[key];
                }
            }
        }
    });
    return diff;
}
function reconciliate(prev, next) {
    if (prev.type != next.type || (prev.type == TEXT && !deepEqual(prev.value, next.value)))
        return execute(REPLACE, prev, next);
    if (prev.tag === next.tag) {
        reconciliateProps(prev.props, next.props, prev);
        prev.props = next.props;
    }
    else
        return execute(UTILS.REPLACE, prev, next);
    const prevs = prev.children || [];
    const nexts = next.children || [];
    for (let i = 0; i < Math.max(prevs.length, nexts.length); i++) {
        let child1 = prevs[i];
        let child2 = nexts[i];
        if (child1 && child2) {
            reconciliate(child1, child2);
        }
        else if (!child1 && child2) {
            execute(CREATE, child2);
            prevs.push(child2);
            prev.dom.appendChild(child2.dom);
        }
        else if (child1 && !child2) {
            execute(UTILS.REMOVE, child1);
            prevs.splice(i, 1);
            i--;
        }
    }
}
// STATES
const States = new Map();
let pos = 0;
function init() {
    pos++;
    States.set(pos, {
        store: new Map(),
        vdom: null,
        state: null,
        JSXfunc: null
    });
    const curr = States.get(pos);
    console.log("call init", pos);
    curr.state = (value) => {
        let key = 0;
        key++;
        console.log("call state", value);
        if (!curr.store.has(key)) {
            curr.store.set(key, value);
            console.log("init", value, "key:", key, "pos:", pos);
        }
        return [
            () => curr.store.get(key),
            (value) => {
                if (!deepEqual(value, curr.store.get(key))) {
                    curr.store.set(key, value);
                    reconciliate(curr.vdom, curr.JSXfunc());
                }
                console.log("new value", value);
            }
        ];
    };
    return [curr.state, (JSXfunc) => {
            console.log("call from state");
            curr.JSXfunc = JSXfunc;
            curr.vdom = JSXfunc();
            return curr.vdom;
        }];
}
// ROUTING
// WEBSOCKET
function sync() {
    const ws = new WebSocket(`ws://${window.location.host}`);
    console.log(window.location.host);
    ws.onmessage = (event) => {
        if (event.data === "reload")
            window.location.reload();
    };
    ws.onopen = () => {
        console.log("WebSocket connection established");
    };
    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
    ws.onclose = () => {
        console.log("WebSocket connection closed");
    };
}
const Ura = {
    element,
    fragment,
    display,
    sync,
    loadCSS,
    init
};
export default Ura;
