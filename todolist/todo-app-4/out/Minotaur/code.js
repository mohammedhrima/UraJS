import { maps, initState } from "./states.js";
import * as UTILS from "./utils.js";
import { Routes, root, refresh, navigate, setRoot } from "./routing.js";
import { fragment, element } from "./jsx.js";
// TODO: check svg set attribute
function setProps(vdom) {
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
            if (tag == "svg" /*|| parent?.tag == "svg"*/)
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
            vdom.dom = document.createDocumentFragment();
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
function destroyDOM(vdom) { }
function appendChildrenDOM(vdom) { }
function execute(mode, prev, next = null) {
    switch (mode) {
        case UTILS.CREATE: {
            createDOM(prev);
            prev.children?.map((child) => {
                execute(mode, child);
                prev.dom.appendChild(child.dom);
            });
            break;
        }
        case UTILS.KEEP: {
            break;
        }
        case UTILS.UPDATE: {
            break;
        }
        case UTILS.INSERT: {
            break;
        }
        case UTILS.REMOVE: {
            break;
        }
        case UTILS.REPLACE: {
            // TODO: handle children
            execute(UTILS.CREATE, next);
            prev.dom.replaceWith(next.dom);
            prev.children?.map(child => {
                destroyDOM(child);
            });
            prev.dom = next.dom;
            break;
        }
        default:
            break;
    }
    return prev;
}
function reconciliateProps(oldProps = {}, newProps = {}, index) { }
function reconciliate(prev, next) {
    // console.log("call reconciliate", prev, next);
    if (prev.type === UTILS.TEXT && !UTILS.deepEqual(prev.value, next.value)) {
        execute(UTILS.REPLACE, prev, next);
        return;
    }
    const prev_children = prev.children || [];
    const next_children = next.children || [];
    for (let i = 0; i < Math.max(prev_children.length, next_children.length); i++) {
        const child1 = prev_children[i];
        const child2 = next_children[i];
        if (child1 && child2) {
            reconciliate(child1, child2);
        }
        else if (!child1 && child2) {
        }
        else if (child1 && !child2) {
        }
    }
}
function display(vdom, parent = null) {
    console.log("display ", vdom);
    vdom = execute(UTILS.CREATE, vdom);
    if (vdom.render && vdom.key && maps.get(vdom.key)) {
        maps.get(vdom.key).handler = () => {
            console.log("found render");
            let newTag = vdom.render();
            newTag.func = vdom.render;
            reconciliate(vdom, newTag);
            // execute(rec, newTag);
            console.log("old:", vdom);
            console.log("new:", newTag);
        };
    }
    switch (vdom.type) {
        case UTILS.ELEMENT: {
            let { tag, props } = vdom;
            switch (tag) {
                case "loop": {
                    //@ts-ignore
                    // let { on } = props || {};
                    // let res = (props.on || []).map((elem, id) => {
                    //   return (children || []).map((child) => {
                    //     if (typeof child == "function") {
                    //       //@ts-ignore
                    //       return child(elem, id);
                    //     } else return child;
                    //   });
                    // });
                    // let arr = [];
                    // res.map((elem) => {
                    //   return elem?.map((child) => {
                    //     arr.push(child);
                    //   });
                    // });
                    // arr.map((child) => {
                    //   display(child, vdom);
                    //   vdom.dom.appendChild(child.dom);
                    // });
                    // vdom.children = arr;
                    break;
                }
                case "root": {
                    // appendChildrenDOM(vdom);
                    break;
                }
                case "if": {
                    //@ts-ignore
                    // if (props?.cond) appendChildrenDOM(vdom);
                    break;
                }
                case "root": {
                    // let { path, call } = props as { [key: string]: any };
                    // path = normalizePath(path);
                    // if (call) Routes[path] = call;
                    // vdom.children?.map((child) => {
                    //   // @ts-ignore
                    //   if (child.tag != "route")
                    //     throw "'route' tag can only have children of type route";
                    //   // @ts-ignore
                    //   child.props.path = normalizePath(path + "/" + child.props.path);
                    //   //@ts-ignore
                    //   display(child as VDOM, parent);
                    // });
                    break;
                }
                case "elif":
                case "else": {
                    console.warn(`${tag} is ignored, beacause it should be inside if tag`);
                    break;
                }
                default: {
                    //@ts-ignore
                    // if (!(tag in UTILS.validTags))
                    //   console.warn(
                    //     `Invalid tag '${tag}',if it's a function, first character should be uppercase`
                    //   );
                    // appendChildrenDOM(vdom);
                    // setProps(vdom, parent);
                    break;
                }
            }
            break;
        }
        case UTILS.FRAGMENT: {
            // vdom.children?.map((child) => {
            //   display(child as VDOM, vdom);
            // });
            // appendChildrenDOM(vdom);
            break;
        }
        case UTILS.TEXT: {
            // TODO: test this case
            // if (vdom.value == "is even") {
            //   console.log("text found");
            // }
            break;
        }
        default: {
            break;
        }
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
