import send_HTTP_Request from "./http.js";
import { maps, initState } from "./states.js";
import validTags from "./validTags.js";
import { loadCSS } from "./utils.js";
const ELEMENT = 1;
const FRAGMENT = 2;
const TEXT = 3;
const KEEP = 4;
const INSERT = 5;
const REPLACE = 6;
const REMOVE = 7;
const UPDATE = 11;
const INSERT_PROP = 8;
const REPLACE_PROP = 9;
const REMOVE_PROP = 10;
// JSX HANDLING
let vdom_index = 0;
function check(children) {
    //@ts-ignore
    return children.map((child) => {
        if (child == null || typeof child === "string" || typeof child === "number") {
            return {
                type: TEXT,
                index: vdom_index++,
                value: child,
                events: {},
            };
        }
        return child;
    });
}
function fragment(props, ...children) {
    return {
        type: FRAGMENT,
        index: vdom_index++,
        children: check(children || []),
    };
}
function element(tag, props, ...children) {
    if (typeof tag === "function") {
        let funcTag = tag(props || {});
        if (funcTag.render) {
            if (funcTag.key && maps.get(funcTag.key)) {
                // console.log("element is a function");
                // currTag = funcTag.render();
                // currTag.key = funcTag.key;
                // currTag.render = funcTag.render;
                return {
                    ...funcTag.render(),
                    key: funcTag.key,
                    render: funcTag.render,
                };
            }
            return funcTag;
        }
        else if (funcTag.type) {
            return {
                ...funcTag,
                index: vdom_index++,
                children: check(children || []),
            };
        }
        else
            throw `function ${tag} must return JSX`;
    }
    return {
        index: vdom_index++,
        tag: tag,
        type: ELEMENT,
        props: props,
        children: check(children || []),
        events: {},
    };
}
const Routes = {};
Routes["*"] = Error;
let root = null;
function normalizePath(path) {
    if (!path || path == "")
        return "/";
    // console.log(typeof path);
    path = path.replace(/^\s+|\s+$/gm, "");
    if (!path.startsWith("/"))
        path = "/" + path;
    path = path.replace(/\/{2,}/g, "/");
    if (path.length > 1 && path.endsWith("/"))
        path = path.slice(0, -1);
    return path;
}
function refresh() {
    let hash = window.location.hash.slice(1) || "/";
    hash = normalizePath(hash);
    /*
    | TODO:
    | in case '*' check if it's error Component
    | if so give it the path as parameter
    */
    const RouteConfig = Routes[hash] || Routes["*"];
    /*
    | I did <RoutConfig/> because
    | I need the key attribute
    */
    display(Mino.element(RouteConfig, null));
    console.log(root);
}
const navigate = (route, params = {}) => {
    // console.log("call navigate");
    route = route.split("?")[0];
    route = normalizePath(route);
    window.history.pushState({}, "", `#${route}`);
    const RouteConfig = Routes[route] || Routes["*"];
    //@ts-ignore
    display(Mino.element(RouteConfig, null));
    console.log(root);
};
function setProps(vdom, parent) {
    const { tag, props } = vdom;
    const style = {};
    Object.keys(props || {}).forEach((key) => {
        if (key.startsWith("on")) {
            const eventType = key.slice(2).toLowerCase();
            vdom.dom.addEventListener(eventType, props[key]);
            vdom.events[eventType] = vdom.props[key];
        }
        else if (key === "style")
            Object.assign(style, props[key]);
        else {
            if (tag == "svg" || parent?.tag == "svg")
                vdom.dom.setAttribute(key, props[key]);
            else
                vdom.dom[key] = props[key];
        }
    });
    if (Object.keys(style).length > 0) {
        vdom.dom.style.cssText = Object.keys(style)
            .map((styleProp) => {
            const Camelkey = styleProp.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
            return Camelkey + ":" + style[styleProp];
        })
            .join(";");
    }
}
function isSpecialVDOM(tag) {
    return tag == "root" || tag == "if" || tag == "loop";
}
function destroyDOM(vdom) {
    if (!isSpecialVDOM(vdom.tag)) {
        for (const eventType in vdom.events) {
            if (vdom.events.hasOwnProperty(eventType)) {
                const callback = vdom.events[eventType];
                vdom.dom.removeEventListener(eventType, callback);
            }
            vdom.events = {};
        }
        console.log(vdom);
        vdom.dom?.remove();
        vdom.dom = null;
    }
    vdom.children?.map(destroyDOM);
}
function createDOM(vdom) {
    switch (vdom.type) {
        case ELEMENT: {
            switch (vdom.tag) {
                case "loop":
                case "if":
                    vdom.dom = document.createDocumentFragment();
                    break;
                case "root":
                    if (root)
                        destroyDOM(root);
                    vdom.dom = document.getElementById("root");
                    root = vdom;
                    break;
                default:
                    if (vdom.dom) {
                        console.log("element already has dom");
                        vdom.dom.replaceWith(document.createElement(vdom.tag));
                    }
                    else
                        vdom.dom = document.createElement(vdom.tag);
                    break;
            }
            break;
        }
        case FRAGMENT: {
            vdom.dom = document.createDocumentFragment();
            break;
        }
        case TEXT: {
            vdom.dom = document.createTextNode(vdom.value);
            break;
        }
        default:
            break;
    }
}
function appendChildrenDOM(vdom) {
    vdom.children?.map((child) => {
        //@ts-ignore
        display(child, vdom);
        //@ts-ignore
        if (child.dom)
            vdom.dom.appendChild(child.dom);
        else {
            // console.log(typeof child);
            // console.log(child);
            vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
        }
    });
}
function reconciliate(left, right) {
    // Handle case where the tag or type is different
    if (left.tag !== right.tag || left.type !== right.type) {
        return {
            action: REPLACE,
            left: left,
            right: right,
        };
    }
    if (left.type === TEXT && left.value !== right.value) {
        return {
            action: REPLACE,
            left: left,
            right: right,
        };
    }
    // Compare props
    let propChanges = reconciliateProps(left.props, right.props, left.index);
    const children1 = left.children || [];
    const children2 = right.children || [];
    let subs = [];
    // Reconciliate children
    for (let i = 0; i < Math.max(children1.length, children2.length); i++) {
        const child1 = children1[i];
        const child2 = children2[i];
        if (child1 && child2) {
            let diff = reconciliate(child1, child2);
            if (diff.action != KEEP)
                subs.push(diff);
        }
        else if (child1 && !child2) {
            subs.push({
                action: REMOVE,
                left: child1,
            });
        }
        else if (!child1 && child2) {
            subs.push({
                action: INSERT,
                right: child2,
            });
        }
    }
    // Return the result, including prop changes and children reconciliation
    return {
        left: left,
        action: subs.length || propChanges.length ? UPDATE : KEEP,
        subs: subs,
        propChanges: propChanges, // Track any prop changes
    };
}
function deepEqual(a, b) {
    if (a === b)
        return true; // Check for strict equality for primitive types
    if (typeof a !== typeof b)
        return false;
    // If comparing functions, compare their string representations
    if (typeof a === "function" && typeof b === "function") {
        return a.toString() === b.toString();
    }
    // For objects or arrays, we perform a deep comparison
    if (typeof a === "object" && typeof b === "object") {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length)
            return false; // Different number of keys
        for (let key of keysA) {
            if (!keysB.includes(key) || !deepEqual(a[key], b[key]))
                return false;
        }
        return true;
    }
    return false; // Otherwise, not equal
}
// Function to compare props and log differences
function reconciliateProps(oldProps = {}, newProps = {}, index) {
    let propChanges = [];
    // Check for props that need to be removed or changed
    for (let key in oldProps) {
        if (!(key in newProps)) {
            // console.log(`Remove prop '${key}' from element with index ${index}`);
            propChanges.push({
                action: REMOVE_PROP,
                key: key,
            });
        }
        else if (!deepEqual(oldProps[key], newProps[key])) {
            // console.log(
            //   `Change prop '${key}' from '${oldProps[key]}' to '${newProps[key]}' for element with index ${index}`
            // );
            propChanges.push({
                action: REPLACE_PROP,
                key: key,
                oldValue: oldProps[key],
                newValue: newProps[key],
            });
        }
    }
    // Check for new props that need to be added
    for (let key in newProps) {
        if (!(key in oldProps)) {
            // console.log(
            //   `Add prop '${key}' with value '${newProps[key]}' to element with index ${index}`
            // );
            propChanges.push({
                action: INSERT_PROP,
                key: key,
                value: newProps[key],
            });
        }
    }
    return propChanges;
}
// Rendering function to apply changes
function execute(rec, parent) {
    switch (rec.action) {
        case KEEP: {
            console.log(`Keep ${rec.left.index}`);
            return rec.left;
        }
        case UPDATE: {
            console.log(`Update ${rec.left.index} children`);
            // Handle prop changes
            if (rec.propChanges?.length) {
                rec.propChanges.forEach((change) => {
                    if (change.action === REMOVE_PROP) {
                        console.log(`Removing prop '${change.key}' from element ${rec.left.index}`);
                    }
                    else if (change.action === REPLACE_PROP) {
                        console.log(`Changing prop '${change.key}' from '${change.oldValue}' to '${change.newValue}' for element ${rec.left.index}`);
                    }
                    else if (change.action === INSERT_PROP) {
                        console.log(`Adding prop '${change.key}' with value '${change.value}' to element ${rec.left.index}`);
                    }
                });
            }
            // Reconcile and execute child elements
            rec.subs?.forEach((sub) => execute(sub, rec.left));
            break;
        }
        case INSERT: {
            console.log(`Insert element with index ${rec.right.index} to element with index ${parent.index}`);
            rec.subs?.forEach((sub) => execute(sub, rec.left));
            break;
        }
        case REMOVE: {
            console.log(`Remove element with index ${rec.left.index}`);
            rec.subs?.forEach((sub) => execute(sub, rec.left));
            break;
        }
        case REPLACE: {
            console.log(`Replace element with index ${rec.left.index} with element with index ${rec.right.index}`);
            rec.subs?.forEach((sub) => execute(sub, rec.left));
            break;
        }
        default:
            break;
    }
    return rec;
}
function display(vdom, parent = null) {
    createDOM(vdom);
    switch (vdom.type) {
        case ELEMENT: {
            let { tag, props } = vdom;
            switch (tag) {
                case "loop": {
                    //@ts-ignore
                    let { on } = props || {};
                    let res = !on
                        ? []
                        : on.map((elem, id) => {
                            return vdom.children.map((child) => {
                                if (typeof child == "function") {
                                    //@ts-ignore
                                    return child(elem, id);
                                }
                                else
                                    return child;
                            });
                        });
                    res.map((elem) => {
                        elem.map((child) => {
                            display(child, vdom);
                            vdom.dom.appendChild(child.dom);
                            vdom.children.push(child);
                        });
                    });
                    break;
                }
                case "root": {
                    appendChildrenDOM(vdom);
                    break;
                }
                case "if": {
                    //@ts-ignore
                    if (props?.cond)
                        appendChildrenDOM(vdom);
                    break;
                }
                case "root": {
                    let { path, call } = props;
                    path = normalizePath(path);
                    if (call)
                        Routes[path] = call;
                    vdom.children?.map((child) => {
                        // @ts-ignore
                        if (child.tag != "route")
                            throw "'route' tag can only have children of type route";
                        // @ts-ignore
                        child.props.path = normalizePath(path + "/" + child.props.path);
                        //@ts-ignore
                        display(child, parent);
                    });
                    break;
                }
                case "elif":
                case "else": {
                    console.warn(`${tag} is ignored, beacause it should be inside if tag`);
                    break;
                }
                default: {
                    //@ts-ignore
                    if (!(tag in validTags))
                        console.warn(`Invalid tag '${tag}',if it's a function, first character should be uppercase`);
                    appendChildrenDOM(vdom);
                    setProps(vdom, parent);
                    break;
                }
            }
            break;
        }
        case FRAGMENT: {
            vdom.children?.map((child) => {
                display(child, vdom);
            });
            appendChildrenDOM(vdom);
            break;
        }
        case TEXT: {
            break;
        }
        default: {
            break;
        }
    }
    if (vdom.render && vdom.key && maps.get(vdom.key)) {
        maps.get(vdom.key).handler = () => {
            console.log("found render");
            let newTag = vdom.render();
            newTag.isfunc = true;
            newTag.key = vdom.key;
            newTag.func = vdom.render;
            newTag.index = vdom.index;
            const rec = reconciliate(vdom, newTag);
            execute(rec, newTag);
            console.log("src :", vdom);
            console.log("dist:", newTag);
        };
    }
    return vdom;
}
// ROUTING
function Error(props) {
    return {
        key: null,
        render: () => {
            return element("root", {}, element("h4", {
                style: {
                    fontFamily: "sans-serif",
                    fontSize: "6vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                },
            }, "Error:", props && props["message"] ? ` Path '${props["message"]}'` : "", " Not Found"));
        },
    };
}
const Mino = {
    initState,
    display,
    element,
    fragment,
    loadCSS,
    Error,
    Routes,
    navigate,
    refresh,
    send: send_HTTP_Request,
};
export default Mino;
