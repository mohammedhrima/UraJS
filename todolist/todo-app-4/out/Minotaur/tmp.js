//@ts-ignore
import send_HTTP_Request from "./http.js";
import { maps, initState } from "./states.js";
import { TYPE, } from "./tmp_types.js";
import validTags from "./validTags.js";
// UTILS
function loadCSS(filename) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = filename;
    document.head.appendChild(link);
}
// JSX HANDLING
let vdom_index = 0;
function check(children) {
    //@ts-ignore
    children = children.map((child) => {
        if (child == null || typeof child === "string" || typeof child === "number") {
            return {
                type: TYPE.TEXT,
                index: vdom_index++,
                value: child,
                events: {},
            };
        }
        else {
            return child;
        }
    });
    return children;
}
function fragment(props, ...children) {
    return {
        type: TYPE.FRAGMENT,
        index: vdom_index++,
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
        type: TYPE.ELEMENT,
        props: props,
        children: check(children || []),
        events: {},
    };
}
function destroyDOM(vdom) {
    if (vdom.tag != "root") {
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
const Routes = {};
//@ts-ignore
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
    let hash = window.location.hash.slice(1) || "/";
    hash = normalizePath(hash);
    // TODO: in case '*' check if it's error Component
    // if so give it the path as parameter
    const RouteConfig = Routes[hash] || Routes["*"];
    /*
    | I did <RoutConfig/> because
    | I need the key attribute
    */
    currentRoute = display(Mino.element(RouteConfig, null));
};
const navigate = (route, params = {}) => {
    // console.log("call navigate");
    route = route.split("?")[0];
    route = normalizePath(route);
    window.history.pushState({}, "", `#${route}`);
    const RouteConfig = Routes[route] || Routes["*"];
    //@ts-ignore
    currentRoute = display(Mino.element(RouteConfig, null));
};
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
function isEqual(value1, value2) {
    if (value1 === value2)
        return true;
    if (value1 == null || value2 == null)
        return false;
    const type1 = typeof value1;
    const type2 = typeof value2;
    if (type1 !== type2)
        return false;
    if (Array.isArray(value1) && Array.isArray(value2)) {
        if (value1.length !== value2.length)
            return false;
        for (let i = 0; i < value1.length; i++) {
            if (!isEqual(value1[i], value2[i]))
                return false;
        }
        return true;
    }
    if (type1 === "object" && type2 === "object") {
        const keys1 = Object.keys(value1);
        const keys2 = Object.keys(value2);
        if (keys1.length !== keys2.length)
            return false;
        for (const key of keys1) {
            if (!keys2.includes(key) || !isEqual(value1[key], value2[key]))
                return false;
        }
        return true;
    }
    return false;
}
// TODO: check props also
function reconciliate(left, right) {
    if (left.tag !== right.tag || left.type !== right.type) {
        return {
            action: "replace",
            left: left,
            right: right,
        };
    }
    if (left.type === "text" && left.value !== right.value) {
        return {
            action: "replace",
            left: left,
            right: right,
        };
    }
    const children1 = left.children || [];
    const children2 = right.children || [];
    let subs = [];
    for (let i = 0; i < Math.max(children1.length, children2.length); i++) {
        const child1 = children1[i];
        const child2 = children2[i];
        if (child1 && child2) {
            let diff = reconciliate(child1, child2);
            if (diff.action != "keep")
                subs.push(diff);
        }
        else if (child1 && !child2) {
            subs.push({
                action: "remove",
                left: child1,
            });
        }
        else if (!child1 && child2) {
            subs.push({
                action: "insert",
                right: child2,
            });
        }
    }
    return {
        left: left,
        action: subs.length ? "update" : "keep",
        subs: subs,
    };
}
function setProps(vdom, parent) {
    const { tag, props } = vdom;
    const style = {};
    Object.keys(props || {}).forEach((key) => {
        // if (validTags[tag as string].includes(key)) {
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
        // } else console.warn(`Invalid attribute "${key}" ignored.`);
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
function createDOM(vdom) {
    switch (vdom.type) {
        case TYPE.ELEMENT:
            if (vdom.tag == "root") {
                vdom.dom = document.getElementById("root");
            }
            else {
                //@ts-ignore
                vdom.dom = document.createElement(vdom.tag);
            }
            break;
        case TYPE.TEXT:
            //@ts-ignore
            vdom.dom = document.createTextNode(vdom.value);
            break;
        default:
            break;
    }
}
function render(rec, parent) {
    console.log(rec.action);
    switch (rec.action) {
        case "keep": {
            break;
        }
        case "update": {
            //@ts-ignore
            rec.subs.map((sub) => render(sub, rec.left));
            break;
        }
        case "insert": {
            createDOM(rec.right);
            console.log(rec);
            console.log("parent", parent);
            console.log("child", rec.right);
            //@ts-ignore
            rec.right.children.map((child) => {
                console.log("has child", child);
                display(child, rec.right);
                //@ts-ignore
                rec.right.dom.appendChild(child.dom);
            });
            parent.dom.appendChild(rec.right.dom);
            break;
        }
        case "remove": {
            destroyDOM(rec.left);
            break;
        }
        case "replace": {
            // console.log("left", left);
            createDOM(rec.right);
            console.log("right", rec.right);
            rec.left.dom.replaceWith(rec.right.dom);
            rec.left.dom = rec.right.dom;
            // left.value = right.value;
            // right.children.map((child) => {
            //   console.log("has child", child);
            //   display(child as VDOM, right)
            //   //@ts-ignore
            //   right.dom.appendChild(child.dom);
            // })
            break;
        }
        default:
            break;
    }
    return rec;
}
function display(vdom, parent = null) {
    //@ts-ignore
    // console.log("call display", vdom);
    switch (vdom.type) {
        case TYPE.ELEMENT: {
            let { tag, props } = vdom;
            if (tag == "loop") {
                //@ts-ignore
                let { on, exec } = props || {};
                // console.log("on", on, " type", typeof on);
                // TODO: protect if if exec is null
                let res = on?.map((elem, id) => {
                    // console.log(elem);
                    return exec(elem, id);
                });
                // console.log(res);
                //@ts-ignore
                vdom.dom = document.createDocumentFragment();
                res?.map((child) => {
                    display(child, parent);
                    //@ts-ignore
                    vdom.children.push(child);
                    if (child.dom)
                        vdom.dom.appendChild(child.dom);
                    else
                        vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
                });
            }
            else if (tag == "if") {
                //@ts-ignore
                let { cond } = props || {};
                // @ts-ignore
                vdom.dom = document.createDocumentFragment();
                if (cond) {
                    vdom.children?.map((child) => {
                        //@ts-ignore
                        display(child, vdom);
                        //@ts-ignore
                        if (child.dom)
                            vdom.dom.appendChild(child.dom);
                        else
                            vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
                    });
                }
            }
            else if (tag == "root") {
                if (currentRoute)
                    destroyDOM(currentRoute);
                vdom.dom = document.getElementById("root");
                vdom.children?.map((child) => {
                    //@ts-ignore
                    // destroyDOM(child);
                    //@ts-ignore
                    display(child, vdom);
                    // console.log(child);
                    // console.log("child", child);
                    //@ts-ignore
                    if (child.dom)
                        vdom.dom.appendChild(child.dom);
                    // else vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
                });
                currentRoute = vdom;
            }
            else if (tag == "get") {
                vdom.dom = document.querySelector(props["by"]);
                vdom.children?.map((child) => {
                    //@ts-ignore
                    // destroyDOM(child);
                    display(child, vdom);
                });
                vdom.children?.map((child) => {
                    // append(child, vdom);
                    //@ts-ignore
                    // display(child, vdom);
                    //@ts-ignore
                    if (child.dom)
                        vdom.dom.appendChild(child.dom);
                    else
                        vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
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
            else if (tag == "else" || tag == "elif") {
                console.warn(`${tag} is ignored, beacause it should be inside if tag`);
            }
            else {
                if (!(tag in validTags)) {
                    console.warn(`Invalid tag '${tag}',if it's a function, first character should be uppercase`);
                }
                if (!vdom.dom)
                    vdom.dom = document.createElement(vdom.tag);
                else {
                    // console.log("element already has dom");
                    vdom.dom.replaceWith(document.createElement(vdom.tag));
                }
                vdom.children?.map((child) => {
                    // destroyDOM(child as VDOM);
                    //@ts-ignore
                    display(child, vdom);
                    //@ts-ignore
                    // console.log(child);
                    //@ts-ignore
                    if (child.dom)
                        vdom.dom.appendChild(child.dom);
                    else
                        vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
                });
            }
            setProps(vdom, parent);
            if (vdom.isfunc && maps.get(vdom.key)) {
                maps.get(vdom.key).handler = () => {
                    // console.log("call handle");
                    let newTag = vdom.func();
                    newTag.isfunc = true;
                    newTag.key = vdom.key;
                    newTag.func = vdom.func;
                    newTag.index = vdom.index;
                    let newrec = render(reconciliate(currentRoute, newTag), parent);
                    console.log("new rec", newrec);
                    // display(newTag, parent);
                    // // newTag.children?.map((child) => {
                    // //   console.log("has children");
                    // //   destroyDOM(child);
                    // //   display(child, newTag);
                    // //   // console.log(child);
                    // //   if (child.dom) newTag.dom.appendChild(child.dom);
                    // //   else newTag.dom.appendChild(document.createTextNode(JSON.stringify(child)));
                    // // });
                    // if (newTag.tag != "root") {
                    //   parent.dom.appendChild(newTag.dom);
                    //   // replaceChildAt(parent.dom, newTag.index, newTag.dom);
                    // }
                };
            }
            break;
        }
        case TYPE.FRAGMENT: {
            // console.log("handle fragment");
            //@ts-ignore
            vdom.dom = document.createDocumentFragment();
            vdom.children?.map((child) => {
                display(child, vdom);
            });
            vdom.children?.map((child) => {
                //@ts-ignore
                if (child.dom)
                    vdom.dom.appendChild(child.dom);
                else
                    vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
            });
            break;
        }
        case TYPE.TEXT: {
            const { value } = vdom;
            // console.log("handle text", value);
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
