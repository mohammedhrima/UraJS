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
    let i = 0;
    //@ts-ignore
    children = children.map((child) => {
        if (child == null || typeof child === "string" || typeof child === "number") {
            return {
                type: TYPE.TEXT,
                index: i++,
                value: child,
                events: {},
            };
        }
        else {
            child.index = i++;
            return child;
        }
    });
    return children;
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
            let currTag;
            if (funcTag.key && maps.get(funcTag.key)) {
                // console.log("element is a function");
                currTag = funcTag.render();
                currTag.isfunc = true;
                currTag.key = funcTag.key;
                currTag.func = funcTag.render;
            }
            else {
                currTag = funcTag;
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
    if (vdom.tag != "get" && vdom.tag != "root" && vdom.type != TYPE.FRAGMENT) {
        for (const eventType in vdom.events) {
            if (vdom.events.hasOwnProperty(eventType)) {
                const callback = vdom.events[eventType];
                vdom.dom.removeEventListener(eventType, callback);
            }
            vdom.events = {};
        }
        vdom.dom?.remove();
        vdom.dom = null;
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
    // console.log(typeof path);
    path = path.replace(/^\s+|\s+$/gm, "");
    if (!path.startsWith("/"))
        path = "/" + path;
    path = path.replace(/\/{2,}/g, "/");
    if (path.length > 1 && path.endsWith("/"))
        path = path.slice(0, -1);
    return path;
};
const refresh = () => {
    console.log("call refresh");
    let hash = window.location.hash.slice(1) || "/";
    hash = normalizePath(hash);
    // TODO: in case '*' check ifit's error Component
    // if so give it the path as parameter
    const RouteConfig = Routes[hash] || Routes["*"];
    // if (currentRoute) destroyDOM(currentRoute);
    //@ts-ignore
    display(element(RouteConfig));
};
const navigate = (route, params = {}) => {
    console.log("call navigate");
    route = route.split("?")[0];
    route = normalizePath(route);
    window.history.pushState({}, "", `#${route}`);
    const RouteConfig = Routes[route] || Routes["*"];
    // if (currentRoute) destroyDOM(currentRoute);
    //@ts-ignore
    display(element(RouteConfig));
};
function append(vdom, parent) {
    if (vdom.dom)
        parent.dom.appendChild(vdom.dom);
    vdom.children?.map((child) => {
        //@ts-ignore
        if (vdom.dom)
            append(child, vdom);
        //@ts-ignore
        else
            append(child, parent);
    });
}
function replaceChildAt(parentDOM, index, newDOM) {
    const children = parentDOM.children;
    if (index >= 0 && index < children.length) {
        // Replace the child at the given index
        parentDOM.replaceChild(newDOM, children[index]);
    }
    else {
        console.error("Index out of bounds");
    }
}
function display(vdom, parent = null) {
    // console.log("call display", vdom);
    switch (vdom.type) {
        case TYPE.ELEMENT: {
            let { tag, props } = vdom;
            if (tag == "root") {
                if (currentRoute)
                    destroyDOM(currentRoute);
                currentRoute = vdom;
                currentRoute.dom = document.getElementById("root");
                vdom.children?.map((child) => {
                    //@ts-ignore
                    // child.parent = vdom;
                    destroyDOM(child);
                    //@ts-ignore
                    display(child, vdom);
                    // console.log(child);
                    //@ts-ignore
                    vdom.dom.appendChild(child.dom);
                });
                // vdom.children?.map((child) => {
                //   // append(child, vdom);
                //   //@ts-ignore
                //   // display(child, vdom);
                //   //@ts-ignore
                //   vdom.dom.appendChild(child.dom);
                // });
            }
            else if (tag == "get") {
                if (!vdom.dom)
                    vdom.dom = document.querySelector(props["by"]);
                vdom.children?.map((child) => {
                    //@ts-ignore
                    // child.parent = vdom;
                    //@ts-ignore
                    destroyDOM(child);
                    display(child, vdom);
                });
                vdom.children?.map((child) => {
                    // append(child, vdom);
                    //@ts-ignore
                    // display(child, vdom);
                    //@ts-ignore
                    vdom.dom.appendChild(child.dom);
                });
            }
            else if (tag == "route") {
                // @ts-ignore
                let { path, call } = props;
                path = normalizePath(path);
                if (call)
                    Routes[path] = call;
                vdom.children?.map((child) => {
                    // destroyDOM(child as VDOM);
                    // @ts-ignore
                    if (child.tag != "route")
                        throw "'route' tag can only have children of type route";
                    // @ts-ignore
                    child.props.path = normalizePath(path + "/" + child.props.path);
                    //@ts-ignore
                    display(child, parent);
                });
            }
            else {
                // TODO: add an else here
                if (!isvalid(tag))
                    throw `Invalid tag ${tag}`;
                if (!vdom.dom)
                    vdom.dom = document.createElement(vdom.tag);
                else {
                    console.log("element already has dom");
                    vdom.dom.replaceWith(document.createElement(vdom.tag));
                }
                vdom.children?.map((child) => {
                    destroyDOM(child);
                    //@ts-ignore
                    display(child, vdom);
                    //@ts-ignore
                    vdom.dom.appendChild(child.dom);
                });
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
            }
            if (vdom.isfunc && maps.get(vdom.key)) {
                // if (vdom.tag == "root") {
                //   console.log("hey", vdom.tag);
                //   vdom.children?.map((child) => {
                //     //@ts-ignore
                //     console.log(child);
                //   });
                // }
                // console.log("found func");
                maps.get(vdom.key).handler = () => {
                    let newTag = vdom.func();
                    // console.log("handle clique for ", newTag);
                    newTag.isfunc = true;
                    newTag.key = vdom.key;
                    newTag.func = vdom.func;
                    newTag.index = vdom.index;
                    // destroyDOM(vdom);
                    display(newTag, parent);
                    newTag.children?.map((child) => {
                        destroyDOM(child);
                        display(child, newTag);
                        newTag.dom.appendChild(child.dom);
                    });
                    if (newTag.tag != "root") {
                        parent.dom.appendChild(newTag.dom);
                        replaceChildAt(parent.dom, newTag.index, newTag.dom);
                    }
                    // newTag.children?.map((child) => {
                    //   append(child, newTag);
                    // });
                };
            }
            break;
        }
        case TYPE.FRAGMENT: {
            console.log("handle fragment");
            //@ts-ignore
            vdom.dom = document.createDocumentFragment();
            vdom.children?.map((child) => {
                // destroyDOM(child as VDOM);
                display(child, vdom);
            });
            vdom.children?.map((child) => {
                //@ts-ignore
                // append(child, vdom);
                vdom.dom.appendChild(child.dom);
            });
            break;
        }
        case TYPE.TEXT: {
            // console.log("handle text");
            const { value } = vdom;
            //@ts-ignore
            vdom.dom = document.createTextNode(value);
            // if (!vdom.dom) {
            //   //@ts-ignore
            //   vdom.dom = document.createTextNode(value as string);
            // } else {
            //   console.log("Text has dom", value);
            //   vdom.dom.replaceWith(document.createTextNode(value as string));
            //   //@ts-ignore
            //   // vdom.dom = document.createTextNode(value as string);
            // }
            break;
        }
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
    refresh,
};
export default Mini;
