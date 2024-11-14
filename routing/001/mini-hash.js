import { TYPE } from "./types.js";
import validTags from "./validTags.js";
// UTILS
function loadCSS(filename) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = filename;
    document.head.appendChild(link);
}
// STATES
const maps = new Map();
let index = 1;
function initState() {
    maps.set(index, {
        state: new Map(),
        handler: () => { },
    });
    const map = maps.get(index);
    index++;
    let key = 1;
    return [
        index - 1,
        (initialValue) => {
            key++;
            map.state.set(key, initialValue);
            return [
                () => {
                    return map.state.get(key);
                },
                (newValue) => {
                    map.state.set(key, newValue);
                    if (map.handler)
                        map.handler();
                },
            ];
        },
    ];
}
// JSX HANDLING
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
        children: check(children || []),
    };
}
function element(tag, props, ...children) {
    if (typeof tag === "function") {
        let funcTag = tag(props || {});
        if (funcTag.component) {
            let currTag = funcTag.component();
            if (funcTag.key && maps.get(funcTag.key)) {
                maps.get(funcTag.key).handler = () => {
                    destroyDOM(currTag);
                    let parent = currTag.parent;
                    currTag = funcTag.component();
                    currTag.parent = parent;
                    Mini.display(currTag, parent);
                    parent.dom.appendChild(currTag.dom);
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
    for (const eventType in vdom.events) {
        if (vdom.events.hasOwnProperty(eventType)) {
            const callback = vdom.events[eventType];
            vdom.dom.removeEventListener(eventType, callback);
        }
        vdom.events = {};
    }
    vdom.dom?.remove();
    vdom.children?.map(destroyDOM);
}
function isvalid(tag) {
    if (!(tag in validTags)) {
        console.warn(`Invalid tag '${tag}',if it's a function, first character should be uppercase`);
        return false;
    }
    return true;
}
// ROUTING
const Routes = new Map();
Routes["*"] = Error;
const matchPath = (pathname) => {
    // console.log("call matchPath");
    // const { path } = options;
    // if (!path) {
    //   return {
    //     path: null,
    //     url: pathname,
    //     isExact: true,
    //   };
    // }
    const match = new RegExp(`^${pathname}`).exec(pathname);
    console.log(match);
    if (!match)
        return null;
    const url = match[0];
    // const isExact = pathname === url;
    return { pathname, url };
};
//@ts-ignore
let routeDom = document.getElementById("root");
function formatRoute(path) {
    if (path.startsWith("/"))
        return "#" + path.slice(1);
    else if (!path.startsWith("#"))
        return "#" + path;
    return path;
}
function reverseformatRoute(path) {
    if (path.startsWith("#"))
        return "/" + path.slice(1);
    else if (!path.startsWith("/"))
        return "#" + path;
    return path;
}
function navigate(path, parentDom) {
    path = formatRoute(path);
    if (!parentDom)
        parentDom = routeDom;
    routeDom.innerHTML = "";
    if (Routes.get("*"))
        //@ts-ignore
        display(Routes["*"]().component(), { dom: routeDom });
    else if (!Routes.get(path))
        //@ts-ignore
        display(Error({ message: reverseformatRoute(path) }).component(), { dom: routeDom });
    else {
        //@ts-ignore
        display(Routes[path]().component(), { dom: routeDom });
        if (window.location.hash !== `#${path}`) {
            // TODO: check this line
            window.location.hash = path;
        }
    }
}
window.addEventListener("popstate", function (event) {
    // console.log("popstate", window.location.pathname);
    navigate(window.location.hash || "#", routeDom);
});
document.addEventListener("DOMContentLoaded", (event) => {
    // console.log("DOMContentLoaded");
    navigate(window.location.hash || "#", routeDom);
});
window.addEventListener("load", (event) => {
    // console.log("load");
    navigate(window.location.hash || "#", routeDom);
});
// DISPLAY
function display(vdom, parent = null) {
    // console.log("vdom", vdom);
    // console.log("parent", parent);
    switch (vdom.type) {
        case TYPE.ELEMENT: {
            let { tag, props } = vdom;
            if (tag == "navigate") {
                vdom.dom = document.createElement("a");
                // vdom.dom.innerHTML = "hh";
                parent.dom.appendChild(vdom.dom);
                vdom.dom.onclick = (event) => {
                    // console.log("navigate to ", Routes[props.to]);
                    // parent.children.map(destroyDOM);
                    // //@ts-ignore
                    // display(Routes[props.to]().component(), parent);
                    // // event.preventDefault();
                    // // console.log("go to ", event);
                    // //@ts-ignore
                    // history.pushState(null, null, props.to);
                    //@ts-ignore
                    navigate(props.to, parent.dom);
                };
                vdom.children?.map((child) => {
                    destroyDOM(child);
                    display(child, vdom);
                });
            }
            else if (tag == "route") {
                // console.log("found route", vdom);
                // @ts-ignore
                let { path, call, render } = props;
                path = formatRoute(path);
                if (call) {
                    Routes[path] = call;
                }
                vdom.children?.map((child) => {
                    destroyDOM(child);
                    // @ts-ignore
                    if (child.tag != "route")
                        throw "'route' tag can only have children of type route";
                    // @ts-ignore
                    child.props.path = path + child.props.path;
                    display(child, parent);
                });
                // if (render) return render({ match });
            }
            else if (tag == "get") {
                vdom.dom = document.querySelector(props["by"]);
                vdom.dom.innerHTML = "";
                vdom.children?.map((child) => {
                    destroyDOM(child);
                    display(child, vdom);
                });
                if (props["by"] === "root")
                    routeDom = vdom.dom;
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
                vdom.children?.map((child) => {
                    destroyDOM(child);
                    display(child, vdom);
                });
                parent.dom?.appendChild(vdom.dom);
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
    }
    return vdom;
}
// ROUTING
function Error(props) {
    return {
        key: null,
        component: () => {
            return Mini.element("get", { by: "#root" }, Mini.element("h4", {
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
    display,
    element,
    fragment,
    loadCSS,
    Error,
    Routes,
};
export default Mini;
