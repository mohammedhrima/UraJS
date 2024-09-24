import { init } from "./states.js";
import * as UTILS from "./utils.js";
import { Routes, refresh, navigate } from "./routing.js";
import { fragment, element } from "./jsx.js";
import DOM from "./dom.js";
function execute(mode, prev, next = null) {
    switch (mode) {
        case UTILS.CREATE: {
            prev = DOM.create(prev);
            prev.children?.map((child) => {
                execute(mode, child);
                console.log(child);
                prev.dom.appendChild(child.dom);
            });
            break;
        }
        case UTILS.REMOVE: {
            DOM.destroy(prev);
            break;
        }
        case UTILS.REPLACE: {
            // clear prev vdom
            DOM.removeProps(prev);
            prev.children?.map((child) => DOM.destroy(child));
            // create next vdom
            execute(UTILS.CREATE, next); // next vdom's children get appended her
            prev.dom.replaceWith(next.dom);
            Object.keys(next).forEach((key) => {
                prev[key] = next[key];
            });
            DOM.setProps(prev);
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
    // console.log("keep ", prev, "and", next);
}
function display(vdom) {
    console.log("display ", vdom);
    execute(UTILS.CREATE, vdom);
    return vdom;
}
const Ura = {
    init,
    display,
    element,
    fragment,
    loadCSS: UTILS.loadCSS,
    Routes,
    navigate,
    refresh,
    send: UTILS.send_HTTP_Request,
    reconciliate,
    execute,
};
export default Ura;
