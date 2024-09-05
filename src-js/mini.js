import validTags from "./validTags.js";
var TYPE;
(function (TYPE) {
    TYPE[TYPE["ELEMENT"] = 1] = "ELEMENT";
    TYPE[TYPE["FRAGMENT"] = 2] = "FRAGMENT";
    TYPE[TYPE["TEXT"] = 3] = "TEXT";
})(TYPE || (TYPE = {}));
function check(child) {
    if (!child)
        throw "check found NULL";
    if (typeof child === "string" || typeof child === "number") {
        return {
            type: TYPE.TEXT,
            value: child,
            events: {},
        };
    }
    return child;
}
function Element(tag, props, ...children) {
    let i = 0;
    if (typeof tag === "function") {
        let funcTag = tag(props || {});
        if (funcTag && funcTag.length == 0) {
            return {
                type: TYPE.FRAGMENT,
                props: props,
                children: (children || []).map((child) => {
                    // @ts-ignore
                    child = check(child);
                    child.index = i;
                    i++;
                    return child;
                }),
                parent: {},
                events: {},
            };
        }
        else if (funcTag) {
            tag = funcTag.tag;
            props = funcTag.props;
            children = funcTag.children;
            return Element(tag, props, ...children);
        }
        throw "Element: function tag must return JSX component";
    }
    return {
        tag: tag,
        type: TYPE.ELEMENT,
        props: props,
        children: (children || []).map((child) => {
            // @ts-ignore
            child = check(child);
            child.index = i;
            i++;
            return child;
        }),
        parent: {},
        events: {},
    };
}
function Fragment(props, ...children) {
    return children || [];
}
function destroyDOM(vdom) {
    if (vdom.element && vdom.events) {
        for (const eventType in vdom.events) {
            if (vdom.events.hasOwnProperty(eventType)) {
                const callback = vdom.events[eventType];
                vdom.element.removeEventListener(eventType, callback);
            }
        }
        vdom.events = {};
    }
    if (!!vdom.element)
        throw "Can only destroy DOM nodes that have been mounted";
    switch (vdom.type) {
        case TYPE.TEXT: {
            vdom.element.remove();
            break;
        }
        case TYPE.ELEMENT: {
            vdom.children.map(destroyDOM);
            vdom.element.remove();
            break;
        }
        case TYPE.FRAGMENT: {
            vdom.children.map(destroyDOM);
            break;
        }
        default: {
            break;
        }
    }
}
function mountDOM(vdom, parentDOM) {
    switch (vdom.type) {
        case TYPE.ELEMENT: {
            const { tag, props, parent } = vdom;
            if (!(tag in validTags)) {
                console.warn(`Invalid tag '${tag}',\n` +
                    `if it's a function, first character should be uppercase`);
                return;
            }
            vdom.element = document.createElement(tag);
            const style = {};
            Object.keys(props || {}).forEach((key) => {
                if (validTags[vdom === null || vdom === void 0 ? void 0 : vdom.tag].includes(key)) {
                    if (key.startsWith("on")) {
                        const eventType = key.slice(2).toLowerCase();
                        vdom.element.addEventListener(eventType, props[key]);
                        vdom.events[eventType] = vdom.props[key];
                    }
                    else if (key === "style")
                        Object.assign(style, props[key]);
                    else {
                        vdom.element.setAttribute(key, props[key]);
                    }
                }
                else
                    console.warn(`Invalid attribute "${key}" ignored.`);
            });
            if (Object.keys(style).length > 0) {
                vdom.element.style.cssText = Object.keys(style)
                    .map((styleProp) => {
                    const Camelkey = styleProp.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
                    return Camelkey + ":" + style[styleProp];
                })
                    .join(";");
            }
            parentDOM.appendChild(vdom.element);
            vdom.children.forEach((child) => {
                console.log("child:", child);
                // @ts-ignore
                mountDOM(child, vdom.element);
            });
            break;
        }
        case TYPE.FRAGMENT: {
            const { tag, props } = vdom;
            if (tag == "state")
                console.log("found state");
            console.log(vdom);
            vdom.children.forEach((child) => {
                // @ts-ignore
                mountDOM(child, parentDOM);
            });
            break;
        }
        case TYPE.TEXT: {
            const { value } = vdom;
            // @ts-ignore
            vdom.element = document.createTextNode(value);
            parentDOM.append(vdom.element);
            break;
        }
        default:
            break;
    }
}
function render(viewfunc) {
    let vdom = null;
    let view = viewfunc;
    function renderApp(parentDOM) {
        if (vdom)
            destroyDOM(vdom);
        vdom = view;
        vdom.parent.element = parentDOM;
        mountDOM(vdom, vdom.parent.element);
    }
    return {
        mount(parentDOM) {
            renderApp(parentDOM);
            return vdom;
        },
        unmount() {
            destroyDOM(vdom);
            vdom = null;
        },
    };
}
const Mini = {
    Element,
    Fragment,
    render,
};
export default Mini;
