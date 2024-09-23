import { maps } from "./states.js";
import { ELEMENT, FRAGMENT, TEXT } from "./utils.js";
import Mino from "./code.js";
// JSX HANDLING
let vdom_index = 1;
export function check(children) {
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
export function fragment(props, ...children) {
    return {
        type: FRAGMENT,
        index: vdom_index++,
        children: check(children || []),
    };
}
export function element(tag, props, ...children) {
    if (typeof tag === "function") {
        let funcTag = tag(props || {});
        if (funcTag.render) {
            if (funcTag.key && maps.get(funcTag.key)) {
                let new_tag = funcTag.render();
                maps.get(funcTag.key).handler = () => {
                    Mino.reconciliate(new_tag, funcTag.render());
                };
                return new_tag;
            }
            return funcTag;
        }
        else if (funcTag.type) {
            return {
                ...funcTag,
                index: funcTag.index ? funcTag.index : vdom_index++,
                children: check(children || []),
            };
        }
        else {
            throw `function ${tag} must return JSX`;
        }
    }
    if (tag === "if") {
        return {
            index: vdom_index++,
            type: FRAGMENT,
            children: check(props?.cond && children ? children : []),
        };
    }
    else if (tag === "loop") {
        let res = (props.on || []).flatMap((elem, id) => (children || []).map((child) => {
            if (typeof child === "function") {
                //@ts-ignore
                return child(elem, id);
            }
            return child;
        }));
        return {
            index: vdom_index++,
            type: FRAGMENT,
            children: check(res || []),
            events: {},
        };
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
