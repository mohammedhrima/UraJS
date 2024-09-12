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
let routeVDOM = null;
// console.log("call mini");
const Routes = {};
Routes["*"] = { call: Error, props: {} };
const matchPath = (pathTemplate, pathname) => {
    // If the pathTemplate is exactly "/" or an empty string, handle it directly
    if (pathTemplate === "/" || pathTemplate === "") {
        return pathname === "/" ? { path: "/", props: {} } : null;
    }
    // Convert the path template into a regex pattern
    const keys = [];
    const pathRegex = pathTemplate
        .replace(/:(\w+)/g, (_, key) => {
        keys.push(key); // Store the parameter names
        return "([^/]+)"; // Regex to capture the value
    })
        .replace(/\/$/, ""); // Remove trailing slash
    // Create regex and match pathname
    const regex = new RegExp(`^${pathRegex}$`);
    const match = regex.exec(pathname);
    if (!match)
        return null;
    // Extract parameters from the match
    const params = {};
    keys.forEach((key, index) => {
        params[key] = match[index + 1]; // Extract parameter values
    });
    // Return the base path without trailing slashes and parameters
    return {
        path: pathTemplate,
        props: params, // Return the extracted parameters
    };
};
//@ts-ignore
// Routes["/test:a/:b"] = { call: () => {}, props: {} };
// const result = matchPath("/test:a/:b", "/test123/2");
// console.log("The match:", result);
function navigate(path) {
    console.log(`call navigate [${path}]`);
    history.pushState({}, "", path);
    let matchedRoute = null;
    Object.keys(Routes).find((route) => {
        if (route != "*") {
            // console.log("match ", route, "and", path);
            const match = matchPath(route, path);
            if (match) {
                matchedRoute = {
                    props: match.props,
                    call: Routes[route].call,
                };
            }
        }
    });
    if (matchedRoute) {
        const { call, props } = matchedRoute;
        display(call(props).render(), routeVDOM);
    }
    else {
        console.log(`not found: [${path}]`);
        display(Routes["*"].call(Routes["*"].props).render(), routeVDOM);
    }
}
window.addEventListener("popstate", () => {
    console.log("popstate");
    navigate(location.pathname);
});
// Handle initial load or when user refreshes the page
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");
    navigate(location.pathname);
});
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
                vdom.dom.innerHTML = "";
                if (props["by"] === "#root") {
                    // console.log("found root");
                    routeVDOM = vdom;
                }
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
                    Routes[path] = { call, props: {} };
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
    // matchPath,
};
export default Mini;
