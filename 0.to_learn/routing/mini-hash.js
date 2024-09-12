"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_js_1 = require("./types.js");
var validTags_js_1 = require("./validTags.js");
// UTILS
function loadCSS(filename) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = filename;
    document.head.appendChild(link);
}
// STATES
var maps = new Map();
var index = 1;
function initState() {
    maps.set(index, {
        state: new Map(),
        handler: function () { },
    });
    var map = maps.get(index);
    index++;
    var key = 1;
    return [
        index - 1,
        function (initialValue) {
            key++;
            map.state.set(key, initialValue);
            return [
                function () {
                    return map.state.get(key);
                },
                function (newValue) {
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
    var i = 0;
    return children.map(function (child) {
        if (child === null)
            throw "check found NULL";
        if (typeof child === "string" || typeof child === "number") {
            return {
                type: types_js_1.TYPE.TEXT,
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
function fragment(props) {
    var children = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        children[_i - 1] = arguments[_i];
    }
    return {
        type: types_js_1.TYPE.FRAGMENT,
        children: check(children || []),
    };
}
function element(tag, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if (typeof tag === "function") {
        var funcTag_1 = tag(props || {});
        if (funcTag_1.component) {
            var currTag_1 = funcTag_1.component();
            if (funcTag_1.key && maps.get(funcTag_1.key)) {
                maps.get(funcTag_1.key).handler = function () {
                    destroyDOM(currTag_1);
                    var parent = currTag_1.parent;
                    currTag_1 = funcTag_1.component();
                    currTag_1.parent = parent;
                    Mini.display(currTag_1, parent);
                    parent.dom.appendChild(currTag_1.dom);
                };
            }
            return currTag_1;
        }
        else if (funcTag_1.type) {
            return __assign(__assign({}, funcTag_1), { children: check(children || []) });
        }
        else
            throw "function ".concat(tag, " must return JSX");
    }
    return {
        tag: tag,
        type: types_js_1.TYPE.ELEMENT,
        props: props,
        children: check(children || []),
        events: {},
    };
}
function destroyDOM(vdom) {
    var _a, _b;
    for (var eventType in vdom.events) {
        if (vdom.events.hasOwnProperty(eventType)) {
            var callback = vdom.events[eventType];
            vdom.dom.removeEventListener(eventType, callback);
        }
        vdom.events = {};
    }
    (_a = vdom.dom) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = vdom.children) === null || _b === void 0 ? void 0 : _b.map(destroyDOM);
}
function isvalid(tag) {
    if (!(tag in validTags_js_1.default)) {
        console.warn("Invalid tag '".concat(tag, "',if it's a function, first character should be uppercase"));
        return false;
    }
    return true;
}
// ROUTING
var Routes = new Map();
Routes["*"] = Error;
var matchPath = function (pathname) {
    // console.log("call matchPath");
    // const { path } = options;
    // if (!path) {
    //   return {
    //     path: null,
    //     url: pathname,
    //     isExact: true,
    //   };
    // }
    var match = new RegExp("^".concat(pathname)).exec(pathname);
    console.log(match);
    if (!match)
        return null;
    var url = match[0];
    // const isExact = pathname === url;
    return { pathname: pathname, url: url };
};
//@ts-ignore
var routeDom = document.getElementById("root");
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
        if (window.location.hash !== "#".concat(path)) {
            // TODO: check this line
            window.location.hash = path;
        }
    }
}
window.addEventListener("popstate", function (event) {
    // console.log("popstate", window.location.pathname);
    navigate(window.location.hash || "#", routeDom);
});
document.addEventListener("DOMContentLoaded", function (event) {
    // console.log("DOMContentLoaded");
    navigate(window.location.hash || "#", routeDom);
});
window.addEventListener("load", function (event) {
    // console.log("load");
    navigate(window.location.hash || "#", routeDom);
});
// DISPLAY
function display(vdom, parent) {
    // console.log("vdom", vdom);
    // console.log("parent", parent);
    var _a, _b, _c, _d, _e, _f;
    if (parent === void 0) { parent = null; }
    switch (vdom.type) {
        case types_js_1.TYPE.ELEMENT: {
            var tag_1 = vdom.tag, props_1 = vdom.props;
            if (tag_1 == "navigate") {
                vdom.dom = document.createElement("a");
                // vdom.dom.innerHTML = "hh";
                parent.dom.appendChild(vdom.dom);
                vdom.dom.onclick = function (event) {
                    // console.log("navigate to ", Routes[props.to]);
                    // parent.children.map(destroyDOM);
                    // //@ts-ignore
                    // display(Routes[props.to]().component(), parent);
                    // // event.preventDefault();
                    // // console.log("go to ", event);
                    // //@ts-ignore
                    // history.pushState(null, null, props.to);
                    //@ts-ignore
                    navigate(props_1.to, parent.dom);
                };
                (_a = vdom.children) === null || _a === void 0 ? void 0 : _a.map(function (child) {
                    destroyDOM(child);
                    display(child, vdom);
                });
            }
            else if (tag_1 == "route") {
                // console.log("found route", vdom);
                // @ts-ignore
                var path_1 = props_1.path, call = props_1.call, render = props_1.render;
                path_1 = formatRoute(path_1);
                if (call) {
                    Routes[path_1] = call;
                }
                (_b = vdom.children) === null || _b === void 0 ? void 0 : _b.map(function (child) {
                    destroyDOM(child);
                    // @ts-ignore
                    if (child.tag != "route")
                        throw "'route' tag can only have children of type route";
                    // @ts-ignore
                    child.props.path = path_1 + child.props.path;
                    display(child, parent);
                });
                // if (render) return render({ match });
            }
            else if (tag_1 == "get") {
                vdom.dom = document.querySelector(props_1["by"]);
                vdom.dom.innerHTML = "";
                (_c = vdom.children) === null || _c === void 0 ? void 0 : _c.map(function (child) {
                    destroyDOM(child);
                    display(child, vdom);
                });
                if (props_1["by"] === "root")
                    routeDom = vdom.dom;
            }
            else {
                if (!isvalid(tag_1))
                    throw "Invalid tag ".concat(tag_1);
                vdom.dom = document.createElement(vdom.tag);
                var style_1 = {};
                Object.keys(props_1 || {}).forEach(function (key) {
                    if (validTags_js_1.default[tag_1].includes(key)) {
                        if (key.startsWith("on")) {
                            var eventType = key.slice(2).toLowerCase();
                            vdom.dom.addEventListener(eventType, props_1[key]);
                            vdom.events[eventType] = vdom.props[key];
                        }
                        else if (key === "style")
                            Object.assign(style_1, props_1[key]);
                        else {
                            vdom.dom.setAttribute(key, props_1[key]);
                        }
                    }
                    else
                        console.warn("Invalid attribute \"".concat(key, "\" ignored."));
                });
                if (Object.keys(style_1).length > 0) {
                    vdom.dom.style.cssText = Object.keys(style_1)
                        .map(function (styleProp) {
                        var Camelkey = styleProp.replace(/[A-Z]/g, function (match) { return "-".concat(match.toLowerCase()); });
                        return Camelkey + ":" + style_1[styleProp];
                    })
                        .join(";");
                }
                (_d = vdom.children) === null || _d === void 0 ? void 0 : _d.map(function (child) {
                    destroyDOM(child);
                    display(child, vdom);
                });
                (_e = parent.dom) === null || _e === void 0 ? void 0 : _e.appendChild(vdom.dom);
            }
            break;
        }
        case types_js_1.TYPE.FRAGMENT: {
            (_f = vdom.children) === null || _f === void 0 ? void 0 : _f.map(function (child) {
                destroyDOM(child);
                display(child, parent);
            });
            break;
        }
        case types_js_1.TYPE.TEXT: {
            var value = vdom.value;
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
        component: function () {
            return Mini.element("get", { by: "#root" }, Mini.element("h4", {
                style: {
                    fontFamily: "sans-serif",
                    fontSize: "6vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                },
            }, "Error:", props && props["message"] ? " Path '".concat(props["message"], "'") : "", " Not Found"));
        },
    };
}
var Mini = {
    display: display,
    element: element,
    fragment: fragment,
    loadCSS: loadCSS,
    Error: Error,
    Routes: Routes,
};
exports.default = Mini;
