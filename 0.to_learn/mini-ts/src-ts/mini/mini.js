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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_js_1 = require("./types.js");
var validTags_js_1 = require("./validTags.js");
function loadCSS(filename) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = filename;
    document.head.appendChild(link);
}
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
        children: children || [],
    };
}
var index = 1;
var maps = new Map();
function initState() {
    maps.set(index, {
        state: new Map(),
        handler: function () { },
    });
    var map = maps.get(index);
    index++;
    var key = 0;
    return [
        index - 1,
        function (initialValue) {
            key++;
            map.state.set(key, initialValue);
            return [
                function () {
                    // console.log("call getter", map.state.get(key));
                    return map.state.get(key);
                },
                function (newValue) {
                    // console.log("call setter");
                    map.state.set(key, newValue);
                    if (map.handler)
                        map.handler();
                },
            ];
        },
    ];
}
function element(tag, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if (typeof tag === "function") {
        var funcTag_1 = tag(props || {});
        // console.log("function", funcTag);
        if (funcTag_1.component) {
            // console.log("element", funcTag);
            // console.log("0>", maps);
            // console.log("1>", maps.get(funcTag.key));
            var currTag_1 = funcTag_1.component();
            if (maps.get(funcTag_1.key))
                maps.get(funcTag_1.key).handler = function () {
                    destroyDOM(currTag_1);
                    var parent = currTag_1.parent;
                    currTag_1 = funcTag_1.component();
                    currTag_1.parent = parent;
                    Mini.display(currTag_1, parent);
                    parent.dom.appendChild(currTag_1.dom);
                };
            return currTag_1;
        }
        else if (funcTag_1.type) {
            return __assign(__assign({}, funcTag_1), { children: check(children || []) });
        }
        else
            throw "function must return JSX";
    }
    return {
        tag: tag,
        type: types_js_1.TYPE.ELEMENT,
        props: props,
        children: check(children || []),
        // parent: {},
        events: {},
    };
}
function get(props) {
    var children = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        children[_i - 1] = arguments[_i];
    }
    console.log("get:", children);
    return {
        type: types_js_1.TYPE.SELECTOR,
        dom: document.querySelector(props["by"]),
        children: check(children || []),
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
var routes = new Map([
    ["", function (props) { return Error(props); }],
]);
function display(vdom, parent) {
    var _a, _b, _c, _d;
    if (parent === void 0) { parent = null; }
    console.log("call display", vdom, parent);
    // console.log("display:", vdom);
    switch (vdom.type) {
        case types_js_1.TYPE.ELEMENT: {
            console.log("display element", vdom);
            var tag_1 = vdom.tag, props_1 = vdom.props;
            if (tag_1 == "get") {
                vdom.type = types_js_1.TYPE.SELECTOR;
                vdom.dom = document.querySelector(props_1["by"]);
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
            }
            (_a = vdom.children) === null || _a === void 0 ? void 0 : _a.map(function (child) {
                display(child, vdom);
                //@ts-ignore
                if (child.dom)
                    vdom.dom.appendChild(child.dom);
                //@ts-ignore
                child.parent = vdom;
            });
            break;
        }
        case types_js_1.TYPE.SELECTOR: {
            console.log("display selector:", vdom);
            (_b = vdom.children) === null || _b === void 0 ? void 0 : _b.map(function (child) {
                display(child, vdom);
                //@ts-ignore
                if (child.dom)
                    vdom.dom.appendChild(child.dom);
                //@ts-ignore
                child.parent = vdom;
            });
            break;
        }
        case types_js_1.TYPE.FRAGMENT: {
            console.log("display fragment");
            // console.log(parent);
            // console.log(vdom);
            (_c = vdom.children) === null || _c === void 0 ? void 0 : _c.map(function (child) {
                display(child, parent);
                //@ts-ignore
                if (child.dom)
                    parent.dom.appendChild(child.dom);
                //@ts-ignore
                child.parent = parent;
            });
            break;
        }
        case types_js_1.TYPE.TEXT: {
            // console.log("type text", vdom);
            var value = vdom.value;
            // @ts-ignore
            vdom.dom = document.createTextNode(value);
            break;
        }
        case types_js_1.TYPE.ROUTE: {
            console.log("display route");
            var props = vdom.props;
            if (props["path"] == "/")
                props["path"] = "";
            props["call"].parent = parent;
            routes.set(props["path"], props["call"]);
            (_d = vdom.children) === null || _d === void 0 ? void 0 : _d.map(function (child) {
                display(child, parent);
                //@ts-ignore
                if (child.dom)
                    parent.dom.appendChild(child.dom);
                //@ts-ignore
                child.parent = parent;
            });
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
            return Mini.element(Mini.get, { by: "#root" }, Mini.element("h4", {
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
function pathToRegex(path) {
    // console.log(path); // TODO: is nothing
    if (path === "")
        return new RegExp("^/$"); // For the root path ("/")
    return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([^\\/]+)") + "$");
}
// function pathToRegex(path: string): string {
//   if (path === "") return "^/$"; // For the root path ("/")
//   // Replace dynamic segments like ":id" with a capturing group "([^/]+)"
//   // Ensure proper escaping of slashes
//   return "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([^\\/]+)") + "$";
// }
// function getParams(match: MiniMatch): Record<string, string> {
//   const values = match.result ? match.result.slice(1) : [];
//   const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
//     (result) => result[1]
//   );
//   return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
// }
function getParams(result) {
    var values = result ? result.slice(1) : [];
    var keys = Array.from(location.pathname.matchAll(/:(\w+)/g)).map(function (result) { return result[1]; });
    return Object.fromEntries(keys.map(function (key, i) { return [key, values[i]]; }));
}
function router() {
    return __awaiter(this, void 0, void 0, function () {
        var matches, match, defaultRoute, component, errorVDOM;
        return __generator(this, function (_a) {
            matches = Array.from(routes.entries()).map(function (_a) {
                var path = _a[0], call = _a[1];
                var regex = pathToRegex(path);
                return {
                    path: path,
                    call: call,
                    result: location.pathname.match(regex),
                };
            });
            console.log("Routes:", routes);
            console.log("Matches:", matches);
            match = matches.find(function (elem) { return elem.result !== null; });
            if (match) {
                console.log("Matched route:", match.call);
                // const component = match.call;
                // console.log(match.call);
                // @ts-ignore
                display(match.call, match.call.parent);
                // @ts-ignore
                match.call.parent.dom.appendChild(match.call.dom);
            }
            else if (routes.has("")) {
                // Handle default route if no match is found
                console.log("No match found. Using default route.");
                defaultRoute = routes.get("");
                component = defaultRoute(getParams(null)).component();
                display(component);
            }
            else {
                // Handle error if no route matches and no default route exists
                console.log("No route found. Displaying error.");
                errorVDOM = Error({ message: location.pathname }).component();
                display(errorVDOM);
            }
            return [2 /*return*/];
        });
    });
}
window.addEventListener("popstate", router); // when going back and forward
document.addEventListener("DOMContentLoaded", router); // on loading
function Routes(props) {
    // console.log("call Routes", children);
    var children = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        children[_i - 1] = arguments[_i];
    }
    // return props["call"];
    return {
        type: types_js_1.TYPE.ROUTE,
        props: props,
        children: check(children || []), // TODO: add sub routes
    };
    // return {
    //   type: TYPE.FRAGMENT,
    //   children:  [()=>routes[0].call],
    // };
}
var Mini = {
    element: element,
    fragment: fragment,
    display: display,
    get: get,
    initState: initState,
    loadCSS: loadCSS,
    Error: Error,
    Routes: Routes,
};
exports.default = Mini;
