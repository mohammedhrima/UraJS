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
        if (funcTag.render) {
            let currTag = funcTag.render();
            if (funcTag.key && maps.get(funcTag.key)) {
                maps.get(funcTag.key).handler = () => {
                    destroyDOM(currTag);
                    let parent = currTag.parent;
                    currTag = funcTag.render();
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
let Routes = {};
Routes["*"] = { call: Error, props: {} };
const matchPath = (pathTemplate, pathname) => {
    // If the pathTemplate is exactly "/" or an empty string, handle it directly
    if (pathTemplate === "/" || pathTemplate === "") {
        // Check if the pathname is also "/" and return empty props
        return pathname === "/" ? { path: "/", props: {} } : null;
    }
    // Convert the path template into a regular expression that captures dynamic parameters
    const keys = [];
    const pathRegex = pathTemplate
        .replace(/:(\w+)/g, (_, key) => {
        keys.push(key); // Store the parameter name (e.g., "id")
        return "([^/]+)"; // Replace with a regex to capture the value (non-slash characters)
    })
        .replace(/\/$/, ""); // Remove trailing slash from the regex pattern
    // Match the provided pathname against the generated regular expression
    const regex = new RegExp(`^${pathRegex}$`);
    const match = regex.exec(pathname);
    if (!match)
        return null; // Return null if no match is found
    // Extract parameters from the match
    const params = {};
    keys.forEach((key, index) => {
        params[key] = match[index + 1]; // Assign the value to the corresponding key
    });
    // Return the base path without trailing slashes and parameters
    return {
        path: pathTemplate.replace(/:(\w+)$/, "").replace(/\/$/, ""),
        props: params, // Return the extracted parameters
    };
};
//@ts-ignore
let routeDom = document.getElementById("root");
function navigate(path, props = {}) {
    console.log(`call navigate [${path}]`);
    routeDom.innerHTML = "";
    // Match the path to find the appropriate route and props
    const matchedRoute = Object.keys(Routes).find((route) => {
        if (route != "*") {
            const match = matchPath(route, path);
            if (match) {
                // Return route and params if match is found
                return { ...Routes[route], props: { ...Routes[route].props, ...match.props } };
            }
            return null;
        }
    });
    if (matchedRoute) {
        const { call, props } = Routes[matchedRoute];
        //@ts-ignore
        display(call(props).render(), { dom: routeDom });
        if (window.location.hash !== `${path}`) {
            window.location.hash = path;
        }
    }
    else {
        console.log(`not found: [${path}]`);
        //@ts-ignore
        display(Routes["*"].call(Routes["*"].props).render(), { dom: routeDom });
    }
}
window.addEventListener("popstate", function (event) {
    console.log("popstate");
    const path = window.location.hash.slice(1);
    navigate(path);
});
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOMContentLoaded");
    const path = window.location.hash.slice(1) || "/";
    navigate(path);
});
window.addEventListener("load", (event) => {
    console.log("load");
    const path = window.location.hash.slice(1) || "/";
    navigate(path);
});
window.addEventListener("hashchange", () => {
    const path = window.location.hash.slice(1); // Get the current hash path
    navigate(path); // Navigate to the new route
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
                    //@ts-ignore
                    navigate(props.to);
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
                if (call) {
                    //@ts-ignore
                    Routes.set(path, call);
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
        render: () => {
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
    initState,
    display,
    element,
    fragment,
    loadCSS,
    Error,
    Routes,
    matchPath,
};
export default Mini;
