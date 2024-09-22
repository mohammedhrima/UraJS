import { Routes, root, normalizePath, setRoot } from "../routing.js";
import { maps } from "../states.js";
import { FRAGMENT, ELEMENT, TEXT, PROP_REMOVE, deepEqual, PROP_REPLACE, PROP_INSERT, REPLACE, KEEP, REMOVE, INSERT, UPDATE, } from "../utils.js";
function setProps(vdom, parent) {
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
            if (tag == "svg" || parent?.tag == "svg")
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
function isSpecialVDOM(tag) {
    return tag == "root" || tag == "if" || tag == "loop";
}
function destroyDOM(vdom) {
    if (!isSpecialVDOM(vdom.tag) && vdom.type != FRAGMENT) {
        for (const eventType in vdom.events) {
            if (vdom.events.hasOwnProperty(eventType)) {
                const callback = vdom.events[eventType];
                vdom.dom.removeEventListener(eventType, callback);
            }
            vdom.events = {};
        }
        console.log(vdom);
        vdom.dom?.remove();
        vdom.dom = null;
    }
    vdom.children?.map(destroyDOM);
}
function createDOM(vdom) {
    switch (vdom.type) {
        case ELEMENT: {
            switch (vdom.tag) {
                case "loop":
                case "if":
                    // vdom.dom = document.createDocumentFragment();
                    vdom.dom = document.createElement("span");
                    break;
                case "root":
                    if (root)
                        destroyDOM(root); // to destroy children
                    vdom.dom = document.getElementById("root");
                    //@ts-ignore
                    setRoot(vdom);
                    break;
                default:
                    if (vdom.dom) {
                        console.log("element already has dom");
                        vdom.dom.replaceWith(document.createElement(vdom.tag));
                    }
                    else
                        vdom.dom = document.createElement(vdom.tag);
                    break;
            }
            break;
        }
        case FRAGMENT: {
            vdom.dom = document.createDocumentFragment();
            break;
        }
        case TEXT: {
            vdom.dom = document.createTextNode(vdom.value);
            break;
        }
        default:
            break;
    }
}
function appendChildrenDOM(vdom) {
    vdom.children?.map((child) => {
        //@ts-ignore
        display(child, vdom);
        //@ts-ignore
        if (child.dom)
            vdom.dom.appendChild(child.dom);
        else {
            // console.log(typeof child);
            // console.log(child);
            vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
        }
    });
}
function reconciliateProps(oldProps = {}, newProps = {}, index) {
    let propChanges = [];
    // Check for props that need to be removed or changed
    for (let key in oldProps) {
        if (!(key in newProps)) {
            // console.log(`Remove prop '${key}' from element with index ${index}`);
            propChanges.push({
                action: PROP_REMOVE,
                key: key,
            });
        }
        else if (!deepEqual(oldProps[key], newProps[key])) {
            // console.log(
            //   `Change prop '${key}' from '${oldProps[key]}' to '${newProps[key]}' for element with index ${index}`
            // );
            propChanges.push({
                action: PROP_REPLACE,
                key: key,
                oldValue: oldProps[key],
                newValue: newProps[key],
            });
        }
    }
    // Check for new props that need to be added
    for (let key in newProps) {
        if (!(key in oldProps)) {
            // console.log(
            //   `Add prop '${key}' with value '${newProps[key]}' to element with index ${index}`
            // );
            propChanges.push({
                action: PROP_INSERT,
                key: key,
                value: newProps[key],
            });
        }
    }
    return propChanges;
}
function reconciliate(left, right) {
    // Handle case where the tag or type is different
    if (left.tag !== right.tag || left.type !== right.type) {
        return {
            action: REPLACE,
            left: left,
            right: right,
        };
    }
    if (left.type === TEXT && left.value !== right.value) {
        return {
            action: REPLACE,
            left: left,
            right: right,
        };
    }
    if (right.type === ELEMENT && right.tag === "loop") {
        // console.log("right is loop");
        let { on } = right.props || {};
        let res = (on || []).map((elem, id) => {
            return right.children.map((child) => {
                if (typeof child == "function") {
                    //@ts-ignore
                    return child(elem, id);
                }
                else
                    return child;
            });
        });
        let arr = [];
        res.map((elem) => {
            return elem?.map((child) => {
                arr.push(child);
            });
        });
        console.log("arr:", arr);
        right.children = arr;
    }
    // Compare props
    let propChanges = reconciliateProps(left.props, right.props, left.index);
    const children1 = left.children || [];
    const children2 = right.children || [];
    let subs = [];
    // Reconciliate children
    for (let i = 0; i < Math.max(children1.length, children2.length); i++) {
        const child1 = children1[i];
        const child2 = children2[i];
        if (child1 && child2) {
            let diff = reconciliate(child1, child2);
            if (diff.action != KEEP)
                subs.push(diff);
        }
        else if (child1 && !child2) {
            subs.push({
                action: REMOVE,
                left: child1,
            });
        }
        else if (!child1 && child2) {
            subs.push({
                action: INSERT,
                right: child2,
            });
        }
    }
    // Return the result, including prop changes and children reconciliation
    return {
        left: left,
        action: subs.length || propChanges.length ? UPDATE : KEEP,
        subs: subs,
        propChanges: propChanges, // Track any prop changes
    };
}
// Rendering function to apply changes
function execute(rec, parent) {
    switch (rec.action) {
        case KEEP: {
            console.log(`Keep ${rec.left.index}`);
            return rec.left;
        }
        case UPDATE: {
            console.log(`Update ${rec.left.index} children`);
            // Handle prop changes
            if (rec.propChanges?.length) {
                rec.propChanges.forEach((change) => {
                    if (change.action === PROP_REMOVE) {
                        console.log(`Removing prop '${change.key}' from element ${rec.left.index}`);
                    }
                    else if (change.action === PROP_REPLACE) {
                        console.log(`Changing prop '${change.key}' from '${change.oldValue}' to '${change.newValue}' for element ${rec.left.index}`);
                        if (rec.left.type === ELEMENT) {
                            switch (rec.left.tag) {
                                case "if": {
                                    createDOM(rec.left);
                                    if (change.key == "cond" &&
                                        !deepEqual(change.oldValue, change.newValue)) {
                                        if (change.oldValue) {
                                            // old is true, new is false
                                            rec.left.children?.map(destroyDOM);
                                        }
                                        // new is true, old is false
                                        else {
                                            rec.left.children.map((child) => {
                                                display(child);
                                                rec.left.dom.appendChild(child.dom);
                                            });
                                        }
                                        rec.left.props[change.key] = change.newValue;
                                        parent.dom.appendChild(rec.left.dom);
                                    }
                                    break;
                                }
                                case "loop": {
                                    // TODO: handle this one
                                    console.warn("handle this case execute 0");
                                    // createDOM(rec.left);
                                    if (change.key == "on" &&
                                        !deepEqual(change.oldValue, change.newValue)) {
                                        console.log("on changed:", change.newValue);
                                        // rec.left.children?.map(destroyDOM);
                                        rec.left.props[change.key] = change.newValue;
                                        // rec.left.children = rec.right.children;
                                    }
                                    // console.log(rec.left);
                                    // rec.left.children.map((child) => {
                                    //   display(child);
                                    //   rec.left.dom.appendChild(child.dom);
                                    // });
                                    // parent.dom.appendChild(rec.left.dom);
                                    break;
                                }
                                default:
                                    break;
                            }
                        }
                        else {
                            console.warn("handle this case execute 1");
                        }
                    }
                    else if (change.action === PROP_INSERT) {
                        console.log(`Adding prop '${change.key}' with value '${change.value}' to element ${rec.left.index}`);
                    }
                });
            }
            // Reconcile and execute child elements
            rec.subs?.forEach((sub) => execute(sub, rec.left));
            break;
        }
        case INSERT: {
            console.log(`Insert ${rec.right.index} to ${parent.index} => `, rec.right, parent);
            createDOM(rec.right);
            appendChildrenDOM(rec.right);
            parent.dom.appendChild(rec.right.dom);
            // rec.subs?.forEach((sub) => execute(sub, rec.right.dom));
            break;
        }
        case REMOVE: {
            console.log(`Remove ${rec.left.index}:`, rec.left);
            // TODO: remove all children
            rec.subs?.forEach((sub) => execute(sub, rec.left));
            break;
        }
        case REPLACE: {
            console.log(`Replace ${rec.left.index} with ${rec.right.index}`);
            createDOM(rec.right);
            rec.left.dom.replaceWith(rec.right.dom);
            rec.left.dom = rec.right.dom;
            rec.subs?.forEach((sub) => execute(sub, rec.left));
            break;
        }
        default:
            break;
    }
    return rec;
}
function display(vdom, parent = null) {
    createDOM(vdom);
    switch (vdom.type) {
        case ELEMENT: {
            let { tag, props } = vdom;
            switch (tag) {
                case "loop": {
                    //@ts-ignore
                    let { on } = props || {};
                    let res = (on || []).map((elem, id) => {
                        return vdom.children.map((child) => {
                            if (typeof child == "function") {
                                //@ts-ignore
                                return child(elem, id);
                            }
                            else
                                return child;
                        });
                    });
                    let arr = [];
                    res.map((elem) => {
                        return elem?.map((child) => {
                            arr.push(child);
                        });
                    });
                    arr.map((child) => {
                        display(child, vdom);
                        vdom.dom.appendChild(child.dom);
                    });
                    vdom.children = arr;
                    break;
                }
                case "root": {
                    appendChildrenDOM(vdom);
                    break;
                }
                case "if": {
                    //@ts-ignore
                    if (props?.cond)
                        appendChildrenDOM(vdom);
                    break;
                }
                case "root": {
                    let { path, call } = props;
                    path = normalizePath(path);
                    if (call)
                        Routes[path] = call;
                    vdom.children?.map((child) => {
                        // @ts-ignore
                        if (child.tag != "route")
                            throw "'route' tag can only have children of type route";
                        // @ts-ignore
                        child.props.path = normalizePath(path + "/" + child.props.path);
                        //@ts-ignore
                        display(child, parent);
                    });
                    break;
                }
                case "elif":
                case "else": {
                    console.warn(`${tag} is ignored, beacause it should be inside if tag`);
                    break;
                }
                default: {
                    //@ts-ignore
                    if (!(tag in validTags))
                        console.warn(`Invalid tag '${tag}',if it's a function, first character should be uppercase`);
                    appendChildrenDOM(vdom);
                    setProps(vdom, parent);
                    break;
                }
            }
            break;
        }
        case FRAGMENT: {
            vdom.children?.map((child) => {
                display(child, vdom);
            });
            appendChildrenDOM(vdom);
            break;
        }
        case TEXT: {
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
    if (vdom.render && vdom.key && maps.get(vdom.key)) {
        maps.get(vdom.key).handler = () => {
            console.log("found render");
            let newTag = vdom.render();
            newTag.func = vdom.render;
            const rec = reconciliate(vdom, newTag);
            execute(rec, newTag);
            console.log("old:", vdom);
            console.log("new:", newTag);
        };
    }
    return vdom;
}
// const Mino = {
//   initState,
//   display,
//   element,
//   fragment,
//   loadCSS,
//   Error,
//   Routes,
//   navigate,
//   refresh,
//   send: send_HTTP_Request,
// };
// export default Mino;
