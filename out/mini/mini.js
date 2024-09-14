import { maps, initState } from "./states.js";
import { TYPE } from "./types.js";
import validTags from "./validTags.js";
// UTILS
function loadCSS(filename) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = filename;
    document.head.appendChild(link);
}
// JSX HANDLING
function check(children) {
    // console.log(children);
    let i = 0;
    //@ts-ignore
    return children.map((child) => {
        if (child == null || typeof child === "string" || typeof child === "number") {
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
        children: check(children || []),
    };
}
function element(tag, props, ...children) {
    if (typeof tag === "function") {
        let funcTag = tag(props || {});
        if (funcTag.render) {
            let currTag = funcTag.render();
            if (funcTag.key && maps.get(funcTag.key)) {
                maps.get(funcTag.key).handler = () => {
                    destroyDOM(currTag);
                    let parent = currTag.parent;
                    currTag = funcTag.render();
                    currTag.parent = parent;
                    Mini.display(currTag, parent);
                    // parent.dom.appendChild(currTag.dom);
                };
            }
            return currTag;
        }
        else if (funcTag.type) {
            return {
                ...funcTag,
                children: check(children || []),
            };
        }
        else
            throw `function ${tag} must return JSX`;
    }
    return {
        tag: tag,
        type: TYPE.ELEMENT,
        props: props,
        children: check(children || []),
        events: {},
    };
}
function destroyDOM(vdom) {
    // console.log("destroy", vdom);
    if (vdom.tag != "get") {
        for (const eventType in vdom.events) {
            if (vdom.events.hasOwnProperty(eventType)) {
                const callback = vdom.events[eventType];
                vdom.dom.removeEventListener(eventType, callback);
            }
            vdom.events = {};
        }
        vdom.dom?.remove();
    }
    vdom.children?.map(destroyDOM);
}
function isvalid(tag) {
    if (!(tag in validTags)) {
        console.warn(`Invalid tag '${tag}',if it's a function, first character should be uppercase`);
        return false;
    }
    return true;
}
const Routes = {};
Routes["*"] = Error;
let currentRoute = null;
const normalizePath = (path) => {
    if (!path || path == "")
        return "/";
    console.log(typeof path);
    path = path.replace(/^\s+|\s+$/gm, "");
    if (!path.startsWith("/"))
        path = "/" + path;
    path = path.replace(/\/{2,}/g, "/");
    if (path.length > 1 && path.endsWith("/"))
        path = path.slice(0, -1);
    return path;
};
const refresh = () => {
    // Get the hash part of the URL and remove the leading '#'
    let hash = window.location.hash.slice(1) || "/";
    hash = normalizePath(hash);
    // if(hash == null)
    console.log(`hash [${hash}]`);
    // Check if the route exists in routes, otherwise use 404
    const routeConfig = Routes[hash] || Routes["*"];
    // Clean up the current route DOM if it exists
    if (currentRoute)
        destroyDOM(currentRoute);
    // Display the new route
    currentRoute = display(routeConfig().render());
    console.log("render", currentRoute);
};
//
// Function to navigate to a route
const navigate = (route, params = {}) => {
    // const queryString = new URLSearchParams(params).toString();
    // const fullRoute = queryString ? `${route}?${queryString}` : route;
    route = route.split("?")[0];
    route = normalizePath(route);
    window.history.pushState({}, "", `#${route}`);
    const routeConfig = Routes[route] || Routes["*"];
    if (currentRoute)
        destroyDOM(currentRoute);
    currentRoute = display(routeConfig(params).render());
    // refresh();
};
function display(vdom, parent = null) {
    // console.log("vdom  : ", vdom);
    // console.log("parent: ", parent);
    switch (vdom.type) {
        case TYPE.ELEMENT: {
            // console.log("vdom type",  vdom.type, "tag", vdom.tag);
            let { tag, props } = vdom;
            if (tag == "get") {
                vdom.dom = document.querySelector(props["by"]);
                vdom.children?.map((child) => {
                    destroyDOM(child);
                    display(child, vdom);
                });
            }
            else if (tag == "route") {
                // console.log("found route", vdom);
                // @ts-ignore
                let { path, call, render } = props;
                path = normalizePath(path);
                if (call)
                    Routes[path] = call;
                vdom.children?.map((child) => {
                    destroyDOM(child);
                    // @ts-ignore
                    if (child.tag != "route")
                        throw "'route' tag can only have children of type route";
                    // @ts-ignore
                    child.props.path = normalizePath(path + "/" + child.props.path);
                    display(child, parent);
                });
                return call;
                // if (render) return render({ match });
            }
            else {
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
                            if (tag == "svg" || parent?.tag == "svg")
                                vdom.dom.setAttribute(key, props[key]);
                            else
                                vdom.dom[key] = props[key];
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
                vdom.children?.map((child) => {
                    destroyDOM(child);
                    display(child, vdom);
                });
                parent?.dom?.appendChild(vdom.dom);
            }
            break;
        }
        case TYPE.FRAGMENT: {
            vdom.children?.map((child) => {
                destroyDOM(child);
                display(child, parent);
            });
            break;
        }
        case TYPE.TEXT: {
            const { value } = vdom;
            vdom.dom = document.createTextNode(value);
            if (parent)
                parent.dom.appendChild(vdom.dom);
            break;
        }
        default:
            break;
    }
    return vdom;
}
// ROUTING
function Error(props) {
    return {
        key: null,
        render: () => {
            return element("get", { by: "#root" }, element("h4", {
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
const Mini = {
    initState,
    display,
    element,
    fragment,
    loadCSS,
    Error,
    Routes,
    navigate,
    refresh
    // matchPath,
};
export default Mini;
