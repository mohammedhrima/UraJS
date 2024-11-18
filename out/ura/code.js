import * as UTILS from "./utils.js";
const { IF, LOOP, CREATE, REPLACE, REMOVE } = UTILS;
const { ELEMENT, FRAGMENT, TEXT } = UTILS;
const { deepEqual, loadCSS, svgElements } = UTILS;
// JSX
function check(children) {
    //@ts-ignore
    return children.map((child) => {
        if (child === null ||
            typeof child === "string" ||
            typeof child === "number") {
            return {
                type: TEXT,
                value: child,
            };
        }
        return child;
    });
}
function fragment(props, ...children) {
    return {
        type: FRAGMENT,
        children: children || [],
    };
    throw "Fragments (<></>) are not supported please use <fr></fr> tag instead";
}
function element(tag, props = {}, ...children) {
    if (typeof tag === "function") {
        let functag = null;
        try {
            functag = tag(props || {}, children);
        }
        catch (error) {
            // console.error("Error: while rendering", tag);
            console.error(error);
            return {
                type: FRAGMENT,
                children: [],
            };
        }
        if (functag.type === FRAGMENT)
            functag = element("fr", functag.props, ...check(children || []));
        return functag;
    }
    if (tag === "if") {
        let res = {
            type: IF,
            tag: "if",
            props: props,
            children: check(props.cond && children.length ? children : []),
        };
        return res;
    }
    else if (tag === "loop") {
        let loopChildren = (props.on || []).flatMap((elem, id) => (children || []).map((child) => {
            const evaluatedChild = 
            //@ts-ignore
            typeof child === "function" ? child(elem, id) : child;
            // I commented this line it caused me problem 
            // in slider when copying input that has function onchange
            // return structuredClone ? structuredClone(evaluatedChild)
            //   : JSON.parse(JSON.stringify(evaluatedChild));
            return JSON.parse(JSON.stringify(evaluatedChild));
        }));
        let res = {
            type: LOOP,
            tag: "loop",
            props: props,
            children: check(loopChildren || []),
        };
        return res;
    }
    return {
        tag: tag,
        type: ELEMENT,
        props: props,
        children: check(children || []),
    };
}
// DOM
function setProps(vdom) {
    const { tag, props } = vdom;
    const style = {};
    Object.keys(props || {}).forEach((key) => {
        if (key === "class") {
            console.warn("Invalid property 'class' did you mean 'className' ?", vdom);
            key = "className";
        }
        if (key.startsWith("on")) {
            const eventType = key.slice(2).toLowerCase();
            if (eventType === "hover") {
                vdom.dom.addEventListener("mouseover", props[key]);
                vdom.dom.addEventListener("mouseout", props[key]);
            }
            else
                vdom.dom.addEventListener(eventType, props[key]);
        }
        else if (key === "style")
            Object.assign(style, props[key]);
        else {
            if (svgElements.has(tag))
                vdom.dom.setAttribute(key, props[key]);
            else
                vdom.dom[key] = props[key];
        }
    });
    if (Object.keys(style).length > 0) {
        vdom.dom.style.cssText = Object.keys(style)
            .map((styleProp) => {
            const Camelkey = styleProp.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
            return `${Camelkey}:${style[styleProp]}`;
        })
            .join(";");
    }
}
function createDOM(vdom) {
    switch (vdom.type) {
        case ELEMENT: {
            switch (vdom.tag) {
                case "root":
                    vdom.dom = document.getElementById("root");
                    break;
                default:
                    if (vdom.dom)
                        console.error("element already has dom"); // TODO: to be removed
                    else {
                        if (svgElements.has(vdom.tag))
                            vdom.dom = document.createElementNS("http://www.w3.org/2000/svg", vdom.tag);
                        else
                            vdom.dom = document.createElement(vdom.tag);
                    }
                    break;
            }
            setProps(vdom);
            break;
        }
        case FRAGMENT: {
            console.log("createDOM: found fragment", vdom);
            if (vdom.dom)
                console.error("fragment already has dom"); // TODO: to be removed
            vdom.dom = document.createElement("container");
            // vdom.dom = document.createDocumentFragment()
            break;
        }
        case TEXT: {
            vdom.dom = document.createTextNode(vdom.value);
            break;
        }
        case IF: {
            // vdom.dom = document.createElement("if");
            vdom.dom = document.createDocumentFragment();
            break;
        }
        case LOOP: {
            // vdom.dom = document.createElement("loop");
            vdom.dom = document.createDocumentFragment();
            break;
        }
        default:
            break;
    }
    return vdom;
}
function removeProps(vdom) {
    const props = vdom.props;
    Object.keys(props || {}).forEach((key) => {
        if (key.startsWith("on")) {
            const eventType = key.slice(2).toLowerCase();
            vdom.dom.removeEventListener(eventType, props[key]);
        }
        else if (key === "style") {
            Object.keys(props.style || {}).forEach((styleProp) => {
                vdom.dom.style[styleProp] = "";
            });
        }
        else {
            if (vdom.dom[key] !== undefined)
                delete vdom.dom[key];
            vdom.dom.removeAttribute(key);
        }
    });
    vdom.props = {};
}
function destroy(vdom) {
    removeProps(vdom);
    vdom.dom?.remove();
    vdom.dom = null;
    vdom.children?.map(destroy);
}
// RENDERING
function execute(mode, prev, next = null) {
    switch (mode) {
        case CREATE: {
            createDOM(prev);
            // console.log("prev", prev);
            prev.children?.map((child) => {
                child = execute(mode, child);
                prev.dom.appendChild(child.dom);
            });
            break;
        }
        case REPLACE: {
            execute(CREATE, next);
            prev.dom.replaceWith(next.dom);
            prev.dom = next.dom;
            // prev.children?.map(destroy)
            prev.children = next.children;
            // I commented it because it caused me an error
            // in the slider
            // removeProps(prev);
            prev.props = next.props;
            break;
        }
        case REMOVE: {
            destroy(prev);
            break;
        }
        default:
            break;
    }
    return prev;
}
// RECONCILIATION
function reconciliateProps(oldProps = {}, newProps = {}, vdom) {
    oldProps = oldProps || {};
    newProps = newProps || {};
    let diff = false;
    Object.keys(oldProps || {}).forEach((key) => {
        if (!newProps.hasOwnProperty(key) ||
            !deepEqual(oldProps[key], newProps[key])) {
            diff = true;
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
    Object.keys(newProps || {}).forEach((key) => {
        if (!oldProps.hasOwnProperty(key) ||
            !deepEqual(oldProps[key], newProps[key])) {
            diff = true;
            if (key.startsWith("on")) {
                const eventType = key.slice(2).toLowerCase();
                vdom.dom.addEventListener(eventType, newProps[key]);
            }
            else if (key === "style")
                Object.assign(vdom.dom.style, newProps[key]);
            else {
                if (vdom.tag === "svg" || vdom.dom instanceof SVGElement)
                    vdom.dom.setAttribute(key, newProps[key]);
                else
                    vdom.dom[key] = newProps[key];
            }
        }
    });
    return diff;
}
function reconciliate(prev, next) {
    if (prev.type != next.type ||
        prev.tag != next.tag ||
        (prev.type === TEXT && !deepEqual(prev.value, next.value)))
        return execute(REPLACE, prev, next);
    if (prev.tag === next.tag) {
        if (reconciliateProps(prev.props, next.props, prev))
            return execute(REPLACE, prev, next);
    }
    else
        return execute(REPLACE, prev, next);
    const prevs = prev.children || [];
    const nexts = next.children || [];
    for (let i = 0; i < Math.max(prevs.length, nexts.length); i++) {
        let child1 = prevs[i];
        let child2 = nexts[i];
        if (child1 && child2) {
            reconciliate(child1, child2);
        }
        else if (!child1 && child2) {
            execute(CREATE, child2);
            prevs.push(child2);
            prev.dom.appendChild(child2.dom);
        }
        else if (child1 && !child2) {
            execute(REMOVE, child1);
            prevs.splice(i, 1);
            i--;
        }
    }
}
let GlobalVDOM = null;
function display(vdom) {
    console.log("display ", vdom);
    if (GlobalVDOM)
        reconciliate(GlobalVDOM, vdom);
    else {
        execute(CREATE, vdom);
        GlobalVDOM = vdom;
    }
}
function init() {
    let index = 1;
    let vdom = null;
    let states = {};
    let View = () => Ura.element("empty", null);
    const State = (initValue) => {
        const stateIndex = index++;
        states[stateIndex] = initValue;
        const getter = () => states[stateIndex];
        const setter = (newValue) => {
            // console.log("call setter", deepEqual(states[stateIndex], newValue));
            if (!deepEqual(states[stateIndex], newValue)) {
                states[stateIndex] = newValue;
                updateState();
            }
        };
        return [getter, setter];
    };
    const updateState = () => {
        const newVDOM = Ura.element(View, null);
        console.log("old", vdom);
        console.log("new", newVDOM);
        // console.log("update");
        if (vdom)
            reconciliate(vdom, newVDOM);
        else
            vdom = newVDOM;
    };
    const render = (call) => {
        View = call;
        updateState();
        return vdom;
    };
    return [render, State];
}
// ROUTING
function Error(props) {
    const [render, State] = init();
    return render(() => {
        return element("h4", {
            style: {
                fontFamily: "sans-serif",
                fontSize: "6vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            },
        }, "Error: [", props.message, "] Not Found");
    });
}
const Routes = {};
Routes["*"] = () => Error({ message: window.location.pathname });
function setRoute(path, call) {
    Routes[path] = call;
}
function getRoute(path) {
    return Routes[path] || Routes["*"];
}
function normalizePath(path) {
    if (!path || path == "")
        return "/";
    path = path.replace(/^\s+|\s+$/gm, "");
    if (!path.startsWith("/"))
        path = "/" + path;
    path = path.replace(/\/{2,}/g, "/");
    if (path.length > 1 && path.endsWith("/"))
        path = path.slice(0, -1);
    return path;
}
function refresh() {
    let path = window.location.pathname || "/";
    // console.log("call refresh", path);
    path = normalizePath(path);
    const RouteConfig = getRoute(path);
    // console.log("go to", RouteConfig);
    display(Ura.element("root", null,
        Ura.element(RouteConfig, null)));
}
function navigate(route, params = {}) {
    route = route.split("?")[0];
    route = normalizePath(route);
    // console.log("navigate to", route);
    window.history.pushState({}, "", `${route}`);
    refresh();
}
// loadfiles
async function loadRoutes() {
    try {
        const response = await fetch("/pages/routes.json");
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error loading routes.json:", error);
        throw error;
    }
}
function loadCSSFiles(styles) {
    styles?.forEach((style) => {
        Ura.loadCSS(Ura.normalizePath(style));
    });
}
async function loadJSFiles(routes, base) {
    for (const route of Object.keys(routes)) {
        try {
            const module = await import(routes[route]);
            if (!module.default) {
                throw `${route}: ${routes[route]} must have a default export`;
            }
            Ura.setRoute(Ura.normalizePath(route), module.default);
            if (base && route === base) {
                Ura.setRoute("*", module.default);
            }
        }
        catch (error) {
            console.error("Error loading JavaScript module:", error);
        }
    }
}
function setEventListeners() {
    window.addEventListener("hashchange", Ura.refresh);
    window.addEventListener("DOMContentLoaded", Ura.refresh);
    window.addEventListener("popstate", Ura.refresh);
}
function handleCSSUpdate(filename) {
    const path = normalizePath("/" + filename);
    console.log(path);
    let found = false;
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
        //@ts-ignore
        const linkUri = new URL(link.href).pathname;
        console.log("old", linkUri);
        if (linkUri === path) {
            console.log("found");
            found = true;
            const newLink = link.cloneNode();
            //@ts-ignore
            newLink.href = link.href.split("?")[0] + "?t=" + new Date().getTime(); // Append timestamp to force reload
            link.parentNode.replaceChild(newLink, link);
            return;
        }
    });
    if (!found) {
        console.log("CSS file not found in <link> tags. Adding it.");
        loadCSS(path);
    }
}
async function sync() {
    const ws = new WebSocket(`ws://${window.location.host}`);
    console.log(window.location.host);
    ws.onmessage = async (socket_event) => {
        const event = JSON.parse(socket_event.data);
        if (event.action === "update") {
            if (event.type === "css") {
                handleCSSUpdate(event.filename);
            }
            else if (event.type === "js") {
                // Handle JS update (if necessary)
            }
            else if (event.type === "json") {
                try {
                    const data = await loadRoutes();
                    const { routes, styles, base, type } = data;
                    if (routes)
                        await loadJSFiles(routes, base);
                    loadCSSFiles(styles);
                    setEventListeners();
                    Ura.refresh();
                    console.log(data);
                    console.log(Ura.Routes);
                }
                catch (error) {
                    console.error("Error during JSON update:", error);
                }
            }
        }
        else if (event.action === "reload") {
            window.location.reload();
        }
    };
    ws.onopen = () => {
        console.log("WebSocket connection established");
    };
    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
    ws.onclose = () => {
        console.log("WebSocket connection closed");
    };
}
async function activate() {
    try {
        const data = await loadRoutes();
        const { routes, styles, base, type } = data;
        if (routes)
            await loadJSFiles(routes, base);
        loadCSSFiles(styles);
        setEventListeners();
        Ura.refresh();
        console.log(data);
        console.log(Ura.Routes);
        if (type === "dev")
            sync();
    }
    catch (error) {
        console.error("Error loading resources:", error);
    }
}
// HTTP
const defaultHeaders = {
    "Content-Type": "application/json",
};
async function HTTP_Request(method, url, headers = {}, body) {
    try {
        const response = await fetch(url, {
            method,
            headers: { ...defaultHeaders, ...headers },
            body: body ? JSON.stringify(body) : undefined,
        });
        const responseData = await response.json();
        return {
            data: responseData,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        };
    }
    catch (error) {
        throw error;
    }
}
const Ura = {
    element,
    fragment,
    setRoute,
    getRoute,
    display,
    sync,
    loadCSS,
    init,
    Routes,
    reconciliate,
    deepEqual,
    normalizePath,
    refresh,
    navigate,
    send: HTTP_Request,
    activate
};
export default Ura;
