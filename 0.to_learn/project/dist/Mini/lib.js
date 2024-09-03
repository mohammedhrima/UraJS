function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
const validTags = {
    children: [],
    nav: [
        "props",
        "path"
    ],
    a: [
        "accesskey",
        "hidden",
        "charset",
        "className",
        "coords",
        "download",
        "href",
        "hreflang",
        "id",
        "name",
        "ping",
        "rel",
        "rev",
        "shape",
        "style",
        "target",
        "title"
    ],
    img: [
        "className",
        "alt",
        "src",
        "hidden",
        "srcset",
        "sizes",
        "crossorigin",
        "usemap",
        "ismap",
        "width",
        "height",
        "referrerpolicy",
        "loading",
        "decoding",
        "onmouseenter",
        "onmouseleave",
        "onmouseover",
        "onmouseout",
        "onclick",
        "style"
    ],
    i: [
        "class",
        "id",
        "title",
        "style",
        "dir",
        "lang",
        "accesskey",
        "tabindex"
    ],
    div: [
        "id",
        "className",
        "style",
        "data-*",
        "aria-*",
        "title",
        "dir",
        "lang",
        "tabindex",
        "accesskey",
        "contenteditable",
        "draggable",
        "spellcheck",
        "hidden",
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onfocus",
        "onblur",
        "oncontextmenu"
    ],
    p: [
        "textContent",
        "hidden",
        "id",
        "className",
        "style",
        "data-*",
        "aria-*",
        "title",
        "dir",
        "lang",
        "tabindex",
        "accesskey",
        "contenteditable",
        "spellcheck",
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onfocus",
        "onblur",
        "oncontextmenu"
    ],
    h1: [
        "hidden",
        "id",
        "className",
        "style",
        "data-*",
        "aria-*",
        "title",
        "dir",
        "lang",
        "tabindex",
        "accesskey",
        "contenteditable",
        "spellcheck",
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onfocus",
        "onblur",
        "oncontextmenu"
    ],
    h2: [
        "hidden",
        "id",
        "className",
        "style",
        "data-*",
        "aria-*",
        "title",
        "dir",
        "lang",
        "tabindex",
        "accesskey",
        "contenteditable",
        "spellcheck",
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onfocus",
        "onblur",
        "oncontextmenu"
    ],
    h3: [
        "hidden",
        "id",
        "className",
        "style",
        "data-*",
        "aria-*",
        "title",
        "dir",
        "lang",
        "tabindex",
        "accesskey",
        "contenteditable",
        "spellcheck",
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onfocus",
        "onblur",
        "oncontextmenu"
    ],
    h4: [
        "hidden",
        "id",
        "className",
        "style",
        "data-*",
        "aria-*",
        "title",
        "dir",
        "lang",
        "tabindex",
        "accesskey",
        "contenteditable",
        "spellcheck",
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onfocus",
        "onblur",
        "oncontextmenu"
    ],
    h5: [
        "hidden",
        "id",
        "className",
        "style",
        "data-*",
        "aria-*",
        "title",
        "dir",
        "lang",
        "tabindex",
        "accesskey",
        "contenteditable",
        "spellcheck",
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onfocus",
        "onblur",
        "oncontextmenu"
    ],
    h6: [
        "hidden",
        "id",
        "className",
        "style",
        "data-*",
        "aria-*",
        "title",
        "dir",
        "lang",
        "tabindex",
        "accesskey",
        "contenteditable",
        "spellcheck",
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onfocus",
        "onblur",
        "oncontextmenu"
    ],
    span: [
        "hidden",
        "id",
        "className",
        "style",
        "data-*",
        "aria-*",
        "title",
        "dir",
        "lang",
        "tabindex",
        "accesskey",
        "contenteditable",
        "spellcheck",
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onfocus",
        "onblur",
        "oncontextmenu"
    ],
    input: [
        "style",
        "hidden",
        "type",
        "name",
        "value",
        "id",
        "className",
        "placeholder",
        "readonly",
        "disabled",
        "checked",
        "size",
        "maxlength",
        "min",
        "max",
        "step",
        "pattern",
        "required",
        "autofocus",
        "autocomplete",
        "autocapitalize",
        "autocorrect",
        "list",
        "multiple",
        "accept",
        "capture",
        "form",
        "formaction",
        "formenctype",
        "formmethod",
        "formnovalidate",
        "formtarget",
        "height",
        "width",
        "alt",
        "src",
        "usemap",
        "ismap",
        "tabindex",
        "title",
        "accesskey",
        "aria-*",
        "role",
        "aria-*",
        "aria-*",
        "onchange",
        "oninput",
        "oninvalid",
        "onsubmit",
        "onreset",
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onfocus",
        "onblur",
        "oncontextmenu"
    ],
    button: [
        "style",
        "hidden",
        "type",
        "name",
        "value",
        "id",
        "className",
        "autofocus",
        "disabled",
        "form",
        "formaction",
        "formenctype",
        "formmethod",
        "formnovalidate",
        "formtarget",
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onfocus",
        "onblur",
        "oncontextmenu"
    ],
    textarea: [
        "hidden",
        "id",
        "className",
        "name",
        "rows",
        "cols",
        "readonly",
        "disabled",
        "placeholder",
        "autofocus",
        "required",
        "maxlength",
        "minlength",
        "wrap",
        "spellcheck",
        "onchange",
        "oninput",
        "onfocus",
        "onblur",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onselect",
        "oncontextmenu"
    ],
    select: [
        "hidden",
        "id",
        "className",
        "name",
        "size",
        "multiple",
        "disabled",
        "autofocus",
        "required",
        "form",
        "onchange",
        "oninput",
        "onfocus",
        "onblur",
        "onkeydown",
        "onkeyup",
        "onkeypress",
        "onselect",
        "oncontextmenu"
    ],
    ul: [
        "hidden",
        "id",
        "className",
        "style",
        "type",
        "compact"
    ],
    ol: [
        "hidden",
        "id",
        "className",
        "style",
        "type",
        "reversed",
        "start"
    ],
    li: [
        "hidden",
        "id",
        "className",
        "style",
        "value"
    ],
    table: [
        "hidden",
        "id",
        "className",
        "style",
        "border",
        "cellpadding",
        "cellspacing",
        "summary",
        "width"
    ],
    tr: [
        "hidden",
        "id",
        "className",
        "style",
        "bgcolor",
        "align",
        "valign"
    ],
    td: [
        "hidden",
        "id",
        "className",
        "style",
        "colspan",
        "rowspan",
        "headers",
        "headers",
        "abbr",
        "align",
        "axis",
        "bgcolor",
        "char",
        "charoff",
        "valign",
        "nowrap",
        "width",
        "height",
        "scope"
    ],
    form: [
        "style",
        "hidden",
        "id",
        "className",
        "style",
        "action",
        "method",
        "enctype",
        "name",
        "target",
        "accept-charset",
        "novalidate",
        "autocomplete",
        "autocapitalize",
        "autocorrect",
        "accept",
        "rel",
        "title",
        "onsubmit",
        "onreset",
        "onformdata",
        "oninput",
        "oninvalid",
        "onchange",
        "onblur",
        "onfocus"
    ],
    svg: [
        "style",
        "hidden",
        "id",
        "className",
        "x",
        "y",
        "width",
        "height",
        "viewBox",
        "preserveAspectRatio",
        "xmlns",
        "version",
        "baseProfile",
        "contentScriptType",
        "contentStyleType",
        "fill",
        "stroke",
        "stroke-width",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-miterlimit",
        "stroke-dasharray",
        "stroke-dashoffset",
        "stroke-opacity",
        "fill-opacity",
        "fill-rule",
        "opacity",
        "color",
        "display",
        "transform",
        "transform-origin",
        "d",
        "cx",
        "cy",
        "r",
        "rx",
        "ry",
        "x1",
        "y1",
        "x2",
        "y2",
        "points",
        "offset",
        "gradientUnits",
        "gradientTransform",
        "spreadMethod",
        "href",
        "xlink:href",
        "role",
        "aria-hidden",
        "aria-label",
        "aria-labelledby",
        "aria-describedby",
        "tabindex",
        "focusable",
        "title",
        "desc"
    ],
    circle: [
        "style",
        "hidden",
        "id",
        "className",
        "cx",
        "cy",
        "r",
        "fill",
        "stroke",
        "stroke-width",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-miterlimit",
        "stroke-dasharray",
        "stroke-dashoffset",
        "stroke-opacity",
        "fill-opacity",
        "fill-rule",
        "opacity",
        "color",
        "display",
        "transform",
        "transform-origin",
        "role",
        "aria-hidden",
        "aria-label",
        "aria-labelledby",
        "aria-describedby",
        "tabindex",
        "focusable",
        "title",
        "desc"
    ]
};
// RENDERING
class Variable {
    set value(new_val) {
        this.aInternal = new_val;
        this.aListener(new_val);
    }
    get value() {
        return this.aInternal;
    }
    registerListener(listener) {
        this.aListener = listener.bind(this);
    }
    constructor(initialValue){
        this.aInternal = initialValue;
        this.aListener = function(new_val) {};
    }
}
function check(child) {
    if (typeof child === "string" || typeof child === "number") {
        return {
            type: "text",
            value: child
        };
    }
    if (child instanceof Variable) {
        return {
            type: "variable",
            value: child
        };
    }
    return child;
}
function Src(props, ...children) {
    const element = {
        tag: "",
        type: "selector",
        props: props,
        children: children
    };
    return element;
}
function createElement(tag = null, props = {}, ...children) {
    //   console.log(tag);
    if (typeof tag === "function") {
        let funcTag = tag(props || {});
        if (funcTag.type == "selector") {
            // funcTag.props = {
            // 	...funcTag.props,
            // 	...props
            // }
            funcTag.children = [
                ...funcTag.children,
                ...children
            ];
            //   console.log("the selector is: ", funcTag);
            // funcTag.children = children;
            return funcTag;
        } else if (funcTag.length == 0) {
            console.log(tag);
            return {
                type: "fragment",
                props: props || {},
                children: (children || []).map(check)
            };
        }
        // if (funcTag.type == "text") {
        //   console.log("is text");
        // }
        return createElement(funcTag.tag, funcTag.props, ...funcTag.children);
    }
    if (children && children.length) children = children.map(check);
    const element = {
        tag: tag,
        type: tag && tag != "Route" ? "element" : "fragment",
        props: props,
        children: children
    };
    // console.log("createElement: ", element);
    return element;
}
function render(vdom, parent = null) {
    if (!vdom) return;
    if (typeof vdom === "function") {
        let func = vdom();
        return render(func, parent);
    }
    let { type, tag, props, children } = vdom;
    switch(type){
        /*==============  TEXT  ===============*/ case "text":
            {
                parent === null || parent === void 0 ? void 0 : parent.appendChild(document.createTextNode(vdom.value));
                break;
            }
        /*============== VARIABLE ==============*/ case "variable":
            {
                //   console.log("found var", vdom.value);
                vdom.value.registerListener(function(val) {
                    console.log("Someone changed the value of value to " + val);
                    console.log("vdom.value: ", vdom.value.value);
                    parent.innerHTML = val;
                // vdom.value.value = val;
                // parent?.appendChild(document.createTextNode(vdom.value.value));
                });
                parent === null || parent === void 0 ? void 0 : parent.appendChild(document.createTextNode(vdom.value.value));
                break;
            }
        /*============== ELEMENT ==============*/ case "element":
            {
                if (!validTags.hasOwnProperty(tag)) throw new Error(`Invalid tag "${tag}"`);
                let dom;
                const svgNS = JSON.stringify("www.w3.org/2000/svg");
                if (tag == "svg") {
                    // console.log("is svg");
                    dom = document.createElementNS(svgNS, "svg");
                } else {
                    if ((parent === null || parent === void 0 ? void 0 : parent.tagName) == "svg") {
                        // console.log("parent is svg");
                        dom = document.createElementNS(svgNS, tag);
                    } else dom = document.createElement(tag);
                }
                const style = {};
                Object.keys(props || {}).filter((key)=>key != "children").forEach((key)=>{
                    // console.log(key, ":", props[key]);
                    if (validTags[vdom === null || vdom === void 0 ? void 0 : vdom.tag].includes(key) || key == "parent") {
                        if (key.startsWith("on")) {
                            dom[key] = props[key];
                        } else if (key === "style") {
                            Object.assign(style, props[key]);
                            if (props[key] instanceof Variable) {
                                props[key].registerListener(function(val) {
                                    // dom[key] = val;
                                    // console.log("set style: ", props[key]);
                                    //   console.log("lib: set style: ", props[key].value);
                                    dom.style = _object_spread({}, val, dom.style);
                                //   console.log(dom.style);
                                });
                                Object.keys(props[key].value).map((skey)=>{
                                    //   console.log("map: ", skey, " -> ", props[key].value[skey]);
                                    dom.style[skey] = props[key].value[skey];
                                });
                            // console.log(props[key].value);
                            // dom.style = props[key].value;
                            // dom.style = {
                            //   ...dom.style,
                            //   ...props[key].value
                            // }
                            // dom.style = props[key].value
                            // props[key].registerListener(function (val) {
                            //   dom.style = {
                            //     ...dom.style,
                            //     ...val
                            //   }
                            // })
                            } else {
                                dom.style = _object_spread({}, dom.style, props[key]);
                            }
                        } else {
                            if (tag == "svg" || (parent === null || parent === void 0 ? void 0 : parent.tagName) == "svg") {
                                if (props[key] instanceof Variable) {
                                    props[key].registerListener(function(val) {
                                        dom.setAttribute(key, val);
                                    });
                                } else {
                                    dom.setAttribute(key, props[key]);
                                }
                            } else {
                                if (props[key] instanceof Variable) {
                                    props[key].registerListener(function(val) {
                                        dom[key] = val;
                                    });
                                } else {
                                    dom[key] = props[key];
                                }
                            }
                        }
                    } else {
                        console.warn("Invalid attribute ", key, " ignored.");
                    }
                });
                if (Object.keys(style).length > 0) {
                    dom.style.cssText = Object.keys(style).map((styleProp)=>{
                        const Camelkey = styleProp.replace(/[A-Z]/g, (match)=>`-${match.toLowerCase()}`);
                        return Camelkey + ":" + style[styleProp];
                    }).join(";");
                }
                children === null || children === void 0 ? void 0 : children.map((child)=>{
                    render(child, dom);
                });
                if (parent) parent.appendChild(dom);
                else {
                    console.warn("Parent is NULL");
                    console.log(children);
                }
                break;
            }
        /*============== FRAGMENT =============*/ case "fragment":
            {
                children === null || children === void 0 ? void 0 : children.map((child)=>{
                    render(child, parent);
                });
                break;
            }
        case "selector":
            let parentTag = document.querySelector(`[data-tag=${props.name}]`);
            // console.log("children: ", children);
            children === null || children === void 0 ? void 0 : children.map((child)=>{
                render(child, parentTag);
            });
            break;
        default:
            break;
    }
}
function display(vdom, attr) {
    render(vdom, document.querySelector(attr));
}
function Fragment(props, ...children) {
    return children || [];
}
// ROUTING
// function pathToRegex(path) {
//   return new RegExp(
//     "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$"
//   );
// }
function getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result)=>result[1]);
    return Object.fromEntries(keys.map((key, i)=>{
        return [
            key,
            values[i]
        ];
    }));
}
function router() {
    return _router.apply(this, arguments);
}
function _router() {
    _router = _async_to_generator(function*() {
    // Test routes
    // const matches = routes.map((route) => {
    //   return {
    //     route: route,
    //     result: location.pathname.match(pathToRegex(route.path)),
    //   };
    // });
    // // find the matche object for the current route
    // let match = matches.find((elem) => elem.result !== null);
    // if (!match) {
    //   // if route doesn't exists
    //   match = {
    //     route: routes[0],
    //     result: [location.pathname],
    //   };
    // }
    // //   console.log("mathc is: ", match);
    // let element = match.route.element(getParams(match));
    // console.log("router: ", element);
    //   app = document.getElementById("app");
    //   app.innerHTML = "";
    //   Mini.render(element, app);
    //   console.log("pathname is", location.pathname);
    //   let pageRoute = routes.find((route) => route.path == location.pathname);
    //   console.log("res: ", pageRoute);
    //   const interval = setInterval(() => {
    //     const iframe = document.getElementById("frame");
    //     if (iframe) {
    //       iframe.src = "dist/pages/Home/home.html";
    //       clearInterval(interval);
    //     }
    //   }, 100);
    });
    return _router.apply(this, arguments);
}
// Usage with async/await
let CurrentPath = "";
let Routes = {};
function navigate(path) {
    let url = Routes[path];
    console.log("request: ", url);
    if (!url) {
        console.error("Error: No URL found for path", path);
        return;
    }
    CurrentPath = path;
    fetch(url).then((response)=>response.text()).then((data)=>{
        const element = document.getElementById("content");
        element.innerHTML = data;
        const scripts = element.querySelectorAll("script");
        scripts.forEach((script)=>{
            // const newScript = document.createElement('script');
            // newScript.src = script.src;
            // document.body.appendChild(newScript);
            import(script.src);
        });
    }).catch((error)=>console.error("Error loading page:", error));
}
document.addEventListener("DOMContentLoaded", ()=>{
    const initialPath = window.location.hash.substring(1) || 'home';
    navigate(initialPath);
    window.addEventListener('popstate', (event)=>{
        console.log("pop state: ", event);
        const path = window.location.hash.substring(1);
        navigate(path);
    });
});
window.navigate = (path)=>{
    window.history.pushState({}, path, path);
    navigate(path);
};
// on loading
function onload(path) {
    window.onload = ()=>{
        CurrentPath = path;
        navigate(path);
    };
}
function setRoutes(value) {
    Routes = value;
}
const Byclass = (className)=>document.querySelector("." + className);
const Byid = (id)=>document.querySelector("#" + id);
export const Mini = {
    createElement,
    Fragment,
    render,
    display,
    Src,
    Byclass,
    Byid,
    Variable,
    setRoutes,
    navigate,
    onload
};
