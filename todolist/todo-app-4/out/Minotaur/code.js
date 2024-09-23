import { maps, initState } from "./states.js";
import * as UTILS from "./utils.js";
import { Routes, root, refresh, navigate, setRoot } from "./routing.js";
import { fragment, element } from "./jsx.js";
// TODO: check svg set attribute
function setProps(vdom) {
    const { tag, props } = vdom;
    const style = {};
    Object.keys(props || {}).forEach((key) => {
        console.log("set prop");
        if (key.startsWith("on")) {
            const eventType = key.slice(2).toLowerCase();
            vdom.dom.addEventListener(eventType, props[key]);
            vdom.events[eventType] = vdom.props[key];
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
        case UTILS.ELEMENT: {
            switch (vdom.tag) {
                case "root":
                    if (root)
                        destroyDOM(root); // to destroy children
                    vdom.dom = document.getElementById("root");
                    //@ts-ignore
                    setRoot(vdom);
                    break;
                default:
                    if (vdom.dom) {
                        console.error("element already has dom");
                        vdom.dom.replaceWith(document.createElement(vdom.tag));
                    }
                    else
                        vdom.dom = document.createElement(vdom.tag);
                    setProps(vdom);
                    break;
            }
            break;
        }
        case UTILS.FRAGMENT: {
            vdom.dom = document.createElement("fragment");
            break;
        }
        case UTILS.TEXT: {
            vdom.dom = document.createTextNode(vdom.value);
            break;
        }
        default:
            break;
    }
}
function isSpecialVDOM(vdom) {
    return (vdom.tag == "root" ||
        vdom.tag == "if" ||
        vdom.tag == "loop" ||
        vdom.type == UTILS.FRAGMENT);
}
function destroyDOM(vdom) {
    if (!isSpecialVDOM(vdom)) {
        for (const eventType in vdom.events) {
            if (vdom.events.hasOwnProperty(eventType)) {
                const callback = vdom.events[eventType];
                vdom.dom.removeEventListener(eventType, callback);
            }
            vdom.events = {};
        }
        // console.log(vdom);
        vdom.dom?.remove();
        vdom.dom = null;
    }
    vdom.children?.map(destroyDOM);
}
function appendChildrenDOM(vdom) { }
function execute(mode, prev, next = null) {
    switch (mode) {
        case UTILS.CREATE: {
            // console.warn("CREATE", prev.tag);
            createDOM(prev);
            prev.children?.map((child) => {
                execute(mode, child);
                prev.dom.appendChild(child.dom);
            });
            break;
        }
        // case UTILS.KEEP: {
        //   break;
        // }
        case UTILS.REMOVE: {
            destroyDOM(prev);
            break;
        }
        case UTILS.REPLACE: {
            // TODO: handle children
            execute(UTILS.CREATE, next); // children get appended here
            prev.dom.replaceWith(next.dom);
            prev.children?.map((child) => destroyDOM(child));
            prev.dom = next.dom;
            break;
        }
        default:
            break;
    }
    return prev;
}
function reconciliateProps(oldProps, newProps, vdom) {
    // Remove old props that are not present in newProps
    Object.keys(oldProps || {}).forEach((key) => {
        if (!(key in newProps) || !UTILS.deepEqual(oldProps[key], newProps[key])) {
            if (key.startsWith("on")) {
                const eventType = key.slice(2).toLowerCase();
                vdom.dom.removeEventListener(eventType, oldProps[key]);
                delete vdom.events[eventType];
            }
            else if (key === "style") {
                // Clear removed styles
                Object.keys(oldProps.style || {}).forEach((styleProp) => {
                    if (!newProps.style || !(styleProp in newProps.style)) {
                        vdom.dom.style[styleProp] = ""; // Reset the style
                    }
                });
            }
            else {
                if (vdom.dom[key] !== undefined) {
                    delete vdom.dom[key]; // Remove the property
                }
                else {
                    vdom.dom.removeAttribute(key); // Remove the attribute
                }
            }
        }
    });
    // Add or update props that have changed
    Object.keys(newProps || {}).forEach((key) => {
        // console.error("new-prop: ", key);
        if (!UTILS.deepEqual(oldProps[key], newProps[key])) {
            if (key.startsWith("on")) {
                const eventType = key.slice(2).toLowerCase();
                vdom.dom.addEventListener(eventType, newProps[key]);
                vdom.events[eventType] = newProps[key];
                // console.log("event", eventType, newProps[key]);
            }
            else if (key === "style") {
                Object.assign(vdom.dom.style, newProps[key]); // Apply new styles
            }
            else {
                if (vdom.tag === "svg" || vdom.dom instanceof SVGElement) {
                    vdom.dom.setAttribute(key, newProps[key]); // Use setAttribute for SVG
                }
                else {
                    vdom.dom[key] = newProps[key]; // Set properties for HTML elements
                }
            }
        }
    });
}
function reconciliate(prev, next) {
    // console.log("call reconciliate", prev, next);
    if (prev.type === UTILS.TEXT && !UTILS.deepEqual(prev.value, next.value)) {
        return execute(UTILS.REPLACE, prev, next);
    }
    if (prev.tag === next.tag) {
        reconciliateProps(prev.props, next.props, prev);
        prev.props = next.props;
    }
    else
        return execute(UTILS.REPLACE, prev, next);
    const prevs = prev.children || [];
    const nexts = next.children || [];
    for (let i = 0; i < Math.max(prevs.length, nexts.length); i++) {
        const child1 = prevs[i];
        const child2 = nexts[i];
        if (child1 && child2) {
            reconciliate(child1, child2);
        }
        else if (!child1 && child2) {
            execute(UTILS.CREATE, child2);
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
function display(vdom, parent = null) {
    console.log("display ", vdom);
    execute(UTILS.CREATE, vdom);
    if (vdom.render && vdom.key && maps.get(vdom.key)) {
        maps.get(vdom.key).handler = () => {
            // console.log("found render");
            let newTag = vdom.render();
            newTag.render = vdom.render;
            reconciliate(vdom, newTag);
            // execute(rec, newTag);
            console.log("old:", vdom);
            console.log("new:", newTag);
        };
    }
    return vdom;
}
const Mino = {
    initState,
    display,
    element,
    fragment,
    loadCSS: UTILS.loadCSS,
    Error,
    Routes,
    navigate,
    refresh,
    send: UTILS.send_HTTP_Request,
};
export default Mino;
